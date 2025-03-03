import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionCards from "../components/transactionCards";
import MoneyChart from "../components/MoneyChart";
import HighTransaction from "../components/highTransactions"
import React, { useState, useEffect } from "react";

function Dashboard() {
  // State to store parsed transactions
  const [transactions, setTransactions] = useState([]);

  // Simulate fetching M-Pesa messages (replace with actual parsed data)
  useEffect(() => {
    const sampleTransactions = [
      { id: 1, amount: 1000, type: 'received', date: '2023-01-10' },
      { id: 2, amount: 500, type: 'sent', date: '2023-02-15' },
      { id: 3, amount: 2000, type: 'received', date: '2023-02-20' },
      { id: 4, amount: 1500, type: 'sent', date: '2023-03-25' },
      { id: 5, amount: 300, type: 'received', date: '2023-04-05' },
    ];
    setTransactions(sampleTransactions);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome to your Dashboard</Text>
        </View>

        {/* Transaction Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Transactions:</Text>
          <TransactionCards />
        </View>


        {/* Money In/Out Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Transaction Breakdown:</Text>
          <MoneyChart transactions={transactions} />
        </View>

        {/* Top Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Highest Transactions:</Text>
          <HighTransaction transactions={transactions} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f0e5', // Light background color
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  welcome: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6d2323', // Primary color
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#fff', // White background for sections
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6d2323', // Primary color
    marginBottom: 15,
  },
});

export default Dashboard;
