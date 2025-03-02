import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper'; // Using react-native-paper Card component

const TransactionList = () => {
  const [dayTransactions, setDayTransactions] = useState([]);
  const [monthTransactions, setMonthTransactions] = useState([]);
  const [yearTransactions, setYearTransactions] = useState([]);

  // Simulated data for demonstration
  useEffect(() => {
    // Simulate fetching data for day, month, and year
    setTimeout(() => {
      setDayTransactions([{ amount: 1500 }, { amount: 2000 }, { amount: 1000 }]);
      setMonthTransactions([{ amount: 5000 }, { amount: 7000 }, { amount: 3000 }]);
      setYearTransactions([{ amount: 15000 }, { amount: 20000 }, { amount: 10000 }]);
    }, 1000); // Simulate a 1-second delay
  }, []);

  // Get highest transaction for each category (Day, Month, Year)
  const getHighestTransaction = (transactions) => {
    if (!transactions || transactions.length === 0) return null;
    return transactions.reduce((max, transaction) => {
      return transaction.amount > max.amount ? transaction : max;
    });
  };

  const dayHighest = getHighestTransaction(dayTransactions);
  const monthHighest = getHighestTransaction(monthTransactions);
  const yearHighest = getHighestTransaction(yearTransactions);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.header}>Highest Transactions Summary</Text>

        <View style={styles.transactionSection}>
          <Text style={styles.sectionHeader}>Today</Text>
          {dayHighest ? (
            <Text style={styles.transactionText}>Amount: {dayHighest.amount} Shillings</Text>
          ) : (
            <Text style={styles.noTransactionText}>No transactions for today</Text>
          )}
        </View>

        <View style={styles.transactionSection}>
          <Text style={styles.sectionHeader}>This Month</Text>
          {monthHighest ? (
            <Text style={styles.transactionText}>Amount: {monthHighest.amount} Shillings</Text>
          ) : (
            <Text style={styles.noTransactionText}>No transactions this month</Text>
          )}
        </View>

        <View style={styles.transactionSection}>
          <Text style={styles.sectionHeader}>This Year</Text>
          {yearHighest ? (
            <Text style={styles.transactionText}>Amount: {yearHighest.amount} Shillings</Text>
          ) : (
            <Text style={styles.noTransactionText}>No transactions this year</Text>
          )}
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Light background for contrast
  },
  card: {
    padding: 20,
    elevation: 3,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6d2323', // Use the provided color for the header
    textAlign: 'center', // Center-align the header
  },
  transactionSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9', // Light background for each section
    borderRadius: 8,
    borderLeftWidth: 4, // Add a colored border to the left
    borderLeftColor: '#6d2323', // Use the provided color for the border
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Darker color for section headers
  },
  transactionText: {
    fontSize: 14,
    color: '#555', // Slightly lighter color for transaction text
  },
  noTransactionText: {
    fontSize: 14,
    color: '#999', // Lighter color for "no transactions" text
    fontStyle: 'italic', // Italicize for emphasis
  },
});

export default TransactionList;