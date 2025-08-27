import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

// Gradient background image (replace with your own or use a local asset)
const backgroundImage = 'https://images.unsplash.com/photo-1505373877841-930c8e1f6922?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80';

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
        <SafeAreaView className="flex-1 ">
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={{ uri: backgroundImage }}
                className="flex-1 justify-center items-center"
                imageStyle={{ opacity: 0.7 }}
            >
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
                            />
                        </View>

                        <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
                            <Ionicons name="lock-closed" size={20} color="#00B8D4" className="mr-2" />
                            <TextInput
                                className="flex-1 text-gray-700 pr-10" // Added padding-right for the icon
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
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
            </ImageBackground>
        </SafeAreaView>
        // </ScrollView>
    );
};

export default LoginScreen;