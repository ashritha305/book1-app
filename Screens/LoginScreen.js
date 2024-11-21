
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigation = useNavigation();

  const validateEmailOrPhone = (input) => {
    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // Phone number validation regex (simple check for 10 digits)
    const phoneRegex = /^\d{10}$/;
    
    // Check if input is a valid email or phone number
    if (emailRegex.test(input)) {
      return 'email';
    } else if (phoneRegex.test(input)) {
      return 'phone';
    } else {
      return 'invalid';
    }
  };

  const handleLogin = async () => {
    let formIsValid = true;

    // Reset previous error messages
    setIdentifierError('');
    setPasswordError('');

    // Validation checks
    if (!identifier) {
      setIdentifierError('Email or Mobile number is required.');
      formIsValid = false;
    } else {
      const identifierType = validateEmailOrPhone(identifier);
      if (identifierType === 'invalid') {
        setIdentifierError('Invalid email or phone number.');
        formIsValid = false;
      }
    }

    if (!password) {
      setPasswordError('Password is required.');
      formIsValid = false;
    }

    if (!formIsValid) {
      return; // Stop execution if validation fails
    }

    try {
      console.log("entered here..");
      
      const response = await fetch('http://10.0.3.2:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });
      console.log("after...");
      

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
            if (data.error.includes('Invalid email or phone number')) {
                setIdentifierError(data.error);
            } else if (data.error.includes('User not found')) {
                setIdentifierError('No account associated with this identifier.');
            } else if (data.error.includes('Incorrect password')) {
                setPasswordError('The password you entered is incorrect.');
            }
        } else {
            setIdentifierError('Login failed. Please try again.');
        }
        return;
    }
    

      const userRole = data.role;

      switch (userRole) {
        case 'admin':
          navigation.navigate('Admin', { screen: 'AdminDashboard' });
          break;
        case 'traveler':
          navigation.navigate('TravelerHome');
          break;
        default:
          setIdentifierError('Unrecognized user role.');
          return;
      }

      await AsyncStorage.setItem('jwtToken', data.token);
      await AsyncStorage.setItem('name', data.name);
      await AsyncStorage.setItem('email', data.email);
      await AsyncStorage.setItem('userId', data.userId);

    } catch (error) {
      console.error('Login Error:', error);
      setIdentifierError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../Assets/loginPage.png')} style={styles.busImage} />
      </View>

      <Text style={styles.title}>Sign In to Book My Bus</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email or mobile number"
          keyboardType="email-address"
          value={identifier}
          onChangeText={setIdentifier}
        />
        {identifierError ? <Text style={styles.errorText}>{identifierError}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Don't have an account? Register here</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  busImage: {
    width: 440,
    height: 230,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  registerText: {
    textAlign: 'center',
    color: '#e74c3c',
    fontSize: 16,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default Login;

//git remote add origin https://github.com/sushmitha-somanathi/BookMyBus.git