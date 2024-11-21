  import React, { useState, useEffect } from 'react';
  import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { Icon } from 'react-native-vector-icons/MaterialIcons';
  import { useNavigation } from '@react-navigation/native';
  import { launchImageLibrary } from 'react-native-image-picker';

  const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [userId, setUserId] = useState(null);
    const navigation = useNavigation();

    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
      return id;
    };

    useEffect(() => {
      const fetchUserDetails = async () => {
        const id = await fetchUserId();
        const token = await AsyncStorage.getItem('jwtToken');

        const response = await fetch(`http://10.0.3.2:5000/users/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setName(userData[0].name);
          setEmail(userData[0].email);
          setProfilePicture(userData[0].profilePicture); 
        } else {
          Alert.alert('Error', 'Failed to fetch user details');
        }
      };

      fetchUserDetails();
    }, []);

    const handleUpdate = async () => {
      const token = await AsyncStorage.getItem('jwtToken');

      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      try {
        const response = await fetch(`http://10.0.3.2:5000/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email, profilePicture }),
        });

        if (!response.ok) {
          throw new Error('Failed to update user details');
        }

        Alert.alert('Success', 'User details updated successfully');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem('jwtToken');
        await AsyncStorage.removeItem('userId');
        navigation.navigate('Login');
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    const selectImage = () => {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
      };

      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.error('ImagePicker Error: ', response.error);
        } else {
          setProfilePicture(response.assets[0].uri); 
           }
      });
    };

    return (
      <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={selectImage}>
            <Image
              source={{ uri: profilePicture || 'https://wallpapers.com/images/hd/girl-in-all-black-outfit-pfp-aesthetic-qb6mk3z43kkayw2w.jpg' }}
              style={styles.profileImage}
            />
            <View style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.header}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Update Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Update Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Button title="Update Profile" onPress={handleUpdate} color="#4CAF50" />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#fff',
      flex: 1,
    },
    logoutButton: {
      position: 'absolute',
      top: 0,
      right: 20,
      backgroundColor: '#e74c3c',
      borderRadius: 10,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    logoutButtonText: {
      color: '#fff',
      fontSize: 13,
      marginLeft: 1,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
      borderBottomWidth: 1,
      borderBottomColor: '#e6e6e6',
      paddingBottom: 20,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginRight: 20,
      borderWidth: 2,
      borderColor: '#e6e6e6',
    },
    addButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: '#4CAF50',
      borderRadius: 20,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButtonText: {
      color: '#fff',
      fontSize: 20,
    },
    profileInfo: {
      flex: 1,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
    },
    email: {
      fontSize: 16,
      color: '#666',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 15,
      marginBottom: 20,
      borderRadius: 10,
      backgroundColor: '#f9f9f9',
    },
  });

  export default Profile;





