import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import TransactionTable from "../components/TransactionTable"; 
import MoneyChart from "../components/MoneyChart"; 

function Transactions({ transactions }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.welcome}>Your Transactions</Text>

                <View style={styles.section}>
                    <TransactionTable />
                </View>

                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Transaction Breakdown</Text>
                    <MoneyChart transactions={transactions} />
                </View> */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f8f0e5",
    },
    container: {
        padding: 20,
    },
    welcome: {
        fontSize: 32,
        marginBottom: 30,
        fontWeight: "bold",
        textAlign: "center",
        color: "#6d2323",
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#6d2323",
        marginBottom: 15,
    },
});

export default Transactions;