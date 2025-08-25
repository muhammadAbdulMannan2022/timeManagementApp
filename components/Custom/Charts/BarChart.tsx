import { RootState } from '@/redux/store'
import { AntDesign } from '@expo/vector-icons'
import { Dimensions, ScrollView, Text, View } from 'react-native'
import { BarChart } from 'react-native-chart-kit'
import { useSelector } from 'react-redux'

export default function StepBarChart() {
    const processes = useSelector((state: RootState) => state.clientRecords.processes)

    // ✅ Merge steps by name
    const stepMap: Record<string, number> = {}
    processes.forEach(p => {
        p.steps.forEach(step => {
            const [h, m, s] = step.takenTime.split(':').map(Number)
            const minutes = h * 60 + m + s / 60
            if (stepMap[step.name]) {
                stepMap[step.name] += minutes
            } else {
                stepMap[step.name] = minutes
            }
        })
    })

    const labels = Object.keys(stepMap)
    const values = Object.values(stepMap)

    const chartData = {
        labels,
        datasets: [{ data: values }],
    }

    const screenWidth = Dimensions.get('window').width
    const chartWidth = Math.max(labels.length * 80, screenWidth - 40) // dynamic width

    return (
        <View className="border-2 border-gray-100 pt-5">
            {/* Header */}
            <View className="gap-2 px-5 pb-5">
                <View className="flex-row items-center gap-4">
                    <AntDesign name="bars" size={24} color="#00B8D4" />
                    <Text className="text-xl font-bold">Step Analysis</Text>
                </View>
                <View className="flex-row gap-1">
                    <Text className="text-[#818181]">Jul 28, 2025 to</Text>
                    <Text className="text-[#818181]">Feb 4, 2025</Text>
                </View>
            </View>

            {/* Chart */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                    data={chartData}
                    width={chartWidth}
                    height={450}
                    yAxisLabel=""
                    yAxisSuffix="m"
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 184, 212, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        barPercentage: 0.5,
                    }}
                    verticalLabelRotation={30}
                    fromZero
                />
            </ScrollView>
        </View>
    )
}
