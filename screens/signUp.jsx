import React, { useState } from 'react';
import { View,  Text, StyleSheet, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';


const SignUp = ({navigation}) => {
  const [username,  setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    // e.preventDefault()
    // getting info to the backend
    // const requestOptions = {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ username, email, password1, password2 }),
    // };
    // fetch("https://phase-4-project-3-o2io.onrender.com/signup", requestOptions)
    //     .then(response => response.json())
    //     .then(data => console.log(data))  // You can handle the response here
    //     .catch(error => window.alert('Error:', error));  // Handle any errors

    
    if(username === "" || email === "" || password === ""){
        alert('Please fill in all fields');
        return;
    }
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email))){
        alert('Please enter a valid email address');
        return;
    }
    if(password.length<8){
        alert('Password must be at least 8 characters long');
        return;
    }
    if(password!==confirmPassword){
        alert('Passwords do not match');
        return;
    }
    navigation.navigate('Main')
    console.log('Form Submitted with Username: ', username);
    console.log('Form Submitted with Email: ', email);
    console.log('Form Submitted with Password: ', password);
    
// clear inputs after submission
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
    <View>
        <Text style={styles.welcomeText}>SIGN-UP</Text>
        <Text style={styles.subWelcomeText}>TO CONTINUE</Text>
    </View>
    <View style={styles.form}>
      <Text style={styles.title}>User Name</Text>
        <TextInput
        onChangeText={setUsername}
        value={username}
        mode='flat'
        labelStyle={{
            color: 'purple',  // Changes the label color
          }}
        contentStyle={{
            paddingLeft: 10,  // Adds padding to the left of the input field
            backgroundColor: '#ffefd0',  // Changes the background color of the text input area
          }}
          underlineStyle={{
            // borderBottomWidth: 2,  // Adjusts the thickness of the underline
            borderBottomColor: '#6d2323',  // Changes the color of the underline
            borderRadius: 5,  // Adds border radius to the bottom of the input
          }}
          activeUnderlineColor='#6d2323'
          style={{
            // margin: 5,  // This applies to the outer wrapper of the input
            borderRadius: 50,  // Border radius for the outer container
            height: 50,  // Sets the height of the text input area
          }}
        />
      <Text style={styles.title}>Email</Text>
        <TextInput
        onChangeText={setEmail}
        value={email}mode='flat'
        labelStyle={{
            color: 'purple',  // Changes the label color
          }}
        contentStyle={{
            paddingLeft: 10,  // Adds padding to the left of the input field
            backgroundColor: '#ffefd0',  // Changes the background color of the text input area
          }}
          underlineStyle={{
            // borderBottomWidth: 2,  // Adjusts the thickness of the underline
            borderBottomColor: '#6d2323',  // Changes the color of the underline
            borderRadius: 5,  // Adds border radius to the bottom of the input
          }}
          activeUnderlineColor='#6d2323'
          style={{
            // margin: 5,  // This applies to the outer wrapper of the input
            borderRadius: 50,  // Border radius for the outer container
            height: 50,  // Sets the height of the text input area
          }}
        />
      <Text style={styles.title}>Password</Text>
        <TextInput
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        mode='flat'
        labelStyle={{
            color: 'purple',  // Changes the label color
          }}
        contentStyle={{
            paddingLeft: 10,  // Adds padding to the left of the input field
            backgroundColor: '#ffefd0',  // Changes the background color of the text input area
          }}
          underlineStyle={{
            // borderBottomWidth: 2,  // Adjusts the thickness of the underline
            borderBottomColor: '#6d2323',  // Changes the color of the underline
            borderRadius: 5,  // Adds border radius to the bottom of the input
          }}
          activeUnderlineColor='#6d2323'
          style={{
            // margin: 5,  // This applies to the outer wrapper of the input
            borderRadius: 50,  // Border radius for the outer container
            height: 50,  // Sets the height of the text input area
          }}
        />
      <Text style={styles.title}>Confirm Password</Text>
        <TextInput
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry={true}
        mode='flat'
        labelStyle={{
            color: 'purple',  // Changes the label color
          }}
        contentStyle={{
            paddingLeft: 10,  // Adds padding to the left of the input field
            backgroundColor: '#ffefd0',  // Changes the background color of the text input area
          }}
          underlineStyle={{
            // borderBottomWidth: 2,  // Adjusts the thickness of the underline
            borderBottomColor: '#6d2323',  // Changes the color of the underline
            borderRadius: 5,  // Adds border radius to the bottom of the input
          }}
          activeUnderlineColor='#6d2323'
          style={{
            // margin: 5,  // This applies to the outer wrapper of the input
            borderRadius: 50,  // Border radius for the outer container
            height: 50,  // Sets the height of the text input area
          }}
        />
        </View>
        <Button style={styles.button} title="Sign-Up" onPress={handleSubmit} />
        <View style={styles.line} />
        <View style = {styles.register}>
            <Text style={styles.normalText}>
                Already registered?{' '}
                <Text style={styles.link} onPress={() => navigation.navigate('LogIn')}>
                Log-in  
                </Text>
            </Text>
        </View>
      </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingBottom : 10,
    paddingTop : 70,
  },
  form: {
    marginBottom: 50,
  },
  register: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: '98%',                // Full width of the container
    height: 1,                    // Height of the line
    backgroundColor: 'black',     // Line color
    marginVertical: 20,
    margin : 5         
  },
  welcomeText: {
    fontSize: 55,
    color: '#6d2323',
    fontWeight : 'bold',
    // marginTop: 70,
},
subWelcomeText: {
    fontSize: 35,
    marginBottom: 20,
    marginLeft : 30,
    color: '#a04747',
    fontWeight : 'bold',
},
  
  welcome: {
    fontSize: 35,
    marginBottom: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    // paddingLeft: 30,
  },
  title: {
    marginBottom: 5,
    marginTop: 20,
    fontSize: 19,
    marginLeft : 0,
    fontWeight : 'bold',
  },
//   input: {
//     height: 40,
//     backgroundColor: '#e5e5bf',
//     borderRadius:10,
//     marginBottom: 20,
//     width: '100%',
//     padding: 10, 
//   },
  normalText:{
    color: 'black',
    fontSize: 19,
  },
  link: {
    color: '#6d2323',
    fontWeight: 'bold',
    fontSize: 19,
    textDecorationLine: 'underline',
  },
});

export default SignUp;
