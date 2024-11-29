import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';

const TagSelector = ({ 
  suggestions, 
  selectedTags, 
  onTagsChange,
  placeholder,
  maxTags = 5
}) => {
  const [customTag, setCustomTag] = useState('');
  
  const handleAddTag = (tag) => {
    if (selectedTags.length < maxTags && !selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      handleAddTag(customTag.trim());
      setCustomTag('');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.suggestionsContainer}
      >
        {suggestions.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.suggestionTag,
              selectedTags.includes(tag) && styles.selectedTag
            ]}
            onPress={() => selectedTags.includes(tag) 
              ? handleRemoveTag(tag) 
              : handleAddTag(tag)}
          >
            <Text style={[
              styles.suggestionText,
              selectedTags.includes(tag) && styles.selectedTagText
            ]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.selectedContainer}>
        {selectedTags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={styles.selectedTagChip}
            onPress={() => handleRemoveTag(tag)}
          >
            <Text style={styles.selectedTagChipText}>{tag}</Text>
            <Text style={styles.removeIcon}>×</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={customTag}
          onChangeText={setCustomTag}
          placeholder={placeholder}
          onSubmitEditing={handleAddCustomTag}
          returnKeyType="done"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  suggestionTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedTag: {
    backgroundColor: '#FF4B8C',
    borderColor: '#FF4B8C',
  },
  suggestionText: {
    color: '#666',
  },
  selectedTagText: {
    color: '#FFF',
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  selectedTagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4B8C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  selectedTagChipText: {
    color: '#FFF',
    marginRight: 4,
  },
  removeIcon: {
    color: '#FFF',
    fontSize: 18,
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});

export default TagSelector;