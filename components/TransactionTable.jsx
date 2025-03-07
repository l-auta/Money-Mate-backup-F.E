import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';

// TransactionTable Component
const TransactionTable = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Transactions from Backend (With Session Cookies)
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('https://moneymatebackend.onrender.com/transactions', {
          method: 'GET',
          credentials: 'include', // Automatically sends cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          Alert.alert('Session Expired', 'Please log in again.');
          navigation.navigate('LogIn'); // Redirect to login on 401
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to load transactions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter Transactions when search or filters change
  useEffect(() => {
    let filtered = [...transactions];

    if (searchQuery) {
      filtered = filtered.filter((transaction) =>
        transaction.amount.toString().includes(searchQuery)
      );
    }

    if (searchDate) {
      filtered = filtered.filter((transaction) => transaction.date === searchDate);
    }

    if (transactionType !== 'all') {
      filtered = filtered.filter((transaction) => transaction.type === transactionType);
    }

    setFilteredTransactions(filtered);
  }, [searchQuery, searchDate, transactionType, transactions]);

  // Render a transaction row
  const renderTransactionRow = ({ item }) => (
    <DataTable.Row key={item.id}>
      <DataTable.Cell>{item.date}</DataTable.Cell>
      <DataTable.Cell>{item.type === 'sent' ? 'Sent' : 'Received'}</DataTable.Cell>
      <DataTable.Cell>{item.amount} KSh</DataTable.Cell>
    </DataTable.Row>
  );

  if (loading) return <ActivityIndicator size="large" color="#6d2323" />;

  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>

      {/* Search by Amount */}
      <TextInput
        style={styles.input}
        placeholder="Search by amount..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        keyboardType="numeric"
      />

      {/* Filter by Date */}
      <TextInput
        style={styles.input}
        placeholder="Filter by date (YYYY-MM-DD)"
        value={searchDate}
        onChangeText={setSearchDate}
      />

      {/* Filter by Transaction Type */}
      <View style={styles.filterContainer}>
        <Button title="All" onPress={() => setTransactionType('all')} />
        <Button title="Sent" onPress={() => setTransactionType('sent')} />
        <Button title="Received" onPress={() => setTransactionType('received')} />
      </View>

      {/* Display Transaction Table */}
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Type</DataTable.Title>
          <DataTable.Title>Amount (KSh)</DataTable.Title>
        </DataTable.Header>

        <FlatList
          data={filteredTransactions}
          renderItem={renderTransactionRow}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text>No transactions found.</Text>}
        />
      </DataTable>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#6d2323',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  table: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default TransactionTable;
