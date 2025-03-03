# Finance Regulator App

A React Native application that helps users track their expenses by reading M-Pesa messages, extracting transaction details (amount, date, recipient, etc.), and displaying the data in a user-friendly interface. The app also sends the parsed data to a backend for processing and updates the UI with charts, tables, and summary cards.

## Features

- **M-Pesa SMS Parsing**:
  - Reads M-Pesa SMS messages from the user's inbox.
  - Extracts transaction details such as amount, date, recipient, and type (deposit or transfer).

- **Backend Integration**:
  - Sends parsed transaction data to a backend for storage and processing.
  - Fetches processed data to update the UI dynamically.

- **User Interface**:
  - **Charts**: Visualize expenses and income over time.
  - **Tables**: Display detailed transaction history.
  - **Summary Cards**: Show daily totals for deposits and transfers.

- **Expense Tracking**:
  - Automatically categorizes transactions (e.g., deposits, transfers).
  - Provides insights into spending patterns.

## Technologies Used

- **Frontend**:
  - React Native
  - React Navigation (for routing)
  - React Native Paper (for UI components)
  - Charting Library (e.g., `react-native-chart-kit`)

- **Other Tools**:
  - React Native Get SMS (for reading SMS messages)
  - Fetch (for API requests)

## Setup Instructions

### Prerequisites

- npm installed.
- React Native development environment set up (follow the [official guide](https://reactnative.dev/docs/environment-setup)).
- Android or iOS emulator (or a physical device for testing).

### Steps to Run the Project

1. **Clone the Repository**:
   ```bash
   git clone git@github.com:l-auta/Money-Mate-backup-F.E.git
   Money-Mate-backup-F.E

2. **Install dependencies**:
- If you are using npm:
    ```bash
    npm install

- If you are using yarn:
     ```bash
     yarn install

3. **Run the frontend**:
- For Android:
    ```bash
    npx react-native run-android
 
- For IOS:
    ```bash
    npx react-native run-ios 

4. **Testing**:
- Use an Android device or emulator to test SMS reading functionality (iOS does not support SMS reading).


## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact Information

For more information, feel free to reach out:

- Emily Maore: emilymwendwa390@gmail.com
- Lisa Auta: lisaauta018@gmail.com