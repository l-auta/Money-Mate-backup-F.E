import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';

// Helper function to get the highest transaction
const getHighestTransaction = (transactions) => {
  if (!transactions || transactions.length === 0) return null;

  const validTransactions = transactions.filter(
    (transaction) => typeof transaction.amount === 'number' && transaction.amount > 0
  );

  if (validTransactions.length === 0) return null;

  return validTransactions.reduce((max, transaction) =>
    transaction.amount > max.amount ? transaction : max
  );
};

// Helper function to categorize transactions (day, month, year)
const categorizeTransactions = (transactions) => {
  const today = new Date();
  const isSameDay = (date) => new Date(date).toDateString() === today.toDateString();
  const isSameMonth = (date) =>
    new Date(date).getMonth() === today.getMonth() &&
    new Date(date).getFullYear() === today.getFullYear();
  const isSameYear = (date) => new Date(date).getFullYear() === today.getFullYear();

  return {
    dayTransactions: transactions.filter((t) => isSameDay(t.date)),
    monthTransactions: transactions.filter((t) => isSameMonth(t.date)),
    yearTransactions: transactions.filter((t) => isSameYear(t.date)),
  };
};

const TransactionList = () => {
  const [dayTransactions, setDayTransactions] = useState([]);
  const [monthTransactions, setMonthTransactions] = useState([]);
  const [yearTransactions, setYearTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transaction data from backend with a 30-second delay
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://money-mate-backend-1-bs54.onrender.com/transactions');
        if (!response.ok) throw new Error('Failed to fetch transactions');

        const data = await response.json();

        // Categorize transactions into day, month, year
        const { dayTransactions, monthTransactions, yearTransactions } = categorizeTransactions(data);

        setDayTransactions(dayTransactions);
        setMonthTransactions(monthTransactions);
        setYearTransactions(yearTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDelay = 10000; // 10 seconds in milliseconds
    const timer = setTimeout(() => {
      fetchData();
    }, fetchDelay);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const dayHighest = useMemo(() => getHighestTransaction(dayTransactions), [dayTransactions]);
  const monthHighest = useMemo(() => getHighestTransaction(monthTransactions), [monthTransactions]);
  const yearHighest = useMemo(() => getHighestTransaction(yearTransactions), [yearTransactions]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6d2323" />
        <Text>Loading transactions</Text>
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.header}>Highest Transactions Summary</Text>

        {[
          { label: "Today", data: dayHighest },
          { label: "This Month", data: monthHighest },
          { label: "This Year", data: yearHighest },
        ].map((item, index) => (
          <View key={index} style={styles.transactionSection}>
            <Text style={styles.sectionHeader}>{item.label}</Text>
            {item.data ? (
              <Text style={styles.transactionText}>Amount: {item.data.amount} KSh</Text>
            ) : (
              <Text style={styles.noTransactionText}>
                No transactions for {item.label.toLowerCase()}
              </Text>
            )}
          </View>
        ))}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { padding: 20, elevation: 3 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  transactionSection: { marginBottom: 20 },
  sectionHeader: { fontSize: 18, fontWeight: '600' },
  transactionText: { fontSize: 16, color: '#333' },
  noTransactionText: { fontSize: 16, color: '#aaa' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TransactionList;