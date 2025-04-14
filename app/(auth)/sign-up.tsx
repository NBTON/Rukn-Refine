import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";

const SignUpScreen: React.FC = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bod, setBod] = useState<string>("");

  const handleCreateAccount = () => {
    // Here, you can add validation, an API call, or navigation logic
    // For demonstration, we'll just show an alert with the data:
    Alert.alert(
      "Account Info",
      `Name: ${fullName}\nEmail: ${email}\nBOD: ${bod}`
    );
    console.log("User Info:", { fullName, email, bod });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={
            require("../../assets/images/logo.png") // Dummy logo URI
          }
          resizeMode="contain"
        />
        {/* Insert the pin icon or any additional logo elements here */}
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.textInput}
          placeholder="BOD"
          placeholderTextColor="#999"
          value={bod}
          onChangeText={setBod}
        />
      </View>

      {/* Create Account Button */}
      <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#F5A623",
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: 12,
    fontSize: 16,
    marginVertical: 8,
    color: "#626262",
    height: 60,
  },
  button: {
    width: "100%",
    backgroundColor: "#F5A623",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    // Optional shadow for iOS and Android
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    height: 60,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  logo: {
    height: 400,
    marginBottom: -90,
  },
});
