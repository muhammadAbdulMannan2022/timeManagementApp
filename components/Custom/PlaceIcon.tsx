import { Image, View } from 'react-native'

export default function PlaceIcon({ children, className }: any) {
    return (
        <View className={`w-24 h-24 rounded-full justify-center items-center overflow-hidden relative ${className}`}>
            {/* Radial gradient background */}
            <Image
                source={require("@/assets/icons/radial.png")}
                className="absolute inset-0 w-full h-full"
                resizeMode="cover"
            />
            {/* Icon on top */}
            {children}
        </View>
    )
}