import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// SignUp Component
function SignUp({ navigation }) {
  // State for input fields
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for error messages
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", email: "", password: "" };

    // Validate Full Name
    if (!username.trim()) {
      newErrors.username = "Full Name is required";
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Validate Password
    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSignUp = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fix the errors in the form.");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the data to send to the backend
      const userData = {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      };

      // Validate the JSON format
      const requestBody = JSON.stringify(userData);
      try {
        JSON.parse(requestBody); // Ensure the JSON is valid
      } catch (error) {
        console.error("Invalid JSON format:", error);
        Alert.alert("Error", "Invalid data format. Please try again.");
        return;
      }

      console.log("Data being sent to backend:", userData);

      // Send a POST request to the backend
      const response = await fetch("https://moneymatebackend.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
        credentials: "include", // Include cookies for session management
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Backend response:", data);

        // Store the session information if needed (optional)
        await AsyncStorage.setItem("session", JSON.stringify(data));

        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("MainPage"); // Navigate to the main page
      } else {
        const errorData = await response.json();
        console.error("Backend error response:", errorData);
        Alert.alert("Error", errorData.error || "Failed to create account.");
      }
    } catch (error) {
      console.error("Error sending data to backend:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Create Account</Text>

        {/* Full Name Input */}
        <TextInput
          style={[styles.input, errors.username && styles.inputError]}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUserName}
        />
        {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

        {/* Email Input */}
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        {/* Password Input */}
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Navigate to Login */}
        <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
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
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  content: {
    paddingHorizontal: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6d2323",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red",
  },
  button: {
    backgroundColor: "#6d2323",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
  },
  loginLink: {
    color: "#6d2323",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});

export default SignUp;
