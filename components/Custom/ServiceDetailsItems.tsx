import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from 'react-i18next';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import PlaceIcon from './PlaceIcon';

const iconComponents = {
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    MaterialIcons,
    Ionicons,
};

export default function ServiceDetailsItems({ item }: any) {
    const { t } = useTranslation()
    const { iconType, iconName, iconColor } = item || {};

    // Get the right icon component
    const IconComponent = iconType ? (iconComponents as any)[iconType] : null;
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
                console.log(photo)
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    return (
        <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
                <PlaceIcon>
                    {IconComponent && iconName ? (
                        <IconComponent name={iconName} size={24} color={iconColor || "#000"} />
                    ) : null}
                </PlaceIcon>
                <View className="ml-2 flex-1">
                    <Text className="text-lg font-bold">{item?.name || "unknown task"}</Text>
                    <Text className="text-[#818181]">
                        {item?.takenTime}/{item?.targetTime}
                    </Text>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={() => pickImage()} >
                <View className="flex-row items-center gap-2 bg-gray-100/80 py-2 px-3 rounded-xl">
                    <Ionicons name="camera" size={18} color="#00B8D4" />
                    <Text className="text-[#00B8D4] text-lg font-bold">{t("calendar.services.add")}</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}
