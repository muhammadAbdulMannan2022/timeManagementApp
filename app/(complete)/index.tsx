import ServiceDetailsItems from "@/components/Custom/ServiceDetailsItems";
import { useDownloadFile } from "@/hooks/useDownloadFile";
import { useGetSingleByIdQuery } from "@/redux/apis/appSlice";
import { resetStep } from "@/redux/slices/stepSlice";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

export default function CompleteIndex() {
  const paddingAnim = useRef(new Animated.Value(10)).current; // start from 10
  //   const stepData = useSelector(
  //     (state: RootState) => state.clientRecords.processes[0]
  //   );
  const router = useRouter();
  const dispatch = useDispatch();
  // id
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: serviceData, isLoading } = useGetSingleByIdQuery(id, {
    skip: !id,
  });
  // convert "HH:MM:SS" → seconds
  const toSeconds = (time: string) => {
    const [h, m, s] = time.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  // convert seconds → "HH:MM:SS"
  const toHHMMSS = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  };
  const avg = serviceData
    ? serviceData.tasks.reduce(
        (sum: any, d: any) => sum + d.completion_percentage,
        0
      )
    : 0;
  // calculate sums
  const totalTaken = serviceData
    ? toHHMMSS(
        serviceData.tasks.reduce(
          (sum: number, i: any) => sum + toSeconds(i.current_time),
          0
        )
      )
    : "00:00:00";

  const totalTarget = serviceData
    ? toHHMMSS(
        serviceData.tasks.reduce(
          (sum: number, i: any) => sum + toSeconds(i.target_time),
          0
        )
      )
    : "00:00:00";

  const difference = toHHMMSS(toSeconds(totalTarget) - toSeconds(totalTaken));
  useEffect(() => {
    console.log(serviceData && serviceData?.tasks, avg, "data");
    Animated.loop(
      Animated.sequence([
        Animated.timing(paddingAnim, {
          toValue: 25, // max padding
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false, // padding can't use native driver
        }),
        Animated.timing(paddingAnim, {
          toValue: 10, // min padding
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const { download: downloadFile, isLoading: isPdfLoading } = useDownloadFile();

  if (isLoading) return <ActivityIndicator />;
  return (
    <View className="flex-1">
      <SafeAreaView className="bg-white flex-1">
        <ScrollView className="flex-1">
          <View>
            <ImageBackground
              source={require("@/assets/bg/done.png")}
              style={{ flex: 1, justifyContent: "center" }}
              className="bg-no-repeat bg-cover h-[30vh] items-center justify-center"
            >
              <View>
                <Animated.View
                  className={` border-[5px] border-[#ffd50217] rounded-full`}
                  style={{ padding: paddingAnim }}
                >
                  <Animated.View
                    className={`border-[5px] border-[#ffd5022a] rounded-full`}
                    style={{ padding: paddingAnim }}
                  >
                    <View className="bg-white rounded-full">
                      <View className="p-5 border-[3px] border-[#FFD30269] bg-[#FFEFA736] rounded-full">
                        <Image source={require("@/assets/bg/trophy.png")} />
                      </View>
                    </View>
                  </Animated.View>
                </Animated.View>
              </View>
            </ImageBackground>
            <View className="flex-col px-8">
              <View className="items-center justify-center">
                <Text className="text-4xl font-bold text-[#222324]">
                  Service Complete
                </Text>
                <View className="w-[150px] rounded-full my-8 h-2 bg-[#FAD50E]"></View>
                <View className="flex-row items-center gap-2">
                  <View
                    className="w-2 h-2  bg-[#00B8D4]"
                    style={{ borderRadius: "100%" }}
                  ></View>
                  <View className="w-[80px] h-1 bg-gray-300"></View>
                  <View
                    className="w-2 h-2  bg-[#00B8D4]"
                    style={{ borderRadius: "100%" }}
                  ></View>
                </View>
              </View>
              <View className="items-center justify-center py-12">
                <Text className="text-xl font-extrabold text-[#818181] py-6">
                  Client{" "}
                  {serviceData ? serviceData?.uid.split("-").pop() : "00"}
                </Text>
                {avg > 90 && (
                  <View
                    className="flex-row items-center justify-between px-5 py-4 border-2 rounded-2xl gap-5 border-[#F8E65C] bg-[#FFFCEB]"
                    style={{
                      shadowColor: "#F8E65C",
                      shadowRadius: 20,
                      shadowOpacity: 0.2,
                    }}
                  >
                    <MaterialIcons
                      name="offline-bolt"
                      size={40}
                      color="#F8E65C"
                    />
                    <View className="items-center justify-center">
                      <Text className="text-[#A0A0A0] text-2xl font-bold">
                        Lightning Efficiency
                      </Text>
                      <Text className="text-[#A0A0A0] text-lg font-bold">
                        {(avg / 4).toFixed()}% efficiency
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <View className="bg-white rounded-xl shadow p-4 mb-4 gap-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-gray-400">
                    Target Time
                  </Text>
                  <Text className="text-xl font-bold text-black">
                    {totalTarget}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-gray-400">
                    Total Time
                  </Text>
                  <Text className="text-xl font-bold text-black">
                    {totalTaken}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between mt-5">
                  <Text className="text-lg font-semibold text-gray-400">
                    Time Difference
                  </Text>
                  <Text className="text-xl font-bold text-[#00B8D4]">
                    {toSeconds(totalTarget) - toSeconds(totalTaken) > 0
                      ? "Ahed"
                      : "-"}{" "}
                    {difference}
                  </Text>
                </View>
              </View>
              <View className="border border-[#ececec] rounded-xl p-5 mt-4">
                <View className="flex-row gap-2 items-center mb-2">
                  <Text className="text-xl font-bold">Step Details</Text>
                  <Text className="text-[#818181] ml-auto">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </Text>
                </View>
                <View>
                  {serviceData &&
                    serviceData.tasks.map((step: any) => (
                      <ServiceDetailsItems key={step.id} item={step} />
                    ))}
                </View>
              </View>
              <View className="py-8 gap-3">
                <TouchableOpacity
                  onPress={() => downloadFile(id)}
                  disabled={isPdfLoading}
                  className="flex-row items-center gap-5 py-4 rounded-xl border-2 border-[#00b8d4b6] justify-center"
                >
                  <Ionicons name="download" size={24} color="#00B8D4" />
                  {isPdfLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text className="text-[#00B8D4] text-lg font-semibold">
                      Download Report
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(resetStep());
                    router.push("/(tabs)");
                  }}
                  className="flex-row items-center gap-5 py-4 rounded-xl border-2 border-[#00b8d4b7] justify-center bg-[#00B8D4]"
                >
                  <FontAwesome6 name="circle-plus" size={24} color="#ffffff" />
                  <Text className="text-white text-lg font-semibold">
                    New Service
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
