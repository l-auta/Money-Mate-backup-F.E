import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

// SpendingInsights Component
const SpendingInsights = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transactions using session (with credentials)
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);

      try {
        // Ensure session exists or redirect to login
        const userSession = await AsyncStorage.getItem('userSession');
        if (!userSession) {
          Alert.alert('Error', 'You must be logged in to view this data.');
          navigation.replace('LogIn'); // Redirect to login page
          return;
        }

        // Fetch transactions (session handled via credentials)
        const response = await fetch('https://moneymatebackend.onrender.com/transactions', {
          method: 'GET',
          credentials: 'include', // Important: Send cookies for session
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Handle session expiry
        if (response.status === 401) {
          Alert.alert('Session Expired', 'Please log in again.');
          await AsyncStorage.removeItem('userSession'); // Clear expired session
          navigation.replace('LogIn');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        setTransactions(data); // Store transactions
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigation]);

  // Categorize transactions by type and calculate total spending
  const categorizeTransactions = useMemo(() => {
    const categories = {};
    let totalSpent = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'sent') {
        totalSpent += transaction.amount;
        const category = transaction.category || 'Other';
        categories[category] = (categories[category] || 0) + transaction.amount;
      }
    });

    return { categories, totalSpent };
  }, [transactions]);

  // Generate spending insights
  useEffect(() => {
    const { categories, totalSpent } = categorizeTransactions;
    if (transactions.length === 0) return;

    const insightsList = [];

    // Detect High-Spending Categories (>30% of total)
    Object.entries(categories).forEach(([category, amount]) => {
      if (amount > totalSpent * 0.3) {
        insightsList.push(`You spent ${((amount / totalSpent) * 100).toFixed(1)}% on ${category}. Consider reducing this.`);
      }
    });

    // Monthly Spending Trend (Compare current month vs last month)
    const currentMonth = moment().format('YYYY-MM');
    const lastMonth = moment().subtract(1, 'month').format('YYYY-MM');

    const monthlySpend = (month) =>
      transactions
        .filter((t) => t.type === 'sent' && moment(t.date).format('YYYY-MM') === month)
        .reduce((acc, t) => acc + t.amount, 0);

    const currentMonthSpend = monthlySpend(currentMonth);
    const lastMonthSpend = monthlySpend(lastMonth);

    if (lastMonthSpend > 0) {
      const difference = ((currentMonthSpend - lastMonthSpend) / lastMonthSpend) * 100;
      insightsList.push(
        difference > 0
          ? `Your spending increased by ${difference.toFixed(1)}% this month.`
          : `You saved ${Math.abs(difference.toFixed(1))}% compared to last month.`
      );
    }

    // Suggest Savings if Spending > 5000
    if (totalSpent > 5000) {
      insightsList.push(`Consider saving 10% of your expenses (~Ksh ${Math.round(totalSpent * 0.1)}) for future use.`);
    }

    setInsights(insightsList);
  }, [categorizeTransactions]);

  // Render Component
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6d2323" />
        <Text>Loading insights...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Spending Insights</Text>
      {insights.length === 0 ? (
        <Text style={styles.noInsights}>No insights available.</Text>
      ) : (
        insights.map((insight, index) => (
          <Text key={index} style={styles.insight}>
            • {insight}
          </Text>
        ))
      )}
    </View>
  );
};

// Component Styles
const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6d2323',
  },
  insight: {
    fontSize: 16,
    marginBottom: 8,
    color: '#4a4a4a',
  },
  noInsights: {
    fontSize: 16,
    color: '#888',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

export default SpendingInsights;
