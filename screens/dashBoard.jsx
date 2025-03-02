import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionCards from "../components/transactionCards";
import TransactionTable from '../components/TransactionTable';
import React from "react";

function Dashboard() {
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
        
        {/* Transaction Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction History:</Text>
          <TransactionTable />
        </View>

        {/* Chart Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Transaction Breakdown:</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>Chart Placeholder</Text>
          </View>
        </View>

        {/* Top Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Highest Transactions:</Text>
          <TransactionList />
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
  chartPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Light gray background for chart placeholder
    borderRadius: 10,
  },
  chartText: {
    fontSize: 18,
    color: '#a04747', // Secondary color
  },
});

export default Dashboard;