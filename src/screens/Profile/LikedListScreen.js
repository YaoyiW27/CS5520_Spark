import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Text, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { getUserProfile } from '../../Firebase/firebaseHelper';

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 16,
        color: '#000',
    },
    listContent: {
        padding: 16,
    },
    likeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    username: {
        fontSize: 16,
        color: '#000',
    },
    noLikesText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
});

export default LikedListScreen;