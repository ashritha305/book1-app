import React, { useState, useEffect } from "react";
import { Text, View, FlatList, Button, ActivityIndicator, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://10.0.3.2:5000/api/bookings`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      if (isMounted) {
        setBookings(data);
      }
    } catch (err) {
      if (isMounted) {
        setError(err.message);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
    return () => {
      isMounted = false;
    };
  };

  const cancelBooking = async (bookingId) => {
    try {
        const response = await fetch(`http://10.0.3.2:5000/api/bookings/${bookingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to cancel booking');
        }

        const result = await response.json();
        Toast.show({
            text1: 'Booking Cancelled',
            text2: result.message,
            position: 'top',
            visibilityTime: 5000,
            type: 'success',
        });

        fetchBookings(); // Refresh the bookings list to reflect changes
    } catch (err) {
        setError(err.message);
    }
};

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {bookings.length === 0 ? (
        <Text style={styles.noBookingsText}>No bookings are available.</Text> // Message for no bookings
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.bookingItem}>
              <Text style={styles.busNumber}>Bus Number: {item.busId?.bus_number || 'N/A'}</Text>
              <Text style={styles.detailText}>User Name: {item.userId?.name || 'N/A'}</Text>
              <Text style={styles.detailText}>From: {item.from || 'N/A'}</Text>
              <Text style={styles.detailText}>To: {item.to || 'N/A'}</Text>
              <Text style={styles.detailText}>Booking Date: {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</Text>
              <Text style={styles.detailText}>Departure: {item.departureTime ? new Date(item.departureTime).toLocaleTimeString() : 'N/A'}</Text>
              <Text style={styles.detailText}>Booked Seats: {item.bookedSeats ? item.bookedSeats.join(', ') : 'N/A'}</Text>
              <Text style={styles.detailText}>Status: {item.status || 'N/A'}</Text>

              {/* Show the cancel button only if the booking status is 'Confirmed' */}
              {item.status === 'Confirmed' && (
                <Button title="Cancel Booking" onPress={() => cancelBooking(item._id)} color="#DC3545" />
              )}
            </View>
          )}
        />
      )}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e9f5ff',
  },
  bookingItem: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  busNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF', // Blue color for bus number
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5, // Gap between details
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
  noBookingsText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default BookingManagement;




