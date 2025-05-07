// ProfileScreen.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon}>
          {/* Left icon—could open a drawer or go back */}
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>User Profile</Text>

        <TouchableOpacity style={styles.headerIcon}>
          {/* Right icon—menu, settings, etc. */}
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Profile Image & Basic Info */}
      <View style={styles.profileSection}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>100 × 100</Text>
        </View>
        <Text style={styles.userName}>Muhannad Alduraywish</Text>
        <Text style={styles.userEmail}>Muhannad@example.com</Text>
        <Text style={styles.userPhone}>+123 456 789</Text>
      </View>

      {/* Personal Information */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Text style={styles.infoHeaderTitle}>Personal Information</Text>
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>DOB</Text>
          <Text style={styles.infoValue}>28/2/2002</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Gender</Text>
          <Text style={styles.infoValue}>Male</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Address</Text>
          <Text style={styles.infoValue}>Alkhobar</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  /**
   * Header
   */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: "#FFF",
    elevation: 2, // slight shadow on Android
    shadowColor: "#000", // slight shadow on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
  headerIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  /**
   * Profile Info
   */
  profileSection: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  imagePlaceholderText: {
    color: "#888",
    fontSize: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  userPhone: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  /**
   * Info Card
   */
  infoCard: {
    backgroundColor: "#FFF",
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoHeaderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  editIcon: {
    padding: 6,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: "#888",
  },
  infoValue: {
    fontSize: 14,
    color: "#000",
  },
});
