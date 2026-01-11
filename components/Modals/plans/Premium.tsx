import { useUpdateSubscriptionMutation } from "@/redux/apis/appSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Purchases from "react-native-purchases";

const PremiumPlanPage: React.FC = () => {
  const { t } = useTranslation();
  const [offerings, setOfferings] = useState<any>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(true);
  const [update, isLoading] = useUpdateSubscriptionMutation();

  useEffect(() => {
    async function loadOfferings() {
      try {
        setIsLoadingOfferings(true);
        const data = await Purchases.getOfferings();
        setOfferings(data);
        console.log("\n\n\n\n", data, "\n\n\n\n");
      } catch (e) {
        console.error("Error loading offerings", e);
      } finally {
        setIsLoadingOfferings(false);
      }
    }
    loadOfferings();
  }, []);

  const handlePurchase = async () => {
    if (isPurchasing) return;
    
    if (!offerings?.current) {
        Alert.alert("Error", "Products are not loaded yet. Please check your internet connection and try again.");
        return;
    }

    setIsPurchasing(true);

    try {
      // Find the $rc_annual package
      // If you are not sure about the identifier, you can log offerings.current to see what's available
      const annual = offerings.current.availablePackages.find(
        (pkg: any) => pkg.identifier === "$rc_annual"
      );

      // Fallback: try to find any package if specific one isn't found, or just alert
      if (!annual) {
          // Attempt to find any available package as a fallback or alert the user
          const anyPackage = offerings.current.availablePackages[0];
          if (anyPackage) {
             console.log("Specific package not found, falling back to:", anyPackage.identifier);
             // Verify if you want to allow this fallback
             // const purchaseMade = await Purchases.purchasePackage(anyPackage);
             Alert.alert("Error", "Premium plan not found. Please contact support.");
             return; 
          } else {
             Alert.alert("Error", "No subscriptions available at this moment.");
             return;
          }
      }

      console.log("Purchasing:", annual.identifier);

      // Trigger the purchase
      const purchaseMade = await Purchases.purchasePackage(annual);

      console.log("✅ Purchase successful:", purchaseMade);

      // Optional: check if entitlement is active
      const purchaserInfo = await Purchases.getCustomerInfo();
      const isPremiumActive =
        purchaserInfo.entitlements.active["premium"] ||
        purchaserInfo.entitlements.active["Premium"];
      
      console.log("Premium active:", isPremiumActive);
      
      if (isPremiumActive) {
          await update({ is_subscribed: true });
          Alert.alert("Success", "You are now a Premium member!");
          // Navigation logic could go here if needed, e.g., go back or close modal
      }
      
    } catch (err: any) {
      if (!err.userCancelled) {
        console.error("Purchase failed:", err);
        Alert.alert("Purchase Failed", err.message || "An unknown error occurred.");
      } else {
        console.log("Purchase cancelled by user");
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, alignItems: "center" }}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text className="text-2xl font-extrabold text-center text-gray-900 mt-5">
        {t("pricing.title")}
      </Text>
      <Text className="text-gray-500 text-center mb-8 px-5">
        {t("pricing.subtitle")}
      </Text>

      {/* Main Content Container */}
      <View className="w-full relative">
        
        {/* Best Value Badge */}
        <View className="absolute -top-3 right-0 left-0 items-center z-10">
             <View className="bg-red-500 px-4 py-1 rounded-full shadow-sm">
                 <Text className="text-white text-xs font-bold uppercase tracking-wider">Best Value</Text>
             </View>
        </View>

        <View className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 pt-10 mb-8 w-full items-center">
            
            {/* Illustration */}
            <Image
                source={require("@/assets/bg/premium.png")}
                style={{
                width: 120,
                height: 120,
                resizeMode: "contain",
                marginBottom: 20,
                }}
            />

            {/* Plan Title */}
            <View className="flex-row items-center gap-2 mb-2">
                <MaterialCommunityIcons name="diamond" size={28} color="#00B8D4" />
                <Text className="text-2xl font-bold text-gray-900">
                {t("pricing.premiumPlan.name")}
                </Text>
            </View>

            {/* Price Display */}
            <View className="items-center mb-6">
                 <View className="flex-row items-start">
                    <Text className="text-xl font-bold text-gray-800 mt-2">$</Text>
                    <Text className="text-5xl font-extrabold text-gray-900">10</Text>
                 </View>
                 <Text className="text-gray-400 text-sm">per year</Text>
            </View>

            {/* Divider */}
            <View className="w-full h-[1px] bg-gray-100 mb-6" />

            {/* Feature List */}
            <View className="w-full gap-4">
                {[
                {
                    name: t("pricing.premiumPlan.features.timer"),
                    icon: "timer-outline",
                },
                {
                    name: t("pricing.premiumPlan.features.calendar"),
                    icon: "calendar-month-outline",
                },
                {
                    name: t("pricing.premiumPlan.features.analytics"),
                    icon: "chart-box-outline",
                },
                {
                    name: t("pricing.premiumPlan.features.pdfExport"),
                    icon: "file-pdf-box",
                },
                ].map((item, idx) => (
                <View
                    key={idx}
                    className="flex-row items-center gap-3"
                >
                    <View className="bg-green-100 p-1 rounded-full">
                         <MaterialCommunityIcons name="check" size={16} color="green" />
                    </View>
                    <Text className="text-gray-700 text-base flex-1 font-medium">{item.name}</Text>
                </View>
                ))}
            </View>
        </View>
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        className={`w-full py-4 rounded-2xl flex-row justify-center items-center shadow-md ${
            isLoadingOfferings || isPurchasing ? "bg-gray-300" : "bg-[#00B8D4]"
        }`}
        onPress={handlePurchase}
        disabled={isLoadingOfferings || isPurchasing}
        style={{
            shadowColor: "#00B8D4",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 8,
        }}
      >
        {isPurchasing || isLoadingOfferings ? (
            <ActivityIndicator color="white" />
        ) : (
            <Text className="text-white text-xl font-bold tracking-wide">
            {t("pricing.premiumPlan.cta")}
            </Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center items-center mt-5 gap-4 mb-5">
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://nimble-sable-b9fe8e.netlify.app/")
          }
        >
          <Text className="text-gray-500 text-xs underline">
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <Text className="text-gray-500 text-xs">|</Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
            )
          }
        >
          <Text className="text-gray-500 text-xs underline">Terms of Use</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PremiumPlanPage;
