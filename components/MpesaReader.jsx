import React, { useEffect } from "react";
import { PermissionsAndroid, Platform, BackHandler } from "react-native";
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

      // If the user denies permission, exit the app
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
const parseMpesaDate = (timestamp) => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const formatAmount = (amount) => {
  return parseFloat(amount).toFixed(1); // Ensure the amount has one decimal places
};

const parseMpesaMessage = (sms) => {
  console.log("Parsing SMS:", sms); 

  // Regex to match the amount
  const amountMatch = sms.body.match(/Ksh(\d+(?:,\d{3})*(?:\.\d{2})?)/i); 

  // Determine transaction type
  const type = sms.body.includes("received") ? "received" : "sent";

  // If amount is not found, the SMS does not match the expected format
  if (!amountMatch) {
    console.log("SMS does not match M-Pesa format:", sms.body);
    return null;
  }

  // Extract amount
  const amount = formatAmount(amountMatch[1].replace(/,/g, ""));

  // Use the SMS metadata date (timestamp in milliseconds)
  const date = parseMpesaDate(sms.date);

  console.log("Parsed M-Pesa message:", { amount, date, type }); // Debugging
  return { amount, date, type };
};

// Send parsed transactions to the backend
const sendTransactionsToBackend = async (transactions) => {
  try {
    console.log("Sending transactions to backend:", transactions); 

    // Loop through each transaction and send it individually
    for (const transaction of transactions) {
      const response = await fetch(
        "https://money-mate-backend-1-bs54.onrender.com/transactions",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction), 
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to send transaction:", transaction, errorData);
        throw new Error("Failed to send transaction");
      }

      const result = await response.json();
      console.log("Transaction sent successfully:", result);
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
      console.log("SMS permission granted:", hasPermission); 
      if (!hasPermission) return;

      const filter = {
        box: "inbox", // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
        address: "MPESA", // Filter by sender's phone number or shortcode
        maxCount: 100, 
      };

      SmsAndroid.list(
        JSON.stringify(filter),
        (fail) => {
          console.error("Failed to fetch SMS:", fail);
        },
        (count, smsList) => {
          console.log("Count: ", count); // Total number of SMS messages matching the filter

          try {
            const messages = JSON.parse(smsList); // Parse the JSON string into an array of objects
            console.log("Parsed SMS messages:", messages); 

            // Parse and filter M-Pesa messages
            const mpesaMessages = messages
              .map((msg) => parseMpesaMessage(msg)) // Parse each SMS
              .filter(Boolean); // Remove null values (invalid M-Pesa messages)

            if (mpesaMessages.length > 0) {
              console.log("Parsed M-Pesa messages:", mpesaMessages);
              sendTransactionsToBackend(mpesaMessages); 
            } else {
              console.log("No M-Pesa messages found.");
            }
          } catch (error) {
            console.error("Error parsing SMS response:", error);
          }
        }
      );
    };
    init();
  }, []);

  return null;
};

export default MpesaReader;