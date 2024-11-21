import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const BusTypeManagement = () => {
  const [busTypes, setBusTypes] = useState([]);
  const [busTypeName, setBusTypeName] = useState('');
  const [amenities, setAmenities] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchBusTypes = async () => {
    try {
      const response = await axios.get('http://10.0.3.2:5000/api/bus-types');
      setBusTypes(response.data);
    } catch (error) {
      console.log('Could not fetch bus types');
    }
  };

  useEffect(() => {
    fetchBusTypes();
  }, []);

  const handleSubmit = async () => {
    try {
      const busTypeData = {
        bus_type_name: busTypeName,
        amenities: amenities.split(',').map(amenity => amenity.trim()),
      };

      if (editId) {
        await axios.put(`http://10.0.3.2:5000/api/bus-types/${editId}`, busTypeData);
      } else {
        await axios.post('http://10.0.3.2:5000/api/bus-types', busTypeData);
      }

      setBusTypeName('');
      setAmenities('');
      setEditId(null);
      fetchBusTypes(); // Refresh the list
    } catch (error) {
      Alert.alert('Error', 'Could not save bus type');
    }
  };

  const handleEdit = (busType) => {
    setBusTypeName(busType.bus_type_name);
    setAmenities(busType.amenities.join(', '));
    setEditId(busType._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://10.0.3.2:5000/api/bus-types/${id}`);
      fetchBusTypes(); // Refresh the list
    } catch (error) {
      Alert.alert('Error', 'Could not delete bus type');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>Bus Type: {item.bus_type_name}</Text>
      <Text style={styles.text}>Amenities: {item.amenities.join(', ')}</Text>
      <Button title="Edit" onPress={() => handleEdit(item)} color="#FFC107" />
      <Button title="Delete" onPress={() => handleDelete(item._id)} color="#DC3545" />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={busTypeName}
        onChangeText={setBusTypeName}
        placeholder="Bus Type Name"
      />
      <TextInput
        style={styles.input}
        value={amenities}
        onChangeText={setAmenities}
        placeholder="Amenities (comma-separated)"
      />
      <Button
        title={editId ? 'Update Bus Type' : 'Add Bus Type'}
        onPress={handleSubmit}
        color="#28A745"
      />

      <FlatList
        data={busTypes}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  item: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#495057',
  },
});

export default BusTypeManagement;
