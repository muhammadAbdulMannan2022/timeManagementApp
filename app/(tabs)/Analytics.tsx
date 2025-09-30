import FilterBar from "@/components/Custom/Filter";
import { useAnalyticsMutation } from "@/redux/apis/appSlice";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// StepBarChart component
type StepAnalysis = {
  name: string;
  current_time: string;
  target_time: string;
  completion_percentage: number;
};

interface BarChartProps {
  stepAnalysis: StepAnalysis[];
  dateRange?: string;
}

const StepBarChart = ({ stepAnalysis, dateRange }: BarChartProps) => {
  const { t } = useTranslation();

  // Convert "mm:ss" to seconds count (e.g., "00:31" = 31 seconds) and then to minutes
  const timeStringToMinutes = (time: string) => {
    if (!time || typeof time !== "string") return 0;
    const parts = time.split(":");
    if (parts.length !== 2) {
      console.warn(`Invalid time format: ${time}`);
      return 0;
    }
    const seconds = parseInt(parts[1], 10);
    if (isNaN(seconds)) {
      console.warn(`Failed to parse seconds from: ${time}`);
      return 0;
    }
    return seconds / 60;
  };

  // Fallback if stepAnalysis is empty or invalid
  const validStepAnalysis =
    stepAnalysis && stepAnalysis.length > 0
      ? stepAnalysis
      : [
          {
            name: "No Data",
            current_time: "00:00",
            target_time: "00:00",
            completion_percentage: 0,
          },
        ];

  const labels = validStepAnalysis.map((s) => s.name);
  const values = validStepAnalysis.map((s) =>
    timeStringToMinutes(s.current_time)
  );

  // Log chart data for debugging
  console.log("Bar chart data:", { labels, values });

  const chartData = {
    labels,
    datasets: [{ data: values.map((v) => (isNaN(v) ? 0 : v)) }],
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
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 184, 212, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            barPercentage: 0.5,
            yAxisInterval: 0.1,
          }}
          verticalLabelRotation={30}
          fromZero
        />
      </ScrollView>
    </View>
  );
};

// LineChartPage component
type TrendDataPoint = {
  period: string;
  average_time_seconds: number;
};

interface LineChartProps {
  trend: {
    summary: string;
    data: TrendDataPoint[];
  };
}

