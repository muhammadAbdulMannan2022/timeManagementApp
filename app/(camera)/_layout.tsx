import { Tabs } from 'expo-router'

export default function Layout() {
    return <Tabs screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }
    }} >
        <Tabs.Screen name='index' options={{ headerShown: false }} />
    </Tabs>
}