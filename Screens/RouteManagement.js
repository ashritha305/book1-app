
// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, FlatList, Alert, TextInput } from 'react-native';
// import axios from 'axios';
// import { Picker } from '@react-native-picker/picker';

// const RouteManagement = () => {
//   const [routes, setRoutes] = useState([]);
//   const [startingStopId, setStartingStopId] = useState('');
//   const [endingStopId, setEndingStopId] = useState('');
//   const [duration, setDuration] = useState('');
//   const [distance, setDistance] = useState('');
//   const [busId, setBusId] = useState('');
//   const [editingId, setEditingId] = useState(null);
//   const [stops, setStops] = useState([]);
//   const [buses, setBuses] = useState([]);

//   useEffect(() => {
//     fetchRoutes();
//     fetchStops();
//     fetchBuses();
//   }, []);

//   const fetchRoutes = async () => {
//     try {
//       const response = await axios.get('http://10.0.3.2:5000/api/routes');
//       console.log("response:"+JSON.stringify(response));

//       setRoutes(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchStops = async () => {
//     try {
//       const response = await axios.get('http://10.0.3.2:5000/api/stops');
//       setStops(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchBuses = async () => {
//     try {
//       const response = await axios.get('http://10.0.3.2:5000/api/buses');
      
//       setBuses(response.data.filter(bus => bus.isAvailable));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!duration || isNaN(duration) || duration <= 0) {
//       Alert.alert('Invalid Input', 'Please enter a valid duration (positive number).');
//       return;
//     }

//     if (!distance || isNaN(distance) || distance <= 0) {
//       Alert.alert('Invalid Input', 'Please enter a valid distance (positive number).');
//       return;
//     }

//     try {
//       const routeData = {
//         starting_stop_id: startingStopId,
//         ending_stop_id: endingStopId,
//         duration: parseInt(duration),
//         distance: parseInt(distance),
//         bus_id: busId,
//       };

//       if (editingId) {
//         await axios.put(`http://10.0.3.2:5000/api/routes/${editingId}`, routeData);
//         Alert.alert('Route updated successfully!');
//       } else {
//         const response = await axios.post('http://10.0.3.2:5000/api/routes', routeData);
//         if (response.data) {
//           await axios.patch(`http://10.0.3.2:5000/api/buses/${busId}`, { isAvailable: false });
//           Alert.alert('Route added successfully');
//         } else {
//           Alert.alert('Error', 'Failed to add the route.');
//         }
//       }

//       resetForm();
//       fetchRoutes();
//       fetchBuses();
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong. Please provide all the details.');
//     }
//   };

//   const handleEdit = (route) => {
//     setStartingStopId(route.starting_stop_id._id);
//     setEndingStopId(route.ending_stop_id ? route.ending_stop_id._id : '');
//     setDuration(route.duration.toString());
//     setDistance(route.distance.toString());
//     setBusId(route.bus_id._id);
//     setEditingId(route._id);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://10.0.3.2:5000/api/routes/${id}`);
//       Alert.alert('Route deleted successfully!');
//       fetchRoutes();
//       fetchBuses();
//     } catch (error) {
//       Alert.alert('Error', 'Could not delete route.');
//     }
//   };

//   const resetForm = () => {
//     setStartingStopId('');
//     setEndingStopId('');
//     setDuration('');
//     setDistance('');
//     setBusId('');
//     setEditingId(null);
//   };

//   const filteredStopsForTo = stops.filter(stop => stop._id !== startingStopId);
//   console.log("filteredStopsForTo:"+JSON.stringify(filteredStopsForTo));
//   let id=routes.starting_stop_id;
//   console.log("id:"+id);
  
//   // let stopName=filteredStopsForTo.find({()});
  
//   const filteredStopsForFrom = stops.filter(stop => stop._id !== endingStopId);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Select From Stop</Text>
//       <Picker
//         selectedValue={startingStopId}
//         onValueChange={(itemValue) => setStartingStopId(itemValue)}
//         style={styles.picker}
//       >
//         <Picker.Item label="Select a Stop" value="" style={styles.pickerItem} />
//         {filteredStopsForFrom.map((stop) => (
//           <Picker.Item key={stop._id} label={stop.stopName} value={stop._id} />
//         ))}
//       </Picker>

//       <Text style={styles.label}>Select To Stop</Text>
//       <Picker
//         selectedValue={endingStopId}
//         onValueChange={(itemValue) => setEndingStopId(itemValue)}
//         style={styles.picker}
//       >
//         <Picker.Item label="Select a Stop" value="" style={styles.pickerItem} />
//         {filteredStopsForTo.map((stop) => (
//           <Picker.Item key={stop._id} label={stop.stopName} value={stop._id} />
//         ))}
//       </Picker>

