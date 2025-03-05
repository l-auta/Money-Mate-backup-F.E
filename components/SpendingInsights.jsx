import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import moment from 'moment';

// SpendingInsights Component
const SpendingInsights = () => {
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transactions from the backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('https://moneymatebackend.onrender.com/transactions');
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

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

  // Generate spending insights based on the categorized data
  useEffect(() => {
    const { categories, totalSpent } = categorizeTransactions;
    if (transactions.length === 0) return;

    const insightsList = [];

    // Detect High-Spending Categories (>30%)
    Object.entries(categories).forEach(([category, amount]) => {
      if (amount > totalSpent * 0.3) {
        insightsList.push(`You spent ${((amount / totalSpent) * 100).toFixed(1)}% on ${category}. Consider reducing this.`);
      }
    });

    // Monthly Spending Trend (Current vs. Last Month)
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
