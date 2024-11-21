
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Updated import
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [busNumber, setBusNumber] = useState('');
  const [arrivalTime, setArrivalTime] = useState(new Date());
  const [noOfSeats, setNoOfSeats] = useState('');
  const [editId, setEditId] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState('date');
  const [busTypes, setBusTypes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedBusType, setSelectedBusType] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');

  const currentDate = new Date();
  const minimumDate = new Date(currentDate);

  // Fetch buses, bus types, and drivers from the API
  useEffect(() => {
    fetchBuses();
    fetchBusTypes();
    fetchDrivers();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await axios.get('http://10.0.3.2:5000/api/buses');
      setBuses(response.data);  // This will only include buses with bus_status: true
    } catch (error) {
      console.log("Could not fetch buses");
    }
  };

  const fetchBusTypes = async () => {
    try {
      const response = await axios.get('http://10.0.3.2:5000/api/bus-types');
      setBusTypes(response.data); // Assuming bus types have 'bus_type_name' field
    } catch (error) {
      console.log("Could not fetch bus types");
    }
  };

  const fetchDrivers = async () => {//http://10.0.3.2:5000/api/drivers?status=true
    try {
      const response = await axios.get('http://10.0.3.2:5000/api/drivers?status=true');
      setDrivers(response.data); // Assuming drivers have 'name' field
    } catch (error) {
      console.log("Could not fetch drivers");
    }
  };

  const handleSubmit = async () => {
    // Validate all fields
    if (!busNumber) {
      Alert.alert('Invalid Input', 'Please enter a bus number.');
      return;
    }

    if (!arrivalTime) {
      Alert.alert('Invalid Input', 'Please select an arrival time.');
      return;
    }

    // Validate no of seats (must be a number and <= 30)
    if (!noOfSeats || isNaN(noOfSeats) || noOfSeats <= 0 || noOfSeats > 30) {
      Alert.alert('Invalid Input', 'Please enter a valid number of seats (1 to 30).');
      return;
    }

    // If a bus type or driver is not selected
    if (!selectedBusType || !selectedDriver) {
      Alert.alert('Invalid Input', 'Please select both bus type and driver.');
      return;
    }

    try {
      const busData = {
        bus_number: busNumber,
        arrival_time: arrivalTime,
        bus_type: selectedBusType,  // Send bus type here
        driver_id: selectedDriver, // Send driver ID
      };

      console.log("busData:"+JSON.stringify(busData));
      

      if (!editId) {
        busData.no_of_seats = parseInt(noOfSeats);
      }

      if (editId) {
        await axios.put(`http://10.0.3.2:5000/api/buses/${editId}`, busData);
      } else {
        await axios.post('http://10.0.3.2:5000/api/buses', busData);
      }

      resetForm();
      fetchBuses();
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const resetForm = () => {
    setBusNumber('');
    setArrivalTime(new Date());
    console.log("Arrivaltime:"+arrivalTime);
    
    setNoOfSeats('');
    setSelectedBusType('');
    setSelectedDriver('');
    setEditId(null);
  };

  const handleEdit = (bus) => {
    setBusNumber(bus.bus_number);
    setArrivalTime(new Date(bus.arrival_time));
    setNoOfSeats(bus.no_of_seats);
    setSelectedBusType(bus.bus_type); // Set bus type for edit
    setSelectedDriver(bus.driver_id); // Set driver for edit
    setEditId(bus._id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://10.0.3.2:5000/api/buses/${id}`);
  
      if (response.data && response.data.bus) {
        setBuses(prevBuses => prevBuses.filter(bus => bus._id !== id));  // Remove from the list
        Alert.alert('Bus status updated to inactive');  // Inform the user
      }
    } catch (error) {
      Alert.alert('Error', 'Could not update bus status');
    }
  };

  const handleNoOfSeatsChange = (text) => {
    // Ensure only numeric input and validate the seat limit
    const validText = text.replace(/[^0-9]/g, ''); // Allow only numbers
    if (validText.length > 2) {
      return; // Prevent entering more than 2 digits (e.g., 100+)
    }
    setNoOfSeats(validText);
  };

  const renderItem = ({ item }) => (
    <View style={styles.busItem}>
      <Text style={styles.busDetails}>Bus Number: {item.bus_number}</Text>
      <Text style={styles.busDetails}>Arrival Time: {new Date(item.arrival_time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
      <Text style={styles.busDetails}>Bus Type: {item.bus_type ? item.bus_type.bus_type_name : ''}</Text>
      <Text style={styles.busDetails}>Driver: {item.driver_id ? item.driver_id.name : ''}</Text>
      <Text style={styles.busDetails}>No of Seats: {item.no_of_seats}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const showDatePicker = () => {
    setMode('date');
    setShowPicker(true);
  };

  const showTimePicker = () => {
    setMode('time');
    setShowPicker(true);
  };

  const onChange = (event, selectedValue) => {
    const current = selectedValue || arrivalTime;
    setShowPicker(false);
    if (mode === 'date') {
      setArrivalTime(new Date(current.getFullYear(), current.getMonth(), current.getDate(), arrivalTime.getHours(), arrivalTime.getMinutes()));
    } else {
      setArrivalTime(new Date(arrivalTime.getFullYear(), arrivalTime.getMonth(), arrivalTime.getDate(), current.getHours(), current.getMinutes()));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={busNumber}
        onChangeText={setBusNumber}
        placeholder="Bus Number"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Arrival Time:</Text>
      {/* Stack Date and Time buttons vertically */}
      <View style={styles.timeButtons}>
        <Button title="Select Date" onPress={showDatePicker} color="#28a745" />
        <Button title="Select Time" onPress={showTimePicker} color="#007bff" />
      </View>
      <Text style={styles.selectedTime}>
        {arrivalTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
      </Text>

      {/* Bus Type Picker */}
      <Text style={styles.label}>Select Bus Type:</Text>
      <Picker
        selectedValue={selectedBusType}
        onValueChange={(itemValue) => setSelectedBusType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Bus Type" value="" />
        {busTypes.map((type) => (
          <Picker.Item key={type._id} label={type.bus_type_name} value={type._id} />
        ))}
      </Picker>

      {/* Driver Picker */}
      <Text style={styles.label}>Select Driver:</Text>
      <Picker
        selectedValue={selectedDriver}
        onValueChange={(itemValue) => setSelectedDriver(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Driver" value="" />
        {drivers.map((driver) => (
          <Picker.Item key={driver._id} label={driver.name} value={driver._id} />
        ))}
      </Picker>
      
      {!editId && (
        <TextInput
          style={styles.input}
          value={noOfSeats}
          onChangeText={handleNoOfSeatsChange}  // Use the new handler
          placeholder="Number of Seats"
          keyboardType="numeric"
          maxLength={2} // Prevent input of more than 2 digits
          placeholderTextColor="#888"
        />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{editId ? "Update Bus" : "Add Bus"}</Text>
      </TouchableOpacity>

      <FlatList
        data={buses}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.busList}
      />

      {showPicker && (
        <DateTimePicker
          value={arrivalTime}
          mode={mode}
          display="default"
          onChange={onChange}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 20,
      flex: 1,
      backgroundColor: '#f4f4f9',
    },
    input: {
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 15,
      padding: 12,
      borderRadius: 8,
      fontSize: 16,
      color: '#333',
      backgroundColor: '#fff',
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: '#333',
      fontWeight: '600',
    },
    timeButtons: {
      flexDirection: 'column',
      marginBottom: 10,
    },
    selectedTime: {
      fontSize: 16,
      color: '#333',
      marginBottom: 15,
    },
    picker: {
      height: 50,
      marginBottom: 15,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: '#fff',
    },
    submitButton: {
      backgroundColor: '#28a745',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 20,
    },
    submitButtonText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: '600',
    },
    busList: {
      paddingBottom: 20,
    },
    busItem: {
      backgroundColor: '#fff',
      padding: 15,
      marginBottom: 12,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 3,
    },
    busDetails: {
      fontSize: 14,
      marginBottom: 6,
      color: '#333',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    editButton: {
      backgroundColor: '#ffc107',
      padding: 10,
      borderRadius: 5,
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

export default BusManagement;
