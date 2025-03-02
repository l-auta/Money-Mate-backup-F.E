import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './screens/welcomePage';
import SignUp from './screens/signUp';
import LogIn from './screens/logIn';

// Create a stack navigator
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {/* Welcome Screen */}
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }} // Hide the header for the Welcome screen
        />
        {/* SignUp Screen */}
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: 'Sign Up' }} // Customize the header title
        />
        <Stack.Screen
         name="LogIn"
          component={LogIn}
          options={{ title: 'Log In' }} // Customize the header title
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;