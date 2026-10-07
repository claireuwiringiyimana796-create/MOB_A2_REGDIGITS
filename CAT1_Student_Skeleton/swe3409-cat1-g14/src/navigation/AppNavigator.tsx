// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import MilkDeliveryScreen from '../screens/MilkDeliveryScreen';
import ChatScreen from '../screens/ChatScreen';
import AssignmentDemoScreen from '../screens/AssignmentDemoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MilkDelivery" component={MilkDeliveryScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="AssignmentDemo" component={AssignmentDemoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

