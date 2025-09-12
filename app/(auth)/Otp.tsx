import { useVerifyOtpMutation } from "@/redux/apis/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

const OTPScreen: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [activeInput, setActiveInput] = useState(0);
  const [error, setError] = useState<string | null>(null); // ❌ error state
  const router = useRouter();
  const inputRefs = useRef<TextInput[]>([]);
  const { email } = useLocalSearchParams<{ email: string }>();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text.replace(/[^0-9]/g, "");
    setOtp(newOtp);
    setError(null); // clear error while typing

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    } else if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveInput(index - 1);
    }
  };

  const handlePaste = (text: string) => {
    const pastedOtp = text
      .replace(/[^0-9]/g, "")
      .slice(0, 4)
      .split("");
    const newOtp = ["", "", "", ""];
    for (let i = 0; i < 4 && i < pastedOtp.length; i++) {
      newOtp[i] = pastedOtp[i];
    }
    setOtp(newOtp);
    if (pastedOtp.length >= 4) {
      inputRefs.current[3]?.focus();
      setActiveInput(3);
    }
    setError(null);
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length === 4) {
      try {
        const res = await verifyOtp({ email, otp: otpCode }).unwrap();
        console.log("OTP verified ✅:", res);
        router.push("/(auth)");
      } catch (err: any) {
        console.error("OTP failed ❌:", err);
        setError("Invalid OTP. Please try again.");
      }
    } else {
      setError("Please enter the full 4-digit OTP.");
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: backgroundImage }}
        className="flex-1 justify-center items-center"
        imageStyle={{ opacity: 0.7 }}
      >
        <View className="bg-white/90 p-8 rounded-2xl w-11/12 max-w-md shadow-lg">
          <View className="mb-6">
            <Ionicons
              name="shield-checkmark"
              size={40}
              color="#00B8D4"
              className="mx-auto"
            />
            <Text className="text-3xl font-bold text-center text-gray-800 mt-2">
              Verify OTP
            </Text>
            <Text className="text-center text-gray-500 mt-1">
              Enter the 4-digit code sent to your email
            </Text>
          </View>

          <View className="flex-row justify-between mb-2">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                className={`w-20 h-20 text-center text-2xl font-bold text-gray-800 bg-gray-100 rounded-lg
                  ${
                    error || activeInput === index
                      ? "border-2"
                      : "border border-transparent"
                  }
                  ${error ? "border-red-500" : activeInput === index ? "border-cyan-200" : ""}
                `}
                value={digit}
                onChangeText={(text) => {
                  if (text.length > 1) handlePaste(text);
                  else handleChange(text, index);
                }}
                maxLength={1}
                keyboardType="numeric"
                autoCapitalize="none"
                autoCorrect={false}
              />
            ))}
          </View>

          {error && (
            <Text className="text-red-500 text-center text-sm mb-4">
              {error}
            </Text>
          )}

          <TouchableOpacity
            disabled={isLoading}
            className={`mt-4 py-3 rounded-lg border border-gray-100 ${
              isLoading ? "bg-cyan-300" : "bg-cyan-400"
            }`}
            onPress={handleVerify}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4"
            onPress={() => router.push("/(auth)/ForgotPassword")}
          >
            <Text className="text-center text-cyan underline">Resend Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-2"
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

export default OTPScreen;
