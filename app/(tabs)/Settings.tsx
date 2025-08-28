import PlaceIcon from '@/components/Custom/PlaceIcon';
import SettingsUpdate from '@/components/Custom/SettingsUpdate';

import LanguageModal from '@/components/Modals/LanguageModal';
import PricingModal from '@/components/Modals/PriceingModal';
import { RootState } from '@/redux/store';
import { AntDesign, Entypo, FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

// Define TypeScript interfaces
interface Step {
    id?: number;
    name?: string;
    takenTime?: string;
    targetTime?: string;
    iconType?: keyof typeof iconComponents;
    iconName?: string;
    iconColor?: string;
}

interface Process {
    steps: Step[];
}

// Define icon components type
type IconComponentType = typeof FontAwesome | typeof FontAwesome5 | typeof FontAwesome6 | typeof MaterialIcons | typeof Ionicons | typeof MaterialCommunityIcons | typeof Entypo | typeof AntDesign;

const iconComponents: Record<string, IconComponentType> = {
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    MaterialIcons,
    Ionicons,
    MaterialCommunityIcons,
    Entypo,
    AntDesign
};

const Settings: React.FC = () => {
    const { t, i18n } = useTranslation();
    const stepData = useSelector((state: RootState) => state.clientRecords.processes[0] as Process);
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const [pricingModalVisible, setPricingModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<any>(null)

    const router = useRouter();

    // Calculate total target time (example, adjust based on your data)
    const totalTargetTime = '150';

    useEffect(() => {
        console.log('Current i18n language in Settings:', i18n.language);
        const onLanguageChange = () => {
            console.log('Language changed to:', i18n.language);
        };
        i18n.on('languageChanged', onLanguageChange);
        return () => {
            i18n.off('languageChanged', onLanguageChange);
        };
    }, [i18n, t]);
    const onIconpress = (icon: any) => {
        console.log(icon)
    }

    return (
        <View className="flex-1 bg-white" key={i18n.language}>
            <SafeAreaView className="flex-1" style={{ paddingBottom: 70 }}>
                <ScrollView className="flex-1 px-5">
                    <View className="gap-5 items-start">
                        <TouchableOpacity
                            onPress={() => {
                                router.back();
                                console.log('Go back pressed');
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <View className="flex-row items-center gap-3">
                            <Ionicons name="settings" size={30} color="#00B8D4" />
                            <View>
                                <Text className="text-2xl font-bold">{t('settings.settings')}</Text>
                                <Text className="text-sm">{t('settings.personalizeWorkflow')}</Text>
                            </View>
                        </View>
                        {/* Total */}
                        <View className="bg-[#00B8D4] w-full rounded-xl p-5 flex-row gap-6 items-center">
                            <View className="bg-[#5CE9FF9E] items-center justify-center w-20 h-20 rounded-full">
                                <FontAwesome5 name="font-awesome-flag" size={34} color="#ffffff" />
                            </View>
                            <View>
                                <Text className="text-white text-lg font-semibold">{t('settings.totalTargetTime')}</Text>
                                <Text className="text-white text-2xl font-extrabold">
                                    {totalTargetTime} {t('settings.minutes') || 'Minutes'}
                                </Text>
                                <Text className="text-white text-lg font-semibold">{t('settings.expectedTime')}</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center gap-5 mt-5">
                            <MaterialCommunityIcons name="heart-flash" size={28} color="#00B8D4" />
                            <Text className="text-2xl font-bold">{t('settings.serviceSettings')}</Text>
                        </View>

                        {
                            isEditing ? <View className='flex-1 w-full gap-4'>
                                <SettingsUpdate onIconPress={onIconpress} setIsEditing={setIsEditing} setIsEditingId={setEditingId} />
                            </View> : <View className='flex-1 w-full gap-4'>
                                <View>
                                    {stepData.steps.map((item: Step) => {
                                        const IconComponent = item.iconType ? iconComponents[item.iconType] : null;
                                        return (
                                            <View
                                                key={item.id?.toString() || item.name}
                                                className="flex-row items-center justify-between border border-gray-300 rounded-xl mb-5 w-full pe-5"
                                            >
                                                <View className="flex-row items-center">
                                                    <PlaceIcon>
                                                        {IconComponent && item.iconName ? (
                                                            <IconComponent name={item.iconName} size={24} color={item.iconColor || '#000'} />
                                                        ) : null}
                                                    </PlaceIcon>
                                                    <View className="ml-2">
                                                        <Text className="text-xl font-bold">{item.name || t('settings.unknownTask')}</Text>
                                                        <Text className="font-semibold text-gray-600">
                                                            {t("settings.time")}: {item.targetTime || '00:00:00'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <TouchableWithoutFeedback onPress={() => {
                                                    setEditingId(item)
                                                    setIsEditing(true)
                                                }}>
                                                    <View className="bg-[#00B8D4] px-3 py-2 rounded-lg">
                                                        <Text className="text-white text-lg">{t('settings.edit') || 'Edit'}</Text>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        );
                                    })}
                                </View>
                                <TouchableOpacity
                                    className="flex-row items-center gap-4 border border-gray-200 rounded-xl w-full p-4"
                                    onPress={() => setLanguageModalVisible(true)}
                                >
                                    <Ionicons name="language" size={24} color="#00B8D4" />
                                    <Text className="font-semibold text-gray-600 text-2xl">{t('settings.languageSettings')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-row items-center gap-4 border border-gray-200 rounded-xl mb-5 w-full p-4"
                                    onPress={() => setPricingModalVisible(true)}
                                >
                                    <FontAwesome5 name="bolt" size={24} color="#00B8D4" />
                                    <Text className="font-semibold text-gray-600 text-2xl">{t('settings.pricing')}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    <LanguageModal visible={languageModalVisible} onClose={() => setLanguageModalVisible(false)} />
                    <PricingModal visible={pricingModalVisible} onClose={() => setPricingModalVisible(false)} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default Settings;