

import ClientList from "@/components/Custom/tabs/bulkExp";
import SingleExport from "@/components/Custom/tabs/SingleExp";
import { AntDesign, FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router"; // ⬅ if you’re using Expo Router
import { useRef, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";


const ExportPreview = ({ images }: { images: string[] }) => {
    return (
        <View className="flex-1">
            <SingleExport />
            <View className="px-5 mt-5">
                <View className="flex-row items-center gap-5">
                    <AntDesign name="eye" size={24} color="#00B8D4" />
                    <Text className="text-xl font-bold">Export Preview</Text>
                </View>
                <View className="flex-1 mt-10 flex-row justify-between items-center">
                    <View className="items-center justify-center gap-2">
                        <Text className="text-[#00B8D4] text-4xl font-bold">2</Text>
                        <Text className="text-xl text-[#22232470]">2 clients</Text>
                    </View>
                    <View className="items-center justify-center gap-2">
                        <Text className="text-[#00B8D4] text-4xl font-bold">1</Text>
                        <Text className="text-xl text-[#22232470]">2 Photo</Text>
                    </View>
                    <View className="items-center justify-center gap-2">
                        <Text className="text-[#00B8D4] text-4xl font-bold">1</Text>
                        <Text className="text-xl text-[#22232470]">2 Page PDF</Text>
                    </View>
                </View>
            </View>
            <View className="px-5 pt-10">
                <View className="flex-row items-center gap-5 mb-5">
                    <Text className="text-xl font-bold">Photo Preview</Text>
                </View>
                {/* Use scrollView for preview images */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {images.map((item, index) => (
                        <View
                            key={index}
                            className="border rounded-lg border-gray-50 mr-2"
                        >
                            <Image
                                source={{ uri: item }}
                                style={{ width: 200, height: 110, borderRadius: 10 }}
                                resizeMode="cover"
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const tab1Images = ["https://i.ibb.co.com/Y6P39yR/pink-and-purple-long-nail-design-grande.webp",
    "https://i.ibb.co.com/bMQvpbMN/images.jpg",
    "https://i.ibb.co.com/RGkGyfrN/8bd2bf6f60befea2f2ede6bb06ba62f9.jpg",
    "https://i.ibb.co.com/Kz381mng/10-62a144bf0b71456b84041b09d2c643b1.jpg"]

export default function CustomTabs() {
    const pagerRef = useRef<PagerView>(null);
    const [activeTab, setActiveTab] = useState(0);


    const goToPage = (page: number) => {
        pagerRef.current?.setPage(page);
        setActiveTab(page);
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-8 pt-5" style={{ paddingBottom: 85 }}>
            {/* Header */}
            <View className="flex-row gap-5 items-center">
                <TouchableOpacity
                    onPress={() => {
                        router.back(); // if using expo-router
                        console.log("Go back pressed"); // if not using navigation
                    }}
                >
                    <Ionicons name="arrow-back" size={24} />
                </TouchableOpacity>
                <View className="flex-row items-center justify-between flex-1">
                    <View>
                        <Text className="text-2xl font-bold">Export Portfolio</Text>
                        <Text className="text-lg">Share with instructor</Text>
                    </View>
                    <TouchableOpacity className="flex-row items-center gap-2 bg-[#00B8D4AB] px-3 py-3 rounded-lg">
                        <FontAwesome6 name="file-export" size={18} color="#ffffff" />
                        <Text className="text-white">Export</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Custom Tab Bar */}
            <View className="flex-row m-3 p-1">
                {/* Tab 1 */}
                <TouchableOpacity
                    onPress={() => goToPage(0)}
                    className={`flex-1 flex-row items-center justify-center gap-3 py-3 rounded-xl ${activeTab === 0 ? "border-2 border-gray-100" : "border-0"
                        }`}
                >
                    <MaterialIcons
                        name="offline-bolt"
                        size={24}
                        color={activeTab === 0 ? "#00B8D4" : "#000000"}
                    />
                    <Text
                        className={`text-center font-semibold ${activeTab === 0 ? "text-black" : "text-gray-600"
                            }`}
                    >
                        Quick Export
                    </Text>
                </TouchableOpacity>

                {/* Tab 2 */}
                <TouchableOpacity
                    onPress={() => goToPage(1)}
                    className={`flex-1 flex-row items-center justify-center gap-3 py-3 rounded-xl ${activeTab === 1 ? "border-2 border-gray-100" : "border-0"
                        }`}
                >
                    <MaterialIcons
                        name="settings"
                        size={24}
                        color={activeTab === 1 ? "#00B8D4" : "#000000"}
                    />
                    <Text
                        className={`text-center font-semibold ${activeTab === 1 ? "text-black" : "text-gray-600"
                            }`}
                    >
                        Settings
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Pager */}
            <PagerView
                ref={pagerRef}
                style={{ flex: 1 }}
                initialPage={0}
                onPageSelected={(e) => setActiveTab(e.nativeEvent.position)}
            >
                {/* Tab 1 Content */}
                <View key="1" style={{ flex: 1 }}>
                    <ExportPreview images={tab1Images} />
                </View>

                {/* Tab 2 Content */}
                <View key="2" style={{ flex: 1 }}>
                    <ClientList />
                </View>
            </PagerView>
        </SafeAreaView>
    );
}


