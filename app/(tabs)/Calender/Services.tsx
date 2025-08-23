import PlaceIcon from '@/components/Custom/PlaceIcon'
import ServiceDetailsItems from '@/components/Custom/ServiceDetailsItems'
import ShowNote from '@/components/Custom/ShowNote'
import { RootState } from '@/redux/store'
import { AntDesign, FontAwesome, Fontisto, Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

function parseToSeconds(time: string): number {
    const [h, m, s] = time.split(':').map(Number)
    return h * 3600 + m * 60 + s
}

export default function Services() {
    const { id, date } = useLocalSearchParams<{ id?: string; date?: string }>()
    const router = useRouter()
    const bottomBarHeight = 85

    // Get selected process
    const process = useSelector((state: RootState) =>
        state.clientRecords.processes.find(p => Number(p.id) === Number(id))
    )

    // All processes by given date
    const processesByDate = useSelector((state: RootState) =>
        state.clientRecords.processes.filter(p => (date ? p.date === date : true))
    )

    // Count photos
    const totalPhotos = processesByDate.reduce(
        (acc, proc) =>
            acc +
            proc.steps.reduce((sAcc, step) => sAcc + (step.photo?.length || 0), 0),
        0
    )

    // Count steps
    const totalSteps = processesByDate.reduce(
        (acc, proc) => acc + proc.steps.length,
        0
    )

    // Count on-time steps
    const onTimeSteps = processesByDate.reduce((acc, proc) => {
        return (
            acc +
            proc.steps.filter(step => {
                const target = parseToSeconds(step.targetTime)
                const taken = parseToSeconds(step.takenTime)
                return taken <= target
            }).length
        )
    }, 0)
    // min max
    const allTakenTimes = processesByDate.flatMap(proc =>
        proc.steps.map(step => parseToSeconds(step.takenTime))
    )
    function formatTime(seconds: number): string {
        const h = String(Math.floor(seconds / 3600)).padStart(2, "0")
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")
        const s = String(seconds % 60).padStart(2, "0")
        return `${h}:${m}:${s}`
    }
    const minTime =
        allTakenTimes.length > 0 ? formatTime(Math.min(...allTakenTimes)) : "--:--:--"
    const maxTime =
        allTakenTimes.length > 0 ? formatTime(Math.max(...allTakenTimes)) : "--:--:--"

    return (
        <View
            className='bg-white flex-1'
            style={{ paddingBottom: bottomBarHeight }}
        >
            <ScrollView>
                <SafeAreaView className='px-8'>
                    {/* Header */}
                    <View className='flex-row items-center justify-between'>
                        <TouchableOpacity onPress={() => router.back()}>
                            <AntDesign name='arrowleft' size={30} color='#222324' />
                        </TouchableOpacity>
                        <View className='items-end'>
                            <Text className='text-3xl font-bold text-[#222324]'>
                                Service Details
                            </Text>
                            <Text className='text-[#818181]'>
                                {process?.date}{' '}
                                {process?.date
                                    ? new Date(process.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                    })
                                    : ''}
                            </Text>
                        </View>
                    </View>

                    {/* Process info card */}
                    {process && (
                        <View className='flex-row items-center my-4 border rounded-xl border-[#ececec] px-4 py-2 gap-3'>
                            <PlaceIcon>
                                <FontAwesome name='user-o' size={24} color='#00B8D4' />
                            </PlaceIcon>
                            <View>
                                <Text className='text-lg font-bold'>{process.name}</Text>
                                <Text className='text-[#818181]'>
                                    {process.date}{' '}
                                    {new Date(process.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                    })}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Stats cards */}
                    <View className='flex-row gap-2'>
                        {/* Total photos */}
                        <View className='w-1/2 bg-gray-100/50 p-5 rounded-xl flex-row items-center justify-between'>
                            <View className='flex-row items-center gap-2 flex-1'>
                                <Fontisto name='camera' size={16} color='#00B8D4' />
                                <Text className='text-[#818181] font-medium text-lg flex-shrink'>
                                    Total Photos
                                </Text>
                            </View>
                            <Text className='text-[#818181] font-medium text-lg ml-2'>
                                {totalPhotos}
                            </Text>
                        </View>

                        {/* On-time steps */}
                        <View className='w-1/2 bg-gray-100/50 p-5 rounded-xl flex-row items-center justify-between'>
                            <View className='flex-row items-center gap-2 flex-1'>
                                <AntDesign name='checkcircle' size={16} color='#00B8D4' />
                                <Text
                                    className='text-[#818181] font-medium text-lg flex-shrink'
                                    style={{ lineHeight: 18 }}
                                >
                                    On-time Steps
                                </Text>
                            </View>
                            <Text className='text-[#818181] font-medium text-lg ml-2'>
                                {onTimeSteps}/{totalSteps}
                            </Text>
                        </View>
                    </View>
                    <View className='bg-gray-100/50 p-5 my-5 rounded-xl flex-row items-center justify-between'>
                        <View className='flex-row items-center gap-2 flex-1'>
                            <Ionicons name='calendar' size={24} color='#00B8D4' />
                            <Text className='text-[#818181] font-medium text-lg flex-shrink'>
                                Time Range
                            </Text>
                        </View>
                        <Text className='text-[#818181] font-medium text-lg ml-2'>
                            {minTime}/{maxTime}
                        </Text>
                    </View>

                    {/* Step analysis per process */}
                    {processesByDate.map(proc => (
                        <View
                            key={proc.id}
                            className='border border-[#ececec] rounded-xl p-5 mt-4'
                        >
                            <View className='flex-row gap-2 items-center mb-2'>
                                <AntDesign name='bars' size={24} color='#00B8D4' />
                                <Text className='text-xl font-bold'>Service Details</Text>
                                <Text className='text-[#818181] ml-auto'>
                                    {new Date(proc.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                    })}
                                </Text>
                            </View>
                            <View>
                                {proc.steps.map(step => (
                                    <ServiceDetailsItems key={step.id} item={step} />
                                ))}
                            </View>
                        </View>
                    ))}
                    {processesByDate.map(proc => (
                        <View
                            key={proc.id}
                            className='border border-[#ececec] rounded-xl p-5 mt-4'
                        >
                            <View className='flex-row gap-2 items-center justify-between mb-2'>
                                <View className='flex-row items-center gap-2'>
                                    <Ionicons name='document-text' size={24} color='#00B8D4' />
                                    <Text className='text-xl font-bold'>Notes</Text>
                                </View>
                                {/* <MaterialIcons name='edit-square' size={24} color="#00B8D4" /> */}
                            </View>
                            <View>
                                {proc.steps.map(step => (
                                    <ShowNote key={step.id} item={step} />
                                ))}
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity className='flex-1 items-center justify-center py-5 '>
                        <View className='flex-row items-center gap-3 bg-[#00B8D426] px-4 py-3 rounded-xl border border-[#00B8D4]'>
                            <FontAwesome name='trash-o' size={24} color="#FF6F61" />
                            <Text className='text-[#00B8D4] text-xl font-bold'>Remove This Record</Text>
                        </View>
                    </TouchableOpacity>
                </SafeAreaView>
            </ScrollView>
        </View>
    )
}
