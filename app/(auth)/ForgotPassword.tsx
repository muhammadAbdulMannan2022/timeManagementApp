import { useForgotPassMutation } from "@/redux/apis/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(false); // control resend button
  const router = useRouter();

  const [forgot, { isLoading }] = useForgotPassMutation();

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleResetPassword = async () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Enter a valid email");
      return;
    }

    try {
      const res = await forgot({ email }).unwrap();
      console.log("Password reset response:", res);

      setCanResend(true); // allow resend after success

      // navigate if API success
      router.push({
        pathname: "/(auth)/Otp",
        params: { email, purpose: "password_reset" },
      });
    } catch (err: any) {
      console.log("Forgot password error:", err);
      setError(
        err?.data?.error || err?.error || "Something went wrong, try again."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: backgroundImage }}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        imageStyle={{ opacity: 0.7 }}
      >
        <View className="bg-white/90 p-8 rounded-2xl w-11/12 max-w-md shadow-lg">
          <View className="mb-6">
            <Ionicons
              name="key"
              size={40}
              color="#00B8D4"
              className="mx-auto"
            />
            <Text className="text-3xl font-bold text-center text-gray-800 mt-2">
              Forgot Password
            </Text>
            <Text className="text-center text-gray-500 mt-1">
              Enter your email to reset your password
            </Text>
          </View>

          <View className="space-y-4">
            <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
              <Ionicons
                name="mail"
                size={20}
                color="#00B8D4"
                className="mr-2"
              />
              <TextInput
                className="flex-1 text-gray-700"
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
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
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text className="text-white text-center text-lg font-semibold">
                Send Reset Code
              </Text>
            )}
          </TouchableOpacity>

          {/* {canResend && (
            <TouchableOpacity
              className={`mt-4 py-3 rounded-lg ${
                isResendLoading ? "bg-gray-300" : "bg-orange-400"
              }`}
              onPress={handleResend}
              disabled={isResendLoading}
            >
              {isResendLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Resend Code
                </Text>
              )}
            </TouchableOpacity>
          )} */}

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

export default ForgotPasswordScreen;
