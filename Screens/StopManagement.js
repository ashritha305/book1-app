// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
// import axios from 'axios';

// const StopManagement = () => {
//   const [stops, setStops] = useState([]);
//   const [stopName, setStopName] = useState('');
//   const [editId, setEditId] = useState(null);

//   const fetchStops = async () => {
//     try {
//       const response = await axios.get('http://10.0.3.2:5000/api/stops'); 
//       setStops(response.data);
//     } catch (error) {
//       console.error('Error fetching stops:', error);
//     }
//   };

//   useEffect(() => {
//     fetchStops();
//   }, []);

//   const handleSubmit = async () => {
//     try {
//       if (editId) {
//         await axios.put(`http://10.0.3.2:5000/api/stops/${editId}`, { stopName });
//       } else {
//         await axios.post('http://10.0.3.2:5000/api/stops', { stopName });
//       }
//       setStopName('');
//       setEditId(null);
//       fetchStops();
//     } catch (error) {
//       console.error('Error saving stop:', error);
//       Alert.alert('Error', 'Could not save stop');
//     }
//   };

//   const handleEdit = (stop) => {
//     setStopName(stop.stopName);
//     setEditId(stop._id);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://10.0.3.2:5000/api/stops/${id}`);
//       fetchStops();
//     } catch (error) {
//       console.error('Error deleting stop:', error);
//       Alert.alert('Error', 'Could not delete stop');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         value={stopName}
//         onChangeText={setStopName}
//         placeholder="Stop Name"
//       />
//       <Button title={editId ? 'Update Stop' : 'Add Stop'} onPress={handleSubmit} color="#007BFF" />
//       <Text></Text>
//       <Text></Text>
//       <FlatList
//         data={stops}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <View style={styles.stopItem}>
//             <Text style={styles.stopText}>{item.stopName}</Text>
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}>
//                 <Text style={styles.buttonText}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item._id)}>
//                 <Text style={styles.buttonText}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     flex: 1,
//     backgroundColor: '#f5f5f5', 
//   },
//   input: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 20,
//     padding: 10,
//     borderRadius: 8,
//   },
//   stopItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//     padding: 15,
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     elevation: 2, 
//   },
//   stopText: {
//     fontSize: 18,
//     color: '#333',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//   },
//   actionButton: {
//     backgroundColor: '#007BFF', 
//     padding: 10,
//     borderRadius: 5,
//     marginLeft: 5,
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontWeight: '600',
//   },
// });

// export default StopManagement;



import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const StopManagement = () => {
  const [stops, setStops] = useState([]);
  const [stopName, setStopName] = useState('');
  const [editId, setEditId] = useState(null);

  // Fetch the stops from the backend
  const fetchStops = async () => {
    try {
      const response = await axios.get('http://10.0.3.2:5000/api/stops'); 
      setStops(response.data);
    } catch (error) {
      console.error('Error fetching stops:', error);
    }
  };

  useEffect(() => {
    fetchStops();
  }, []);

  // Validate stop name (only alphabets and spaces)
  const isValidStopName = (name) => /^[A-Za-z\s]+$/.test(name);

  // Check if stop name already exists (case insensitive)
  const isStopNameUnique = (name) => {
    return !stops.some(stop => stop.stopName.toLowerCase() === name.toLowerCase());
  };

  // Handle form submission (Add or Edit stop)
  const handleSubmit = async () => {
    if (!stopName.trim()) {
      Alert.alert('Error', 'Stop name cannot be empty.');
      return;
    }
    if (!isValidStopName(stopName)) {
      Alert.alert('Invalid Input', 'Stop name must only contain alphabets and spaces.');
      return;
    }

    if (!isStopNameUnique(stopName)) {
      Alert.alert('Duplicate Stop Name', 'A stop with this name already exists.');
      return;
    }

    try {
      if (editId) {
        // Editing an existing stop
        await axios.put(`http://10.0.3.2:5000/api/stops/${editId}`, { stopName });
        Alert.alert('Success', 'Stop updated successfully');
      } else {
        // Adding a new stop
        await axios.post('http://10.0.3.2:5000/api/stops', { stopName });
        Alert.alert('Success', 'Stop added successfully');
      }
      setStopName('');
      setEditId(null);
      fetchStops(); // Refresh the stop list
    } catch (error) {
      console.error('Error saving stop:', error);
      Alert.alert('Error', 'Could not save stop');
    }
  };

  // Handle edit action (set stop name and ID for editing)
  const handleEdit = (stop) => {
    setStopName(stop.stopName);
    setEditId(stop._id);
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://10.0.3.2:5000/api/stops/${id}`);
      Alert.alert('Success', 'Stop deleted successfully');
      fetchStops(); // Refresh the stop list
    } catch (error) {
      console.error('Error deleting stop:', error);
      Alert.alert('Error', 'Could not delete stop');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={stopName}
        onChangeText={setStopName}
        placeholder="Add a New Stop "
      />
      <Button title={editId ? 'Update Stop' : 'Add Stop'} onPress={handleSubmit} color="#007BFF" />

      <FlatList
        data={stops}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.stopItem}>
            <Text style={styles.stopText}>{item.stopName}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item._id)}>
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
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
  },
  stopItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
  },
  stopText: {
    fontSize: 18,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default StopManagement;

