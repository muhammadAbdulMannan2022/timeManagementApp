import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../context/languageContext';

interface LanguageModalProps {
    visible: boolean;
    onClose: () => void;
}

const languages = [
    { code: 'zh-cn', name: '简体中文', flag: '🇨🇳' },
    { code: 'zh-tw', name: '繁體中文', flag: '🇹🇼' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'pt-br', name: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'es-mx', name: 'Español (México)', flag: '🇲🇽' },
    { code: 'en-ca', name: 'English (Canada)', flag: '🇨🇦' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

const LanguageModal: React.FC<LanguageModalProps> = ({ visible, onClose }) => {
    const { t, i18n } = useTranslation();
    const { language, changeLanguage } = useLanguage();

    useEffect(() => {
        console.log('LanguageModal language:', i18n.language);
        console.log('Translated settings.languageSettings:', t('settings.languageSettings'));
        console.log('Translated settings.close:', t('settings.close'));
    }, [i18n, t]);

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View className="flex-1 bg-black/40 justify-center items-center">
                <View className="bg-white w-4/5 p-5 rounded-2xl">
                    <Text className="text-xl font-bold mb-3">{t('settings.languageSettings')}</Text>
                    <Text className="text-sm text-gray-500 mb-3">{t('settings.chooseLanguage')}</Text>

                    <ScrollView className="max-h-80">
                        {languages.map((lang) => (
                            <TouchableOpacity
                                key={lang.code}
                                onPress={() => {
                                    console.log('Selected language:', lang.code);
                                    changeLanguage(lang.code as typeof language);
                                    onClose();
                                }}
                                className={`p-2 ${language === lang.code ? 'bg-red-100' : ''}`}
                            >
                                <Text className="text-lg">
                                    {lang.flag} {lang.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity onPress={onClose} className="mt-4 bg-[#00B8D4] rounded-lg p-2">
                        <Text className="text-white text-center">{t('settings.close')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default LanguageModal;