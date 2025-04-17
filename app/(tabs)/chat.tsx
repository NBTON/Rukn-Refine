import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import ChatScreen from "../chatScreen";
import { SafeAreaView } from "react-native-safe-area-context";

// Sample data for active conversations
const conversations = [
  {
    id: "1",
    name: "المساعد الشخصي",
    lastMessage: "Hey! How can I help you?",
  },
  {
    id: "2",
    name: "حمزة",
    lastMessage: "أنا مدير المحتوى لأساعدك",
  },
  {
    id: "3",
    name: "زيد",
    lastMessage: "مرحبا",
  },
];

const ConversationsScreen: React.FC = () => {

  const renderConversationItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => {
          // Navigate to Chat screen with the contact’s name
          router.push("/chatScreen");
        }}
      >
        <View style={styles.leftColumn}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Title */}
      <Text style={styles.headerTitle}>Active Conversations</Text>

      {/* Conversations List */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversationItem}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default ConversationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingTop:20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 16,
    marginBottom: 8,
    color: "#000",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop:20,
  },
  conversationItem: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftColumn: {
    flexDirection: "column",
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
});
