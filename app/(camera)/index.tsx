import { Ionicons } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const Index = () => {
    const insets = useSafeAreaInsets()

    return (
        <SafeAreaView
            className="flex-1 bg-white items-center justify-start px-8"
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}
        >
            {/* Top left close button */}
            <View
                className="absolute flex-row items-center justify-between w-full p-3 rounded-md bg-white"
                style={{
                    top: insets.top,
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 1.5, // <-- Android shadow
                }}
            >
                <TouchableOpacity>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
                <View className="items-center justify-center">
                    <Text className="text-gray-900 font-bold text-lg">Removal</Text>
                    <Text className="text-gray-500">Photo Records</Text>
                </View>
                <View></View>
            </View>

            <View
                style={{
                    top: insets.top,
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 1.5, // <-- Android shadow
                }}
                className='w-full items-center justify-center px-5 py-8 rounded-xl'
            >

                {/* Center content */}
                <Ionicons name="camera" size={40} color="#999" className="mb-4" />
                <Text className="text-2xl font-[900] text-gray-800 mb-2">Design Complete</Text>
                <Text className="text-gray-500 mb-6">Take photo?</Text>

                <View className='flex-row items-center justify-center gap-4'>
                    {/* Buttons */}
                    <TouchableOpacity className="bg-blue-500 px-8 py-3 rounded-lg flex-row items-center">
                        <Ionicons name="camera" size={16} color="#fff" />
                        <Text className="text-white font-semibold ml-2">Take Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-blue-400 px-8 py-3 rounded-lg flex-row items-center">
                        <Ionicons name="images" size={16} color="#fff" />
                        <Text className="text-white font-semibold ml-2">Library</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Index
