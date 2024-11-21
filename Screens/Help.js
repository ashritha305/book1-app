import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Help = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const predefinedAnswers = {
    // Account & Login
    'hi':'hello how can I help you',
    'hello':'hello how can I help you',
    'how to create an account?': 'To create an account, click on the "Sign Up" button on the home screen and fill in your details.',
    'how do I sign up?': 'To create an account, click on the "Sign Up" button on the home screen and fill in your details.',
    'what is the sign up process?': 'To create an account, click on the "Sign Up" button on the home screen and fill in your details.',
    
    'how to log in?': 'Click on the "Login" button and enter your credentials. If you have forgotten your password, click on the "Forgot Password" link to reset it.',
    'how do I log into my account?': 'Click on the "Login" button and enter your credentials. If you have forgotten your password, click on the "Forgot Password" link to reset it.',
    
    // Booking Related
    'how do I book a ticket?': 'To book a ticket, search for your route, select the desired bus, and proceed to enter your passenger details and payment information.',
    'how to book a ticket?': 'To book a ticket, search for your route, select the desired bus, and proceed to enter your passenger details and payment information.',
    'how can I make a booking?': 'To book a ticket, search for your route, select the desired bus, and proceed to enter your passenger details and payment information.',
    
    // Payment and Refunds
    'how can I pay for my booking?': 'You can pay using debit/credit cards, net banking, UPI, or wallet options available during the checkout process.',
    'what are the payment methods available?': 'We accept payments via debit/credit cards, Paytm, Google Pay, PhonePe, and other popular payment methods.',
    'can I pay using UPI?': 'You can pay using UPI or other payment methods available during checkout.',
    
    // Cancellation & Modification
    'how do I cancel my ticket?': 'To cancel your ticket, go to "My Bookings", select the booking you want to cancel, and click on the "Cancel" button.',
    'how can I cancel my ticket?': 'To cancel your ticket, go to "My Bookings", select the booking you want to cancel, and click on the "Cancel" button.',
    'can I change or cancel my booking?': 'To cancel your ticket, go to "My Bookings", select the booking you want to cancel, and click on the "Cancel" button.',
    
    // Miscellaneous
    'how do I contact customer support?': 'You can contact our support team by calling our helpline number or sending an email to support@redbus.com. Alternatively, you can use the "Contact Us" feature in the app.',
    'what is the helpline number?': 'Yes, our helpline number is +91-XXXXXXXXXX. You can call us for any booking or service-related inquiries.',
  };

 
  const getAnswer = (input) => {
    const normalizedInput = input.trim().toLowerCase();

    for (let question in predefinedAnswers) {
      const synonyms = question.toLowerCase();
      
     
      if (normalizedInput.includes(synonyms)) {
        return predefinedAnswers[question];
      }
    }
    return null; 
  };


  const sendMessage = async () => {
    if (message.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: message, isUser: true }
      ]);
      
     
      setMessage('');
  
   
      const response = getAnswer(message);
  
      if (response) {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: response, isUser: false }
        ]);
      } else {
       
        setLoading(true);
        setTimeout(() => {
          setMessages(prevMessages => [
            ...prevMessages,
            {
              text: "Sorry, I couldn’t understand your question. Here is some basic information about the app:\n\n" +
                    "1. You can create an account by clicking on the 'Sign Up' button.\n" +
                    "2. To book tickets, search for a route and select your preferred bus.\n" +
                    "3. We accept payments via credit/debit cards, UPI, and other popular methods.\n" +
                    "4. You can track your bus live in the 'Track Your Bus' section.\n" +
                    "5. If you have any questions, feel free to contact our customer support.\n\n" +
                    "For more help, please reach out to us through the 'Contact Us' section.",
              isUser: false
            }
          ]);
          setLoading(false);
        }, 1500); 
      }
    }
  };

 
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setMessages([]); 
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.isUser ? styles.userMessageContainer : styles.botMessageContainer
            ]}
          >
            <Text
              style={[
                styles.message,
                item.isUser ? styles.userMessage : styles.botMessage
              ]}
            >
              {item.text}
            </Text>
          </View>
        )}
      />
      
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
   
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  message: {
    maxWidth: '80%',
    padding: 10,
    backgroundColor: '#e1ffc7', 
    borderRadius: 15,
    fontSize: 16,
    lineHeight: 22,
  },
  userMessage: {
    backgroundColor: '#34b7f1', 
    color: 'white',
  },
  botMessage: {
    backgroundColor: '#e1ffc7', 
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 25,
    marginBottom: 10,
  },
});

export default Help;
