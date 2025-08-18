import Timer from "@/components/Custom/Timer";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <SafeAreaView className="flex-1 items-center justify-center">
        <Timer client={"88"} time={1} type="Removal" />
      </SafeAreaView>
    </View>
  );
}
