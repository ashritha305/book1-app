// import React, { useState } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

// const Register = () => {
//   const navigation = useNavigation();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');

//   const validateInputs = () => {
//     const nameRegex = /^[A-Za-z]{3,}( [A-Za-z]{3,})?$/;
//     if (!name) {
//       Alert.alert('Name is required');
//       return false;
//     }
//     if (!nameRegex.test(name)) {
//       Alert.alert('Name must be at least 3 letters long and may contain one space');
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@gmail\.com$/;
//     if (!email) {
//       Alert.alert('Email is required');
//       return false;
//     }
//     if (!emailRegex.test(email)) {
//       Alert.alert('Email must end with @gmail.com');
//       return false;
//     }

//     const mobileNumberRegex = /^\d{10}$/;
//     if (!mobileNumber) {
//       Alert.alert('Mobile number is required');
//       return false;
//     }
//     if (!mobileNumberRegex.test(mobileNumber)) {
//       Alert.alert('Mobile number must be exactly 10 digits');
//       return false;
//     }

//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;

//     if (!password) {
//       Alert.alert('Password is required');
//       return false;
//     }
//     if (!passwordRegex.test(password)) {
//       Alert.alert(
//         'Password Requirements', 
//         'Password must be at least 6 characters long, and include:\n' +
//         '- One lowercase letter\n' +
//         '- One uppercase letter\n' +
//         '- One special symbol\n' +
//         '- One number'
//       );
//       return false;
//     }

    
//     if (password !== confirmPassword) {
//       Alert.alert('Passwords do not match');
//       return false;
//     }

//     return true;
//   };

//   const handleRegister = async () => {
//     if (validateInputs()) {
//       try {
//         const body = {
//           name,
//           email,
//           mobile: mobileNumber,
//           password,
//           confirmPassword,
//           role: 'traveler', 
//         };

//         const response = await fetch('http://10.0.3.2:5000/register', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(body),
//         });

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.error || 'Registration failed. Please try again.');
//         }

//         Alert.alert('Success', data.message || 'Registration successful!');
      
//         navigation.navigate('Login'); 

//       } catch (error) {
//         Alert.alert('Registration Error', 'User already exists with this email or phone');
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Image
//           source={require('../Assets/loginPage.png')} 
//           style={styles.busImage}
//         />
//       </View>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter your name"
//         value={name}
//         onChangeText={setName}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Enter your email"
//         value={email}
//         onChangeText={setEmail}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Enter your mobile number"
//         value={mobileNumber}
//         onChangeText={setMobileNumber}
//         keyboardType="phone-pad"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Enter your password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Confirm your password"
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         secureTextEntry
//       />

//       <TouchableOpacity style={styles.button} onPress={handleRegister}>
//         <Text style={styles.buttonText}>Register</Text>
//       </TouchableOpacity>

//       <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
//         Already have an account? Login here
//       </Text>

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     marginBottom: 300,
//   },
//   header: {
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   busImage: {
//     width: 440,
//     height: 230,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: '#e74c3c',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   loginLink: {
//     marginTop: 15,
//     color: '#2980b9',
//     textAlign: 'center',
//     textDecorationLine: 'underline',
//   },
// });

// export default Register;





import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Register = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  
  // State variables for validation errors
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });

  const validateInputs = () => {
    const newErrors = {
      name: '',
      email: '',
      mobileNumber: '',
      password: '',
      confirmPassword: ''
    };

    const nameRegex = /^[A-Za-z]{3,}( [A-Za-z]{3,})?$/;
    if (!name) {
      newErrors.name = 'Name is required';
    } else if (!nameRegex.test(name)) {
      newErrors.name = 'Name must be at least 3 letters long and may contain one space';
    }

    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email must end with @gmail.com';
    }

    const mobileNumberRegex = /^\d{10}$/;
    if (!mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!mobileNumberRegex.test(mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'Password must be at least 6 characters long and include:\n- One lowercase letter\n- One uppercase letter\n- One special symbol\n- One number';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleRegister = async () => {
    if (validateInputs()) {
      try {
        const body = {
          name,
          email,
          mobile: mobileNumber,
          password,
          confirmPassword,
          role: 'traveler',
        };

        const response = await fetch('http://10.0.3.2:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed. Please try again.');
        }

        // On success
        setErrors({
          name: '',
          email: '',
          mobileNumber: '',
          password: '',
          confirmPassword: ''
        });

        navigation.navigate('Login');
      } catch (error) {
        // Handle registration error, like if the user already exists
        setErrors({
          name: '',
          email: '',
          mobileNumber: '',
          password: '',
          confirmPassword: 'User already exists with this email or phone'
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../Assets/loginPage.png')} 
          style={styles.busImage}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Enter your mobile number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />
      {errors.mobileNumber ? <Text style={styles.errorText}>{errors.mobileNumber}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Confirm your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login here
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    marginBottom: 300,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  busImage: {
    width: 440,
    height: 230,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 15,
    color: '#2980b9',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default Register;



