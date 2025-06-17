import { router } from "expo-router";
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
  ActivityIndicator,
  ScrollView,
  Modal,
  SafeAreaView,
} from "react-native";
import { supabaseApi, UserRole } from '../src/lib/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '@/src/context/AuthContext';

const SignUpScreen = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  
  // Date of birth states
  const [dob, setDob] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  
  // Gender selection
  const [gender, setGender] = useState<string>("");
  
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("Saudi Arabia");
  const [role, setRole] = useState<UserRole>("entrepreneur");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signUp } = useAuth();

  const validateInputs = () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (!password || password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }
    if (!dob.trim()) {
      Alert.alert("Error", "Please select your date of birth");
      return false;
    }
    if (!gender.trim()) {
      Alert.alert("Error", "Please select your gender");
      return false;
    }
    if (!city.trim()) {
      Alert.alert("Error", "Please enter your city");
      return false;
    }
    return true;
  };
  
  // Format date to DD/MM/YYYY
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  // Handle date change
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setDob(formatDate(selectedDate));
    }
  };

  const handleCreateAccount = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      setError(null);

      // Format phone with country code if user didn't enter it
      const formattedPhone = phone.startsWith("+966") ? phone : "+966" + phone;

      const result = await signUp(email, password, {
        name: fullName,
        email,
        phone: formattedPhone,
        dob,
        gender,
        city,
        country,
        role: role,
        address: city + ", " + country,
      });

      if (result.success) {
        console.log("Signup successful!");
        // Navigate to main app
        router.replace("/(tabs)/profile");
      } else {
        // Handle error
        setError(result.error || "Failed to create account. Please try again.");
        Alert.alert("Error", result.error || "Failed to create account");
      }
    } catch (e: any) {
      console.error("Signup error:", e);
      setError(e.message || "An unexpected error occurred");
      Alert.alert("Error", e.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../../assets/images/logo.png")}
            resizeMode="contain"
          />
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
            autoCapitalize="none"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text>{showPassword ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.phoneContainer}>
            <Text style={styles.countryCode}>+966</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <TouchableOpacity 
            style={styles.textInput} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={dob ? styles.inputText : styles.placeholderText}>
              {dob || "Date of Birth (DD/MM/YYYY)"}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Gender:</Text>
            <View style={styles.genderButtons}>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'Male' ? styles.selectedGender : null]}
                onPress={() => setGender('Male')}
              >
                <Text style={gender === 'Male' ? styles.selectedGenderText : styles.genderButtonText}>Male</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.genderButton, gender === 'Female' ? styles.selectedGender : null]}
                onPress={() => setGender('Female')}
              >
                <Text style={gender === 'Female' ? styles.selectedGenderText : styles.genderButtonText}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="City"
            placeholderTextColor="#999"
            value={city}
            onChangeText={setCity}
          />
          
          {/* Role Selection */}
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>I am a:</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'entrepreneur' ? styles.selectedRole : null]}
                onPress={() => setRole('entrepreneur')}
              >
                <Text style={styles.roleButtonText}>Entrepreneur</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, role === 'owner' ? styles.selectedRole : null]}
                onPress={() => setRole('owner')}
              >
                <Text style={styles.roleButtonText}>Shop Owner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Error message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Create Account Button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleCreateAccount}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Sign In Link */}
        <TouchableOpacity 
          style={styles.signInLink}
          onPress={() => router.replace("/sign-in")}
        >
          <Text style={styles.signInText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 190, // Further increased padding to ensure buttons are fully visible
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 250, // Further increased padding at the bottom
  },
  inputText: {
    color: "#000000",
    fontSize: 16,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    height: 200,
    marginBottom: 10,
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
  roleContainer: {
    marginVertical: 15,
  },
  roleLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  roleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedRole: {
    backgroundColor: "#FFF0DB",
    borderColor: "#F5A623",
  },
  roleButtonText: {
    fontSize: 14,
    color: "#333",
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#F5A623",
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    height: 60,
    marginVertical: 8,
    width: "100%",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    height: "100%",
    color: "#626262",
  },
  eyeIcon: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  genderContainer: {
    width: "100%",
    marginVertical: 8,
  },
  genderLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  genderButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    height: 45,
  },
  selectedGender: {
    backgroundColor: "#FFF0DB",
    borderColor: "#F5A623",
  },
  genderButtonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedGenderText: {
    fontSize: 14,
    color: "#F5A623",
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    backgroundColor: "#F5A623",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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
  errorText: {
    color: "#FF3B30", 
    marginBottom: 10,
    textAlign: "center",
  },
  signInLink: {
    marginTop: 20,
  },
  signInText: {
    color: "#F5A623",
    fontSize: 16,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#F5A623",
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    height: 60,
    marginVertical: 8,
  },
  countryCode: {
    paddingLeft: 12,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  phoneInput: {
    flex: 1,
    paddingLeft: 4,
    paddingRight: 12,
    fontSize: 16,
    height: 60,
    color: "#626262",
  }
});
