import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import { DataTable } from 'react-native-paper'; // Import DataTable component from react-native-paper

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [transactionType, setTransactionType] = useState('all'); // 'all', 'sent', 'received'

  useEffect(() => {
    // Mock transactions - Replace with data from API
    const fetchedTransactions = [
      { id: 1, amount: 500, type: 'received', date: '2023-02-28' },
      { id: 2, amount: 1000, type: 'sent', date: '2023-02-28' },
      { id: 3, amount: 300, type: 'received', date: '2023-02-25' },
      { id: 4, amount: 1500, type: 'sent', date: '2023-01-15' },
    ];

    setTransactions(fetchedTransactions);
    setFilteredTransactions(fetchedTransactions);
  }, []);

  // Filter transactions when search or filters change
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
  }, [searchQuery, searchDate, transactionType]);

  // Render a transaction row
  const renderTransactionRow = ({ item }) => (
    <DataTable.Row key={item.id}>
      <DataTable.Cell>{item.date}</DataTable.Cell>
      <DataTable.Cell>{item.type === 'sent' ? 'Sent' : 'Received'}</DataTable.Cell>
      <DataTable.Cell>{item.amount} KSh</DataTable.Cell>
    </DataTable.Row>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.input}
        placeholder="Search transactions by amount..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Date Filter */}
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

      {/* Transaction Table */}
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Type</DataTable.Title>
          <DataTable.Title>Amount</DataTable.Title>
        </DataTable.Header>

        <FlatList
          data={filteredTransactions}
          renderItem={renderTransactionRow}
          keyExtractor={(item) => item.id.toString()}
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
});

export default TransactionTable;
