import { useUpdateTaskMutation } from "@/redux/apis/appSlice";
import { RootState } from "@/redux/store";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function ViewImage() {
  const router = useRouter();
  const step = useSelector((state: RootState) => state.step);
  const stepImage = useSelector((state: RootState) => state.image);
  const dispatch = useDispatch();
  const [updateTask, { isLoading: updateLoading }] = useUpdateTaskMutation();
  const [task_id, setTaskId] = useState("");
  const [client_uid, setClientUid] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const storedId = await SecureStore.getItemAsync("item_id");
        const storedStepId = await SecureStore.getItemAsync("service_id");

        if (storedId) setClientUid(storedId);
        if (storedStepId) setTaskId(storedStepId);
      } catch (error) {
        console.log("Error reading SecureStore:", error);
      }
    })();
  }, []);

  const { uri, width, height, format } = useLocalSearchParams<{
    uri: string;
    width: string;
    height: string;
    format: string;
  }>();

  const handleBack = () => router.back();

  const handleSave = async () => {
    const c = await SecureStore.getItemAsync("item_id");
    console.log(client_uid, task_id, "dslkgalsj", c);
    const data = new FormData();

    data.append("client_uid", client_uid);
    data.append("task_id", task_id);
    // ✅ Correct image append
    data.append("image", {
      uri,
      type: `image/${format}`,
      name: `photo.${format}`,
    } as any);

    try {
      const res = await updateTask(data).unwrap();
      console.log(res, "view 45");
      //   dispatch(addImage({ step: Number(step.currentStep), uri }));
      router.push({
        pathname: "/SelectedImage",
        params: { client_uid, task_id },
      });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1 pb-8">
        {/* Header */}
        <View className="flex-row items-center p-4 shadow-md justify-between px-10">
          <TouchableOpacity onPress={handleBack}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text className="ml-4 text-black text-xl font-semibold">
            Selected Picture
          </Text>
          <View />
        </View>

        {/* Image */}
        <View className="flex-1 items-center justify-center">
          {uri ? (
            <Image
              source={{ uri }}
              className="w-[90%] h-[80%] rounded-xl bg-gray-900"
              style={{ resizeMode: "contain" }}
            />
          ) : (
            <Text className="text-black">No image found</Text>
          )}
        </View>

        {/* Save Button */}
        <View className="p-4 items-center justify-center">
          <TouchableOpacity
            onPress={handleSave}
            disabled={updateLoading}
            className="flex-row items-center justify-center bg-[#00B8D430] py-4 px-5 rounded-xl shadow-md gap-3"
          >
            <Entypo name="camera" size={24} color="#00B8D4" />
            <Text className="text-[#00B8D4] text-lg font-semibold">
              {updateLoading ? "Saving..." : "Save Photo"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar style="dark" />
    </View>
  );
}
