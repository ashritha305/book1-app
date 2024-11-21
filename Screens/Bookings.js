
import React from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';

const Bookings = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Bookings</Text> */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PastBookings')}
      >
        <Text style={styles.buttonText}>Past Bookings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UpcomingBookings')}
      >
        <Text style={styles.buttonText}>Upcoming Bookings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#003366',
    textShadowColor: '#aaa',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  button: {
    backgroundColor: '#0056b3',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Bookings;
