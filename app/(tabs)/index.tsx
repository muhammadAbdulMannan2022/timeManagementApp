import Timer from "@/components/Custom/Timer";
import { useGetBoilerPlateQuery } from "@/redux/apis/appSlice";
import { RootState } from "@/redux/store";
import { AntDesign } from "@expo/vector-icons"; // Added for error icon
import { useRouter } from "expo-router";

import { useEffect } from "react";
import { useTranslation } from "react-i18next"; // Added for translations
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated"; // Added for animations
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const parseTimeToMinutes = (timeStr: string) => {
  const [hh, mm, ss] = timeStr.split(":").map(Number);
  return hh * 60 + mm + (ss > 0 ? 1 : 0); // add 1 extra minute if there are leftover seconds
};

export default function App() {
  const { t } = useTranslation(); // Added for translations
  const router = useRouter(); // Added for navigation
  const step = useSelector((state: RootState) => state.step);
  const { data, isLoading, error, refetch } = useGetBoilerPlateQuery(undefined);

  // Handle 401 error and navigate to Auth screen
  useEffect(() => {
    if (error && "status" in error && error.status === 401) {
      router.replace("/(auth)");
    }
  }, [error]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#00B8D4" />
      </SafeAreaView>
    );
  }

  // Handle error state (non-401 errors)
  if (error && (!("status" in error) || error.status !== 401)) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Animated.View
          entering={FadeInUp.duration(500)}
          className="bg-[#E8F9FB] rounded-2xl shadow-lg p-6 w-4/5 items-center"
        >
          <AntDesign name="exclamationcircleo" size={48} color="#F9A61D" />
          <Text className="text-xl text-[#818181] font-semibold mt-4 text-center">
            {t("error.title")}:{" "}
            {error?.data?.error || t("error.defaultMessage")}
          </Text>
          <Text className="text-base text-[#818181] mt-2 text-center">
            {t("error.tryAgainMessage")}
          </Text>
          <TouchableOpacity
            className="mt-6 bg-[#00B8D4] px-6 py-3 rounded-full"
            onPress={() => refetch()} // Assumes refetch is available from useGetBoilerPlateQuery
          >
            <Text className="text-white text-lg font-bold">
              {t("error.retry")}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // Pick the current task from API
  const currentTask = data?.[step.currentStep - 1]; // step 1 → index 0

  // Convert target_time to minutes
  const targetMinutes = currentTask
    ? parseTimeToMinutes(currentTask.target_time)
    : 1;

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <SafeAreaView className="flex-1 items-center justify-center">
        {currentTask ? (
          <Timer
            client={currentTask.client.split("-").pop()}
            time={targetMinutes}
            type={currentTask.task_name}
            stepId={currentTask.client}
          />
        ) : (
          <Animated.View
            entering={FadeInUp.duration(500)}
            className="bg-[#E8F9FB] rounded-2xl shadow-lg p-6 w-4/5 items-center"
          >
            <AntDesign name="exclamationcircleo" size={48} color="#00B8D4" />
            <Text className="text-xl text-[#818181] font-semibold mt-4 text-center">
              {t("noData.title")}
            </Text>
            <Text className="text-base text-[#818181] mt-2 text-center">
              {t("noData.message")}
            </Text>
            <TouchableOpacity
              className="mt-6 bg-[#00B8D4] px-6 py-3 rounded-full"
              onPress={() => refetch()} // Assumes refetch is available
            >
              <Text className="text-white text-lg font-bold">
                {t("noData.retry")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
}