//       <Text style={styles.label}>Select Bus</Text>
//       <Picker
//         selectedValue={busId}
//         onValueChange={(itemValue) => setBusId(itemValue)}
//         style={styles.picker}
//       >
//         <Picker.Item label="Select a Bus" value="" />
//         {buses.map((bus) => (
//           <Picker.Item key={bus._id} label={bus.bus_number} value={bus._id} />
//         ))}
//       </Picker>

//       <TextInput
//         placeholder="Duration (hrs)"
//         value={duration}
//         onChangeText={setDuration}
//         keyboardType="numeric"
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Distance (km)"
//         value={distance}
//         onChangeText={setDistance}
//         keyboardType="numeric"
//         style={styles.input}
//       />

//       <Button title={editingId ? "Update Route" : "Add Route"} onPress={handleSubmit} color="#007BFF" />

//       <FlatList
//         data={routes}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <View style={styles.routeItem}>
//             <Text style={styles.routeText}>
//               {`From: ${item.starting_stop_id ? item.starting_stop_id.stopName : 'N/A'}`}
//             </Text>
//             <Text style={styles.routeText}>
//               {`To: ${item.ending_stop_id ? item.ending_stop_id.stopName : 'N/A'}`}
//             </Text>
//             <Text style={styles.routeText}>
//               {`Bus: ${item.bus_id?.bus_number || 'N/A'}`}
//             </Text>
//             <Text style={styles.routeText}>
//               {`Arrival Time: ${item.bus_id?.arrival_time ? new Date(item.bus_id.arrival_time).toLocaleTimeString() : 'N/A'}`}
//             </Text>
//             <Text style={styles.routeText}>
//               {`Duration: ${item.duration} hrs`}
//             </Text>
//             <Text style={styles.routeText}>
//               {`Distance: ${item.distance} km`}
//             </Text>
//             <Text style={styles.routeText}>
//               {`Number of Seats: ${item.bus_id?.no_of_seats || 'N/A'}`}
//             </Text>
//             <View style={styles.buttonContainer}>
//               <Button title="Edit" onPress={() => handleEdit(item)} color="#FFC107" />
//               <Button title="Delete" onPress={() => handleDelete(item._id)} color="#DC3545" />
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = {
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F5F5F5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   label: {
//     fontSize: 16,
//     marginVertical: 10,
//     color: '#555',
//   },
//   picker: {
//     height: 55,
//     width: '100%',
//     marginBottom: 15,
//     backgroundColor: '#FFF',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     color: '#333', // Ensure text is visible
//   },
//   pickerItem: {
//     color: '#888', // Light color for the placeholder text
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//     backgroundColor: '#FFF',
//   },
//   routeItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     backgroundColor: '#FFF',
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   routeText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
// };

// export default RouteManagement;




import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, TextInput } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [startingStopId, setStartingStopId] = useState('');
  const [endingStopId, setEndingStopId] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [busId, setBusId] = useState('');
  const [fare, setFare] = useState(''); // Fare input state
  const [editingId, setEditingId] = useState(null);
  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedBusType, setSelectedBusType] = useState(''); // To store the selected bus type

  useEffect(() => {
    fetchRoutes();
    fetchStops();
    fetchBuses();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('http://10.0.3.2:5000/api/routes');
      setRoutes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStops = async () => {
    try {
      const response = await axios.get('http://10.0.3.2:5000/api/stops');
      setStops(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await axios.get('http://10.0.3.2:5000/api/buses');
      setBuses(response.data.filter(bus => bus.isAvailable));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!duration || isNaN(duration) || duration <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid duration (positive number).');
      return;
    }

    if (!distance || isNaN(distance) || distance <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid distance (positive number).');
      return;
    }

    if (!fare || isNaN(fare) || fare <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid base fare (positive number).');
      return;
    }

    // Calculate the extra fare based on bus type
    const extraFare = calculateExtraFare(selectedBusType);

    // Total fare calculation
    const finalFare = parseFloat(fare) + extraFare;

    try {
      const routeData = {
        starting_stop_id: startingStopId,
        ending_stop_id: endingStopId,
        duration: parseInt(duration),
        distance: parseInt(distance),
        bus_id: busId,
        fare: finalFare, // Use the calculated fare
      };

      if (editingId) {
        // Update the route if we're editing
        await axios.put(`http://10.0.3.2:5000/api/routes/${editingId}`, routeData);
        Alert.alert('Route updated successfully!');
      } else {
        const response = await axios.post('http://10.0.3.2:5000/api/routes', routeData);
        if (response.data) {
          // If adding a new route, make the bus unavailable
          await axios.patch(`http://10.0.3.2:5000/api/buses/${busId}`, { isAvailable: false });
          Alert.alert('Route added successfully');
        } else {
          Alert.alert('Error', 'Failed to add the route.');
        }
      }

      resetForm();
      fetchRoutes();
      fetchBuses();
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please provide all the details.');
    }
  };

  const handleEdit = (route) => {
    setStartingStopId(route.starting_stop_id._id);
    setEndingStopId(route.ending_stop_id ? route.ending_stop_id._id : '');
    setDuration(route.duration.toString());
    setDistance(route.distance.toString());
    setBusId(route.bus_id._id);
    setFare(route.fare); // Set the fare from the route during edit
    setSelectedBusType(route.bus_id.bus_type); // Set the bus type
    setEditingId(route._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://10.0.3.2:5000/api/routes/${id}`);
      Alert.alert('Route deleted successfully!');
      fetchRoutes();
      fetchBuses();
    } catch (error) {
      Alert.alert('Error', 'Could not delete route.');
    }
  };

  const resetForm = () => {
    setStartingStopId('');
    setEndingStopId('');
    setDuration('');
    setDistance('');
    setBusId('');
    setFare('');
    setSelectedBusType('');
    setEditingId(null);
  };

  // Calculate extra fare based on bus type
  const calculateExtraFare = (busType) => {
    console.log("busType:"+busType);
    
    let extraFare = 0;
    const type = busType?.bus_type?.bus_type_name;
    console.log("type:"+type);
    

    switch (type) {
      case 'Express':
        extraFare = 50; // Extra charge for Express buses
        break;
      case 'Luxury':
        extraFare = 150; // Extra charge for Luxury buses
        break;
      case 'Super - Luxury':
        extraFare = 250; // Extra charge for Super-Luxury buses
        break;
      default:
        extraFare = 0; // No extra charge for other bus types
        break;
    }

    return extraFare;
  };

  const handleBusChange = (busId) => {
    setBusId(busId);
    const selectedBus = buses.find(bus => bus._id === busId);
    if (selectedBus) {
      setSelectedBusType(selectedBus); // Set the entire bus object, not just bus_type
    }
};


  const filteredStopsForTo = stops.filter(stop => stop._id !== startingStopId);
  const filteredStopsForFrom = stops.filter(stop => stop._id !== endingStopId);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select From Stop</Text>
      <Picker
        selectedValue={startingStopId}
        onValueChange={(itemValue) => setStartingStopId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a Stop" value="" />
        {filteredStopsForFrom.map((stop) => (
          <Picker.Item key={stop._id} label={stop.stopName} value={stop._id} />
        ))}
      </Picker>

      <Text style={styles.label}>Select To Stop</Text>
      <Picker
        selectedValue={endingStopId}
        onValueChange={(itemValue) => setEndingStopId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a Stop" value="" />
        {filteredStopsForTo.map((stop) => (
          <Picker.Item key={stop._id} label={stop.stopName} value={stop._id} />
        ))}
      </Picker>

      <Text style={styles.label}>Select Bus</Text>
      <Picker
        selectedValue={busId}
        onValueChange={handleBusChange}
        style={styles.picker}
      >
        <Picker.Item label="Select a Bus" value="" />
        {buses.map((bus) => (
          <Picker.Item key={bus._id} label={bus.bus_number} value={bus._id} />
        ))}
      </Picker>

      <TextInput
        placeholder="Duration (hrs)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Distance (km)"
        value={distance}
        onChangeText={setDistance}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Base Fare"
        value={fare}
        onChangeText={setFare}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Display the calculated total fare */}
      <Text style={styles.label}>Total Fare: {fare ? parseFloat(fare) + calculateExtraFare(selectedBusType) : 0}</Text>

      <Button title={editingId ? "Update Route" : "Add Route"} onPress={handleSubmit} color="#007BFF" />

      <FlatList
        data={routes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.routeItem}>
            <Text style={styles.routeText}>
              {`From: ${item.starting_stop_id ? item.starting_stop_id.stopName : 'N/A'}`}
            </Text>
            <Text style={styles.routeText}>
              {`To: ${item.ending_stop_id ? item.ending_stop_id.stopName : 'N/A'}`}
            </Text>
            <Text style={styles.routeText}>
              {`Bus: ${item.bus_id?.bus_number || 'N/A'}`}
            </Text>
            <Text style={styles.routeText}>
              {`Duration: ${item.duration} hrs`}
            </Text>
            <Text style={styles.routeText}>
              {`Distance: ${item.distance} km`}
            </Text>
            <Text style={styles.routeText}>
              {`Fare: ${item.fare}`}
            </Text>
            <View style={styles.buttonContainer}>
              <Button title="Edit" onPress={() => handleEdit(item)} color="#FFC107" />
              <Button title="Delete" onPress={() => handleDelete(item._id)} color="#DC3545" />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: '#555',
  },
  picker: {
    height: 55,
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    color: '#333', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  routeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginBottom: 10,
  },
  routeText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
};

export default RouteManagement;

