import { View, Image, Text } from "react-native";
import React, { useState } from "react";
import { Tabs, Stack } from "expo-router";
import { icons } from "../../constants";

interface TabIconProps {
  icon: any; // The source of the icon (e.g., from require() or a URI)
  color: string; // The color of the icon or text
  name: string; // The label for the tab
  focused: boolean; // Whether the tab is focused or active
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", gap: 4 }}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: 24,
          height: 24,
          tintColor: color,
          marginTop: 30,
        }}
      />
      <Text
        style={{
          //fontFamily: focused ? "Poppins-SemiBold" : "Poppins-Regular",
          fontSize: 9,
          color: color,
          width: 90,
          textAlign: "center",
        }}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#F5A623",
        tabBarInactiveTintColor: "#ffffff",
        tabBarStyle: {
          backgroundColor: "#1E2A38",
          borderTopWidth: 1,
          borderBottomColor: "#232533",
          height: 84,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name={"Home"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: "Favorite",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.heart}
              color={color}
              name={"Favorite"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.mapPin}
              color={color}
              name={"Map"}
              focused={focused}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.chat}
              color={color}
              name={"Chat"}
              focused={focused}
            />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.userCircle}
              color={color}
              name={"Profile"}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
