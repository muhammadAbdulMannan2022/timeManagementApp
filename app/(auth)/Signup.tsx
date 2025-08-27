import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Gradient background image (replace with your own or use a local asset)
const backgroundImage = 'https://images.unsplash.com/photo-1505373877841-930c8e1f6922?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80';

const SignUpScreen: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const handleSignUp = () => {
        if (password !== confirmPassword) {
            console.log('Passwords do not match');
            return;
        }
        console.log('Sign-up attempted with:', { name, email, password });
        // Add your sign-up logic here (e.g., API call)
        router.push('/(auth)'); // Navigate to login after success
    };

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
                        <Ionicons name="person-add" size={40} color="#00B8D4" className="mx-auto" />
                        <Text className="text-3xl font-bold text-center text-gray-800 mt-2">Create Account</Text>
                        <Text className="text-center text-gray-500 mt-1">Sign up to get started</Text>
                    </View>

                    <View className="space-y-4 gap-3">
                        <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
                            <Ionicons name="person" size={20} color="#00B8D4" className="mr-2" />
                            <TextInput
                                className="flex-1 text-gray-700"
                                placeholder="Full Name"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                                autoCorrect={false}
                            />
                        </View>

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
                                className="flex-1 text-gray-700 pr-10"
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

                        <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
                            <Ionicons name="lock-closed" size={20} color="#00B8D4" className="mr-2" />
                            <TextInput
                                className="flex-1 text-gray-700 pr-10"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                className="absolute right-3"
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#00B8D4"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-cyan mt-6 py-3 rounded-lg border border-gray-100 bg-cyan-400"
                        onPress={handleSignUp}
                    >
                        <Text className="text-white text-center text-lg font-semibold">Sign Up</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-gray-500">Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)')}>
                            <Text className="text-cyan font-semibold">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default SignUpScreen;