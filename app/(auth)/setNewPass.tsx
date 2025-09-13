import { useSetNewPassMutation } from "@/redux/apis/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage =
  "https://i.ibb.co.com/KjDXZW8L/teenager-pointing-to-laptop-28273841.jpg";

const SetNewPasswordScreen: React.FC = () => {
  const { email, otp } = useLocalSearchParams<{ email: string; otp: string }>(); // passed from OTP screen
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [setNewPass, { isLoading }] = useSetNewPassMutation();

  const validatePassword = (value: string) => {
    return value.length >= 6;
  };

  const handleSubmit = async () => {
    setError("");
    console.log(email, password, confirm, otp);

    if (!password || !confirm) {
      setError("Both fields are required");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await setNewPass({
        email,
        password,
        password2: confirm,
        otp,
      }).unwrap();
      console.log("Set new password response:", res);

      // Navigate back to login
      router.replace("/(auth)");
    } catch (err: any) {
      console.log("Set password error:", err);
      setError(
        err?.data?.error || err?.error || "Failed to set password. Try again."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: backgroundImage }}
        className="flex-1 justify-center items-center"
        imageStyle={{ opacity: 0.7 }}
      >
        <View className="bg-white/90 p-8 rounded-2xl w-11/12 max-w-md shadow-lg">
          <View className="mb-6">
            <Ionicons
              name="lock-closed"
              size={40}
              color="#00B8D4"
              className="mx-auto"
            />
            <Text className="text-3xl font-bold text-center text-gray-800 mt-2">
              Set New Password
            </Text>
            <Text className="text-center text-gray-500 mt-1">
              Enter and confirm your new password
            </Text>
          </View>

          <View className="space-y-4 gap-3">
            <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#00B8D4"
                className="mr-2"
              />
              <TextInput
                className="flex-1 text-gray-700"
                placeholder="New Password"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error) setError("");
                }}
              />
            </View>

            <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#00B8D4"
                className="mr-2"
              />
              <TextInput
                className="flex-1 text-gray-700"
                placeholder="Confirm Password"
                secureTextEntry
                value={confirm}
                onChangeText={(text) => {
                  setConfirm(text);
                  if (error) setError("");
                }}
              />
            </View>

            {error ? (
              <Text className="text-red-500 text-sm mt-1">{error}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            className={`mt-6 py-3 rounded-lg ${
              isLoading ? "bg-gray-300" : "bg-cyan-400"
            }`}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text className="text-white text-center text-lg font-semibold">
                Save Password
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4"
            onPress={() => router.push("/(auth)")}
          >
            <Text className="text-center text-cyan underline">
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SetNewPasswordScreen;
