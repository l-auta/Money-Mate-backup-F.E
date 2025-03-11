import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]); 
  const [filteredTransactions, setFilteredTransactions] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [searchDate, setSearchDate] = useState(''); 
  const [transactionType, setTransactionType] = useState('all'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  // Fetch Transactions from Backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('https://money-mate-backend-lisa.onrender.com/transactions'); 
        if (!response.ok) throw new Error('Failed to fetch transactions');

        const data = await response.json();
        console.log('Fetched transactions:', data); 

        // Generate unique keys for transactions without an id
        const transactionsWithKeys = data.map((transaction, index) => ({
          ...transaction,
          key: transaction.id ? transaction.id.toString() : `temp-${index}`, 
        }));

        setTransactions(transactionsWithKeys);
        setFilteredTransactions(transactionsWithKeys);
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

    // Filter by amount
    if (searchQuery) {
      filtered = filtered.filter((transaction) =>
        transaction.amount.toString().includes(searchQuery)
      );
    }

    // Filter by date (YYYY-MM-DD)
    if (searchDate) {
      filtered = filtered.filter((transaction) => transaction.date === searchDate);
    }

    // Filter by transaction type ('sent', 'received')
    if (transactionType !== 'all') {
      filtered = filtered.filter((transaction) => transaction.type === transactionType);
    }

    setFilteredTransactions(filtered);
  }, [searchQuery, searchDate, transactionType, transactions]);

  // Render a transaction row
  const renderTransactionRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.type === 'sent' ? 'Sent' : 'Received'}</Text>
      <Text style={styles.cell}>{item.amount} KSh</Text>
    </View>
  );

  // Show loading spinner while fetching
  if (loading) return <ActivityIndicator size="large" color="#6d2323" />;

  // Show error message if fetch fails
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
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell}>Type</Text>
          <Text style={styles.headerCell}>Amount (KSh)</Text>
        </View>

        <FlatList
          data={filteredTransactions}
          renderItem={renderTransactionRow}
          keyExtractor={(item) => item.key} 
          ListEmptyComponent={<Text>No transactions found.</Text>}
        />
      </View>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    marginBottom: 800,
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
    color: 'black',
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
    marginTop: 10,
    marginBottom: 30,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  headerCell: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default TransactionTable;