import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { AuthContext } from '../../contexts/AuthContext';
import { db } from '../../Firebase/firebaseSetup';
import { doc, updateDoc } from 'firebase/firestore';
import { datePlanScreenStyles as styles } from '../../styles/ProfileStyles';

const DateDetailsScreen = ({ route, navigation }) => {
    const { invitation } = route.params;
    const { user } = useContext(AuthContext);

    const handleResponse = async (response) => {
        try {
            const invitationRef = doc(db, 'dateInvitations', invitation.id);
            await updateDoc(invitationRef, {
                isRead: true,
                status: response
            });

            navigation.goBack();

            if (response === 'accepted') {
                navigation.navigate('DatePlanScreen');
            }
        } catch (error) {
            console.error('Error updating invitation status:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Date Invitation</Text>
                <View style={styles.decorationContainer}>
                    <View style={styles.decorationLine} />
                    <View style={styles.heartContainer}>
                        <Text style={styles.decorationHeart}>
                            <Ionicons name="heart" size={24} color="#FF69B4" />
                        </Text>
                    </View>
                    <View style={styles.decorationLine} />
                </View>
                <Text style={styles.subHeaderText}>
                    You have a new date invitation!
                </Text>
            </View>

            <View style={styles.dateItem}>
                <View style={styles.dateContent}>
                    <Text style={styles.matchName}>
                        From: {invitation.dateDetails.senderName}
                    </Text>
                    <Text style={styles.location}>
                        Location: {invitation.dateDetails.location}
                    </Text>
                    <Text style={styles.dateTime}>
                        Date: {format(new Date(invitation.dateDetails.date), 'PPpp')}
                    </Text>
                    {invitation.dateDetails.alertType && invitation.dateDetails.alertType !== 'none' && (
                        <Text style={styles.alertText}>
                            Alert: {invitation.dateDetails.alertType}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.modalButtonsContainer}>
                <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => handleResponse('declined')}
                >
                    <Text style={styles.cancelButtonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={() => handleResponse('accepted')}
                >
                    <Text style={styles.saveButtonText}>Accept</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// 添加额外的样式
const additionalStyles = StyleSheet.create({
    heartContainer: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    decorationLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#FFB6C1',
    },
    decorationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        paddingHorizontal: 20,
    },
    headerContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF69B4',
    },
    subHeaderText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
    },
});

// 合并样式
const combinedStyles = {
    ...styles,
    ...additionalStyles,
};

export default DateDetailsScreen;