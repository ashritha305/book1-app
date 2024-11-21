// // AdminChat.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
// import io from 'socket.io-client';

// const AdminChat = () => {
//   const [adminMessage, setAdminMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const socket = io('http://10.0.2.2:5001'); // Use your server's IP address

//   useEffect(() => {
//     socket.on('receiveMessage', (msg) => {
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const sendAdminMessage = () => {
//     if (adminMessage.trim()) {
//       socket.emit('sendMessage', adminMessage);
//       setAdminMessage('');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Admin Chat</Text>
//       <FlatList
//         data={messages}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <Text style={styles.message}>{item}</Text>
//         )}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Type an admin message"
//         value={adminMessage}
//         onChangeText={setAdminMessage}
//       />
//       <Button title="Send" onPress={sendAdminMessage} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   message: {
//     padding: 10,
//     backgroundColor: '#e1f5fe',
//     borderRadius: 5,
//     marginVertical: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
// });

// export default AdminChat; // Ensure this line is present
