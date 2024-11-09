import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import { getAllUsers } from '../../Firebase/firebaseHelper';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Card = ({ user, onCardPress }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={() => onCardPress(user)}
      style={styles.card}
    >
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: `${user.image}?w=800` }}
          style={styles.photo}
          resizeMode="cover"
        />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{user.name}, {user.age}</Text>
        <Text style={styles.location}>{user.city}, {user.country}</Text>
      </View>
      <TouchableOpacity 
        style={styles.likeButton} 
        onPress={(e) => {
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}
        activeOpacity={0.7}
      >
        <AntDesign 
          name="heart" 
          size={30} 
          color={isLiked ? '#FF69B4' : '#ddd'} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const SwipeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const swiperRef = useRef(null);
  const {  user } = useContext(AuthContext);
  const navigation = useNavigation();

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
    console.log('Rendering card for user:', user);
    return <Card user={user} onCardPress={handleCardPress} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        ref={swiperRef}
        cards={users}
        renderCard={renderCard}
        cardIndex={currentIndex}
        backgroundColor={'#fff'}
        stackSize={3}
        stackSeparation={15}
        disableTopSwipe
        disableBottomSwipe
        useViewOverflow={false}
        onSwipedLeft={(cardIndex) => {
          setCurrentIndex(cardIndex + 1);
        }}
        onSwipedRight={(cardIndex) => {
          setCurrentIndex(cardIndex + 1);
        }}
        overlayLabels={{
          left: {
            title: 'NOPE',
            style: {
              label: {
                backgroundColor: '#FF0000',
                color: '#fff',
                fontSize: 24
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                marginTop: 30,
                marginLeft: -30
              }
            }
          },
          right: {
            title: 'LIKE',
            style: {
              label: {
                backgroundColor: '#4DED30',
                color: '#fff',
                fontSize: 24
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginTop: 30,
                marginLeft: 30
              }
            }
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    height: SCREEN_WIDTH * 1.5,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: 'center',
    position: 'relative',
  },
  photoContainer: {
    flex: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    zIndex: 1,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    padding: 16,
    alignItems: 'center',
    zIndex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  likeButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    padding: 16,
    zIndex: 1000,
    backgroundColor: 'transparent',
    elevation: 6,
    pointerEvents: 'auto',
  },
});

export default SwipeScreen;