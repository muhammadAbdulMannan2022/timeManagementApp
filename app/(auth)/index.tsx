import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

// Gradient background image (replace with your own or use a local asset)
const backgroundImage = 'https://i.ibb.co.com/KjDXZW8L/teenager-pointing-to-laptop-28273841.jpg';

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = () => {
        console.log('Login attempted with:', { email, password });
        // Add your login logic here
        router.push('/(tabs)');
    };

    return (
        // <ScrollView className='flex-1'>
        <ImageBackground
            source={{ uri: backgroundImage }}
            className="flex-1 bg-white"
            imageStyle={{ opacity: 0.7 }}
        >
            <SafeAreaView className="flex-1  justify-center items-center">
                <StatusBar barStyle="light-content" />

                <View className="bg-white/90 p-8 rounded-2xl w-11/12 max-w-md shadow-lg">
                    <View className="mb-6">
                        <Ionicons name="lock-closed" size={40} color="#00B8D4" className="mx-auto" />
                        <Text className="text-3xl font-bold text-center text-gray-800 mt-2">Welcome Back</Text>
                        <Text className="text-center text-gray-500 mt-1">Sign in to continue</Text>
                    </View>

                    <View className="space-y-4 gap-4">
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
                                placeholderTextColor="#000000"
                            />
                        </View>

                        <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
                            <Ionicons name="lock-closed" size={20} color="#00B8D4" className="mr-2" />
                            <TextInput
                                className="flex-1 text-black pr-10" // Added padding-right for the icon
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
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#00B8D4"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-cyan mt-6 py-3 rounded-lg border border-gray-100 bg-cyan-400"
                        onPress={handleLogin}
                    >
                        <Text className="text-white text-center text-lg font-semibold">Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { router.push("/(auth)/ForgotPassword") }} className="mt-2">
                        <Text className="text-center text-cyan underline">Forgot Password?</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-gray-500">Don’t have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/Signup')}>
                            <Text className="text-cyan font-semibold">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <StatusBar barStyle="dark-content" />
            </SafeAreaView>
        </ImageBackground>
        // </ScrollView>
    );
};

export default LoginScreen;