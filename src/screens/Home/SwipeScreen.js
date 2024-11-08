import React, { useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';

const SCREEN_WIDTH = Dimensions.get('window').width;

// 模拟用户数据
const DUMMY_USERS = [
  { 
    id: 1, 
    name: 'Victoria', 
    age: 23, 
    city: 'California', 
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  },
  { 
    id: 2, 
    name: 'Emma', 
    age: 25, 
    city: 'New York', 
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
  },
  { id: 3, name: 'Sophia', age: 22, city: 'Miami', country: 'USA', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
  { id: 4, name: 'Oliver', age: 28, city: 'Boston', country: 'USA', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
  { id: 5, name: 'James', age: 26, city: 'Seattle', country: 'USA', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
];

const Card = ({ user }) => {
  const [isLiked, setIsLiked] = useState(false);  // 每个卡片独立的状态

  return (
    <View style={styles.card}>
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
        onPress={() => setIsLiked(!isLiked)}
        activeOpacity={0.7}
      >
        <AntDesign 
          name="heart" 
          size={30} 
          color={isLiked ? '#FF69B4' : '#ddd'} 
        />
      </TouchableOpacity>
    </View>
  );
};

const SwipeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);

  const renderCard = (user) => {
    if (!user) return null;
    return <Card user={user} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        ref={swiperRef}
        cards={DUMMY_USERS}
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