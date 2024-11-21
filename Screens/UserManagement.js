

import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch('http://10.0.3.2:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // const deleteUser = async (userId) => {
  //   try {
  //     const token = await AsyncStorage.getItem('jwtToken');
  //     const response = await fetch(`http://10.0.3.2:5000/users/${userId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to delete user');
  //     }

  //     // Re-fetch users after deletion
  //     fetchUsers();
  //   } catch (error) {
  //     Alert.alert('Error', error.message);
  //   }
  // };


  const deleteUser = async (userId) => {
    // Show a confirmation alert before updating the user's status
    Alert.alert(
      'Confirm Deactivation',
      'Are you sure you want to deactivate this user?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('jwtToken');
              
              // Send PATCH request to update the is_available status to false
              const response = await fetch(`http://10.0.3.2:5000/users/${userId}`, {
                method: 'PATCH',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_available: false }), // Deactivate the user
              });

              if (!response.ok) {
                throw new Error('Failed to deactivate user');
              }

              // Re-fetch users after deactivation
              fetchUsers();
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ],
      { cancelable: false }
    );
};


  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userText}>
        <Text style={styles.userLabel}>Name:</Text> {item.name}
      </Text>
      <Text style={styles.userText}>
        <Text style={styles.userLabel}>Email:</Text> {item.email}
      </Text>
      <Text style={styles.userText}>
        <Text style={styles.userLabel}>Mobile:</Text> {item.mobile || 'N/A'}
      </Text>
      <Text style={styles.userText}>
        <Text style={styles.userLabel}>Role:</Text> {item.role || 'N/A'}
      </Text>
      <Button title="Delete" onPress={() => deleteUser(item._id)} color="#DC3545" />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item._id} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  userText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5, 
  },
  userLabel: {
    fontWeight: 'bold',
    color: '#007BFF', 
  },
});

export default UserManagement;

