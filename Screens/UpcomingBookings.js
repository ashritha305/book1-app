import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, ActivityIndicator, StyleSheet, Button, Modal, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const UpcomingBookings = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);

  // Fetch upcoming bookings
  const fetchUpcomingBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        setError("No user ID found.");
        return;
      }

      const response = await fetch(`http://10.0.3.2:5000/api/bookings/${userId}/upcoming`);
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming bookings");
      }

      const data = await response.json();
      setUpcomingBookings(data.upcomingBookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle seat selection for cancellation
  const handleCancelBooking = (booking) => {
    setCurrentBooking(booking);
    setSelectedSeats([]);
    setModalVisible(true);
  };

  // Check if cancellation is allowed based on arrival time
  const isCancellationAllowed = (booking) => {
    const busArrivalTime = new Date(booking.busId.arrival_time);
    const currentTime = new Date();
    const timeDifference = busArrivalTime - currentTime;

    // Allow cancellation if the time difference is greater than 1 hour
    return timeDifference > 3600000; // 3600000 ms = 1 hour
  };

  // Confirm cancellation of selected seats
  const confirmCancellation = async () => {
    if (!currentBooking || selectedSeats.length === 0) {
      Alert.alert('Error', 'Please select at least one seat to cancel.');
      return;
    }

    // Ensure cancellation is allowed before proceeding
    if (!isCancellationAllowed(currentBooking)) {
      Alert.alert('Error', 'You can only cancel seats at least 1 hour before departure.');
      return;
    }

    try {
      const response = await axios.patch(`http://10.0.3.2:5000/api/bookings/${currentBooking._id}/cancel-seats`, {
        bookedSeats: selectedSeats,
      });

      if (response.status === 200) {
        Toast.show({
          text1: 'Seats Cancelled',
          text2: 'The selected seats have been cancelled successfully.',
          position: 'top',
          visibilityTime: 5000,
          type: 'success',
        });

        // Refresh bookings after cancellation
        fetchUpcomingBookings();
        setModalVisible(false);
      } else {
        throw new Error('Failed to cancel booking');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not cancel the selected seats. Please try again.');
      console.error('Error cancelling booking:', error);
    }
  };

  // const confirmCancellation = async () => {
  //   if (!currentBooking || selectedSeats.length === 0) {
  //     Alert.alert('Error', 'Please select at least one seat to cancel.');
  //     return;
  //   }
  
  //   // Ensure cancellation is allowed before proceeding
  //   if (!isCancellationAllowed(currentBooking)) {
  //     Alert.alert('Error', 'You can only cancel seats at least 1 hour before departure.');
  //     return;
  //   }
  
  //   try {
  //     // Get the total number of booked seats
  //     const totalBookedSeats = currentBooking.bookedSeats.length;
  
  //     // Calculate fare per seat (totalFare / totalBookedSeats)
  //     const farePerSeat = currentBooking.totalFare / totalBookedSeats;
  
  //     // Calculate the total fare for the cancelled seats
  //     const totalCancelledFare = selectedSeats.length * farePerSeat;
  
  //     // Calculate the updated total fare after cancellation
  //     const updatedTotalFare = currentBooking.totalFare - totalCancelledFare;
  
  //     // Prepare the request data with updated fare and cancelled seats
  //     const updatedBookingData = {
  //       bookedSeats: selectedSeats,
  //       updatedTotalFare: updatedTotalFare, // Send updated fare to the backend
  //     };
  
  //     // Make API request to cancel selected seats and update total fare
  //     const response = await axios.patch(
  //       `http://10.0.3.2:5000/api/bookings/${currentBooking._id}/cancel-seats`,
  //       updatedBookingData
  //     );
  
  //     if (response.status === 200) {
  //       Toast.show({
  //         text1: 'Seats Cancelled',
  //         text2: `The selected seats have been cancelled successfully. Total fare updated to ₹${updatedTotalFare}`,
  //         position: 'top',
  //         visibilityTime: 5000,
  //         type: 'success',
  //       });
  
  //       // Refresh bookings after cancellation
  //       fetchUpcomingBookings();
  //       setModalVisible(false);
  //     } else {
  //       throw new Error('Failed to cancel booking');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'Could not cancel the selected seats. Please try again.');
  //     console.error('Error cancelling booking:', error);
  //   }
  // };
  
  
  

  useEffect(() => {
    fetchUpcomingBookings();
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

  // Check if there are no upcoming bookings
  if (upcomingBookings.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noBookingsText}>No upcoming bookings are available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={upcomingBookings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.bookingItem}>
            <Text style={styles.bookingText}>Booking Date: {new Date(item.bookingDate).toLocaleDateString()}</Text>
            <Text style={styles.bookingText}>Status: {item.status}</Text>
            <Text style={styles.bookingText}>Total Fare: ₹{item.totalFare}</Text>
            <Text style={styles.bookingText}>From: {item.routeId.starting_stop_id.stopName}</Text>
            <Text style={styles.bookingText}>To: {item.routeId.ending_stop_id.stopName}</Text>
            <Text style={styles.bookingText}>Bus Number: {item.busId.bus_number}</Text>
            <Text style={styles.bookingText}>Departure Time: {new Date(item.busId.arrival_time).toLocaleString()}</Text>
            <Text style={styles.bookingText}>Driver: {item.busId.driver_id.name}</Text>
            <Text style={styles.bookingText}>Booked Seats: {item.bookedSeats.length}</Text>
            <Text style={styles.bookingText}>Seat Numbers: {item.bookedSeats.join(', ')}</Text>

            {item.status !== 'Cancelled' && (
              <>
                {/* <Button
                  title="Cancel Booking"
                  color="red"
                  onPress={() => cancelBooking(item._id)}
                /> */}
                {isCancellationAllowed(item) && (
                  <Button
                    title="Cancel Specific Seats"
                    color="orange"
                    onPress={() => handleCancelBooking(item)}
                  />
                )}
              </>
            )}
          </View>
        )}
      />

      {/* Modal for Selecting Seats */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Seats to Cancel</Text>
            <FlatList
              data={currentBooking?.bookedSeats}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.seatItem, selectedSeats.includes(item) && styles.selectedSeat]}
                  onPress={() => {
                    setSelectedSeats((prev) =>
                      prev.includes(item) ? prev.filter(seat => seat !== item) : [...prev, item]
                    );
                  }}
                >
                  <Text style={styles.seatText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Confirm Cancellation" onPress={confirmCancellation} color="#ff5c5c" />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#f8d7da',
    padding: 20,
    borderRadius: 8,
  },
  errorText: {
    color: '#721c24',
    fontSize: 16,
    textAlign: 'center',
  },
  bookingItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  bookingText: {
    fontSize: 14,
    marginVertical: 5,
    color: '#333',
  },
  noBookingsText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  seatItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedSeat: {
    backgroundColor: '#d1e7fd',
  },
  seatText: {
    fontSize: 18,
  },
});

export default UpcomingBookings;

