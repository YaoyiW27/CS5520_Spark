import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Text,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as Notifications from 'expo-notifications';
import DateInput from '../../components/DateInput';
import TimeInput from '../../components/TimeInput';
import { AuthContext } from '../../contexts/AuthContext';
import { 
  addReminder, 
  getUserReminders, 
  deleteReminder as deleteReminderFromDB,
  getMatchNotifications,
  updateReminderStatus
} from '../../Firebase/firebaseHelper';
import { datePlanScreenStyles as styles } from '../../styles/ProfileStyles';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const DatePlanScreen = ({ route, navigation }) => {
  const [datePlans, setDatePlans] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [alertType, setAlertType] = useState('none');
  const [matches, setMatches] = useState([]);
  const { user } = useContext(AuthContext);
  const [showMatchPicker, setShowMatchPicker] = useState(false);
  const [showAlertPicker, setShowAlertPicker] = useState(false);

  const alertOptions = [
    { label: 'None', value: 'none' },
    { label: 'At time of event', value: 'atTime' },
    { label: '5 minutes before', value: '5min' },
    { label: '10 minutes before', value: '10min' },
    { label: '15 minutes before', value: '15min' },
    { label: '30 minutes before', value: '30min' },
    { label: '1 hour before', value: '1hour' },
    { label: '2 hours before', value: '2hours' },
    { label: '1 day before', value: '1day' },
    { label: '2 days before', value: '2days' },
    { label: '1 week before', value: '1week' },
  ];

  const getAlertTime = (dateTime, alertType) => {
    const date = new Date(dateTime);
    switch (alertType) {
      case 'atTime': return date;
      case '5min': return new Date(date.getTime() - 5 * 60000);
      case '10min': return new Date(date.getTime() - 10 * 60000);
      case '15min': return new Date(date.getTime() - 15 * 60000);
      case '30min': return new Date(date.getTime() - 30 * 60000);
      case '1hour': return new Date(date.getTime() - 60 * 60000);
      case '2hours': return new Date(date.getTime() - 2 * 60 * 60000);
      case '1day': return new Date(date.getTime() - 24 * 60 * 60000);
      case '2days': return new Date(date.getTime() - 2 * 24 * 60 * 60000);
      case '1week': return new Date(date.getTime() - 7 * 24 * 60 * 60000);
      default: return null;
    }
  };

  const hideModal = () => {
    setModalVisible(false);
    setSelectedMatch('');
    setLocation('');
    setDate(new Date());
    setAlertType('none');
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const notifications = await getMatchNotifications(user.email);
        const matchList = notifications.map(match => ({
          id: match.id,
          name: user.email === match.users[0] ? match.user2Name : match.user1Name,
          userId: user.email === match.users[0] ? match.users[1] : match.users[0]
        }));
        setMatches(matchList);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };
    fetchMatches();
  }, [user]);

  const scheduleNotification = async (matchName, location, dateTime, alertTime) => {
    if (!alertTime) return null;
    
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Date Reminder',
          body: `Upcoming date with ${matchName} at ${location}`,
        },
        trigger: alertTime,
      });
      return identifier;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  };

  const saveDatePlan = async () => {
    if (!selectedMatch || !location.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const matchInfo = matches.find(m => m.id === selectedMatch);
      const alertTime = getAlertTime(date, alertType);
      const notificationId = await scheduleNotification(
        matchInfo.name,
        location,
        date,
        alertTime
      );

      const datePlanData = {
        matchId: selectedMatch,
        matchName: matchInfo.name,
        location: location,
        date: date.toISOString(),
        alertType: alertType,
        notificationId: notificationId,
        reminderStatus: 'pending'
      };

      await addReminder(user.email, datePlanData);
      const userReminders = await getUserReminders(user.email);
      setDatePlans(userReminders);
      hideModal();
    } catch (error) {
      console.error('Error saving date plan:', error);
      alert('Failed to save date plan');
    }
  };

  useEffect(() => {
    if (route.params?.showModal) {
      setModalVisible(true);
      navigation.setParams({ showModal: false });
    }
  }, [route.params?.showModal]);

  useEffect(() => {
    const loadReminders = async () => {
      if (user?.email) {
        try {
          const userReminders = await getUserReminders(user.email);
          userReminders.forEach(reminder => {
            const now = new Date();
            const reminderDate = new Date(reminder.date);
            if (now > reminderDate && reminder.reminderStatus === 'pending') {
              updateReminderStatus(reminder.id, 'completed');
            }
          });
          setDatePlans(userReminders);
        } catch (error) {
          console.error('Error loading reminders:', error);
        }
      }
    };
    
    loadReminders();
  }, [user]);

  const handleDeleteReminder = async (reminderId) => {
    try {
      await deleteReminderFromDB(reminderId);
      setDatePlans(prevPlans => prevPlans.filter(plan => plan.id !== reminderId));
    } catch (error) {
      console.error('Error deleting reminder:', error);
      alert('Failed to delete reminder');
    }
  };

  const formatAlertType = (alertType) => {
    switch (alertType) {
      case 'atTime': return 'At time of event';
      case '5min': return '5 minutes before';
      case '10min': return '10 minutes before';
      case '15min': return '15 minutes before';
      case '30min': return '30 minutes before';
      case '1hour': return '1 hour before';
      case '2hours': return '2 hours before';
      case '1day': return '1 day before';
      case '2days': return '2 days before';
      case '1week': return '1 week before';
      default: return 'No alert';
    }
  };

  const checkAndUpdateReminderStatus = (reminder) => {
    const now = new Date();
    const reminderDate = new Date(reminder.date);
    
    if (now > reminderDate && reminder.reminderStatus === 'pending') {
      updateReminderStatus(reminder.id, 'completed');
      setDatePlans(prevPlans => 
        prevPlans.map(plan => 
          plan.id === reminder.id 
            ? {...plan, reminderStatus: 'completed'} 
            : plan
        )
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Plan a Date
        </Text>
        <View style={styles.decorationContainer}>
          <View style={styles.decorationLine} />
          <Ionicons name="heart" size={24} style={styles.decorationHeart} />
          <View style={styles.decorationLine} />
        </View>
        <Text style={styles.subHeaderText}>
          Create special moments with your matches
        </Text>
      </View>

      <FlatList
        data={datePlans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isPast = new Date(item.date) < new Date();
          return (
            <View style={[
              styles.dateItem, 
              isPast && styles.pastDateItem,
              item.reminderStatus === 'completed' && styles.completedDateItem
            ]}>
              <View style={styles.dateContent}>
                <Text style={styles.matchName}>
                  Date with {item.matchName}
                </Text>
                <Text style={styles.location}>
                  Location: {item.location}
                </Text>
                <Text style={styles.dateTime}>
                  {format(new Date(item.date), 'PPpp')}
                </Text>
                {item.alertType !== 'none' && (
                  <Text style={styles.alertText}>
                    Alert: {formatAlertType(item.alertType)}
                  </Text>
                )}
                <Text style={[
                  styles.statusText,
                  item.reminderStatus === 'completed' && styles.completedStatusText
                ]}>
                  Alert Status: {item.reminderStatus}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleDeleteReminder(item.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash" size={24} color="#FF69B4" />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <Modal
        visible={modalVisible}
        onRequestClose={hideModal}
        animationType="slide"
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={hideModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Plan a Date</Text>

                <Text style={styles.inputLabel}>Select your date partner</Text>
                <TouchableOpacity 
                  style={styles.selectedValueContainer}
                  onPress={() => setShowMatchPicker(true)}
                >
                  <Text style={styles.selectedValueText}>
                    {selectedMatch ? matches.find(m => m.id === selectedMatch)?.name : 'Select a match'}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.inputLabel}>Date Location</Text>
                <TextInput
                  placeholder="Enter location"
                  value={location}
                  onChangeText={setLocation}
                  style={styles.input}
                />

                <Text style={styles.inputLabel}>Date</Text>
                <DateInput
                  value={date}
                  onChange={setDate}
                />

                <Text style={styles.inputLabel}>Time</Text>
                <TimeInput
                  value={date}
                  onChange={setDate}
                />

                <Text style={styles.inputLabel}>Set Reminder</Text>
                <TouchableOpacity 
                  style={styles.selectedValueContainer}
                  onPress={() => setShowAlertPicker(true)}
                >
                  <Text style={styles.selectedValueText}>
                    {formatAlertType(alertType)}
                  </Text>
                </TouchableOpacity>

                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={hideModal}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={saveDatePlan}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={showMatchPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={selectedMatch}
              onValueChange={(value) => {
                setSelectedMatch(value);
                setShowMatchPicker(false);
              }}
            >
              <Picker.Item label="Select a match" value="" />
              {matches.map(match => (
                <Picker.Item 
                  key={match.id} 
                  label={match.name} 
                  value={match.id} 
                />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAlertPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={alertType}
              onValueChange={(value) => {
                setAlertType(value);
                setShowAlertPicker(false);
              }}
            >
              {alertOptions.map(option => (
                <Picker.Item 
                  key={option.value} 
                  label={option.label} 
                  value={option.value} 
                />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DatePlanScreen;
