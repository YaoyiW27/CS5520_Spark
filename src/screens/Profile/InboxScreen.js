import React, { useState, useEffect, useContext } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    TouchableOpacity,
    RefreshControl 
} from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { db } from '../../Firebase/firebaseSetup';
import { getMatchNotifications, markNotificationAsRead } from '../../Firebase/firebaseHelper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';

const InboxScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [dateInvitations, setDateInvitations] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useContext(AuthContext);
    const navigation = useNavigation();

    const fetchNotifications = async () => {
        if (!user?.email) return;
        
        try {
            const fetchedNotifications = await getMatchNotifications(user.email);
            console.log('Fetched notifications:', fetchedNotifications);
            setNotifications(fetchedNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        const unsubscribe = navigation.addListener('focus', () => {
            fetchNotifications();
        });

        return unsubscribe;
    }, [navigation, user]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    const handleNotificationPress = async (notification) => {
        try {
            await markNotificationAsRead(notification.id, user.email);
            
            setNotifications(prevNotifications => 
                prevNotifications.map(notif => {
                    if (notif.id === notification.id) {
                        return {
                            ...notif,
                            isRead: {
                                ...notif.isRead,
                                [user.email]: true
                            }
                        };
                    }
                    return notif;
                })
            );
            
            const otherUserId = notification.users.find(id => id !== user.email);
            navigation.navigate('DisplayProfile', { userId: otherUserId });
            
        } catch (error) {
            console.error('Error handling notification:', error);
        }
    };

    const renderNotification = ({ item }) => {
        const isUnread = !(item.isRead && item.isRead[user.email]);
        const otherUserName = user.email === item.users[0] ? item.user2Name : item.user1Name;

        return (
            <TouchableOpacity 
                style={[
                    styles.notificationItem,
                    isUnread ? styles.unreadItem : null
                ]}
                onPress={() => handleNotificationPress(item)}
            >
                <View style={styles.notificationContent}>
                    <Ionicons 
                        name="heart" 
                        size={24} 
                        color="#FF69B4" 
                        style={styles.icon}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.matchText}>
                            New match with {otherUserName}!
                        </Text>
                        <Text style={styles.messageText}>
                            You both liked each other. Start a conversation!
                        </Text>
                    </View>
                </View>
                {isUnread && <View style={styles.unreadDot} />}
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        let unsubscribeFunction = null;

        const setupDateInvitationsListener = async () => {
            if (!user?.email) return;
            
            try {
                const invitationsRef = collection(db, 'dateInvitations');
                const q = query(
                    invitationsRef,
                    where('receiverEmail', '==', user.email),
                    where('status', 'in', [null, 'accepted'])
                );
                
                unsubscribeFunction = onSnapshot(q, (snapshot) => {
                    const invitations = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setDateInvitations(invitations);
                });
            } catch (error) {
                console.error('Error fetching date invitations:', error);
            }
        };

        setupDateInvitationsListener();

        return () => {
            if (unsubscribeFunction) {
                unsubscribeFunction();
            }
        };
    }, [user]);

    const handleDateInvitationPress = async (invitation) => {
        try {
            // 导航到约会详情页面，传递完整的invitation对象
            navigation.navigate('DateDetails', {
                invitation: invitation  // 传递整个invitation对象，而不仅仅是dateDetails
            });
        } catch (error) {
            console.error('Error handling date invitation:', error);
        }
    };

    const renderDateInvitation = ({ item }) => (
        <TouchableOpacity 
            style={[
                styles.notificationItem, 
                !item.isRead && styles.unreadItem
            ]}
            onPress={() => handleDateInvitationPress(item)}
        >
            <View style={styles.notificationContent}>
                <Ionicons 
                    name="calendar" 
                    size={24} 
                    color="#FF69B4" 
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.matchText}>
                        Date Invitation from {item.dateDetails.senderName}
                    </Text>
                    <Text style={styles.messageText}>
                        {`Date: ${format(new Date(item.dateDetails.date), 'PPpp')}\nLocation: ${item.dateDetails.location}`}
                    </Text>
                    {item.status === 'accepted' && (
                        <Text style={styles.statusText}>Accepted</Text>
                    )}
                </View>
                {!item.isRead && <View style={styles.unreadDot} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={[...notifications, ...dateInvitations]}
                renderItem={({ item }) => 
                    item.dateDetails 
                        ? renderDateInvitation({ item })
                        : renderNotification({ item })
                }
                keyExtractor={item => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#FF69B4"
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    notificationItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    unreadItem: {
        backgroundColor: '#fff5f8',
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    matchText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    messageText: {
        fontSize: 14,
        color: '#666',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF69B4',
        marginLeft: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    statusText: {
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 4,
        fontStyle: 'italic'
    }
});

export default InboxScreen;
