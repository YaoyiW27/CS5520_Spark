import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Dimensions, Image, Platform } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { getAllUsers, getUserProfile, updateUserProfile, updateUserLikedBy, checkMatch, createMatchNotification } from '../../Firebase/firebaseHelper';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { swipeScreenStyles as styles } from '../../styles/HomeStyles';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SwipeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const swiperRef = useRef(null);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        if (user?.email) {
          const allUsers = await getAllUsers(user.email);
          setUsers(allUsers);
        }
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();
  }, [user?.email]);

  const handleCardPress = (selectedUser) => {
    console.log('Selected user:', selectedUser);
    if (selectedUser && selectedUser.id) {
      navigation.navigate('DisplayProfile', { 
        userId: selectedUser.id
      });
    } else {
      console.error('Invalid user data:', selectedUser);
    }
  };

  const renderCard = (user) => {
    if (!user) return null;
    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => handleCardPress(user)}
        style={styles.card}
      >
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: user.image }}
            style={styles.photo}
            resizeMode="cover"
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.name}, {user.age || 'N/A'}</Text>
          <Text style={styles.location}>
            {[user.city, user.country].filter(Boolean).join(', ') || 'Location not specified'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSwipeRight = async (cardIndex) => {
    try {
      const swipedUser = users[cardIndex];
      const currentUserProfile = await getUserProfile(user.email);
      const likes = currentUserProfile?.likes || [];
      
      if (!likes.includes(swipedUser.id)) {
        const updatedLikes = [...likes, swipedUser.id];
        await updateUserProfile(user.email, { likes: updatedLikes });
        await updateUserLikedBy(swipedUser.id, user.email, true);
      }
      
      const checkAndCreateMatch = async (currentUserId, likedUserId) => {
        const isMatch = await checkMatch(currentUserId, likedUserId);
        if (isMatch) {
          await createMatchNotification(currentUserId, likedUserId);
        }
      };
      
      await checkAndCreateMatch(user.email, swipedUser.id);
      
      setCurrentIndex(cardIndex + 1);
    } catch (error) {
      console.error('Error handling right swipe:', error);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFinished(false);
  };

  const handleAllSwiped = () => {
    setIsFinished(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isFinished ? (
        <Swiper
          ref={swiperRef}
          cards={users}
          renderCard={renderCard}
          cardIndex={currentIndex}
          backgroundColor={'transparent'}
          stackSize={3}
          stackScale={1}
          stackSeparation={14}
          animateCardOpacity
          infinite={false}
          showSecondCard={true}
          verticalSwipe={false}
          horizontalSwipe={true}
          disableTopSwipe
          disableBottomSwipe
          outputRotationRange={["-10deg", "0deg", "10deg"]}
          cardVerticalMargin={0}
          cardHorizontalMargin={0}
          useViewOverflow={Platform.OS === 'ios'}
          swipeAnimationDuration={350}
          goBackToPreviousCardOnSwipeLeft={false}
          goBackToPreviousCardOnSwipeRight={false}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  backgroundColor: '#FF0000',
                  color: '#fff',
                  fontSize: 25,
                  fontWeight: 'bold',
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1.5,
                  borderColor: '#FF0000',
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: -30,
                  paddingRight: 20,
                }
              }
            },
            right: {
              title: 'LIKE',
              style: {
                label: {
                  backgroundColor: '#4DED30',
                  color: '#fff',
                  fontSize: 25,
                  fontWeight: 'bold',
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1.5,
                  borderColor: '#4DED30',
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: 30,
                  paddingLeft: 20,
                }
              }
            }
          }}
          overlayOpacityRangeX={[0.15, 0.3]}
          overlayOpacityRangeY={[0.15, 0.3]}
          overlayOpacityReverse={true}
          animateOverlayLabelsOpacity
          containerStyle={{
            flex: 1,
          }}
          cardStyle={{
            top: -14,
          }}
          onSwipedLeft={(cardIndex) => {
            setCurrentIndex(cardIndex + 1);
          }}
          onSwipedRight={handleSwipeRight}
          onSwipedAll={handleAllSwiped}
        />
      ) : (
        <View style={styles.finishedContainer}>
          <Text style={styles.finishedText}>
            You've seen all potential matches for now...{'\n'}
            Want to give them another chance? 
          </Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SwipeScreen;