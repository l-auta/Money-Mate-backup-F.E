// MainPage.js
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomNav from './bottomNav';  // Import BottomNav component
import MpesaReader from '../components/MpesaReader';

function MainPage({navigation}) {
  return (
    <SafeAreaProvider>
      <BottomNav />  
      <MpesaReader />  
    </SafeAreaProvider>
  );
}

export default MainPage;
