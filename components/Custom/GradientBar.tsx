import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableOpacity, View } from 'react-native';

export default function GradientTab() {
    return (
        <TouchableOpacity className='mt-8'>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={['#50CDC7', '#00B8D4']}
                style={{ borderRadius: 10 }}
            >
                <View className='flex-row items-center px-5 py-3 gap-7'>
                    <View>
                        <FontAwesome6 name="graduation-cap" size={32} color="#ffffff" />
                    </View>
                    <View className='flex-1 flex-row justify-between items-center'>
                        <View>
                            <Text className='text-2xl text-white font-bold'>Export Protfolio</Text>
                            <Text className='text-xl text-white font-light'>Share with instructor</Text>
                        </View>
                        <View>
                            <FontAwesome name='angle-right' size={32} color="#ffffff" />
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

