import Timer from "@/components/Custom/Timer";
import { useGetBoilerPlateQuery } from "@/redux/apis/appSlice";
import { RootState } from "@/redux/store";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const parseTimeToMinutes = (timeStr: string) => {
  const [hh, mm, ss] = timeStr.split(":").map(Number);
  return hh * 60 + mm + (ss > 0 ? 1 : 0); // add 1 extra minute if there are leftover seconds
};

export default function App() {
  const step = useSelector((state: RootState) => state.step);
  const { data, isLoading } = useGetBoilerPlateQuery(undefined);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00B8D4" />
      </View>
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
        {currentTask && (
          <Timer
            client={currentTask.client.split("-").pop()}
            time={targetMinutes}
            type={currentTask.task_name}
            stepId={currentTask.client}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
