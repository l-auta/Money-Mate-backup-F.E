import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

const SpendingInsights = ({ transactions }) => {
  const [insights, setInsights] = useState([]);

  // Helper function to categorize transactions by type
  const categorizeTransactions = () => {
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
  };

  // Generate spending insights based on transaction analysis
  const generateInsights = () => {
    const { categories, totalSpent } = categorizeTransactions();
    const insightsList = [];

    // High-spending category detection
    Object.entries(categories).forEach(([category, amount]) => {
      if (amount > totalSpent * 0.3) {
        insightsList.push(`You spent ${((amount / totalSpent) * 100).toFixed(1)}% on ${category}. Consider reducing this.`);
      }
    });

    // Monthly spending trend analysis
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

    // Savings suggestion
    if (totalSpent > 5000) {
      insightsList.push(`Consider saving 10% of your expenses (~Ksh ${Math.round(totalSpent * 0.1)}) for future use.`);
    }

    setInsights(insightsList);
  };

  useEffect(() => {
    if (transactions.length > 0) generateInsights();
  }, [transactions]);

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
    elevation: 3, // Android shadow
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
});

export default SpendingInsights;
