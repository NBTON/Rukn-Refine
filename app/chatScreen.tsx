import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Message {
  id: string;
  text: string;
  time: string;
  sender: string; // "You" or contact name
}

// Sample conversation messages
const initialMessages: Message[] = [
  {
    id: "1",
    text: "فاضي نتقابل يمديك؟",
    time: "10:15 AM",
    sender: "محمد",
  },
  {
    id: "2",
    text: "نبي نشوف المحل اذا يمديك",
    time: "10:17 AM",
    sender: "محمد",
  },
  {
    id: "3",
    text: "تمام",
    time: "10:17 AM",
    sender: "You",
  },
  {
    id: "4",
    text: "حياك الله",
    time: "10:20 AM",
    sender: "محمد",
  },
];

const ChatScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { name } = (route.params as any) || {}; // contact name passed from ConversationsScreen

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim().length === 0) {
      return;
    }
    const newMessage: Message = {
      id: Math.random().toString(),
      text: inputText.trim(),
      time: "10:25 AM", // or use moment.js / dayjs for actual time
      sender: "You",
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  const renderMessages = () => {
    return messages.map((msg) => {
      const isUser = msg.sender === "You";
      return (
        <View
          key={msg.id}
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.otherBubble,
          ]}
        >
          <Text style={styles.bubbleText}>{msg.text}</Text>
          <Text style={styles.timestamp}>{msg.time}</Text>
        </View>
      );
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={-30} // Adjust if you have a header
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.chatTitle}>{name || "Chat"}</Text>
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={{ padding: 16 }}
      >
        {renderMessages()}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message here..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop:40,
    
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "#FFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  // Messages
  messagesContainer: {
    flex: 1,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: "#F5A623",
    alignSelf: "flex-end",
  },
  otherBubble: {
    backgroundColor: "#E5E7EB",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E2E2E2",
  },
  bubbleText: {
    fontSize: 14,
    color: "#000",
  },
  timestamp: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E2E2",
    paddingHorizontal: 8,
    paddingVertical: 6,
    paddingBottom:40,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderColor: "#CCC",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 6,
    fontSize: 14,
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#F5A623",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
