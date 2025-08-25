import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function SingleExport() {
    const [selected, setSelected] = useState("today");

    const options = [
        {
            key: "today",
            title: "Today's Work",
            subtitle: "2 client",
            icon: { name: "calendar-today", color: "#00B8D4" },
        },
        {
            key: "recent",
            title: "Recent Work",
            subtitle: "3 client (yesterday + today)",
            icon: { name: "history", color: "#00B8D4" },
        },
        {
            key: "week",
            title: "This week’s work",
            subtitle: "3 client (past 7 days)",
            icon: { name: "calendar-month", color: "#00B8D4" },
        },
    ];

    return (
        <View className="flex-1 bg-white p-4">
            <Text className="text-lg font-bold mb-4">Select Export Range</Text>

            {options.map((item) => {
                const isActive = selected === item.key;
                return (
                    <TouchableOpacity key={item.key} onPress={() => {
                        setSelected(item.key)
                    }} className="flex-row my-2 border px-4 py-4 items-center rounded-lg " style={{ borderColor: isActive ? "#00B8D4" : "#68686870" }}>
                        {/* Left side */}
                        <View className="flex-row items-center gap-3 flex-1">
                            <MaterialIcons
                                name={item.icon.name as any}
                                size={24}
                                color={item.icon.color}
                            />
                            <View className="flex-1">
                                <Text
                                    className={`font-semibold ${isActive ? "text-[#00B8D4]" : "text-black"
                                        }`}
                                >
                                    {item.title}
                                </Text>
                                <Text className="text-gray-500 text-sm">{item.subtitle}</Text>
                            </View>
                        </View>

                        {/* Checkmark if active */}
                        {isActive && (
                            <MaterialIcons name="check-circle" size={22} color="#00B8D4" />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
