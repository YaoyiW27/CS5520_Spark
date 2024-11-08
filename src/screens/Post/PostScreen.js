import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const PostScreen = ({ navigation }) => {
  // 模拟帖子数据
  const posts = [
    { id: '1', user: 'Bob', time: '27 min', content: "I'm happy today.", likes: 3, comments: 2 },
    // 其他帖子数据...
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreatePostScreen')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('PostDetailScreen', { post: item })}>
            <View style={styles.postCard}>
              <Text>{item.user}</Text>
              <Text>{item.time}</Text>
              <Text>{item.content}</Text>
              <Text>❤️ {item.likes}  💬 {item.comments}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  addButton: { position: 'absolute', top: 10, right: 10, zIndex: 1 },
  addButtonText: { fontSize: 24 },
  postCard: { padding: 16, marginBottom: 10, backgroundColor: '#fff', borderRadius: 8 },
});

export default PostScreen;