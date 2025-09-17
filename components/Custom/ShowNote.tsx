import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Text, View } from "react-native";
import PlaceIcon from "./PlaceIcon";

const iconComponents = {
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
};

export default function ShowNote({ item, icon }: any) {
  const {
    iconType: iconType,
    iconName: iconName,
    iconColor: iconColor,
  } = icon || {};

  // Get the right icon component
  const IconComponent = iconType ? (iconComponents as any)[iconType] : null;

  return (
    <View className="flex-row items-start justify-between mt-5">
      <PlaceIcon>
        {IconComponent && iconName ? (
          <IconComponent
            name={iconName}
            size={24}
            color={iconColor || "#000"}
          />
        ) : null}
      </PlaceIcon>
      <View className="ml-2 flex-1 mt-5">
        <Text
          className="text-lg font-bold"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.task_name || "unknown task"}
        </Text>
        <Text className="text-[#818181] flex-wrap">
          {item?.note || "No note available"}
        </Text>
      </View>
    </View>
  );
}
