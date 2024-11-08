import React from 'react';
import { View, StyleSheet, SafeAreaView, Text, FlatList, Image, TouchableOpacity } from 'react-native';

const LikedListScreen = () => {
    // Dummy data - replace with real data later
    const dummyLikes = [
      { id: '1', username: 'User 1', avatar: null },
      { id: '2', username: 'User 2', avatar: null },
      { id: '3', username: 'User 3', avatar: null },
    ];
  
    const renderItem = ({ item }) => (
      <View style={styles.likeItem}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
        </View>
        <Text style={styles.username}>{item.username}</Text>
      </View>
    );

    return (
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Liked by</Text>
          <FlatList
            data={dummyLikes}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        </SafeAreaView>
      );
};

    
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
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
  });
  
  export default LikedListScreen;