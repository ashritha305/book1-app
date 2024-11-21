import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import Icon from 'react-native-vector-icons/MaterialIcons';
 import Toast from 'react-native-toast-message';

import Login from './Screens/LoginScreen';
import Register from './Screens/Registration';
import AdminDashboard from './Screens/AdminDashboard';
import UserManagement from './Screens/UserManagement';
import BookingManagement from './Screens/BookingManagement';
import BusManagement from './Screens/BusManagement';
import RouteManagement from './Screens/RouteManagement';
import StopManagement from './Screens/StopManagement';
import DriverManagement from './Screens/DriverManagement';
import Home from './Screens/Home';
import Bookings from './Screens/Bookings';
import Help from './Screens/Help';
import Profile from './Screens/MyAccount';
import PastBookings from './Screens/PastBookings';
import UpcomingBookings from './Screens/UpcomingBookings';
import BusTypeManagement from './Screens/BusTypeManagement';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TravelerTabs = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Bookings') {
            iconName = 'event';
          } else if (route.name === 'Help') {
            iconName = 'help-outline';
          } else if (route.name === 'Profile') {
            iconName = 'account-circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff5733',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Bookings" component={Bookings} />
      <Tab.Screen name="Help" component={Help}  />
      <Tab.Screen name="Profile" component={Profile}  />
    </Tab.Navigator>
  );
};

const AdminStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{headerShown:false}} />
      <Stack.Screen name="UserManagement" component={UserManagement} options={{ title: 'User Management' }}  />
      <Stack.Screen name="StopManagement" component={StopManagement}  options={{ title: 'Stop Management' }}  />
      <Stack.Screen name="BookingManagement" component={BookingManagement}  options={{ title: 'Booking Management' }}  />
      <Stack.Screen name="BusManagement" component={BusManagement}  options={{ title: 'Bus Management' }}  />
      <Stack.Screen name="RouteManagement" component={RouteManagement}  options={{ title: 'Route Management' }}  />
      <Stack.Screen name="DriverManagement" component={DriverManagement}  options={{ title: 'Driver Management' }}  />
      <Stack.Screen name="BusTypeManagement" component={BusTypeManagement}  options={{ title: 'Bus Type Management' }}  />
    </Stack.Navigator>
  );
};

export const Navigation1 = () => {
 

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" >
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="Register" component={Register} options={{headerShown:false}}/>
        <Stack.Screen name="TravelerHome" component={TravelerTabs} options={{headerBackVisible:false,headerShown:false}} />
        <Stack.Screen name="Admin" component={AdminStack} options={{headerBackVisible:false,headerShown:false}}/>
        <Stack.Screen name="PastBookings" component={PastBookings}/>
        <Stack.Screen name="UpcomingBookings" component={UpcomingBookings}/>
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
};





