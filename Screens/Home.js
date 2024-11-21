
// original-2
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { debounce } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
//  import Sound from 'react-native-sound';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the calendar icon
import AsyncStorage from '@react-native-async-storage/async-storage';

import RNFS from 'react-native-fs';
import { PDFDocument } from 'react-native-pdf-lib';
// import Toast from 'react-native-toast-message'; 

const Home = () => {

  const navigation = useNavigation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableBuses, setAvailableBuses] = useState([]);
  const [filteredFromStops, setFilteredFromStops] = useState([]);
  const [filteredToStops, setFilteredToStops] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [seatSelectionModalVisible, setSeatSelectionModalVisible] = useState(false);
  const [passengerDetailsModalVisible, setPassengerDetailsModalVisible] = useState(false);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [errors, setErrors] = useState([]); // New state to track errors
  const [totalCost, setTotalCost] = useState(0);
  const [allSeatsBooked, setAllSeatsBooked] = useState(false);



  const currentDate = new Date();

  // Fetch stop suggestions for 'From' input
  useEffect(() => {
    const fetchFromStops = debounce(async () => {
      if (from.length > 0) {
        try {
          const response = await axios.get('http://10.0.3.2:5000/api/stops', { params: { query: from } });
          setFilteredFromStops(response.data);
        } catch (error) {
          console.error('Error fetching from stops:', error);
        }
      } else {
        setFilteredFromStops([]);
      }
    }, 300);
    fetchFromStops();
    return () => { fetchFromStops.cancel(); };
  }, [from]);

  // Fetch stop suggestions for 'To' input
  useEffect(() => {
    const fetchToStops = debounce(async () => {
      if (to.length > 0) {
        try {
          const response = await axios.get('http://10.0.3.2:5000/api/stops', { params: { query: to } });
          setFilteredToStops(response.data);
        } catch (error) {
          console.error('Error fetching to stops:', error);
        }
      } else {
        setFilteredToStops([]);
      }
    }, 300);
    fetchToStops();
    return () => { fetchToStops.cancel(); };
  }, [to]);

  // Handle date change
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  // Handle search and fetch available buses
  const handleSearch = async () => {
    setIsLoading(true);
    setAvailableBuses([]);
    setNoResults(false);

    try {
      const response = await axios.get('http://10.0.3.2:5000/routes/details', {
        params: { from, to, date: date.toISOString().split('T')[0] },
      });

      setAvailableBuses(response.data);
      console.log("AvailableBuses: " + JSON.stringify(availableBuses));

      setNoResults(response.data.length === 0);
    } catch (error) {
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle stop selection
  const handleStopSelect = (stop, type) => {
    if (type === 'from') {
      setFrom(stop.stopName);
      setFilteredFromStops([]);
    } else {
      setTo(stop.stopName);
      setFilteredToStops([]);
    }
  };




  const handleBooking = async (bus) => {
    setSelectedBus(bus);
    setSeatSelectionModalVisible(true);
    setSelectedSeats([]);
    setPassengerDetails([]);
    setErrors([]); // Reset errors on new booking

    // Fetch the already booked seats from the selected bus
    try {
      const response = await axios.get(`http://10.0.3.2:5000/api/buses/${bus.bus_id}`);

      setBookedSeats(response.data.bookedSeats || []);

      // Check if all seats are booked
      if (response.data.bookedSeats.length >= bus.available_seats) {
        setAllSeatsBooked(true); // All seats are booked
      } else {
        setAllSeatsBooked(false); // There are still available seats
      }

    } catch (error) {
      console.error('Error fetching booked seats:', error);
    }
  };
  // Render seats for selection
  const renderSeats = () => {
    if (!selectedBus || typeof selectedBus.available_seats !== 'number') {
      return <Text>No seats available</Text>;
    }

    const totalSeats = selectedBus.available_seats;
    const seats = Array.from({ length: totalSeats }, (_, index) => ({ seat_number: index + 1 }));
    const rows = [];

    for (let i = 0; i < seats.length; i += 4) {
      rows.push(seats.slice(i, i + 4));
    }

    // If all seats are booked, show no seats available message
    if (totalSeats === bookedSeats.length) {
      return <Text style={styles.noSeatsText}>No seats available for booking.</Text>;
    }

    return (
      <View style={styles.seatContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.seatRow}>
            {row.map((seat) => {
              const isSelected = selectedSeats.includes(seat.seat_number);
              const isBooked = bookedSeats.includes(seat.seat_number); // Check if the seat is already booked

              return (
                <TouchableOpacity
                  key={seat.seat_number}
                  style={[
                    styles.seat,
                    isSelected && styles.selectedSeat,
                    isBooked && styles.bookedSeat, // Apply a different style if the seat is booked
                    !isSelected && !isBooked && styles.availableSeat,
                  ]}
                  onPress={() => {
                    if (!isBooked) { // Disable selection for booked seats
                      toggleSeatSelection(seat.seat_number);
                    }
                  }}
                  disabled={isBooked} // Disable touch event for booked seats
                >
                  <Text style={styles.seatNumber}>{seat.seat_number}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };


  // Toggle seat selection
  const toggleSeatSelection = (seatNumber) => {
    setSelectedSeats((prevSeats) => {
      let newSeats;
      if (prevSeats.includes(seatNumber)) {
        newSeats = prevSeats.filter((seat) => seat !== seatNumber);
      } else {
        newSeats = [...prevSeats, seatNumber];
      }

      // Recalculate total cost based on the number of selected seats
      const selectedSeatCount = newSeats.length;
      const farePerSeat = selectedBus?.fare || 0;  // Get fare per seat from selected bus
      const newTotalCost = selectedSeatCount * farePerSeat;
      setTotalCost(newTotalCost); // Update total cost state

      return newSeats;
    });
  };


  // Function to handle passenger detail changes
  const handlePassengerDetailChange = (index, field, value) => {
    const updatedDetails = [...passengerDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };
    setPassengerDetails(updatedDetails);
  };

  // Validate passenger details
  const validatePassengerDetails = () => {
    let formErrors = [];

    selectedSeats.forEach((seat) => {
      const details = passengerDetails[seat - 1];
      console.log("details:", JSON.stringify(details));

      // Name validation (only alphabets and a single space allowed)
      const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;  // Allows alphabets and single space between words

      if (!details?.name || !nameRegex.test(details.name)) {
        formErrors[seat] = formErrors[seat] || {};
        if (!details?.name) {
          formErrors[seat].name = "Name is required.";
        } else {
          formErrors[seat].name = "Name must contain only letters and a single space between words.";
        }
      }

      // Age validation (must be a positive number)
      if (!details?.age || isNaN(details.age) || parseInt(details.age, 10) <= 0) {
        formErrors[seat] = formErrors[seat] || {};
        formErrors[seat].age = "Age must be a valid positive number.";
      }

      // Gender validation (not empty)
      if (!details?.gender) {
        formErrors[seat] = formErrors[seat] || {};
        formErrors[seat].gender = "Gender is required.";
      }
    });

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;  // If there are no errors, return true
  };

  const confirmBooking = async () => {
    console.log("entering here..");
    
    if (!validatePassengerDetails()) {
      return; // Exit if validation fails
    }

    const updatedBookedSeats = [...bookedSeats, ...selectedSeats];
    console.log("updatedBookedSeats:", updatedBookedSeats);

    const UserId = await AsyncStorage.getItem('userId');
    console.log("UserId:", UserId);
    console.log("busId:", selectedBus.bus_id);
    console.log("routeId:", selectedBus.route_id);

    const bookingData = {
      busId: selectedBus.bus_id,
      routeId: selectedBus.route_id,
      bookedSeats: selectedSeats,
      passengerDetails: passengerDetails.filter((_, index) => selectedSeats.includes(index + 1)),
      userId: UserId,
      bookingDate: date || new Date(),
      status: 'Confirmed',
      totalFare: totalCost,
    };

    console.log("bookingData:", JSON.stringify(bookingData));

    try {
      const response = await axios.post('http://10.0.3.2:5000/api/bookings', bookingData);
      console.log("response:", JSON.stringify(response.data.bookedSeats));

      if (response.status === 201) {
        // Update the booked seats after successful booking
        setBookedSeats(updatedBookedSeats);

        await axios.patch('http://10.0.3.2:5000/api/buses/update/seats', {
          busId: response.data.busId,
          selectedSeats: response.data.bookedSeats,
        });

        // Show success toast
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Booking Successful!',
          text2: 'Your seats have been successfully booked.',
        });

        setSeatSelectionModalVisible(false);
        setPassengerDetailsModalVisible(false);
        setSelectedSeats([]);
        setPassengerDetails([]);
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Booking Failed!',
        text2: 'Something went wrong. Please try again.',
      });
      console.error(error);
    }
  };


  // Function to play success sound
  const playSuccessSound = () => {
    // Load the success sound file
    const successSound = new Sound('success.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound file', error);
        return;
      }

      // Play the sound
      successSound.play((success) => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.log('Sound playback failed');
        }
      });
    });
  };
  const handleContinue = () => {
    // Check if there are any available seats remaining
    // console.log("bus.data.remaining_seats:"+JSON.stringify(availableBuses[0].remaining_seats))
    if (availableBuses[0].remaining_seats === 0) {
      // Show an alert if no seats are available
      alert("No seats are available.");
    } else if (selectedSeats.length === 0) {
      // Show an alert if no seats are selected
      alert("Please select at least one seat.");
    } else {
      // Show the passenger details modal if seats are selected
      setPassengerDetailsModalVisible(true);
    }
  };

  // JSX
  return (
    <ScrollView style={styles.container}>
      {/* Form Input for 'From' */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={from}
          onChangeText={setFrom}
          placeholder="From"
        />
        {filteredFromStops.length > 0 && (
          <FlatList
            data={filteredFromStops}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleStopSelect(item, 'from')} style={styles.suggestionItem}>
                <Text>{item.stopName}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.stopName}
          />
        )}
      </View>

      {/* Form Input for 'To' */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={to}
          onChangeText={setTo}
          placeholder="To"
        />
        {filteredToStops.length > 0 && (
          <FlatList
            data={filteredToStops}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleStopSelect(item, 'to')} style={styles.suggestionItem}>
                <Text>{item.stopName}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.stopName}
          />
        )}
      </View>

      {/* Date Picker */}
      <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.datePickerText}>{date.toLocaleDateString()}</Text>
        <Icon name="calendar-today" size={24} color="#4CAF50" />
      </TouchableOpacity>

      {/* Date Time Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {/* Search Button */}
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {/* Loading */}
      {isLoading && <Text>Loading...</Text>}

      {/* Available Buses */}
      {!isLoading && !noResults && availableBuses.length > 0 && (
        <ScrollView>
          {availableBuses.map((bus) => (
            <View key={bus.bus_id._id} style={styles.busCard}>
              <Text>{bus.bus_name}</Text>
              <TouchableOpacity onPress={() => handleBooking(bus)} style={styles.bookButton}>
                <Text style={styles.busName}>Bus Number: {bus.bus_number}</Text>
                <Text style={styles.busDetails}>From: {bus.starting_stop_name}</Text>
                <Text style={styles.busDetails}>To: {bus.ending_stop_name}</Text>
                {/* Arrival Time (Already provided in the bus object) */}
                <Text style={styles.busDetails}>
                  Departure Time: {new Date(bus.arrival_time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </Text>
                <Text style={styles.busDetails}>Duration: {bus.duration} hours</Text>
                <Text style={styles.busDetails}>Total Seats: {bus.available_seats}</Text>
                <Text style={styles.busDetails}>Remaing Seats:{bus.remaining_seats}</Text>
                <Text style={styles.busDetails}>Fare: ₹{bus.fare}</Text>
                <Text style={styles.busDetails}>Bus Type: {bus.bus_type_name || 'Not Available'}</Text>
                <Text style={styles.busDetails}>
                  Amenities: {bus.amenities ? bus.amenities.join(', ') : 'Not Available'}
                </Text>
                <Text style={styles.busDetails}>Driver: {bus.driver_name || 'Not Available'}</Text>
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* No Results */}
      {noResults && !isLoading && <Text>No buses available for the selected route.</Text>}

      {/* Seat Selection Modal */}
      <Modal
        visible={seatSelectionModalVisible}
        onRequestClose={() => setSeatSelectionModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Seats</Text>
          {renderSeats()}


          <Text style={styles.totalCostText}>Total Cost: ₹{totalCost}</Text>
          

          <TouchableOpacity
            onPress={handleContinue}
            style={[styles.continueButton, (allSeatsBooked || selectedSeats.length === 0) && styles.disabledButton]}
            disabled={allSeatsBooked || selectedSeats.length === 0}  // Disable if no seats are selected or all seats are booked
          >
            <Text style={styles.continueButtonText}>
              {allSeatsBooked ? 'No Seats Available' : 'Continue'}
            </Text>
          </TouchableOpacity>


        </View>
      </Modal>

      {/* Passenger Details Modal */}
      <Modal
        visible={passengerDetailsModalVisible}
        onRequestClose={() => setPassengerDetailsModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Passenger Details</Text>

          {/* Wrap the passenger details section in a ScrollView */}
          <ScrollView contentContainerStyle={styles.passengerDetailsScrollView}>
            {selectedSeats.map((seat) => (
              <View key={seat} style={styles.passengerDetailContainer}>
                <Text>Passenger {seat}</Text>

                {/* Name Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={passengerDetails[seat - 1]?.name}
                  onChangeText={(value) => handlePassengerDetailChange(seat - 1, 'name', value)}
                />
                {errors[seat] && errors[seat].name && (
                  <Text style={styles.errorText}>{errors[seat].name}</Text>
                )}

                {/* Age Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  keyboardType="numeric"
                  value={passengerDetails[seat - 1]?.age}
                  onChangeText={(value) => handlePassengerDetailChange(seat - 1, 'age', value)}
                />
                {errors[seat] && errors[seat].age && (
                  <Text style={styles.errorText}>{errors[seat].age}</Text>
                )}

                {/* Gender Picker */}
                <Picker
                  selectedValue={passengerDetails[seat - 1]?.gender}
                  style={styles.picker}
                  onValueChange={(value) => handlePassengerDetailChange(seat - 1, 'gender', value)}
                >
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
                {errors[seat] && errors[seat].gender && (
                  <Text style={styles.errorText}>{errors[seat].gender}</Text>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Confirm Booking Button */}
          <TouchableOpacity onPress={confirmBooking} style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  searchButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  busCard: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 8,
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  seatContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  seat: {
    width: 40,
    height: 40,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
  },
  selectedSeat: {
    backgroundColor: '#4CAF50',
  },
  availableSeat: {
    backgroundColor: '#f0f0f0',
  },
  seatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  passengerDetailContainer: {
    marginVertical: 10,
    width: '100%',
  },
  picker: {
    height: 50,
    width: '100%',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  totalCostText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 10,
  },
  bookedSeat: {
    backgroundColor: '#FF6347', // Red or any color that signifies the seat is booked
    borderColor: '#D43F00', // Optional: Border color for better visibility
  },

  // Optional: to make the booked seat look unclickable
  availableSeat: {
    backgroundColor: '#f0f0f0',
  },

  selectedSeat: {
    backgroundColor: '#4CAF50', // Green for selected seats
  },

  seatContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  seatRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  disabledButton: {
    backgroundColor: '#d3d3d3', // Light gray for disabled state
  },
  noSeatsText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  

});

export default Home;