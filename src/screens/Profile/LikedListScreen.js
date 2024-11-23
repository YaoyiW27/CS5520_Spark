import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Text, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { getUserProfile } from '../../Firebase/firebaseHelper';
import { likedListScreenStyles as styles } from '../../styles/ProfileStyles';

const LikedListScreen = ({ navigation }) => {
    const [likedUsers, setLikedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchLikedUsers = async () => {
            try {
                // 获取当前用户的profile
                const userProfile = await getUserProfile(user.email);
                const likedUserIds = userProfile?.likes || [];

                // 获取所有被喜欢用户的详细信息
                const likedUsersDetails = await Promise.all(
                    likedUserIds.map(userId => getUserProfile(userId))
                );

                setLikedUsers(likedUsersDetails);
            } catch (error) {
                console.error('Error fetching liked users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedUsers();
    }, [user]);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.likeItem}
            onPress={() => navigation.navigate('DisplayProfile', { userId: item.email })}
        >
            <View style={styles.avatarContainer}>
                {item.profilePhoto ? (
                    <Image 
                        source={{ uri: item.profilePhoto }} 
                        style={styles.avatar}
                    />
                ) : (
                    <View style={styles.avatar} />
                )}
            </View>
            <Text style={styles.username}>{item.username}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={40} color="#0000ff" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <Text style={styles.title}>Liked Users</Text> */}
            {likedUsers.length > 0 ? (
                <FlatList
                    data={likedUsers}
                    renderItem={renderItem}
                    keyExtractor={item => item.email}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <Text style={styles.noLikesText}>No liked users yet</Text>
            )}
        </SafeAreaView>
    );
};

export default LikedListScreen;