import { useAddUserMutation } from "@/redux/apis/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Gradient background image (replace with your own or use a local asset)
const backgroundImage =
  "https://i.ibb.co/KjDXZW8/teenager-pointing-to-laptop-28273841.jpg";

const SignUpScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [regError, setRegError] = useState("");
  const [register, { isLoading, isError, error }] = useAddUserMutation();

  const validate = () => {
    let valid = true;
    let newErrors = {
      name: false,
      email: false,
      password: false,
      confirmPassword: false,
    };

    if (!name.trim()) {
      newErrors.name = true;
      valid = false;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = true;
      valid = false;
    }

    if (!password || password.length < 6) {
      newErrors.password = true;
      valid = false;
    }

    if (!confirmPassword || confirmPassword !== password) {
      newErrors.confirmPassword = true;
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = true;
      newErrors.password = true;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = async () => {
    console.log("hello signup");
    if (!validate()) {
      console.log("Validation failed:", errors);
      return;
    }

    try {
      console.log("Attempting API call with:", {
        full_name: name,
        email,
        password,
      });
      const res = await register({
        full_name: name,
        email,
        password,
      }).unwrap();

      console.log("✅ Registered:", res);

      router.push({
        pathname: "/(auth)/Otp",
        params: { email, purpose: "registration" },
      });
    } catch (err: any) {
      console.error("❌ Registration failed:", err);
      setRegError(
        err?.data?.error ||
          err?.error ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" />
      <ImageBackground
        source={{ uri: backgroundImage }}
        className="flex-1 justify-center items-center"
        imageStyle={{ opacity: 0.7 }}
      >
        <View className="bg-white/90 p-8 rounded-2xl w-11/12 max-w-md shadow-lg">
          <View className="mb-6">
            <Ionicons
              name="person-add"
              size={40}
              color="#00B8D4"
              className="mx-auto"
            />
            <Text className="text-3xl font-bold text-center text-gray-800 mt-2">
              Create Account
            </Text>
            <Text className="text-center text-gray-500 mt-1">
              Sign up to get started
            </Text>
          </View>

          <View className="space-y-4 gap-3">
            <View
              className={`flex-row items-center bg-gray-100 rounded-lg p-3 ${
                errors.name ? "border-2 border-red-500" : ""
              }`}
            >
              <Ionicons
                name="person"
                size={20}
                color="#00B8D4"
                className="mr-2"
              />
              <TextInput
                className="flex-1 text-gray-700"
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor="#000000"
              />
            </View>

            <View
              className={`flex-row items-center bg-gray-100 rounded-lg p-3 ${
                errors.email ? "border-2 border-red-500" : ""
              }`}
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
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#000000"
              />
            </View>

            <View
              className={`flex-row items-center bg-gray-100 rounded-lg p-3 ${
                errors.password ? "border-2 border-red-500" : ""
              }`}
            >
              <Ionicons
                name="lock-closed"
                size={20}
                color="#00B8D4"
                className="mr-2"
              />
              <TextInput
                className="flex-1 text-gray-700 pr-10"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
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

            <View
              className={`flex-row items-center bg-gray-100 rounded-lg p-3 ${
                errors.confirmPassword ? "border-2 border-red-500" : ""
              }`}
            >
              <Ionicons
                name="lock-closed"
                size={20}
                color="#00B8D4"
                className="mr-2"
              />
              <TextInput
                className="flex-1 text-gray-700 pr-10"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                placeholderTextColor="#000000"
              />
              <TouchableOpacity
                className="absolute right-3"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#00B8D4"
                />
              </TouchableOpacity>
            </View>
          </View>

          {isError && (
            <Text className="text-red-500 text-center mt-2">{regError}</Text>
          )}

          <TouchableOpacity
            className="bg-cyan mt-6 py-3 rounded-lg border border-gray-100 bg-cyan-400"
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)")}>
              <Text className="text-cyan font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SignUpScreen;
