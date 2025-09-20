import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, View, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

type TrendDataPoint = {
  period: string;
  average_time_seconds: number;
};

interface Props {
  trend: {
    summary: string;
    data: TrendDataPoint[];
  };
}

export default function LineChartPage({ trend }: Props) {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  if (!trend || !trend.data || trend.data.length === 0) return null;

  // Convert seconds → minutes for chart
  const labels = trend.data.map((d) => d.period);
  const values = trend.data.map(
    (d) => +(d.average_time_seconds / 60).toFixed(2)
  );

  const data = {
    labels,
    datasets: [
      {
        data: values,
        color: (opacity = 1) => `rgba(0, 184, 212, 1)`,
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
    decimalPlaces: 1,
  };

  return (
    <View className="border-2 border-gray-100 pt-5">
      <View className="gap-2 px-5 pb-5">
        <View className="flex-row items-center gap-4">
          <FontAwesome name="line-chart" size={24} color="#00B8D4" />
          <Text className="text-xl font-bold">
            {t("analytics.completionTimeTrend")}
          </Text>
        </View>
        {trend.summary && (
          <Text className="text-[#818181]">{trend.summary}</Text>
        )}
      </View>

      <View className="flex-1 px-0 py-4" style={{ borderRadius: 20 }}>
        <LineChart
          data={data}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          withDots={false}
          withShadow={false}
          withInnerLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          withVerticalLines={true}
          withHorizontalLines={true}
          style={{ backgroundColor: "transparent" }}
        />
      </View>
    </View>
  );
}
