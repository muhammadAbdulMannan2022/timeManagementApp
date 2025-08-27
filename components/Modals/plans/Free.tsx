import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
// Assume you are using i18n (react-i18next or similar)
import { useTranslation } from "react-i18next";

const FreePlanPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <ScrollView
            contentContainerStyle={{ padding: 20, alignItems: "center" }}
            showsVerticalScrollIndicator={false}
        >
            {/* Title */}
            <Text className="text-xl font-bold text-center">{t("pricing.title")}</Text>
            <Text className="text-gray-500 text-center mb-5">{t("pricing.subtitle")}</Text>

            {/* Illustration */}
            <Image
                source={require("@/assets/bg/free.png")}
                style={{ width: 100, height: 100, resizeMode: "contain", marginBottom: 10 }}
            />

            {/* Plan Title */}
            <View className="flex-row items-center gap-2 mb-5">
                <MaterialCommunityIcons name="fire" size={24} color="red" />
                <Text className="text-lg font-bold text-red-500">{t("pricing.freePlan.name")}</Text>
            </View>

            {/* Feature List */}
            <View className="bg-white rounded-2xl shadow p-5 mb-5 divide-y-2 " style={{ width: "100%" }}>
                {[
                    { name: t("pricing.freePlan.features.timer"), value: <MaterialCommunityIcons name="check" size={20} color="green" /> },
                    { name: t("pricing.freePlan.features.calendar"), value: t("pricing.freePlan.features.calendarLimited") },
                    { name: t("pricing.freePlan.features.analytics"), value: <MaterialCommunityIcons name="close" size={20} color="red" /> },
                    { name: t("pricing.freePlan.features.pdfExport"), value: <MaterialCommunityIcons name="close" size={20} color="red" /> },
                ].map((item, idx) => (
                    <View
                        key={idx}
                        className={`flex-row justify-between items-center gap-5 ${idx !== 3 ? "mb-3 border-b border-gray-200 pb-4" : ""}`}
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

            {/* Upgrade Button (commented out for now) */}
            {/* <TouchableOpacity className="bg-[#00B8D4] w-full py-3 rounded-xl flex-row justify-center items-center">
                <MaterialCommunityIcons name="diamond" size={20} color="yellow" />
                <Text className="text-white text-lg font-bold ml-2">{t("pricing.premiumPlan.cta")}</Text>
            </TouchableOpacity> */}
        </ScrollView>
    );
};

export default FreePlanPage;
