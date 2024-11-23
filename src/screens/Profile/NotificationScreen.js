import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Text,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as Notifications from 'expo-notifications';
import DateInput from '../../components/DateInput';
import TimeInput from '../../components/TimeInput';
import { 
  addReminder, 
  getUserReminders, 
  deleteReminder as deleteReminderFromDB 
} from '../../Firebase/firebaseHelper';
import { AuthContext } from '../../contexts/AuthContext';
import { notificationScreenStyles as styles } from '../../styles/ProfileStyles';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NotificationScreen = ({ route, navigation }) => {
  const [reminders, setReminders] = useState([]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useContext(AuthContext);

  const hideModal = () => {
    setModalVisible(false);
    setDescription('');
    setDate(new Date());
  };


  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('You need to enable notifications permissions');
      }
    };

    requestPermissions();
  }, []);

  const scheduleNotification = async (description, reminderDate) => {
    try {
      const trigger = new Date(reminderDate);
      
      if (trigger <= new Date()) {
        throw new Error('Notification time must be in the future');
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Reminder',
          body: description,
        },
        trigger,
      });

      return identifier;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      throw error;
    }
  };


  const saveReminder = async () => {
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    try {
      const selectedDate = new Date(date);
      const now = new Date();
      
      if (selectedDate <= now) {
        alert('Please select a future date and time');
        return;
      }

      
      const notificationId = await scheduleNotification(description, selectedDate);

      const reminderData = {
        description: description,
        date: selectedDate.toISOString(),
        status: 'pending',
        notificationId: notificationId,
        userEmail: user.email
      };

      
      const reminderId = await addReminder(user.email, reminderData);
      
      
      setReminders(prevReminders => [...prevReminders, {
        id: reminderId,
        description: description,
        date: selectedDate,
        status: 'pending',
        notificationId: notificationId,
        userEmail: user.email
      }]);

      hideModal();
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert('Failed to save reminder');
    }
  };

  
  useEffect(() => {
    const loadReminders = async () => {
      try {
        const userReminders = await getUserReminders(user.email);
        setReminders(userReminders);
      } catch (error) {
        console.error('Error loading reminders:', error);
        alert('Failed to load reminders');
      }
    };

    loadReminders();
  }, [user.email]);

  
  const deleteReminder = async (id) => {
    try {
      await deleteReminderFromDB(id);
      setReminders(reminders.filter(reminder => reminder.id !== id));
    } catch (error) {
      console.error('Error deleting reminder:', error);
      alert('Failed to delete reminder');
    }
  };

  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setReminders(prevReminders => 
        prevReminders.map(reminder => {
          if (new Date(reminder.date) <= now && reminder.status === 'pending') {
            // 可以选择在这里调用 updateReminderStatus
            return { ...reminder, status: 'completed' };
          }
          return reminder;
        })
      );
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    
    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  
  useEffect(() => {
    if (route.params?.showModal) {
      setModalVisible(true);
      navigation.setParams({ showModal: false });
    }
  }, [route.params?.showModal]);

  
  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('reminders', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isPast = new Date(item.date) < new Date();
          
          return (
            <View style={[
              styles.reminderItem,
              isPast && styles.pastReminderItem
            ]}>
              <View style={styles.reminderContent}>
                <Text style={[
                  styles.reminderTitle,
                  isPast && styles.pastReminderText
                ]}>
                  {item.description}
                </Text>
                <Text style={[
                  styles.reminderDate,
                  isPast && styles.pastReminderText
                ]}>
                  {format(new Date(item.date), 'PPpp')}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => deleteReminder(item.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash" size={24} color="#FF69B4" />
              </TouchableOpacity>
            </View>
          );
        }}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        visible={modalVisible}
        onRequestClose={hideModal}
        animationType="slide"
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={hideModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <TextInput
                  placeholder="Description"
                  value={description}
                  onChangeText={setDescription}
                  style={styles.input}
                  multiline
                  blurOnSubmit={true}
                  onSubmitEditing={Keyboard.dismiss}
                />

                <DateInput
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                />

                <TimeInput
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                />

                <TouchableOpacity 
                  onPress={saveReminder}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default NotificationScreen;
