import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import Dashboard from './dashBoard'; // Import Dashboard
import Transactions from './transaction'; // Import Transactions

function BottomNav() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'dashboard', title: 'Dashboard' }, // No icon property
    { key: 'transactions', title: 'Transactions' }, // No icon property
  ]);

  const renderScene = BottomNavigation.SceneMap({
    dashboard: () => <Dashboard />, // Render Dashboard when the first tab is selected
    transactions: () => <Transactions />, // Render Transactions when the second tab is selected
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene} // Use the renderScene map for dynamic tab content
      activeColor="#6d2323" // Active tab color
      inactiveColor="#a04747" // Inactive tab color
      barStyle={{
        backgroundColor: '#fffefb', // Background color of the navigation bar
        height: 70, // Height of the navigation bar
        paddingBottom: 10, // Padding at the bottom
        borderTopWidth: 1, // Add a border at the top
        borderTopColor: '#e0e0e0', // Light gray border color
      }}
      labeled={true} // Show labels for the tabs
    />
  );
}

export default BottomNav;