import React, { useEffect } from "react";
import { PermissionsAndroid, Platform, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SmsAndroid from "react-native-get-sms-android";

// Request SMS permissions on Android
const requestSmsPermission = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "SMS Permission",
          message: "App needs access to read your M-Pesa messages.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Deny",
          buttonPositive: "Allow",
        }
      );

      // Exit the app if permission is denied
      if (granted === PermissionsAndroid.RESULTS.DENIED) {
        console.log("SMS permission denied. Exiting app...");
        BackHandler.exitApp();
        return false;
      }

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error("Error requesting SMS permission", err);
      return false;
    }
  }
  return false;
};

// Parse M-Pesa messages
const parseMpesaMessage = (sms) => {
  const amountMatch = sms.match(/Ksh (\d+(?:,\d{3})*(?:\.\d{2})?)/i);
  const dateMatch = sms.match(/on (\d{1,2}(st|nd|rd|th) \w+ \d{4})/i);
  const recipientMatch = sms.match(/sent to (.*?) on/i);

  if (!amountMatch || !dateMatch) return null;

  const amount = parseFloat(amountMatch[1].replace(/,/g, ""));
  const date = dateMatch[1];
  const recipient = recipientMatch ? recipientMatch[1] : "Unknown";

  const type = sms.includes("sent to") ? "sent" : "received";

  return { amount, date, recipient, type };
};

// Send parsed transactions to the backend with session management
const sendTransactionsToBackend = async (transactions) => {
  try {
    // Check if user is logged in (based on session flag in AsyncStorage)
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      console.error("User not logged in. Exiting...");
      BackHandler.exitApp(); // Exit app if no session is found
      return;
    }

    const response = await fetch(
      "https://moneymatebackend.onrender.com/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactions }),
        credentials: "include", // Ensure cookies (session) are sent with the request
      }
    );

    if (response.ok) {
      console.log("Transactions sent successfully");
    } else {
      const errorData = await response.json();
      console.error("Failed to send transactions:", errorData);

      // If the session is invalid, clear and exit
      if (response.status === 401) {
        console.warn("Session expired or invalid. Logging out...");
        await AsyncStorage.removeItem("isLoggedIn"); // Clear session flag
        BackHandler.exitApp(); // Exit the app or navigate to login
      }
    }
  } catch (error) {
    console.error("Error sending data to backend:", error);
  }
};

// Main component to read M-Pesa SMS
const MpesaReader = () => {
  useEffect(() => {
    const init = async () => {
      const hasPermission = await requestSmsPermission();
      if (!hasPermission) return;

      SmsAndroid.list(
        JSON.stringify({
          box: "inbox", // Read messages from the inbox
          maxCount: 50, // Number of messages to read
        }),
        (fail) => console.error("Failed to fetch SMS:", fail),
        (success) => {
          console.log("Raw SMS response:", success);

          try {
            const messages = JSON.parse(success);
            console.log("Parsed SMS messages:", messages);

            const messageList = Array.isArray(messages) ? messages : [];

            const mpesaMessages = messageList
              .filter((msg) => msg.body && msg.body.includes("M-PESA"))
              .map((msg) => parseMpesaMessage(msg.body))
              .filter(Boolean);

            if (mpesaMessages.length > 0) {
              console.log("Parsed M-Pesa messages:", mpesaMessages);
              sendTransactionsToBackend(mpesaMessages);
            } else {
              console.log("No M-Pesa messages found.");
            }
          } catch (error) {
            console.error("Error parsing SMS JSON:", error);
          }
        }
      );
    };

    init();
  }, []);

  return null;
};

export default MpesaReader;
