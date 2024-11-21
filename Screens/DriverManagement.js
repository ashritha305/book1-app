
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [editingId, setEditingId] = useState(null); // Track the driver being edited

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Fetch the list of drivers from the backend, only active ones (driver_status = true)
  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://10.0.3.2:5000/api/drivers?status=true');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  // Email validation regex
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // Mobile validation (this is just a basic validation for length, adjust as needed)
  const validateMobile = (mobile) => {
    const regex = /^[0-9]{10}$/; // Assuming a 10-digit mobile number format
    return regex.test(mobile);
  };

  // Handle form submission for adding or editing a driver
  const handleSubmit = async () => {
    // Validation checks
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a valid name.');
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    if (!mobile.trim() || !validateMobile(mobile)) {
      Alert.alert('Error', 'Please enter a valid mobile number (10 digits).');
      return;
    }

    const driverData = { name, email, mobile, driver_status: true };

    try {
      if (editingId) {
        // Edit existing driver
        await axios.put(`http://10.0.3.2:5000/api/drivers/${editingId}`, driverData);
        Alert.alert('Success', 'Driver updated successfully.');
      } else {
        // Add new driver
        await axios.post('http://10.0.3.2:5000/api/drivers', driverData);
        Alert.alert('Success', 'Driver added successfully.');
      }

      // Reset form and refetch drivers
      resetForm();
      fetchDrivers();
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  // Handle editing driver (populate form fields)
  const handleEdit = (driver) => {
    setName(driver.name);
    setEmail(driver.email);
    setMobile(driver.mobile);
    setEditingId(driver._id); // Set the ID for editing
  };

  // Handle deleting a driver (update status to false)
  const handleDelete = async (id) => {
    try {
      // Update driver_status to false instead of deleting
      await axios.put(`http://10.0.3.2:5000/api/drivers/status/${id}`, { driver_status: false });
      Alert.alert('Success', 'Driver status updated to inactive.');
      fetchDrivers(); // Refresh the driver list
    } catch (error) {
      Alert.alert('Error', 'Could not update driver status.');
    }
  };

  // Reset form fields
  const resetForm = () => {
    setName('');
    setEmail('');
    setMobile('');
    setEditingId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editingId ? 'Edit Driver' : 'Add New Driver'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Driver Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />

      <Button title={editingId ? 'Update Driver' : 'Add Driver'} onPress={handleSubmit} color="#007BFF" />

      <FlatList
        data={drivers}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.driverItem}>
            <View style={styles.driverInfo}>
              <Text style={styles.driverText}>Name: {item.name}</Text>
              <Text style={styles.driverText}>Email: {item.email}</Text>
              <Text style={styles.driverText}>Mobile: {item.mobile}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  driverItem: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  driverInfo: {
    marginBottom: 10,
  },
  driverText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  editButton: {
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default DriverManagement;

