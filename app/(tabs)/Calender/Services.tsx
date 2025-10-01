import PlaceIcon from "@/components/Custom/PlaceIcon";
import ServiceDetailsItems from "@/components/Custom/ServiceDetailsItems";
import ShowNote from "@/components/Custom/ShowNote";
import {
  useDeleteItemMutation,
  useGetBoilerPlateQuery,
  useGetSingleByIdQuery,
} from "@/redux/apis/appSlice";
import { AntDesign, FontAwesome, Fontisto, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ⏱ Convert HH:MM:SS -> total seconds
function parseToSeconds(time: string): number {
  const [h, m, s] = time.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

// 🕒 Format seconds -> HH:MM:SS
function formatTime(seconds: number): string {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function Services() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {
    data: processData,
    isLoading,
    refetch,
  } = useGetSingleByIdQuery(id, {
    skip: !id,
  });

  const { data: boilerPlaate, isLoading: boilerPlaateLoading } =
    useGetBoilerPlateQuery(undefined);
  const router = useRouter();
  const bottomBarHeight = 85;
  const [deleteItem, { isLoading: isDeleteLoading }] = useDeleteItemMutation();

  useEffect(() => {
    if (id) refetch();
  }, [id]);

  if (isLoading || !processData || boilerPlaateLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#00B8D4" />
        <Text className="mt-2 text-gray-500">{t("loading")}</Text>
      </View>
    );
  }

  const process = processData;
  const tasks = Array.isArray(process?.tasks) ? process.tasks : [];

  // Stats calculations

  const totalPhotos = Array.isArray(tasks)
    ? tasks.reduce((acc: any, task: any) => acc + (task.images?.length || 0), 0)
    : 0;

  const totalSteps = tasks.length || 0;

  const onTimeSteps = Array.isArray(tasks)
    ? tasks.filter((task: any) => {
        const target = parseToSeconds(task.target_time);
        const taken = parseToSeconds(task.current_time);
        return taken <= target;
      }).length
    : 0;

  const allTakenTimes = Array.isArray(tasks)
    ? tasks.map((task: any) => parseToSeconds(task.current_time))
    : [];
  const minTime =
    allTakenTimes.length > 0
      ? formatTime(Math.min(...allTakenTimes))
      : "--:--:--";
  const maxTime =
    allTakenTimes.length > 0
      ? formatTime(Math.max(...allTakenTimes))
      : "--:--:--";
  const deleteThis = async () => {
    try {
      const res = await deleteItem({ client_uid: id });
      console.log(id);
      router.push("/(tabs)/Calender");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View
      className="bg-white flex-1"
      style={{ paddingBottom: bottomBarHeight }}
    >
      <StatusBar style="dark" />
      <ScrollView>
        <SafeAreaView className="px-8">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={30} color="#222324" />
            </TouchableOpacity>
            <View className="items-end">
              <Text className="text-3xl font-bold text-[#222324]">
                {t("calendar.services.serviceDetails")}
              </Text>
              <Text className="text-[#818181]">
                {process.created_at
                  ? new Date(process.created_at).toLocaleDateString("en-US", {
                      weekday: "long",
                    })
                  : ""}
              </Text>
            </View>
          </View>

          {/* Process info card */}
          <View className="flex-row items-center my-4 border rounded-xl border-[#ececec] px-4 py-2 gap-3">
            <PlaceIcon>
              <FontAwesome name="user-o" size={24} color="#00B8D4" />
            </PlaceIcon>
            <View>
              <Text className="text-lg font-bold">
                {process.uid.split("-").pop()}
              </Text>
              <Text className="text-[#818181]">
                {process.created_at
                  ? new Date(process.created_at).toLocaleDateString("en-US")
                  : ""}
              </Text>
            </View>
          </View>

          {/* Stats cards */}
          <View className="flex-row gap-2">
            <View className="w-1/2 bg-gray-100/50 p-5 rounded-xl flex-row items-center justify-between">
              <View className="flex-row items-center gap-2 flex-1">
                <Fontisto name="camera" size={16} color="#00B8D4" />
                <Text className="text-[#818181] font-medium text-lg flex-shrink">
                  {t("calendar.services.totalPhotos")}
                </Text>
              </View>
              <Text className="text-[#818181] font-medium text-lg ml-2">
                {totalPhotos}
              </Text>
            </View>

            <View className="w-1/2 bg-gray-100/50 p-5 rounded-xl flex-row items-center justify-between">
              <View className="flex-row items-center gap-2 flex-1">
                <AntDesign name="checkcircle" size={16} color="#00B8D4" />
                <Text
                  className="text-[#818181] font-medium text-lg flex-shrink"
                  style={{ lineHeight: 18 }}
                >
                  {t("calendar.services.onTimeSteps")}
                </Text>
              </View>
              <Text className="text-[#818181] font-medium text-lg ml-2">
                {onTimeSteps}/{totalSteps}
              </Text>
            </View>
          </View>

          {/* Time Range Card */}
          <View className="bg-gray-100/50 p-5 my-5 rounded-xl flex-row items-center justify-between">
            <View className="flex-row items-center gap-2 flex-1">
              <Ionicons name="calendar" size={24} color="#00B8D4" />
              <Text className="text-[#818181] font-medium text-lg flex-shrink">
                {t("calendar.services.timeRange")}
              </Text>
            </View>
            <Text className="text-[#818181] font-medium text-lg ml-2">
              {minTime}/{maxTime}
            </Text>
          </View>

          {/* Step analysis / Notes */}
          <View className="border border-[#ececec] rounded-xl p-5 mt-4">
            <View className="flex-row gap-2 items-center mb-2">
              <AntDesign name="bars" size={24} color="#00B8D4" />
              <Text className="text-xl font-bold">
                {t("analytics.services")}
              </Text>
            </View>
            {tasks.map((task: any, i: number) => (
              <ServiceDetailsItems
                key={i}
                item={task}
                icon={i <= 5 ? boilerPlaate[i] : 1}
              />
            ))}
          </View>

          <View className="border border-[#ececec] rounded-xl p-5 mt-4">
            <View className="flex-row gap-2 items-center mb-2">
              <AntDesign name="bars" size={24} color="#00B8D4" />
              <Text className="text-xl font-bold">
                {t("calendar.services.notes")}
              </Text>
            </View>
            {tasks.map((task: any, i: number) => (
              <ShowNote
                key={i}
                item={task}
                icon={i <= 5 ? boilerPlaate[i] : 1}
              />
            ))}
          </View>
          {/* Delete Button */}
          <TouchableOpacity
            onPress={deleteThis}
            className="flex-1 items-center justify-center py-5 "
          >
            <View className="flex-row items-center gap-3 bg-[#00B8D426] px-4 py-3 rounded-xl border border-[#00B8D4]">
              {isDeleteLoading ? (
                <ActivityIndicator />
              ) : (
                <>
                  <FontAwesome name="trash-o" size={24} color="#FF6F61" />
                  <Text className="text-[#00B8D4] text-xl font-bold">
                    {t("calendar.services.removeRecord")}
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
