import { useUpdateSubscriptionMutation } from "@/redux/apis/appSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Purchases from "react-native-purchases";

const PremiumPlanPage: React.FC = () => {
  const { t } = useTranslation();
  const [offerings, setOfferings] = useState<any>(null);
  const [update, isLoading] = useUpdateSubscriptionMutation();

  useEffect(() => {
    async function loadOfferings() {
      const data = await Purchases.getOfferings();
      setOfferings(data);
      console.log("\n\n\n\n", data, "\n\n\n\n");
    }
    loadOfferings();
  }, []);

  async function getOfferings() {
    try {
      const offerings = await Purchases.getOfferings();
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        console.log("All offerings:\n", JSON.stringify(offerings, null, 2));

        // 👇 specifically check for $rc_annual
        const annual = offerings.current.availablePackages.find(
          (pkg) => pkg.identifier === "$rc_annual"
        );

        if (annual) {
          console.log(
            "✅ Found $rc_annual package:\n",
            JSON.stringify(annual, null, 2)
          );
        } else {
          console.log("❌ No $rc_annual package found.");
        }
      }
    } catch (err) {
      console.error("Error fetching offerings:", err);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, alignItems: "center" }}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text className="text-xl font-bold text-center">
        {t("pricing.title")}
      </Text>
      <Text className="text-gray-500 text-center mb-5">
        {t("pricing.subtitle")}
      </Text>

      {/* Illustration */}
      <Image
        source={require("@/assets/bg/premium.png")}
        style={{
          width: 100,
          height: 100,
          resizeMode: "contain",
          marginBottom: 10,
        }}
      />

      {/* Plan Title */}
      <View className="flex-row items-center gap-2 mb-5">
        <MaterialCommunityIcons name="diamond" size={24} color="red" />
        <Text className="text-lg font-bold text-red-500">
          {t("pricing.premiumPlan.name")}
        </Text>
      </View>

      {/* Feature List */}
      <View
        className="bg-white rounded-2xl shadow p-5 mb-5"
        style={{ width: "100%" }}
      >
        {[
          {
            name: t("pricing.premiumPlan.features.timer"),
            value: (
              <MaterialCommunityIcons name="check" size={20} color="green" />
            ),
          },
          {
            name: t("pricing.premiumPlan.features.calendar"),
            value: (
              <MaterialCommunityIcons name="check" size={20} color="green" />
            ),
          },
          {
            name: t("pricing.premiumPlan.features.analytics"),
            value: (
              <MaterialCommunityIcons name="check" size={20} color="green" />
            ),
          },
          {
            name: t("pricing.premiumPlan.features.pdfExport"),
            value: (
              <MaterialCommunityIcons name="check" size={20} color="green" />
            ),
          },
        ].map((item, idx) => (
          <View
            key={idx}
            className={`flex-row justify-between items-center ${idx !== 3 ? "mb-3 border-b border-gray-200 pb-4" : ""}`}
          >
            <Text className="text-gray-700">{item.name}</Text>
            {typeof item.value === "string" ? (
              <Text className="text-gray-500">{item.value}</Text>
            ) : (
              item.value
            )}
          </View>
        ))}
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        className="bg-[#00B8D4] w-full py-3 rounded-xl flex-row justify-center items-center"
        onPress={async () => {
          try {
            if (!offerings?.current)
              return console.log("Offerings not loaded yet");

            // Find the $rc_annual package
            console.log("\n\n\n\n", offerings, "kkkkkkkkkkkkkkkkkkkkkkk");
            const annual = offerings.current.availablePackages.find(
              (pkg: any) => pkg.identifier === "$rc_annual"
            );

            if (!annual) return console.log("❌ $rc_annual not found");

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
            const res = await update({ is_subscribed: true });
            console.log(res);
          } catch (err: any) {
            if (!err.userCancelled) {
              console.error("Purchase failed:", err);
            } else {
              console.log("Purchase cancelled by user");
            }
          }
        }}
      >
        <Text className="text-white text-lg font-bold">
          {t("pricing.premiumPlan.cta")}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PremiumPlanPage;
