import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

// Helper function to categorize M-Pesa transactions
const categorizeTransactions = (transactions) => {
  const monthlyData = {};

  transactions.forEach((transaction) => {
    const month = moment(transaction.date).format('YYYY-MM'); // e.g., "2023-09"
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }

    if (transaction.type === 'received') {
      monthlyData[month].income += transaction.amount;
    } else if (transaction.type === 'sent') {
      monthlyData[month].expense += transaction.amount;
    }
  });

  return monthlyData;
};

const MoneyChart = ({ transactions }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const monthlyData = categorizeTransactions(transactions);

    // Prepare labels and datasets for the chart
    const labels = Object.keys(monthlyData).sort(); // Months in ascending order
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
        <Text>No data available</Text>
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
});

export default MoneyChart;
