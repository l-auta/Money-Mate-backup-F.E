// MainPage.js
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomNav from './bottomNav';  // Import BottomNav component

function MainPage({navigation}) {
  return (
    <SafeAreaProvider>
      <BottomNav />  
    </SafeAreaProvider>
  );
}

export default MainPage;
