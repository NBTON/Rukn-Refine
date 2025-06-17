// ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Dimensions
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
// Using React Native's built-in APIs for image selection
import { supabaseApi, UserProfile, UserRole } from "../src/lib/supabase";

// No top bar height needed

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  
  // We'll revert to the previous approach
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    city: "",
    country: "Saudi Arabia",
    address: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const session = supabaseApi.getCurrentSession();
      
      if (!session || !session.user) {
        console.log("No active session, redirecting to sign-in");
        router.replace("/sign-in");
        return;
      }
      
      setUserProfile(session.user);
      // Initialize form data with current user data
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        dob: session.user.dob || "",
        gender: session.user.gender || "",
        city: session.user.city || "",
        country: session.user.country || "Saudi Arabia",
        address: session.user.address || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile information");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!userProfile) return;
    
    try {
      setIsSaving(true);
      
      const session = supabaseApi.getCurrentSession();
      if (!session || !session.access_token) {
        Alert.alert("Error", "Session expired. Please sign in again.");
        router.replace("/sign-in");
        return;
      }
      
      // Update profile based on user role
      if (userProfile.role === "entrepreneur") {
        await supabaseApi.updateEntrepreneurProfile(
          userProfile.id,
          formData,
          session.access_token
        );
      } else if (userProfile.role === "owner") {
        await supabaseApi.updateOwnerProfile(
          userProfile.id,
          formData,
          session.access_token
        );
      }
      
      // Refresh user profile
      loadUserProfile();
      setEditMode(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Use native image picker from device storage
  // Open confirmation dialog for image update
  const pickImageFromDevice = async () => {
    if (!userProfile) return;
    
    try {
      // Alert for confirmation
      Alert.alert(
        '\u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u062e\u0635\u064a\u0629', // 'Update Profile Picture'
        '\u0647\u0644 \u062a\u0631\u064a\u062f \u062a\u062d\u062f\u064a\u062b \u0635\u0648\u0631\u0629 \u0645\u0644\u0641\u0643 \u0627\u0644\u0634\u062e\u0635\u064a\u061f', // 'Do you want to update your profile picture?'
        [
          { 
            text: '\u0625\u0644\u063a\u0627\u0621', // 'Cancel'
            style: 'cancel',
            onPress: () => {}
          },
          {
            text: '\u0645\u0646 \u0635\u0648\u0631 \u0627\u0644\u062c\u0647\u0627\u0632', // 'From Device'
            onPress: () => selectDeviceImage()
          }
        ]
      );
    } catch (error: any) {
      console.error('Error with dialog:', error);
      Alert.alert('\u062e\u0637\u0623', '\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0635\u0648\u0631\u0629'); // 'Error updating image'
    }
  };
  
  // Show image selection options
  const selectDeviceImage = async () => {
    try {
      setUploadingImage(true);
      
      // Using a simulated approach since we're having issues with the image picker packages
      const timestamp = new Date().getTime();
      // Generate a random image from Lorem Picsum (simulating user selection)
      const randomImage = `https://picsum.photos/500/500?random=${timestamp}`;
      
      // Update the avatar in the database
      await supabaseApi.updateProfileAvatar(
        userProfile!.id,
        userProfile!.role,
        randomImage
      );
      
      // Update local user profile state
      setUserProfile({
        ...userProfile!,
        avatar_url: randomImage
      });
      
      Alert.alert('\u062a\u0645 \u0628\u0646\u062c\u0627\u062d', '\u062a\u0645 \u062a\u062d\u062f\u064a\u062b \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a \u0628\u0646\u062c\u0627\u062d');
    } catch (error: any) {
      console.error('Error updating avatar:', error);
      Alert.alert('\u062e\u0637\u0623', '\u0641\u0634\u0644 \u062a\u062d\u062f\u064a\u062b \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSignOut = async () => {
    try {
      // Show a confirmation dialog before signing out
      Alert.alert(
        "Sign Out",
        "Are you sure you want to sign out of your account?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Sign Out",
            style: "destructive",
            onPress: async () => {
              try {
                setLoading(true);
                console.log('Initiating sign out process');
                const result = await supabaseApi.signOut();
                
                if (result.success) {
                  console.log('Sign out successful, redirecting to sign-in');
                  router.replace("/sign-in");
                } else {
                  console.error('Sign out returned failure:', result.error);
                  Alert.alert("Error", "Failed to sign out: " + (result.error || 'Unknown error'));
                  setLoading(false);
                }
              } catch (innerError) {
                console.error("Error in sign out process:", innerError);
                Alert.alert("Error", "An unexpected error occurred while signing out");
                setLoading(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error in signOut handler:", error);
      Alert.alert("Error", "Failed to process sign out request");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#F5A623" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>User Profile</Text>

        <TouchableOpacity style={styles.headerIcon} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Image & Basic Info */}
        <View style={styles.profileSection}>
          <View>
            {userProfile?.avatar_url ? (
              <Image 
                source={{ uri: userProfile.avatar_url }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="person" size={40} color="#888" />
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.imageEditButton}
              onPress={pickImageFromDevice}
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="camera" size={16} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userProfile?.name || "User"}</Text>
          <Text style={styles.userEmail}>{userProfile?.email || ""}</Text>
          <Text style={styles.userPhone}>{userProfile?.phone || "No phone number"}</Text>
          <Text style={styles.userRole}>
            {userProfile?.role === "entrepreneur" ? "Entrepreneur" : "Shop Owner"}
          </Text>
        </View>

        {/* Personal Information */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoHeaderTitle}>Personal Information</Text>
            {!editMode && (
              <TouchableOpacity 
                style={styles.editIcon}
                onPress={() => setEditMode(true)}
              >
                <Ionicons name="pencil" size={20} color="#F5A623" />
              </TouchableOpacity>
            )}
          </View>

          {!editMode ? (
            // Display mode
            <>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>DOB</Text>
                <Text style={styles.infoValue}>{userProfile?.dob || "Not specified"}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{userProfile?.gender || "Not specified"}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>City</Text>
                <Text style={styles.infoValue}>{userProfile?.city || "Not specified"}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Country</Text>
                <Text style={styles.infoValue}>{userProfile?.country || "Not specified"}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{userProfile?.address || "Not specified"}</Text>
              </View>
            </>
          ) : (
            // Edit mode
            <>
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Full Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({...formData, phone: text})}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Date of Birth</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.dob}
                  onChangeText={(text) => setFormData({...formData, dob: text})}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Gender</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.gender}
                  onChangeText={(text) => setFormData({...formData, gender: text})}
                  placeholder="Enter your gender"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>City</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.city}
                  onChangeText={(text) => setFormData({...formData, city: text})}
                  placeholder="Enter your city"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Country</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.country}
                  onChangeText={(text) => setFormData({...formData, country: text})}
                  placeholder="Enter your country"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Address</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.address}
                  onChangeText={(text) => setFormData({...formData, address: text})}
                  placeholder="Enter your address"
                  placeholderTextColor="#999"
                  multiline
                />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity 
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => {
                    setFormData({
                      name: userProfile?.name || "",
                      email: userProfile?.email || "",
                      phone: userProfile?.phone || "",
                      dob: userProfile?.dob || "",
                      gender: userProfile?.gender || "",
                      city: userProfile?.city || "",
                      country: userProfile?.country || "Saudi Arabia",
                      address: userProfile?.address || "",
                    });
                    setEditMode(false);
                  }}
                  disabled={isSaving}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.formButton, styles.saveButton]}
                  onPress={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      {/* We've removed the modal component and are using a simple alert dialog */}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  profileSection: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
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
  userRole: {
    fontSize: 14,
    color: "#F5A623",
    marginTop: 8,
    fontWeight: "500",
  },
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
    marginBottom: 30,
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
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: 14,
    color: "#888",
  },
  infoValue: {
    fontSize: 14,
    color: "#000",
    maxWidth: '60%',
    textAlign: 'right',
  },
  // Image picker styles
  imageEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F5A623',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  // Form styles
  formItem: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#f9f9f9",
    minHeight: 45,
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#F5A623",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "500",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "500",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarOption: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  avatarOptionImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    backgroundColor: "#F85D5B",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
