import BarChart from "@/components/Custom/Charts/BarChart";
import LineChartPage from "@/components/Custom/Charts/LineChart";
import FilterBar from "@/components/Custom/Filter";
import { useAnalyticsMutation } from "@/redux/apis/appSlice";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Analytics() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [getAnaData, { isLoading, isUninitialized }] = useAnalyticsMutation();
  const [data, setData] = useState<any>(null);

  const filterMap = ["1W", "1M", "6M", "1Y"];

  const getData = async () => {
    try {
      const d = await getAnaData({ filter_type: filterMap[active] }).unwrap();
      setData(d);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [active]);

  if (isLoading || isUninitialized) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#00B8D4" />
      </SafeAreaView>
    );
  }

  if (!data) return null;

  // 🔹 Safe parsing functions
  const timeStrToMinutes = (time: string) => {
    if (!time) return 0;
    const [h = 0, m = 0, s = 0] = time.split(":").map(Number);
    return h * 60 + m + s / 60;
  };

  const formatMinutesToHHMMSS = (minutes: number) => {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const m = Math.floor(minutes % 60)
      .toString()
      .padStart(2, "0");
    const s = Math.round((minutes - Math.floor(minutes)) * 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // 🔹 Overview
  const overview = data.overview || {};
  const stepAnalysis = [...(data.step_analysis || [])];

  // Ensure exactly 4 steps
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
    data.performance?.fastest ?? formatMinutesToHHMMSS(minTime || 0);
  const slowest =
    data.performance?.slowest ?? formatMinutesToHHMMSS(maxTime || 0);

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
          <BarChart stepAnalysis={stepAnalysis} />
          <LineChartPage trend={data.completion_time_trend} />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
