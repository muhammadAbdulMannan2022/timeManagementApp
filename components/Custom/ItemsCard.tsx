import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

const timeToSeconds = (time: string) => {
  if (!time) return 0;
  const [h, m, s] = time.split(":").map(Number);
  return h * 3600 + m * 60 + s;
};

// helper to format seconds back to "HH:mm:ss"
const secondsToTime = (secs: number) => {
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};
export default function ItemsCard({ item, titleId }: any) {
  const router = useRouter();
  const { t } = useTranslation();

  // avg of target_time
  const averageTargetTime = item?.tasks?.length
    ? secondsToTime(
        Math.round(
          item.tasks.reduce(
            (sum: number, t: any) => sum + timeToSeconds(t.target_time),
            0
          ) / item.tasks.length
        )
      )
    : null;

  // avg of current_time
  const averageCurrentTime = item?.tasks?.length
    ? secondsToTime(
        Math.round(
          item.tasks.reduce(
            (sum: number, t: any) => sum + timeToSeconds(t.current_time),
            0
          ) / item.tasks.length
        )
      )
    : null;

  useEffect(() => {
    console.log("process", item.uid, item.tasks);
  }, []);

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(tabs)/Calender/Services",
          params: { id: item.uid },
        })
      }
      className="flex-row border border-[#e9e9e9] rounded-xl px-3 py-2 my-2 gap-4 items-center"
    >
      <View
        style={{ borderRadius: 20 }}
        className="h-10 w-10 bg-[#00B8D4] items-center justify-center"
      >
        <Text className="text-white text-md">{titleId}</Text>
      </View>

      <View className="flex-row items-center justify-between flex-1">
        <View>
          <Text className="text-xl font-bold text-black">
            {t("calendar.clients")}: {titleId}
          </Text>
          {averageTargetTime !== null && (
            <Text className="mt-1">{averageTargetTime}</Text>
          )}
        </View>

        <View className="justify-end">
          {averageCurrentTime !== null && <Text>{averageCurrentTime}</Text>}
          <View className="flex-row items-center gap-2 mt-1 justify-end">
            {item.tasks?.some((t: any) => t.images?.length > 0) && (
              <FontAwesome name="camera" size={14} color="#00B8D4" />
            )}
            <FontAwesome5 name="angle-right" size={18} color="#E5E5E5" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
