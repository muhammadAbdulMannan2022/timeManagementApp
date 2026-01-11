import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import IconGrid from "./Icons";

interface SettingsUpdateProps {
  setIsEditing: (data: boolean) => void;
  setIsEditingId: (data: any) => void;
  onSubmitEdit: (icon: any, name: any, time: any) => void;
  initialData?: any;
}

const formatTimeToHHMMSS = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // Pad with leading zeros to ensure HH:mm:ss format
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(secs).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const parseTimeToMinutes = (timeStr: string) => {
  if (!timeStr) return 0;
  const parts = timeStr.split(":");
  // Handle basic cases like "MM" or "HH:MM" or "HH:MM:SS"
  if (parts.length === 1) return parseInt(parts[0]);
  if (parts.length >= 2) {
      const hh = parseInt(parts[0]) || 0;
      const mm = parseInt(parts[1]) || 0;
      // We ignore seconds for the minute input usually, or round them?
      // let's just stick to hours * 60 + minutes
      return hh * 60 + mm;
  }
  return 0;
};

export default function SettingsUpdate({
  setIsEditing,
  setIsEditingId,
  onSubmitEdit,
  initialData,
}: SettingsUpdateProps) {
  const { t } = useTranslation();
  const [text, setText] = useState(initialData?.task_name || "");
  const [time, setTime] = useState(initialData?.target_time ? parseTimeToMinutes(initialData.target_time) : 0);
  const [icon, setIcon] = useState(
      initialData 
      ? { iconSet: initialData.iconType, iconName: initialData.iconName } 
      : undefined
  );

  const submitData = async () => {
    const timeFormated = formatTimeToHHMMSS(time * 60);
    onSubmitEdit(icon, text, timeFormated);
    setIsEditingId(null);
    setIsEditing(false);
  };

  return (
    <View className="p-5 pt-2">
      <View
        className="border px-5 py-3 mb-5 border-gray-200 flex-row items-center"
        style={{ borderRadius: 10, borderColor: "#e5e7eb" }}
      >
        {/* <Text className="text-xl font-medium  ">{t('settingsUpd.enterText')}</Text> */}
        <TextInput
          className=" flex-1 h-full p-3  rounded-lg"
          placeholder={t("settingsUpd.typeSomething")}
          value={text}
          onChangeText={setText}
        />
      </View>

      <View
        className="flex-row items-center border border-gray-200 px-5 py-3 gap-2 justify-between"
        style={{ borderRadius: 10, borderColor: "#e5e7eb" }}
      >
        {/* <Text className="text-xl font-medium mb-2">{t('settingsUpd.setTimer')}</Text> */}
        <View
          className="flex-row gap-3 flex-1 justify-between"
          style={{ borderRadius: 10, borderColor: "#e5e7eb" }}
        >
          <TouchableOpacity
            onPress={() => {
              if (time > 10) {
                return setTime((time) => (time -= 10));
              }
            }}
            className="p-2 border border-gray-200"
            style={{ borderRadius: "100%" }}
          >
            <Entypo name="minus" size={24} color="#00B8D4" />
          </TouchableOpacity>
          <Text className="text-lg p-3 rounded-lg">{time} m</Text>
          <TouchableOpacity
            onPress={() => {
              setTime((time) => (time += 10));
            }}
            className="p-2 border border-gray-200"
            style={{ borderRadius: "100%" }}
          >
            <Entypo name="plus" size={24} color="#00B8D4" />
          </TouchableOpacity>
        </View>
      </View>

      <IconGrid onIconPress={(e) => setIcon(e)} />

      <View className="flex-row justify-end mt-5 space-x-3 gap-2">
        <TouchableOpacity
          className="bg-white w-1/2 border-2 border-[#00B8D4] px-6 py-2 rounded-lg"
          onPress={() => {
            setIsEditingId(null);
            setIsEditing(false);
          }}
        >
          <Text className="text-base text-black text-center">
            {t("settingsUpd.cancel")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#00B8D4] w-1/2 px-6 py-2 rounded-lg"
          onPress={() => {
            submitData();
          }}
        >
          <Text className="text-base text-white text-center">
            {t("settingsUpd.save")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
