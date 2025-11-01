import PlaceIcon from "@/components/Custom/PlaceIcon";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

interface IconItem {
  name: string;
  iconSet: string;
  iconName: string;
}

interface IconGridProps {
  onIconPress?: (icon: IconItem) => void;
}

const IconGrid: React.FC<IconGridProps> = ({ onIconPress }) => {
  const icons: IconItem[] = [
    { name: "Rainbow", iconSet: "Entypo", iconName: "rainbow" },
    { name: "Box", iconSet: "AntDesign", iconName: "inbox" },
    { name: "Paint drop", iconSet: "FontAwesome5", iconName: "hand-sparkles" },
    { name: "Hand (palm)", iconSet: "FontAwesome5", iconName: "hand-paper" },
    { name: "Star", iconSet: "Entypo", iconName: "star-outlined" },
    { name: "Leaf", iconSet: "Ionicons", iconName: "leaf-outline" },
    { name: "Sparkle", iconSet: "AntDesign", iconName: "checkcircleo" },
    {
      name: "Check mark",
      iconSet: "MaterialCommunityIcons",
      iconName: "palette-outline",
    },
    { name: "Camera", iconSet: "MaterialIcons", iconName: "icecream" },
    {
      name: "Color palette",
      iconSet: "MaterialCommunityIcons",
      iconName: "calendar-star",
    },
    { name: "Water drop", iconSet: "Entypo", iconName: "cross" },
    { name: "Scissors", iconSet: "MaterialIcons", iconName: "format-paint" },
    { name: "cut", iconSet: "MaterialIcons", iconName: "content-cut" },
    { name: "Timer", iconSet: "Ionicons", iconName: "brush-outline" },
    { name: "Clock", iconSet: "FontAwesome6", iconName: "droplet" },
    { name: "Fire", iconSet: "FontAwesome5", iconName: "fire-alt" },
    { name: "Flower", iconSet: "FontAwesome6", iconName: "person-dress" },
    { name: "Eyebrow", iconSet: "FontAwesome6", iconName: "bowl-rice" },
    { name: "Eyelash", iconSet: "Ionicons", iconName: "ear-outline" },
    {
      name: "Nail",
      iconSet: "MaterialCommunityIcons",
      iconName: "flower-outline",
    },
    { name: "Brush / Pen", iconSet: "Entypo", iconName: "circle" },
    { name: "Scraper", iconSet: "FontAwesome5", iconName: "square" },
    { name: "Clothes", iconSet: "Ionicons", iconName: "triangle-outline" },
    {
      name: "Magic",
      iconSet: "MaterialCommunityIcons",
      iconName: "star-four-points",
    },
    { name: "Breeze / Wind", iconSet: "Ionicons", iconName: "camera-outline" },
    {
      name: "Cream (whipped shape)",
      iconSet: "AntDesign",
      iconName: "clockcircleo",
    },
    { name: "Steam", iconSet: "FontAwesome5", iconName: "wind" },
    { name: "Pusher", iconSet: "FontAwesome", iconName: "magic" },
    { name: "Ear", iconSet: "Entypo", iconName: "eye" },
    {
      name: "timer",
      iconSet: "MaterialCommunityIcons",
      iconName: "timer-outline",
    },
    {
      name: "1 (number1)",
      iconSet: "MaterialCommunityIcons",
      iconName: "numeric-1",
    },
    {
      name: "2 (number2)",
      iconSet: "MaterialCommunityIcons",
      iconName: "numeric-2",
    },
    {
      name: "3 (number3)",
      iconSet: "MaterialCommunityIcons",
      iconName: "numeric-3",
    },
    {
      name: "4 (number4)",
      iconSet: "MaterialCommunityIcons",
      iconName: "numeric-4",
    },
    { name: "Question", iconSet: "AntDesign", iconName: "questioncircleo" },
    { name: "swap", iconSet: "AntDesign", iconName: "swap" },
  ];

  const iconComponents: Record<string, any> = {
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    MaterialIcons,
    Ionicons,
    MaterialCommunityIcons,
    Entypo,
    AntDesign,
  };

  const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null);

  const handlePress = (icon: IconItem) => {
    const newSelected = selectedIcon?.name === icon.name ? null : icon; // Toggle: deselect if same
    setSelectedIcon(newSelected);
    if (onIconPress) {
      onIconPress(newSelected || icon);
    }
  };

  return (
    <ScrollView className="flex-1 p-4">
      <View className="flex-row flex-wrap justify-between">
        {icons.map((item) => {
          const IconComponent = iconComponents[item.iconSet];
          const isSelected = selectedIcon?.name === item.name;

          return (
            <TouchableOpacity
              key={item.name}
              className="w-1/4 p-2 items-center"
              onPress={() => handlePress(item)}
            >
              <View
                className={` ${isSelected ? "border-2 border-cyan-500" : ""}`}
                style={{
                  borderColor: isSelected ? "#06B6D4" : "transparent",
                  backgroundColor: isSelected ? "#ECFEFF" : "transparent", // Optional: highlight background
                  borderRadius: 999,
                }}
              >
                <PlaceIcon>
                  {IconComponent ? (
                    <IconComponent
                      name={item.iconName}
                      size={24}
                      color={isSelected ? "#06B6D4" : "#00B8D4"}
                    />
                  ) : null}
                </PlaceIcon>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default IconGrid;
