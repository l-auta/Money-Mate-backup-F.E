import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";

function SignUp({ navigation }) {
  // State for input fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for error messages
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullName: "", email: "", password: "" };

    // Validate Full Name
    if (!fullName.trim()) {
      newErrors.fullName = "Full Name is required";
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

    // Update errors state
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSignUp = async () => {
    if (!validateForm()) {
      // If form is invalid, show error messages
      Alert.alert("Error", "Please fix the errors in the form.");
      return;
    }

    // If form is valid, proceed with sign-up logic
    setIsLoading(true); // Show loading indicator

    try {
      // Prepare the data to send to the backend
      const userData = {
        fullName,
        email,
        password,
      };

      // Send a POST request to your backend
      const response = await fetch("http://your-backend-url/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Check if the request was successful
      if (response.ok) {
        const data = await response.json();
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("LogIn"); // Navigate to Login screen
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to create account.");
      }
    } catch (error) {
      console.error("Error sending data to backend:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.header}>Create Account</Text>

        {/* Full Name Input */}
        <TextInput
          style={[styles.input, errors.fullName && styles.inputError]}
          placeholder="Full Name"
          placeholderTextColor="#999"
          color="#333"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
        {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

        {/* Email Input */}
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          color="#333"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        {/* Password Input */}
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          color="#333"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" /> // Show loading indicator
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
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
    color: "#333",
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