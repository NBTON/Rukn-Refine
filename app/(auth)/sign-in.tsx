import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useAuth } from '@/src/context/AuthContext';

const SignInScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const validateInputs = () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (!password || password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      setError(null);

      const result = await signIn(email, password);

      if (result.success) {
        console.log("Sign in successful!");
        
        // Check if this is a legacy user (without password verification)
        if (result.isLegacyUser) {
          // Show a security notification
          Alert.alert(
            "Security Notice", 
            "For your security, we recommend you update your password in the next version of the app.", 
            [{ text: "OK", onPress: () => router.replace("/(tabs)/profile") }]
          );
        } else {
          // Standard successful login
          router.replace("/(tabs)/profile");
        }
      } else {
        // Handle error
        setError(result.error || "Invalid email or password. Please try again.");
        Alert.alert("Error", result.error || "Invalid email or password");
      }
    } catch (e: any) {
      console.error("Sign in error:", e);
      setError(e.message || "An unexpected error occurred");
      Alert.alert("Error", e.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../../assets/images/logo.png")}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome Back</Text>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text>{showPassword ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Sign In Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity 
          style={styles.signUpLink}
          onPress={() => router.replace("/sign-up")}
        >
          <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPasswordLink}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;

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
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F5A623',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    height: 60,
    marginVertical: 8,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#F5A623',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    height: 60,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 15,
    textAlign: 'center',
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
  signUpLink: {
    marginTop: 20,
  },
  signUpText: {
    color: '#F5A623',
    fontSize: 16,
  },
  forgotPasswordLink: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 14,
  },
});
