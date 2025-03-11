import { View, Text, StyleSheet, Animated, SafeAreaView } from "react-native";
import React, { useEffect } from "react";

function Welcome({ navigation }) {
  // Fade-in animation for the text
  const fadeAnim = new Animated.Value(0); // Initial opacity set to 0

  useEffect(() => {
    // Animate the text fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500, // Time for the text to fade in
      useNativeDriver: true,
    }).start();

    // Redirect to SignUp screen after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('SignUp');
    }, 2500);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [fadeAnim, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Money Mate</Text>
        <View style={styles.line} />
        <Text style={styles.tagline}>
          Track your expenses effortlessly and take control of your finances.
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Light background for contrast
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#6d2323', // Primary color
    marginBottom: 10,
    textTransform: 'uppercase', 
    letterSpacing: 2, 
  },
  line: {
    width: 100,
    height: 4,
    backgroundColor: '#6d2323', // Primary color
    marginBottom: 20,
  },
  tagline: {
    fontSize: 18,
    color: '#a04747', // Secondary color
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24, // Improve readability
  },
});

export default Welcome;