const LineChartPage = ({ trend }: LineChartProps) => {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  if (!trend || !trend.data || trend.data.length === 0) {
    console.log("LineChartPage: No trend data available");
    return null;
  }

  // Convert seconds → minutes for chart
  const labels = trend.data.map((d) => d.period);
  const values = trend.data.map(
    (d) =>
      +(
        isNaN(d.average_time_seconds) ? 0 : d.average_time_seconds / 60
      ).toFixed(2)
  );

  // Check if all values are 0
  const allZero = values.every((v) => v === 0);
  if (allZero) {
    console.log("LineChartPage: All values are 0, chart may appear flat");
  }

  // Log chart data for debugging
  console.log("Line chart data:", { labels, values });

  const data = {
    labels,
    datasets: [{ data: values }],
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
};

// Analytics component
export default function Analytics() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [getAnaData, { isLoading, isUninitialized }] = useAnalyticsMutation();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const filterMap = ["1W", "1M", "6M", "1Y"];

  // Convert "mm:ss" to seconds count (e.g., "00:31" = 31 seconds)
  const timeStrToSeconds = (time: string) => {
    if (!time || typeof time !== "string") {
      console.warn(`Invalid time input: ${time}`);
      return 0;
    }
    const parts = time.split(":");
    if (parts.length !== 2) {
      console.warn(`Invalid time format: ${time}`);
      return 0;
    }
    const seconds = parseInt(parts[1], 10);
    if (isNaN(seconds)) {
      console.warn(`Failed to parse seconds from: ${time}`);
      return 0;
    }
    return seconds;
  };

  // Convert "mm:ss" to minutes for current_time and target_time
  const timeStrToMinutes = (time: string) => {
    if (!time || typeof time !== "string") return 0;
    const parts = time.split(":");
    if (parts.length !== 2) {
      console.warn(`Invalid time format: ${time}`);
      return 0;
    }
    const seconds = parseInt(parts[1], 10);
    if (isNaN(seconds)) {
      console.warn(`Failed to parse seconds from: ${time}`);
      return 0;
    }
    return seconds / 60;
  };

  const getData = async () => {
    try {
      const d = await getAnaData({ filter_type: filterMap[active] }).unwrap();
      console.log("Raw API response:", d);
      // Transform completion_time_trend to match LineChartPage expected format
      const transformedData = {
        ...d,
        completion_time_trend: {
          summary: d.completion_time_trend?.summary || "No summary",
          data: d.completion_time_trend?.chart_data?.labels?.length
            ? d.completion_time_trend.chart_data.labels.map(
                (period: string, index: number) => ({
                  period,
                  average_time_seconds:
                    d.completion_time_trend.chart_data.datasets?.[0]?.data?.[
                      index
                    ] != null
                      ? timeStrToSeconds(
                          d.completion_time_trend.chart_data.datasets[0].data[
                            index
                          ]
                        )
                      : 0,
                })
              )
            : [
                { period: "Sep 23", average_time_seconds: 0 },
                { period: "Sep 24", average_time_seconds: 0 },
                { period: "Sep 25", average_time_seconds: 0 },
                { period: "Sep 26", average_time_seconds: 0 },
                { period: "Sep 27", average_time_seconds: 0 },
                { period: "Sep 28", average_time_seconds: 0 },
                { period: "Sep 29", average_time_seconds: 0 },
                { period: "Sep 30", average_time_seconds: 0 },
              ],
        },
      };
      setData(transformedData);
      setError(null);
      console.log("Raw step_analysis:", d.step_analysis);
      console.log("Transformed step_analysis:", transformedData.step_analysis);
      console.log("Raw completion_time_trend:", d.completion_time_trend);
    } catch (err: any) {
      const errorMessage =
        err?.data?.error || err?.message || "Failed to load data";
      console.error("Error fetching data:", errorMessage);
      setError(errorMessage);
    }
  };

  useEffect(() => {
    getData();
  }, [active]);

  // Format minutes to "mm:ss"
  const formatMinutesToMMSS = (minutes: number) => {
    if (isNaN(minutes)) {
      console.warn("Invalid minutes value for formatting:", minutes);
      return "00:00";
    }
    const m = Math.floor(minutes).toString().padStart(2, "0");
    const s = Math.round((minutes - Math.floor(minutes)) * 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  // Show loading state
  if (isLoading || isUninitialized) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#00B8D4" />
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Animated.View
          entering={FadeInUp.duration(500)}
          className="bg-[#E8F9FB] rounded-2xl shadow-lg p-6 w-4/5 items-center"
        >
          <MaterialIcons name="error-outline" size={48} color="#F9A61D" />
          <Text className="text-xl text-[#818181] font-semibold mt-4 text-center">
            {error}
          </Text>
          <TouchableOpacity
            className="mt-6 bg-[#00B8D4] px-6 py-3 rounded-full"
            onPress={() => router.push("/(tabs)/Settings")}
          >
            <Text className="text-white text-lg font-bold">
              <AntDesign name="arrowright" size={24} color="white" />
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // Show no data state
  if (!data) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-2xl text-black">{t("analytics.noData")}</Text>
      </SafeAreaView>
    );
  }

  // Overview
  const overview = data.overview || {};
  const stepAnalysis = [...(data.step_analysis || [])];

  // Ensure exactly 4 steps
  while (stepAnalysis.length < 4) {
    stepAnalysis.push({
      name: `Step ${stepAnalysis.length + 1}`,
      current_time: "00:00",
      target_time: "00:00",
      completion_percentage: 0,
    });
  }

  const totalClients = overview.total_clients ?? stepAnalysis.length;

  // On-time / over-time
  const onTimeCount = stepAnalysis.filter(
    (s: any) =>
      timeStrToMinutes(s.current_time) <= timeStrToMinutes(s.target_time)
  ).length;
  const onTimeRate =
    overview.on_time_rate ??
    (stepAnalysis.length ? (onTimeCount / stepAnalysis.length) * 100 : 0);
  const overTimeRate = overview.overtime_rate ?? 100 - onTimeRate;

  // Fastest / slowest
  const times = stepAnalysis.map((s: any) => timeStrToMinutes(s.current_time));
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const fastest =
    data.performance?.fastest ?? formatMinutesToMMSS(minTime || 0);
  const slowest =
    data.performance?.slowest ?? formatMinutesToMMSS(maxTime || 0);

  return (
    <View className="bg-white flex-1">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
      >
        <SafeAreaView className="gap-4">
          {/* Average Time */}
          <View className="w-full items-center justify-center py-10">
            <Text className="text-[#00B8D4] text-2xl font-bold">
              {t("analytics.averageTime")}
            </Text>
            <Text className="text-5xl font-bold text-[#00B8D4] mt-4">
              {data.average_time ?? "00:00"}
            </Text>
          </View>

          {/* Filter */}
          <FilterBar active={active} setActive={setActive} />

          {/* Overview */}
          <View className="py-5 mt-5">
            <View className="flex-row items-center gap-4">
              <AntDesign name="barschart" size={24} color="#00B8D4" />
              <Text className="text-xl font-bold">
                {t("analytics.overview")}
              </Text>
            </View>
            <Text className="text-[#818181] text-lg">
              {overview.date_range ?? ""}
            </Text>
          </View>

          <View className="flex-row gap-2 items-center justify-between">
            <View className="flex-1 items-center bg-[#E8F9FB] py-5 rounded-xl gap-1">
              <Entypo name="users" size={18} color="#00B8D4" />
              <Text className="text-[#818181]">
                {t("analytics.totalClients")}
              </Text>
              <Text className="text-[#818181] text-2xl font-bold">
                {totalClients}
              </Text>
            </View>

            <View className="flex-1 items-center bg-[#E8F9FB] py-5 rounded-xl gap-1">
              <AntDesign name="checkcircle" size={18} color="#00B8D4" />
              <Text className="text-[#818181]">
                {t("analytics.onTimeRate")}
              </Text>
              <Text className="text-[#818181] text-2xl font-bold">
                {onTimeRate.toFixed(0)}%
              </Text>
            </View>

            <View className="flex-1 items-center bg-[#E8F9FB] py-5 rounded-xl gap-1">
              <FontAwesome name="warning" size={18} color="#F9A61D" />
              <Text className="text-[#818181]">
                {t("analytics.overtimeRate")}
              </Text>
              <Text className="text-[#818181] text-2xl font-bold">
                {overTimeRate.toFixed(0)}%
              </Text>
            </View>
          </View>

          {/* Performance */}
          <View className="bg-white rounded-xl shadow p-4 mb-4 gap-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <MaterialIcons name="offline-bolt" size={24} color="#00B8D4" />
                <Text className="text-lg font-semibold">
                  {t("analytics.fastest")}
                </Text>
              </View>
              <Text className="text-xl font-bold text-[#00B8D4]">
                {fastest}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <AntDesign name="clockcircle" size={24} color="#F9A61D" />
                <Text className="text-lg font-semibold">
                  {t("analytics.slowest")}
                </Text>
              </View>
              <Text className="text-xl font-bold text-[#00B8D4]">
                {slowest}
              </Text>
            </View>
          </View>

          {/* Charts */}
          <StepBarChart
            stepAnalysis={stepAnalysis}
            dateRange={overview.date_range}
          />
          <LineChartPage trend={data.completion_time_trend} />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
