import { LanguageProvider } from "@/components/context/languageContext";
import store from "@/redux/store";
// import { DefaultTheme, ThemeProvider } from "";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router"; // Import Slot
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import "react-native-reanimated";
import { Provider } from "react-redux";
import "../global.css";
export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === "ios") {
      Purchases.configure({ apiKey: "appl_zwIrravyMOjGnNRrxujYLlErkwE" });
    } else if (Platform.OS === "android") {
      Purchases.configure({ apiKey: "goog_NrpbuWNNnlvFpYtwFRXxsiUlQLc" });
    }
    getCustomerInfo();
  }, []);

  if (!loaded) {
    return null;
  }

  async function getCustomerInfo() {
    const customerInfo = await Purchases.getCustomerInfo();
    console.log(customerInfo);
  }

  return (
    <LanguageProvider>
      <Provider store={store}>
        <ThemeProvider value={DefaultTheme}>
          <Slot />
          <StatusBar style="dark" />
        </ThemeProvider>
      </Provider>
    </LanguageProvider>
  );
}
