import React, { useState, useEffect } from 'react';
import { View, TextInput, Platform, Pressable, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// DateInput component to handle date selection
const DateInput = ({ value, onChange}) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ||null);
  const today = new Date();

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
    }
  }, [value]);
  
  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (event.type === 'set' && date) {
      setSelectedDate(date);
      onChange(date);
      setShow(false);
    } else if (event.type === 'dismissed') {
      setShow(false);
    }
  };

  const handleInputFocus = () => {
    if (!selectedDate) {
      setSelectedDate(today);
      onChange(today);
    }
    setShow(!show);
  };

  return (
    <View>
      <Pressable onPress={handleInputFocus}> 
        <View pointerEvents="none">
          <TextInput
            value={selectedDate ? selectedDate.toDateString() : ''}
            editable={false}
            placeholder="Select a date"
            style={styles.input}
          />
        </View>
      </Pressable>
      {show && (
        <DateTimePicker
          value={selectedDate || today}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  }
});

export default DateInput;
