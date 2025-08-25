import { FontAwesome } from "@expo/vector-icons";
import { Text, View, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function LineChartPage() {
    const { width } = useWindowDimensions();

    const data = {
        labels: ["1D", "1M", "6M", "1Y", "ALL"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                color: (opacity = 1) => `rgba(0, 184, 212, 150)`,
                strokeWidth: 2,
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: "transparent",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "transparent",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(0, 184, 212, ${opacity})`,
        strokeWidth: 4,
        decimalPlaces: 0,
    };

    return (
        <View className="border-2 border-gray-100 pt-5">
            <View className="gap-2 px-5 pb-5">
                <View className="flex-row items-center gap-4">
                    <FontAwesome name="line-chart" size={24} color="#00B8D4" />
                    <Text className="text-xl font-bold">Completion Time Trend</Text>
                </View>
                <View className="flex-row gap-3">
                    <Text className="text-[#818181]">2 service days.</Text>
                    <Text className="text-[#818181]">3 services</Text>
                </View>
            </View>
            <View className="flex-1  px-0 py-4" style={{ borderRadius: 20, }}>

                <LineChart
                    data={data}
                    width={width - 40} // fits parent with some padding
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    withDots={false}   // remove point indicators
                    withShadow={false} // remove shadow fill
                    withInnerLines={true} // remove grid lines
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                    withVerticalLines={true}
                    withHorizontalLines={true}

                    style={{
                        backgroundColor: "transparent",
                    }}
                />
            </View>
        </View>
    );
}
