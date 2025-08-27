import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation()
  return (

    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#00B8D4",
        tabBarInactiveTintColor: "#999",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#fff',
          height: 100,
          paddingBottom: 20,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",                   // iOS shadow
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 10,                         // Android shadow
        },
        tabBarIconStyle: {
          marginBottom: 0,                       // adjust icon position
        },
        tabBarLabelStyle: {
          fontSize: 12,                          // label size
          fontWeight: "600",
          marginBottom: 5,
        },
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: t("calendar.tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="timer-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Calender"
        options={{
          title: t("calendar.tabs.calendar"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Analytics"
        options={{
          title: t("calendar.tabs.analytics"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: t("calendar.tabs.settings"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
