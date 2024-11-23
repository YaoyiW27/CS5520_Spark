import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseSetup';
import { searchScreenStyles as styles } from '../../styles/HomeStyles';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setNoResults(false);
    
    try {
      const usersRef = collection(db, 'Users');
      
      const querySnapshot = await getDocs(usersRef);
      const usersList = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.username && 
            userData.username.toLowerCase().includes(searchQuery.toLowerCase())) {
          usersList.push({ id: doc.id, ...userData });
        }
      });
      
      setUsers(usersList);
      setNoResults(usersList.length === 0);
      
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
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
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={24} color="#FF69B4" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF69B4" style={styles.loader} />
      ) : noResults ? (
        <Text style={styles.noResults}>
          Sorry, we couldn't find any matching users.
        </Text>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default SearchScreen;
