import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import React from "react";

function SignUp({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.header}>Create Account</Text>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
        />

        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')} // Replace 'Home' with your main screen
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5', // Light background
  },
  content: {
    paddingHorizontal: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6d2323', // Primary color
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff', // White background for inputs
  },
  button: {
    backgroundColor: '#6d2323', // Primary color
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
  loginLink: {
    color: '#6d2323', // Primary color
    fontWeight: 'bold',
  },
});

export default SignUp;