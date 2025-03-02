import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const LogIn = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // Basic validation for empty fields
    if (!username || !password) {
      alert('Please fill in both fields');
      return;
    }

    navigation.replace('Main'); // Navigate to the main screen after login

    console.log('Form Submitted with Username: ', username);
    console.log('Form Submitted with Password: ', password);

    // Clear inputs after submission
    setUsername('');
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>LOG IN</Text>
            <Text style={styles.subWelcomeText}>TO YOUR ACCOUNT</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>User Name</Text>
            <TextInput
              onChangeText={setUsername}
              value={username}
              mode="outlined"
              placeholder="Enter your username"
              placeholderTextColor="#999"
              outlineColor="#6d2323"
              activeOutlineColor="#6d2323"
              style={styles.input}
              theme={{ colors: { primary: '#6d2323', background: '#fff' } }}
              left={<TextInput.Icon name="account" color="#6d2323" />}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
              mode="outlined"
              placeholder="Enter your password"
              placeholderTextColor="#999"
              outlineColor="#6d2323"
              activeOutlineColor="#6d2323"
              style={styles.input}
              theme={{ colors: { primary: '#6d2323', background: '#fff' } }}
              left={<TextInput.Icon name="lock" color="#6d2323" />}
            />
          </View>

          {/* Log In Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 42,
    color: '#6d2323',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subWelcomeText: {
    fontSize: 24,
    color: '#a04747',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#6d2323',
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6d2323',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LogIn;