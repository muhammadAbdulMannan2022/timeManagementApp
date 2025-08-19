// ViewImage.tsx
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewImage() {
    const router = useRouter();
    const { uri, width, height, format } = useLocalSearchParams<{
        uri: string;
        width: string;
        height: string;
        format: string;
    }>();

    const handleBack = () => router.back();
    const handleSave = () => console.log("Save pressed:", uri);

    return (
        <View className='flex-1'>
            <SafeAreaView className="flex-1 pb-8">
                {/* Header */}
                <View className="flex-row items-center p-4  shadow-md justify-between px-10">
                    <TouchableOpacity onPress={handleBack}>
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="ml-4 text-black text-xl font-semibold">Selected Picture</Text>
                    <View />
                </View>

                {/* Image */}
                <View className="flex-1 items-center justify-center">
                    {uri ? (
                        <Image
                            source={{ uri }}
                            className="w-[90%] h-[80%] rounded-xl bg-gray-900"
                            style={{ resizeMode: "contain" }}
                        />
                    ) : (
                        <Text className="text-white">No image found</Text>
                    )}
                </View>

                {/* Save Button */}
                <View className="p-4 items-center justify-center">
                    <TouchableOpacity
                        onPress={handleSave}
                        className="flex-row items-center justify-center bg-[#00B8D430] py-4 px-5 rounded-xl shadow-md gap-3"
                    >
                        <Entypo name="camera" size={24} color="#00B8D4" />
                        <Text className="text-[#00B8D4] text-lg font-semibold ">
                            Save Photo
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

        </View>
    );
}
