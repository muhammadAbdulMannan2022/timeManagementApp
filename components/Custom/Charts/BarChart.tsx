import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

type StepAnalysis = {
  name: string;
  current_time: string;
  target_time: string;
  completion_percentage: number;
};

interface Props {
  stepAnalysis: StepAnalysis[];
  dateRange?: string; // optional, e.g., "Sep 12, 2025 to Sep 19, 2025"
}

export default function StepBarChart({ stepAnalysis, dateRange }: Props) {
  const { t } = useTranslation();

  // Convert "hh:mm:ss" to minutes
  const timeStringToMinutes = (time: string) => {
    const [h, m, s] = time.split(":").map(Number);
    return h * 60 + m + s / 60;
  };

  const labels = stepAnalysis.map((s) => s.name);
  const values = stepAnalysis.map((s) => timeStringToMinutes(s.current_time));

  const chartData = {
    labels,
    datasets: [{ data: values }],
  };

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = Math.max(labels.length * 80, screenWidth - 40);

  return (
    <View className="border-2 border-gray-100 pt-5">
      {/* Header */}
      <View className="gap-2 px-5 pb-5">
        <View className="flex-row items-center gap-4">
          <AntDesign name="bars" size={24} color="#00B8D4" />
          <Text className="text-xl font-bold">
            {t("analytics.stepAnalysis")}
          </Text>
        </View>
        {dateRange && (
          <View className="flex-row gap-1">
            <Text className="text-[#818181]">{dateRange}</Text>
          </View>
        )}
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
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
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
  );
}
