import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import Dashboard from './dashBoard'; 
import Transactions from './transaction'; 

function BottomNav() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'dashboard', title: 'Dashboard' }, 
    { key: 'transactions', title: 'Transactions' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    dashboard: () => <Dashboard />, // Render Dashboard when the first tab is selected
    transactions: () => <Transactions />, // Render Transactions when the second tab is selected
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene} 
      activeColor="#6d2323" // Active tab color
      inactiveColor="#a04747" // Inactive tab color
      barStyle={{
        backgroundColor: '#fffefb', 
        height: 70, 
        paddingBottom: 10, 
        borderTopWidth: 1, 
        borderTopColor: '#e0e0e0', 
      }}
      labeled={true} 
    />
  );
}

export default BottomNav;