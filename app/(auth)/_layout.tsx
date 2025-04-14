import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="Verification"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="sign-up"
          options={{ headerShown: false, presentation: "modal" }}
        />
      </Stack>
      <StatusBar backgroundColor="#F6F4F0" style="dark" />
    </>
  );
};

export default AuthLayout;
