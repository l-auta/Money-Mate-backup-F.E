import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

const MoneyChart = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transactions from backend with session
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);

      try {
        // Fetch transactions - including credentials (cookies)
        const response = await fetch('https://moneymatebackend.onrender.com/transactions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Ensures cookies are sent with the request
        });

        if (!response.ok) {
          if (response.status === 401) {
            Alert.alert('Session Expired', 'Please log in again.');
            navigation.navigate('Login'); // Redirect to login if session expired
          }
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setTransactions(data); // Set transactions from backend
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigation]);

  // Helper function to categorize transactions
  const categorizeTransactions = (transactions) => {
    const monthlyData = {};

    transactions.forEach((transaction) => {
      const month = moment(transaction.date).format('YYYY-MM');
      if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };

      if (transaction.type === 'received') {
        monthlyData[month].income += transaction.amount;
      } else if (transaction.type === 'sent') {
        monthlyData[month].expense += transaction.amount;
      }
    });

    return monthlyData;
  };

  // Process and set chart data
  useEffect(() => {
    if (transactions.length === 0) return;

    const monthlyData = categorizeTransactions(transactions);
    const labels = Object.keys(monthlyData).sort();
    const incomeData = labels.map((month) => monthlyData[month].income);
    const expenseData = labels.map((month) => monthlyData[month].expense);

    setChartData({
      labels,
      datasets: [
        {
          data: incomeData,
          color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`, // Green for income
          label: 'Income',
        },
        {
          data: expenseData,
          color: (opacity = 1) => `rgba(255, 69, 58, ${opacity})`, // Red for expenses
          label: 'Expenses',
        },
      ],
    });
  }, [transactions]);

  // Display loading indicator
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6d2323" />
        <Text>Loading transactions...</Text>
      </View>
    );
  }

  // Display error message if fetch fails
  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Money In/Out Breakdown</Text>

      {chartData.labels.length > 0 ? (
        <LineChart
          data={chartData}
          width={screenWidth - 40} // Responsive width
          height={300}
          yAxisLabel="KSh "
          chartConfig={{
            backgroundColor: '#f5f5f5',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier // Smooth curves
        />
      ) : (
        <Text>No transaction data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default MoneyChart;
