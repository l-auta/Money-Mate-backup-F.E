import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

// Simulate receiving new transactions
const TransactionCards = () => {
  // State to track the total amounts for deposits and transfers
  const [depositTotal, setDepositTotal] = useState(0);
  const [transferTotal, setTransferTotal] = useState(0);

  // Simulate receiving a new transaction
  const receiveTransaction = (transaction) => {
    if (transaction.type === 'deposit') {
      setDepositTotal((prevAmount) => prevAmount + transaction.amount);
    } else if (transaction.type === 'transfer') {
      setTransferTotal((prevAmount) => prevAmount + transaction.amount);
    }
  };

  // Example to simulate receiving new deposits and transfers
  useEffect(() => {
    // Simulate receiving a deposit after 3 seconds
    setTimeout(() => {
      const newTransaction = { type: 'deposit', amount: 10 }; // Simulated deposit
      receiveTransaction(newTransaction);
    }, 3000); // 3 seconds delay for deposit

    // Simulate receiving a transfer after 6 seconds
    setTimeout(() => {
      const newTransaction = { type: 'transfer', amount: 5 }; // Simulated transfer
      receiveTransaction(newTransaction);
    }, 6000); // 6 seconds delay for transfer
  }, []);

  return (
    <View style={styles.container}>
      {/* Container with flexDirection: 'row' to align cards side by side */}
      <View style={styles.cardsContainer}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Deposits Today</Text>
          <Text style={styles.cardAmount}>{depositTotal} Sh</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Transfers Today</Text>
          <Text style={styles.cardAmount}>{transferTotal} Sh</Text>
        </Card>
      </View>

      {/* Buttons to manually simulate transactions */}
      <View style={styles.buttonContainer}>
        <Button
          title="Simulate Deposit"
          onPress={() => receiveTransaction({ type: 'deposit', amount: 10 })}
          color="#6d2323"
        />
        <Button
          title="Simulate Transfer"
          onPress={() => receiveTransaction({ type: 'transfer', amount: 5 })}
          color="#6d2323"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // Light background for contrast
  },
  cardsContainer: {
    flexDirection: 'row', // Align cards side by side
    justifyContent: 'space-between', // Add space between the cards
    marginBottom: 20,
  },
  card: {
    flex: 1, // Makes each card take up equal width
    marginRight: 10, // Space between the two cards
    padding: 20,
    borderRadius: 10, // Rounded corners
    backgroundColor: '#fff', // White background for cards
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Elevation for Android
  },
  cardTitle: {
    fontSize: 18,
    color: '#6d2323', // Use the provided color for titles
    fontWeight: '600', // Semi-bold for titles
    marginBottom: 10, // Space between title and amount
  },
  cardAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333', // Darker color for amounts
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10, // Space between buttons
  },
});

export default TransactionCards;