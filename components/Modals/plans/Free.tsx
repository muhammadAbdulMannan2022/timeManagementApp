import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

const FreePlanPage: React.FC = () => {
    return (
        <ScrollView
            contentContainerStyle={{ padding: 20, alignItems: "center" }}
            showsVerticalScrollIndicator={false}
        >
            {/* Title */}
            <Text className="text-xl font-bold text-center">Select plan that help’s grow</Text>
            <Text className="text-gray-500 text-center mb-5">
                Get unlimited steps, advanced analytics
            </Text>

            {/* Illustration */}
            <Image
                source={require("@/assets/bg/free.png")}
                style={{ width: 100, height: 100, resizeMode: "contain", marginBottom: 10 }}
            />

            {/* Plan Title */}
            <View className="flex-row items-center gap-2 mb-5">
                <MaterialCommunityIcons name="fire" size={24} color="red" />
                <Text className="text-lg font-bold text-red-500">Free</Text>
            </View>

            {/* Feature List */}
            <View className="bg-white rounded-2xl shadow p-5 mb-5 divide-y-2 " style={{ width: "100%" }}>
                {[
                    { name: "Timer & Photo Recording", value: <MaterialCommunityIcons name="check" size={20} color="green" /> },
                    { name: "Calender", value: "Today'r records only" },
                    { name: "Analytics", value: <MaterialCommunityIcons name="close" size={20} color="red" /> },
                    { name: "PDF Export", value: <MaterialCommunityIcons name="close" size={20} color="red" /> },
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

            {/* Upgrade Button */}
            {/* <TouchableOpacity className="bg-[#00B8D4] w-full py-3 rounded-xl flex-row justify-center items-center">
                <MaterialCommunityIcons name="diamond" size={20} color="yellow" />
                <Text className="text-white text-lg font-bold ml-2">Upgrade to premium</Text>
            </TouchableOpacity> */}
        </ScrollView>
    );
};

export default FreePlanPage;
