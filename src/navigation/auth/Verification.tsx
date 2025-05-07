import { router } from "expo-router";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  Image,
} from "react-native";

const verificationScreen: React.FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", ""]);

  // Create refs for each TextInput with explicit type annotations
  const inputRefs = [
    useRef<RNTextInput>(null),
    useRef<RNTextInput>(null),
    useRef<RNTextInput>(null),
    useRef<RNTextInput>(null),
  ];

  const handleChange = (value: string, index: number): void => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Automatically focus the next field if a value is entered.
    if (value !== "" && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus();
    }

    // Once all four digits are entered, log the concatenated code.
    if (newCode.every((digit) => digit !== "")) {
      console.log("The user entered:", newCode.join(""));
      // Add further logic here (e.g., API call or navigation)
      router.replace("/sign-up");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Header/Logo */}
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={
            require("../../assets/images/logo.png") // Dummy logo URI
          }
          resizeMode="contain"
        />
      </View>

      {/* Four numeric input fields */}
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={inputRefs[index]}
            value={digit}
            onChangeText={(val: string) => handleChange(val, index)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.codeBox}
          />
        ))}
      </View>
    </KeyboardAvoidingView>
  );
};

export default verificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    //justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  codeBox: {
    width: 60,
    height: 60,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#F5A623",
    backgroundColor: "#F5F5F5",
    textAlign: "center",
    fontSize: 24,
    borderRadius: 15,
  },
  logo: {
    height: 400,
    marginBottom: -90,
  },
});
