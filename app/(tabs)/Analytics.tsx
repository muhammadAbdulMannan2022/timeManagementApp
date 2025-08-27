
import BarChart from '@/components/Custom/Charts/BarChart'
import LineChartPage from '@/components/Custom/Charts/LineChart'
import FilterBar from '@/components/Custom/Filter'
import { RootState } from '@/redux/store'
import { AntDesign, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

export default function Analytics() {
    const processes = useSelector((state: RootState) => state.clientRecords.processes)
    const { t } = useTranslation()
    // filter options 
    const [active, setActive] = useState(0);

    // Flatten all steps
    const steps = processes.flatMap(p => p.steps)

    // Helper: convert "hh:mm:ss" to minutes
    const timeStringToMinutes = (time: string) => {
        const [h, m, s] = time.split(':').map(Number)
        return h * 60 + m + s / 60
    }

    const takenTimes = steps.map(s => timeStringToMinutes(s.takenTime))
    const targetTimes = steps.map(s => timeStringToMinutes(s.targetTime))

    // Total steps
    const totalSteps = steps.length

    // Average time
    const averageTime = takenTimes.reduce((sum, t) => sum + t, 0) / (totalSteps || 1)

    // Longest and shortest step
    const longestTime = Math.max(...takenTimes)
    const shortestTime = Math.min(...takenTimes)

    // On-time / over-time rates
    const onTimeCount = steps.filter((s, i) => takenTimes[i] <= targetTimes[i]).length
    const overTimeCount = totalSteps - onTimeCount
    const onTimeRate = totalSteps ? (onTimeCount / totalSteps) * 100 : 0
    const overTimeRate = totalSteps ? (overTimeCount / totalSteps) * 100 : 0

    const formatTime = (minutes: number) => {
        const h = Math.floor(minutes / 60)
        const m = Math.floor(minutes % 60)
        const s = Math.round((minutes - Math.floor(minutes)) * 60)
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
            .toString()
            .padStart(2, '0')}`
    }


    // filter 
    const getStartDate = (index: number): Date => {
        const today = new Date();
        switch (index) {
            case 0: // 1W
                return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            case 1: // 1M
                return new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            case 2: // 6M
                return new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
            case 3: // 1Y
                return new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
            default:
                return today;
        }
    };

    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const today = new Date();
    const startDate = getStartDate(active);
    return (
        <View className='bg-white flex-1'>
            <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}>
                <SafeAreaView className='gap-4'>
                    <View className='w-full items-center justify-center py-10'>
                        <Text className='text-[#00B8D4] text-2xl font-bold'>{t("analytics.averageTime")}</Text>
                        <Text className='text-5xl font-bold text-[#00B8D4] mt-4'>{formatTime(averageTime)}</Text>
                    </View>
                    <FilterBar active={active} setActive={setActive} />
                    <View className='py-5 mt-5'>
                        <View className='flex-row items-center gap-4'>
                            <AntDesign name="barschart" size={24} color="#00B8D4" />
                            <Text className='text-xl font-bold'>{t("analytics.overview")}</Text>
                        </View>
                        <Text className='text-[#818181] text-lg'>{formatDate(startDate)} – {formatDate(today)} </Text>
                    </View>
                    <View className="flex-row gap-2 items-center justify-between">
                        <View className="flex-1 items-center bg-[#E8F9FB] py-5 rounded-xl gap-1">
                            <Entypo name="users" size={18} color="#00B8D4" />
                            <Text className="text-[#818181]">{t("analytics.totalClients")}</Text>
                            <Text className="text-[#818181] text-2xl font-bold">{processes.length}</Text>
                        </View>

                        <View className="flex-1 items-center bg-[#E8F9FB] py-5 rounded-xl gap-1">
                            <AntDesign name="checkcircle" size={18} color="#00B8D4" />
                            <Text className="text-[#818181]">{t("analytics.onTimeRate")}</Text>
                            <Text className="text-[#818181] text-2xl font-bold">{onTimeRate.toFixed(1)}%</Text>
                        </View>

                        <View className="flex-1 items-center bg-[#E8F9FB] py-5 rounded-xl gap-1">
                            <FontAwesome name="warning" size={18} color="#F9A61D" />
                            <Text className="text-[#818181]">{t("analytics.overtimeRate")}</Text>
                            <Text className="text-[#818181] text-2xl font-bold">{overTimeRate.toFixed(1)}%</Text>
                        </View>
                    </View>
                    <View className='bg-white rounded-xl shadow p-4 mb-4 gap-4'>
                        <View className='flex-row items-center justify-between'>
                            <View className='flex-row items-center gap-4'>
                                <MaterialIcons name="offline-bolt" size={24} color="#00B8D4" />
                                <Text className='text-lg font-semibold'>{t("analytics.fastest")}</Text>
                            </View>
                            <Text className='text-xl font-bold text-[#00B8D4]'>{formatTime(shortestTime)}</Text>
                        </View>
                        <View className='flex-row items-center justify-between'>
                            <View className='flex-row items-center gap-4'>
                                <AntDesign name="clockcircle" size={24} color="#F9A61D" />
                                <Text className='text-lg font-semibold'>{t("analytics.slowest")}</Text>
                            </View>
                            <Text className='text-xl font-bold text-[#00B8D4]'>{formatTime(longestTime)}</Text>
                        </View>
                    </View>
                    <BarChart />
                    <LineChartPage />
                </SafeAreaView>
            </ScrollView>
        </View>
    )
}
