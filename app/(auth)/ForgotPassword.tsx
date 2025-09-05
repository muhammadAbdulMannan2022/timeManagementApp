import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Gradient background image (replace with your own or use a local asset)
const backgroundImage = 'https://i.ibb.co.com/KjDXZW8L/teenager-pointing-to-laptop-28273841.jpg';

const ForgotPasswordScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleResetPassword = () => {
        console.log('Password reset requested for:', { email });
        // Add your password reset logic here (e.g., API call to send reset link)
        router.push('/(auth)/Otp'); // Navigate back to login after request
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
                        <Ionicons name="key" size={40} color="#00B8D4" className="mx-auto" />
                        <Text className="text-3xl font-bold text-center text-gray-800 mt-2">Forgot Password</Text>
                        <Text className="text-center text-gray-500 mt-1">Enter your email to reset your password</Text>
                    </View>

                    <View className="space-y-4">
                        <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
                            <Ionicons name="mail" size={20} color="#00B8D4" className="mr-2" />
                            <TextInput
                                className="flex-1 text-gray-700"
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        className=" mt-6 py-3 rounded-lg border border-gray-100 bg-cyan-400"
                        onPress={handleResetPassword}
                    >
                        <Text className="text-white text-center text-lg font-semibold">Send Reset Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="mt-4" onPress={() => router.push('/(auth)')}>
                        <Text className="text-center text-cyan underline">Back to Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;