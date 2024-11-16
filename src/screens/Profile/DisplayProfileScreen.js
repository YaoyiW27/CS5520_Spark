import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getUserProfile, updateUserProfile } from '../../Firebase/firebaseHelper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../contexts/AuthContext';

const DisplayProfileScreen = ({ route }) => {
    const { userId } = route.params;
    const [userProfile, setUserProfile] = useState(null);
    const { user } = useContext(AuthContext);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await getUserProfile(userId);
                console.log('Loaded profile:', profile);
                setUserProfile(profile);
                
                // Check if current user has liked this profile
                if (user) {
                    const currentUserProfile = await getUserProfile(user.email);
                    setIsLiked(currentUserProfile?.likes?.includes(userId) || false);
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                Alert.alert('Error', 'Failed to load profile');
            }
        };

        loadProfile();
    }, [userId, user]);

    const handleLike = async () => {
        try {
            const currentUserProfile = await getUserProfile(user.email);
            const likes = currentUserProfile?.likes || [];
            
            let updatedLikes;
            if (isLiked) {
                updatedLikes = likes.filter(id => id !== userId);
            } else {
                updatedLikes = [...likes, userId];
            }
            
            await updateUserProfile(user.email, { likes: updatedLikes });
            setIsLiked(!isLiked);
            
        } catch (error) {
            console.error('Error updating like:', error);
            Alert.alert('Error', 'Failed to update like');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: userProfile?.profilePhoto }}
                    style={styles.profilePhoto}
                />
                <Text style={styles.username}>{userProfile?.username}</Text>
                {user && user.email !== userId && (
                    <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
                        <Icon
                            name={isLiked ? 'heart' : 'heart-outline'}
                            size={24}
                            color={isLiked ? '#FF69B4' : '#000'}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Photo Wall Section */}
            <View style={styles.photoWallSection}>
                <Text style={styles.sectionTitle}>Photo Wall</Text>
                <View style={styles.photoWallContainer}>
                    {userProfile?.photowall && userProfile.photowall.length > 0 ? (
                        userProfile.photowall.map((photo, index) => (
                            <Image
                                key={index}
                                source={{ uri: photo }}
                                style={styles.photoWallImage}
                            />
                        ))
                    ) : (
                        <Text style={styles.noPhotosText}>No photos in photo wall</Text>
                    )}
                </View>
            </View>

            <View style={styles.infoContainer}>
                {userProfile?.pronouns && (
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Pronouns:</Text>
                        <Text style={styles.value}>{userProfile.pronouns}</Text>
                    </View>
                )}

                {userProfile?.occupation && (
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Occupation:</Text>
                        <Text style={styles.value}>{userProfile.occupation}</Text>
                    </View>
                )}

                {userProfile?.city && userProfile?.country && (
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Location:</Text>
                        <Text style={styles.value}>{`${userProfile.city}, ${userProfile.country}`}</Text>
                    </View>
                )}

                {userProfile?.hobbies && (
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Hobbies & Interests:</Text>
                        <Text style={styles.value}>{userProfile.hobbies}</Text>
                    </View>
                )}

                {userProfile?.personalityTags && userProfile.personalityTags.length > 0 && (
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Personality Tags:</Text>
                        <Text style={styles.value}>{userProfile.personalityTags.join(', ')}</Text>
                    </View>
                )}

                {userProfile?.favoriteBooks && userProfile.favoriteBooks.length > 0 && (
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Favorite Books:</Text>
                        <Text style={styles.value}>{userProfile.favoriteBooks.join(', ')}</Text>
                    </View>
                )}

                {userProfile?.favoriteMovies && userProfile.favoriteMovies.length > 0 && (
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Favorite Movies/Actors:</Text>
                        <Text style={styles.value}>{userProfile.favoriteMovies.join(', ')}</Text>
                    </View>
                )}

                {userProfile?.favoriteMusic && userProfile.favoriteMusic.length > 0 && (
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Favorite Music:</Text>
                        <Text style={styles.value}>{userProfile.favoriteMusic.join(', ')}</Text>
                    </View>
                )}

                {userProfile?.aboutMe && (
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>About Me:</Text>
                        <Text style={styles.value}>{userProfile.aboutMe}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        padding: 20,
    },
    profilePhoto: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    likeButton: {
        marginTop: 10,
    },
    infoContainer: {
        padding: 20,
    },
    infoItem: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: '#666',
    },
    // Photo Wall Styles
    photoWallSection: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    photoWallContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },
    photoWallImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    noPhotosText: {
        color: '#666',
        fontStyle: 'italic',
    },
});

export default DisplayProfileScreen;
