



// import React, { useState, useEffect } from 'react';
// import { Text, View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const PastBookings = () => {
//   const [pastBookings, setPastBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchPastBookings = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const userId = await AsyncStorage.getItem("userId");

//       if (!userId) {
//         setError("No user ID found.");
//         return;
//       }

//       const response = await fetch(`http://10.0.3.2:5000/api/bookings/${userId}/past`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch past bookings");
//       }

//       const data = await response.json();

//       // Assuming the data contains the 'pastBookings' array
//       setPastBookings(data.pastBookings);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPastBookings();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={pastBookings}
//         keyExtractor={item => item._id} // Ensure the keyExtractor is based on the unique id
//         renderItem={({ item }) => (
//           <View style={styles.bookingItem}>
//             <Text style={styles.bookingText}>Booking Date: {new Date(item.bookingDate).toLocaleDateString()}</Text>
//             <Text style={styles.bookingText}>From: {item.routeId.starting_stop_id.stopName}</Text>
//             <Text style={styles.bookingText}>To: {item.routeId.ending_stop_id.stopName}</Text>
//             <Text style={styles.bookingText}>Driver Name: {item.busId.driver_id.name}</Text>
//             <Text style={styles.bookingText}>Seats: {item.bookedSeats.length}</Text>
//             <Text style={styles.bookingText}>Seat Numbers: {item.bookedSeats.map((seat, index) => (
//               <Text key={index} style={styles.bookingText}>{seat}{index < item.bookedSeats.length - 1 ? ', ' : ''}</Text>
//             ))}</Text>
//             <Text style={styles.bookingText}>Total Fare: ₹{item.totalFare}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f8ff',
//   },
//   loader: {
//     marginTop: 20,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 18,
//   },
//   bookingItem: {
//     marginBottom: 15,
//     padding: 10,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   bookingText: {
//     fontSize: 16,
//     marginVertical: 2,
//   },
// });

// export default PastBookings;


import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PastBookings = () => {
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPastBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        setError("No user ID found.");
        return;
      }

      const response = await fetch(`http://10.0.3.2:5000/api/bookings/${userId}/past`);
      if (!response.ok) {
        throw new Error("Failed to fetch past bookings");
      }

      const data = await response.json();

      // Assuming the data contains the 'pastBookings' array
      setPastBookings(data.pastBookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastBookings();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Check if there are no past bookings
  if (pastBookings.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noBookingsText}>No past bookings are available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pastBookings}
        keyExtractor={item => item._id} // Ensure the keyExtractor is based on the unique id
        renderItem={({ item }) => (
          <View style={styles.bookingItem}>
            <Text style={styles.bookingText}>Booking Date: {new Date(item.bookingDate).toLocaleDateString()}</Text>
            <Text style={styles.bookingText}>From: {item.routeId.starting_stop_id.stopName}</Text>
            <Text style={styles.bookingText}>To: {item.routeId.ending_stop_id.stopName}</Text>
            <Text style={styles.bookingText}>Driver Name: {item.busId.driver_id.name}</Text>
            <Text style={styles.bookingText}>Seats: {item.bookedSeats.length}</Text>
            <Text style={styles.bookingText}>Seat Numbers: {item.bookedSeats.map((seat, index) => (
              <Text key={index} style={styles.bookingText}>{seat}{index < item.bookedSeats.length - 1 ? ', ' : ''}</Text>
            ))}</Text>
            <Text style={styles.bookingText}>Total Fare: ₹{item.totalFare}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  loader: {
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  bookingItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  bookingText: {
    fontSize: 16,
    marginVertical: 2,
  },
  noBookingsText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
});

export default PastBookings;


