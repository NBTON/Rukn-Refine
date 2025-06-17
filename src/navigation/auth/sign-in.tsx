import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const PhoneVerificationScreen = () => {
  // You can handle any state or form submission logic here.
  // e.g., const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendVerification = () => {
    // TODO: integrate real verification logic
    console.log("Verification code sent");
    router.replace("/Verification")
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* KeyboardAvoidingView helps ensure the UI adjusts when the keyboard is shown */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Logo + App Name */}
        <Image
          style={styles.logo}
          source={
            require("../../assets/images/logo.png") // Dummy logo URI
          }
          resizeMode="contain"

        />
        

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            // value={phoneNumber}
            // onChangeText={(text) => setPhoneNumber(text)}
          />
        </View>

        {/* Verification Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSendVerification}
        >
          <Text style={styles.buttonText}>Send verification code</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PhoneVerificationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logo: {
    height: 400,
    marginBottom:-90,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    height: 70,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    height: 60,
  },
  button: {
    width: '100%',
    backgroundColor: '#F5A623',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent:"center",
    // Optional shadow for iOS and Android
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    height: 60,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
