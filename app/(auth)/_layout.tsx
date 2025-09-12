import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  const [loading, setLoading] = useState(true); // to wait for token check
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("accessToken");

      if (token) {
        // token exists → redirect to main app
        router.replace("/(tabs)");
      } else {
        // no token → stay on auth stack
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) {
    // optional: show blank screen or splash while checking token
    return null;
  }

  return (
    <SafeAreaProvider className="flex-1 bg-white">
      <Stack screenOptions={{ headerShown: false }}></Stack>
    </SafeAreaProvider>
  );
}
