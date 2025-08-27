import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Gradient background image (replace with your own or use a local asset)
const backgroundImage = 'https://images.unsplash.com/photo-1505373877841-930c8e1f6922?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80';

const OTPScreen: React.FC = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [activeInput, setActiveInput] = useState(0);
    const router = useRouter();
    const inputRefs = useRef<TextInput[]>([]); // Explicitly type as TextInput array

    // Handle input change and move focus
    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text.replace(/[^0-9]/g, ''); // Allow only numbers
        setOtp(newOtp);

        // Move focus to next input if a digit is entered
        if (text && index < 3) {
            inputRefs.current[index + 1]?.focus();
            setActiveInput(index + 1);
        } else if (!text && index > 0) {
            // Move focus back if deleted
            inputRefs.current[index - 1]?.focus();
            setActiveInput(index - 1);
        }
    };

    // Handle paste (supports pasting 4-digit code)
    const handlePaste = (text: string) => {
        const pastedOtp = text.replace(/[^0-9]/g, '').slice(0, 4).split('');
        const newOtp = ['', '', '', ''];
        for (let i = 0; i < 4 && i < pastedOtp.length; i++) {
            newOtp[i] = pastedOtp[i];
        }
        setOtp(newOtp);
        if (pastedOtp.length >= 4) {
            inputRefs.current[3]?.focus();
            setActiveInput(3);
        }
    };

    // Handle form submission
    const handleVerify = () => {
        const otpCode = otp.join('');
        if (otpCode.length === 4) {
            console.log('OTP verified:', otpCode);
            // Add your OTP verification logic here (e.g., API call)
            router.push('/(auth)'); // Navigate back to login after success
        } else {
            console.log('Please enter a 4-digit OTP');
        }
    };

    // Focus the first input on mount
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
                        <Ionicons name="shield-checkmark" size={40} color="#00B8D4" className="mx-auto" />
                        <Text className="text-3xl font-bold text-center text-gray-800 mt-2">Verify OTP</Text>
                        <Text className="text-center text-gray-500 mt-1">Enter the 4-digit code sent to your email</Text>
                    </View>

                    <View className="flex-row justify-between mb-6">
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => {
                                    if (ref) {
                                        inputRefs.current[index] = ref; // Assign ref only if not null
                                    }
                                }}
                                className={`w-20 h-20 text-center text-2xl font-bold text-gray-800 bg-gray-100 rounded-lg ${activeInput === index ? 'border-2 border-cyan-200' : ''}`}
                                value={digit}
                                onChangeText={(text) => {
                                    // If user pastes multiple digits, handle as paste
                                    if (text.length > 1) {
                                        handlePaste(text);
                                    } else {
                                        handleChange(text, index);
                                    }
                                }}
                                maxLength={1}
                                keyboardType="numeric"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        className=" mt-6 py-3 rounded-lg border border-gray-100 bg-cyan-400"
                        onPress={handleVerify}
                    >
                        <Text className="text-white text-center text-lg font-semibold">Verify OTP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="mt-4" onPress={() => router.push('/(auth)/ForgotPassword')}>
                        <Text className="text-center text-cyan underline">Resend Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="mt-2" onPress={() => router.push('/(auth)')}>
                        <Text className="text-center text-cyan underline">Back to Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default OTPScreen;