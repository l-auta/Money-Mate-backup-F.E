import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

function Transactions() {
    return (
        <SafeAreaView>
        <View style={styles.container}>
            <Text style={styles.welcome}>Transaction Screen</Text>
        </View>
        </SafeAreaView>
    );
}

const styles =  StyleSheet.create({
    container: {
        padding: 30,
        paddingBottom : 10,
        paddingTop : 70,
    },
    welcome: {
        fontSize: 35,
        marginBottom: 50,
        fontWeight: 'bold',
        textAlign: 'center',
        // paddingLeft: 30,
    },
})

export default Transactions;