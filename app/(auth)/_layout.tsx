import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
    return (
        <SafeAreaProvider className='flex-1 bg-white'>
            <Stack screenOptions={{ headerShown: false }} >
            </Stack>
        </SafeAreaProvider>
    );
}