import { Ionicons } from "@expo/vector-icons";
import {
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [id, setId] = useState("");
  const [stepId, setStepId] = useState("");

  // photo
  //   const { id, stepId } = useLocalSearchParams();
  useEffect(() => {
    (async () => {
      try {
        const storedId = await SecureStore.getItemAsync("item_id");
        const storedStepId = await SecureStore.getItemAsync("service_id");
        console.log("storedId raw:", storedId);
        console.log("storedStepId raw:", storedStepId);

        if (storedId) setId(storedId);
        if (storedStepId) setStepId(storedStepId);
      } catch (error) {
        console.log("Error reading SecureStore:", error);
      }
    })();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(id, stepId, "camers 46");
      router.push({
        pathname: "/View",
        params: {
          uri: photo.uri,
          width: String(photo.width),
          height: String(photo.height),
          format: photo.uri.split(".").pop() || "jpg",
          client_uid: id,
          task_id: stepId,
        },
      });
    }
  }

  function closeCamera() {
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" />
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          flash={flash}
          ref={cameraRef}
        />

        {/* Top Controls */}
        <View className="absolute top-5 left-6 right-6 flex-row justify-between">
          <TouchableOpacity
            onPress={() => setFlash((prv) => (prv === "on" ? "off" : "on"))}
            className="p-3"
          >
            <Ionicons
              name={
                flash === "on"
                  ? "flash"
                  : flash === "auto"
                    ? "flash-outline"
                    : "flash-off"
              }
              size={28}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity className="p-3">
            <Ionicons name="settings-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View className="absolute bottom-8 left-5 right-5 flex-row justify-between items-center">
          <TouchableOpacity className="p-3" onPress={closeCamera}>
            <Ionicons name="close" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-20 h-20 rounded-full bg-white items-center justify-center"
            onPress={takePicture}
          >
            <View className="w-[65px] h-[65px] rounded-full border-4" />
          </TouchableOpacity>
          <TouchableOpacity className="p-3" onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 0.8,
  },
});
