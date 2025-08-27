import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { initReactI18next } from 'react-i18next';

// Import language resources dynamically
import ar from '@/locales/ar.json';
import de from '@/locales/de.json';
import enCa from '@/locales/en-ca.json';
import en from '@/locales/en.json';
import esMx from '@/locales/es-mx.json';
import es from '@/locales/es.json';
import fr from '@/locales/fr.json';
import hi from '@/locales/hi.json';
import it from '@/locales/it.json';
import ja from '@/locales/ja.json';
import ko from '@/locales/ko.json';
import ptBr from '@/locales/pt-br.json';
import ru from '@/locales/ru.json';
import th from '@/locales/th.json';
import vi from '@/locales/vi.json';
import zhCn from '@/locales/zh-cn.json';
import zhTw from '@/locales/zh-tw.json';

// Define the structure of the translation resources
interface TranslationResources {
    settings: {
        settings: string;
        personalizeWorkflow: string;
        totalTargetTime: string;
        expectedTime: string;
        serviceSettings: string;
        unknownTask: string;
        languageSettings: string;
        chooseLanguage: string;
        edit: string;
        pricing: string;
        minutes: string;
        close: string;
        simplifiedChinese: string;
        traditionalChinese: string;
        time: string;
    },
    settingsUpd: {
        enterText: string;
        typeSomething: string;
        setTimer: string;
        cancel: string;
        save: string;
    },
    pricing: {
        tabs: {
            free: string;
            premium: string;
        },
        title: string;
        subtitle: string;
        freePlan: {
            name: string;
            features: {
                timer: string;
                calendar: string;
                calendarLimited: string;
                analytics: string;
                pdfExport: string;
            }
        },
        premiumPlan: {
            name: string;
            features: {
                timer: string;
                calendar: string;
                analytics: string;
                pdfExport: string;
            },
            cta: string;
        },
        close: string;
    },
    analytics: {
        averageTime: string;
        overview: string;
        totalClients: string;
        onTimeRate: string;
        overtimeRate: string;
        fastest: string;
        slowest: string;
        stepAnalysis: string;
        completionTimeTrend: string;
        serviceDay: string;
        services: string;
    },
    calendar: {
        title: string;
        subtitle: string;
        processes: string;
        clients: string;
        noSteps: string;
        gradientTab: {
            title: string;
            subtitle: string;
        }
    }
}

const resources: Record<string, { translation: TranslationResources }> = {
    en: { translation: en },
    'zh-cn': { translation: zhCn },
    'zh-tw': { translation: zhTw },
    es: { translation: es },
    ja: { translation: ja },
    fr: { translation: fr },
    de: { translation: de },
    hi: { translation: hi },
    ru: { translation: ru },
    ko: { translation: ko },
    'pt-br': { translation: ptBr },
    it: { translation: it },
    ar: { translation: ar },
    'es-mx': { translation: esMx },
    'en-ca': { translation: enCa },
    th: { translation: th },
    vi: { translation: vi },
    'zh-CN': { translation: zhCn }, // Alias for zh-cn
    'zh-Hans': { translation: zhCn }, // Alias for zh-cn
    'zh-TW': { translation: zhTw }, // Alias for zh-tw
    'zh-Hant': { translation: zhTw }, // Alias for zh-tw
};

// Declare the module for i18next to provide type safety
declare module 'i18next' {
    interface CustomTypeOptions {
        resources: TranslationResources;
    }
}

const supportedLocales = [
    'en',
    'zh-cn',
    'zh-tw',
    'es',
    'ja',
    'fr',
    'de',
    'hi',
    'ru',
    'ko',
    'pt-br',
    'it',
    'ar',
    'es-mx',
    'en-ca',
    'th',
    'vi',
    'zh-CN',
    'zh-Hans',
    'zh-TW',
    'zh-Hant',
] as const;
type SupportedLocale = typeof supportedLocales[number];

const STORAGE_KEY = '@app_language';

const getStoredLanguage = async (): Promise<SupportedLocale | null> => {
    try {
        const storedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
        return storedLanguage && supportedLocales.includes(storedLanguage as SupportedLocale)
            ? (storedLanguage as SupportedLocale)
            : null;
    } catch (error) {
        console.error('Error reading stored language:', error);
        return null;
    }
};

const initialLocale = Localization.getLocales()[0].languageTag;
const normalizedLocale = supportedLocales.find((locale) =>
    initialLocale.toLowerCase().startsWith(locale.toLowerCase())
) || 'en';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: normalizedLocale,
        fallbackLng: 'en',
        supportedLngs: supportedLocales,
        interpolation: {
            escapeValue: false,
        },
    })
    .then(async () => {
        const storedLanguage = await getStoredLanguage();
        if (storedLanguage) {
            await i18n.changeLanguage(storedLanguage);
            console.log('Restored language from storage:', storedLanguage);
        }
        console.log('i18next initialized with resources:', Object.keys(i18n.options.resources || {}));
        console.log('zh-cn settings:', i18n.getResourceBundle('zh-cn', 'translation')?.settings);
        console.log('zh-tw settings:', i18n.getResourceBundle('zh-tw', 'translation')?.settings);
        console.log('Current language:', i18n.language);
    })
    .catch((error) => {
        console.error('i18next initialization failed:', error);
    });

interface LanguageContextType {
    language: SupportedLocale;
    changeLanguage: (lng: SupportedLocale) => void;
}

const LanguageContext = createContext<LanguageContextType>({
    language: normalizedLocale as SupportedLocale,
    changeLanguage: () => { },
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<SupportedLocale>(normalizedLocale as SupportedLocale);

    useEffect(() => {
        const initializeLanguage = async () => {
            const storedLanguage = await getStoredLanguage();
            if (storedLanguage) {
                setLanguage(storedLanguage);
            }
        };
        initializeLanguage();
    }, []);

    const changeLanguage = async (lng: SupportedLocale) => {
        console.log('Changing language to:', lng);
        const normalizedLng = lng.toLowerCase().startsWith('zh-cn') || lng.toLowerCase().startsWith('zh-hans') ? 'zh-cn' :
            lng.toLowerCase().startsWith('zh-tw') || lng.toLowerCase().startsWith('zh-hant') ? 'zh-tw' : lng;
        try {
            await i18n.changeLanguage(normalizedLng);
            await AsyncStorage.setItem(STORAGE_KEY, normalizedLng);
            console.log('Language changed to:', i18n.language);
            console.log('zh-cn settings after change:', i18n.getResourceBundle('zh-cn', 'translation')?.settings);
            console.log('zh-tw settings after change:', i18n.getResourceBundle('zh-tw', 'translation')?.settings);
            setLanguage(normalizedLng as SupportedLocale);
        } catch (error) {
            console.error('Error changing language:', error);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

export default i18n;