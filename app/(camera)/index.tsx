import { RootState } from '@/redux/store'
import { Ionicons } from '@expo/vector-icons'
import { useCameraPermissions } from 'expo-camera'
import * as ImagePicker from "expo-image-picker"
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

const Index = () => {
    const insets = useSafeAreaInsets()
    const { t } = useTranslation()
    const router = useRouter()
    const [permission, requestPermission] = useCameraPermissions();
    const steps = useSelector((state: RootState) => state.step)

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use correct enum for images
                allowsEditing: true,
                quality: 1,
            });

            console.log(result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const photo = result.assets[0];
                router.push({
                    pathname: "/View",
                    params: {
                        uri: photo.uri,
                        width: String(photo.width),
                        height: String(photo.height),
                        format: photo.mimeType ? photo.mimeType.split('/')[1] : '', // Extracts 'jpeg' from 'image/jpeg' or empty string if undefined
                    },
                });
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };
    return (
        <SafeAreaView
            className="flex-1 bg-white items-center justify-start px-8 gap-8"
            style={{
                // paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}
        >
            {/* Top left close button */}
            <View
                className=" flex-row items-center justify-between w-full p-3 rounded-md bg-white"
                style={{
                    top: insets.top,
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 1.5, // <-- Android shadow
                }}
            >
                <TouchableOpacity onPress={() => router.navigate("/(tabs)")}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
                <View className="items-center justify-center">
                    <Text className="text-gray-900 font-bold text-lg">{steps.stepName}</Text>
                    <Text className="text-gray-500">Photo Records</Text>
                </View>
                <View></View>
            </View>

            <View
                style={{
                    top: insets.top,
                    backgroundColor: "#fff",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 4, // works on Android
                }}
                className="w-full items-center justify-center px-5 py-8 rounded-xl"
            >

                {/* Center content */}
                <Ionicons name="camera" size={40} color="#999" className="mb-4" />
                <Text className="text-4xl font-[900] text-gray-800 mb-2">{t("actions.designComplete")}</Text>
                <Text className="text-gray-500 text-xl font-bold mt-2 mb-6">{t("actions.takePhoto")}?</Text>

                <View className='flex-row items-center justify-center gap-4 mt-4' style={{ marginTop: 16 }}>
                    {/* Buttons */}
                    <TouchableOpacity onPress={() => {
                        if (permission?.granted) {
                            router.push("/Camera")
                        } else {
                            requestPermission()
                        }
                    }} className="bg-[#00B8D430] px-8 py-5 rounded-lg flex-row items-center gap-3">
                        <Ionicons name="camera" size={24} color="#00B8D4" />
                        <Text className="text-[#00B8D4] text-lg font-semibold ">{t("actions.takePhoto")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        pickImage()
                    }} className="bg-[#baf6ff6e] px-8 py-5 rounded-lg flex-row items-center gap-3">
                        <Ionicons name="images" size={24} color="#00B8D4" />
                        <Text className="text-[#00B8D4] text-lg font-semibold ">Library</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Index
