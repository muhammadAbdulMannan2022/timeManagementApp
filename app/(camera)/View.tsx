import { useUpdateTaskMutation } from "@/redux/apis/appSlice";
import { RootState } from "@/redux/store";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
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

  const params = useLocalSearchParams<{
    uri: string;
    width: string;
    height: string;
    format: string;
    client_uid: string;
    task_id: string;
  }>();
  
  const { uri, format } = params;

  // Use params as fallback if state is empty, though state is set from SecureStore in useEffect.
  // It's safer to use what was passed directly if available.
  const activeClientUid = params.client_uid || client_uid;
  const activeTaskId = params.task_id || task_id;

  const handleBack = () => router.back();

  const handleSave = async () => {
    if (!activeClientUid || !activeTaskId) {
        Alert.alert("Error", "Missing client or task ID.");
        return;
    }

    const data = new FormData();

    data.append("client_uid", activeClientUid);
    data.append("task_id", activeTaskId);
    // ✅ Correct image append
    data.append("image", {
      uri,
      type: `image/${format}`,
      name: `photo.${format}`,
    } as any);

    try {
      const res = await updateTask(data).unwrap();
      console.log(res, "view 45");
      Alert.alert("Success", "Photo saved successfully", [
        {
             text: "OK",
             onPress: () => router.push({
                pathname: "/SelectedImage",
                params: { client_uid: activeClientUid, task_id: activeTaskId },
              })
        }
      ]);

    } catch (err: any) {
      console.error("Upload failed:", err);
      const errorMessage = err?.data?.message || "Failed to save photo. Please try again.";
      Alert.alert("Error", errorMessage);
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
