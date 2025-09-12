import { useLoginMutation } from "@/redux/apis/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
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

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false }); // track field touch
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const handleLogin = async () => {
    // mark fields as touched on submit
    setTouched({ email: true, password: true });

    if (!email || !password) return; // stop if any empty

    try {
      const res = await login({ email, password }).unwrap();
      console.log("Login success:", res);

      // Save tokens securely
      await SecureStore.setItemAsync("accessToken", res.tokens.access);
      await SecureStore.setItemAsync("refreshToken", res.tokens.refresh);
      await SecureStore.setItemAsync("userEmail", res.email);

      router.push("/(tabs)");
    } catch (err: any) {
      console.error("Login failed:", err);
      // optionally you can shake input or something
    }
  };

  const getBorderStyle = (field: "email" | "password") =>
    touched[field] && !field
      ? "border-red-500 border-2"
      : "border border-gray-200";

  return (
    <ImageBackground
      source={{ uri: backgroundImage }}
      className="flex-1 bg-white"
      imageStyle={{ opacity: 0.7 }}
    >
      <SafeAreaView className="flex-1 justify-center items-center">
        <StatusBar barStyle="light-content" />

        <View className="bg-white/90 p-8 rounded-2xl w-11/12 max-w-md shadow-lg">
          <View className="mb-6">
            <Ionicons
              name="lock-closed"
              size={40}
              color="#00B8D4"
              className="mx-auto"
            />
            <Text className="text-3xl font-bold text-center text-gray-800 mt-2">
              Welcome Back
            </Text>
            <Text className="text-center text-gray-500 mt-1">
              Sign in to continue
            </Text>
          </View>

          <View className="space-y-4 gap-4">
            <View
              className={`flex-row items-center bg-gray-100 rounded-lg p-3 ${touched.email && !email ? "border-red-500 border-2" : "border border-gray-200"}`}
            >
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
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#000000"
              />
            </View>

            <View
              className={`flex-row items-center bg-gray-100 rounded-lg p-3 ${touched.password && !password ? "border-red-500 border-2" : "border border-gray-200"}`}
            >
              <Ionicons
                name="lock-closed"
                size={20}
                color="#00B8D4"
                className="mr-2"
              />
              <TextInput
                className="flex-1 text-black pr-10"
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                placeholderTextColor="#000000"
              />
              <TouchableOpacity
                className="absolute right-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#00B8D4"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className={`mt-6 py-3 rounded-lg border border-gray-100 bg-cyan-400 ${isLoading ? "opacity-50" : ""}`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/ForgotPassword")}
            className="mt-2"
          >
            <Text className="text-center text-cyan underline">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-500">Don’t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/Signup")}>
              <Text className="text-cyan font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
        <StatusBar barStyle="dark-content" />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;
