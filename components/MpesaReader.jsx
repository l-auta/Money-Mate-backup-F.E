import React, { useEffect } from "react";
import { PermissionsAndroid, Platform, BackHandler } from "react-native";
import SmsAndroid from "react-native-get-sms-android";
import Transactions from "../screens/transaction";

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
        BackHandler.exitApp(); // Exit the app
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
  console.log("Parsing SMS:", sms); // Debugging

  // Regex to match the amount
  const amountMatch = sms.match(/Ksh\. (\d+(?:,\d{3})*(?:\.\d{2})?)/i); // Match "Ksh. 60"

  // Determine transaction type
  const type = sms.includes("received") ? "received" : "sent";

  // If amount is not found, the SMS does not match the expected format
  if (!amountMatch) {
    console.log("SMS does not match M-Pesa format:", sms); // Debugging
    return null;
  }

  // Extract amount
  const amount = parseFloat(amountMatch[1].replace(/,/g, ""));

  // If the date is not in the SMS body, use the timestamp from the metadata
  const date = new Date().toLocaleString(); // Use current date as a placeholder

  console.log("Parsed M-Pesa message:", { amount, date, type }); // Debugging
  return { amount, date, type };
};

// Send parsed transactions to the backend
const sendTransactionsToBackend = async (transactions) => {
  try {
    console.log("Sending transactions to backend:", transactions); // Debugging

    const response = await fetch("https://moneymatebackend.onrender.com/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactions }),
    });

    console.log("Response status:", response.status);
    // console.log("Response URL:", response.url); 

    if (response.ok) {
      console.log("Transactions sent successfully", response);
    } else {
      console.error("Failed to send transactions");
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
      console.log("SMS permission granted:", hasPermission); // Debugging
      if (!hasPermission) return;

      const filter = {
        box: "inbox", // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
        address: "ETOPUP", // Filter by sender's phone number or shortcode
      };

      SmsAndroid.list(
        JSON.stringify(filter),
        (fail) => {
          console.error("Failed to fetch SMS:", fail);
        },
        (count, smsList) => {
          console.log("Count: ", count); // Total number of SMS messages matching the filter
          // console.log("List: ", smsList); // Raw JSON string of SMS messages

          try {
            const messages = JSON.parse(smsList); // Parse the JSON string into an array of objects
            console.log("Parsed SMS messages:", messages); // Debugging

            // Parse and filter M-Pesa messages
            const mpesaMessages = messages
              .map((msg) => parseMpesaMessage(msg.body)) // Parse each SMS body
              .filter(Boolean); // Remove null values (invalid M-Pesa messages)

            if (mpesaMessages.length > 0) {
              console.log("Parsed M-Pesa messages:", mpesaMessages);
              sendTransactionsToBackend(mpesaMessages); // Send parsed messages to the backend
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