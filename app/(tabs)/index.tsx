import Timer from "@/components/Custom/Timer";
import { RootState } from "@/redux/store";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function App() {
  const step = useSelector((state: RootState) => state.step)

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <SafeAreaView className="flex-1 items-center justify-center">
        <Timer client={"88"} time={1} type={step.stepName} />
      </SafeAreaView>
    </View>
  );
}
