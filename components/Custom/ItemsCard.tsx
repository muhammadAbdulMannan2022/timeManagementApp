import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'

export default function ItemsCard({ item }: any) {
    return (
        <TouchableOpacity className='flex-row border border-[#e9e9e9] rounded-xl px-3 py-2 my-2 gap-4 items-center'>
            <View style={{ borderRadius: 20 }} className='h-10 w-10 bg-[#00B8D4] items-center justify-center'>
                <Text className='text-white text-xl'>{item.id}</Text>
            </View>
            <View className='flex-row items-center justify-between flex-1'>
                <View>
                    <Text className='text-xl font-bold'>{item.name}</Text>
                    <Text className='mt-1'>{item.targetTime}</Text>
                </View>
                <View className='justify-end'>
                    <Text>{item.takenTime}</Text>
                    <View className='flex-row items-center gap-2 mt-1 justify-end'>
                        {
                            item.photo.length > 0 && <FontAwesome name='camera' size={14} color="#00B8D4" />
                        }
                        <FontAwesome5 name='angle-right' size={18} color="#E5E5E5" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}