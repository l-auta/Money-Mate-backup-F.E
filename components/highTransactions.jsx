import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

const TransactionList = () => {
  const [dayTransactions, setDayTransactions] = useState([]);
  const [monthTransactions, setMonthTransactions] = useState([]);
  const [yearTransactions, setYearTransactions] = useState([]);

  // Simulating fetching data
  useEffect(() => {
    const fetchData = async () => {
      const simulatedData = [
        { amount: 1500, date: '2024-02-10' },
        { amount: 5000, date: '2024-02-05' },
        { amount: 30000, date: '2024-01-15' },
      ];
      setDayTransactions(simulatedData);
      setMonthTransactions(simulatedData);
      setYearTransactions(simulatedData);
    };
    fetchData();
  }, []);

  // Optimize with useMemo
  const dayHighest = useMemo(() => getHighestTransaction(dayTransactions), [dayTransactions]);
  const monthHighest = useMemo(() => getHighestTransaction(monthTransactions), [monthTransactions]);
  const yearHighest = useMemo(() => getHighestTransaction(yearTransactions), [yearTransactions]);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.header}>Highest Transactions Summary</Text>

        {[{ label: "Today", data: dayHighest },
          { label: "This Month", data: monthHighest },
          { label: "This Year", data: yearHighest }].map((item, index) => (
          <View key={index} style={styles.transactionSection}>
            <Text style={styles.sectionHeader}>{item.label}</Text>
            {item.data ? (
              <Text style={styles.transactionText}>Amount: {item.data.amount} Shillings</Text>
            ) : (
              <Text style={styles.noTransactionText}>No transactions for {item.label.toLowerCase()}</Text>
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
});

export default TransactionList;
