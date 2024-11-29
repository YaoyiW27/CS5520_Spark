import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { datePlanScreenStyles as styles } from '../../styles/ProfileStyles';

const DateDetailsScreen = ({ route }) => {
    const { invitation } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Date Details</Text>
                <View style={styles.decorationContainer}>
                    <View style={styles.decorationLine} />
                    <View style={styles.heartContainer}>
                        <Ionicons name="heart" size={24} color="#FF69B4" />
                    </View>
                    <View style={styles.decorationLine} />
                </View>
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
                </View>
            </View>
        </View>
    );
};

export default DateDetailsScreen;