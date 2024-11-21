import React, { useState } from 'react';
import { View, TextInput, Platform, Pressable, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const TimeInput = ({ value, onChange }) => {
  const [show, setShow] = useState(false);

  const handleTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (event.type === 'set' && selectedTime) {
      onChange(selectedTime);
      setShow(false);
    } else if (event.type === 'dismissed') {
      setShow(false);
    }
  };

  return (
    <View>
      <Pressable onPress={() => setShow(true)}> 
        <View pointerEvents="none">
          <TextInput
            value={format(value, 'p')}
            editable={false}
            placeholder="Select time"
            style={styles.input}
          />
        </View>
      </Pressable>
      {show && (
        <DateTimePicker
          value={value}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
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

export default TimeInput;