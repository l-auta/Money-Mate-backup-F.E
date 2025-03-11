import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';

// TransactionCards Component
const TransactionCards = () => {
  const [depositTotal, setDepositTotal] = useState(0);
  const [transferTotal, setTransferTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transactions from the backend
  const fetchTransactions = async () => {
    try {
      const response = await fetch('https://money-mate-backend-1-bs54.onrender.com/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();

      // Process and update totals
      calculateTotals(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate deposit and transfer totals from transactions
  const calculateTotals = (transactions) => {
    let depositSum = 0;
    let transferSum = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'received') {
        depositSum += transaction.amount;
      } else if (transaction.type === 'sent') {
        transferSum += transaction.amount;
      }
    });

    setDepositTotal(depositSum);
    setTransferTotal(transferSum);
  };

  // Fetch data on component mount with a 30-second delay
  useEffect(() => {
    const fetchDelay = 20000; // 30 seconds in milliseconds
    const timer = setTimeout(() => {
      fetchTransactions();
    }, fetchDelay);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);


  // If still loading, show a spinner
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6d2323" />
        <Text>Loading transactions...</Text>
      </View>
    );
  }

  // If there's an error, display it
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Transaction Summary Cards */}
      <View style={styles.cardsContainer}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Deposits</Text>
          <Text style={styles.cardAmount}>{depositTotal} Sh</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Transfers</Text>
          <Text style={styles.cardAmount}>{transferTotal} Sh</Text>
        </Card>
      </View>  
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // Light background for contrast
  },
  cardsContainer: {
    flexDirection: 'row', // Align cards side by side
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    marginRight: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  cardTitle: {
    fontSize: 18,
    color: '#6d2323',
    fontWeight: '600',
    marginBottom: 10,
  },
  cardAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default TransactionCards;