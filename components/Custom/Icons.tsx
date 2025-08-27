import PlaceIcon from '@/components/Custom/PlaceIcon';
import { AntDesign, Entypo, FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

interface IconItem {
    name: string;
    iconSet: string;
    iconName: string;
}

interface IconGridProps {
    onIconPress?: (iconName: any) => void;
}

const IconGrid: React.FC<IconGridProps> = ({ onIconPress }) => {
    // Define the icons with corrected icon names
    const icons: IconItem[] = [
        { name: 'Rainbow', iconSet: 'Entypo', iconName: 'rainbow' },
        { name: 'Box', iconSet: 'AntDesign', iconName: 'inbox' },
        { name: 'Paint drop', iconSet: 'FontAwesome5', iconName: 'hand-sparkles' },
        { name: 'Hand (palm)', iconSet: 'FontAwesome5', iconName: 'hand-paper' },
        { name: 'Star', iconSet: 'Entypo', iconName: 'star-outlined' },
        { name: 'Leaf', iconSet: 'Ionicons', iconName: 'leaf-outline' },
        { name: 'Sparkle', iconSet: 'AntDesign', iconName: 'checkcircleo' },
        { name: 'Check mark', iconSet: 'MaterialCommunityIcons', iconName: 'palette-outline' },
        { name: 'Camera', iconSet: 'MaterialIcons', iconName: 'icecream' },
        { name: 'Color palette', iconSet: 'MaterialCommunityIcons', iconName: 'calendar-star' },
        { name: 'Water drop', iconSet: 'Entypo', iconName: 'cross' },
        { name: 'Scissors', iconSet: 'MaterialIcons', iconName: 'format-paint' },
        { name: 'cut', iconSet: 'MaterialIcons', iconName: 'content-cut' },
        { name: 'Timer', iconSet: 'Ionicons', iconName: 'brush-outline' },
        { name: 'Clock', iconSet: 'FontAwesome6', iconName: 'droplet' },
        { name: 'Fire', iconSet: 'FontAwesome5', iconName: 'fire-alt' },
        { name: 'Flower', iconSet: 'FontAwesome6', iconName: 'person-dress' },
        { name: 'Eyebrow', iconSet: 'FontAwesome6', iconName: 'bowl-rice' },
        { name: 'Eyelash', iconSet: 'Ionicons', iconName: 'ear-outline' },
        { name: 'Nail', iconSet: 'MaterialCommunityIcons', iconName: 'flower-outline' },
        { name: 'Brush / Pen', iconSet: 'Entypo', iconName: 'circle' },
        { name: 'Scraper', iconSet: 'FontAwesome5', iconName: 'square' },
        { name: 'Clothes', iconSet: 'Ionicons', iconName: 'triangle-outline' },
        { name: 'Magic', iconSet: 'MaterialCommunityIcons', iconName: 'star-four-points' },
        { name: 'Breeze / Wind', iconSet: 'Ionicons', iconName: 'camera-outline' },
        { name: 'Cream (whipped shape)', iconSet: 'AntDesign', iconName: 'clockcircleo' }, // Placeholder
        { name: 'Steam', iconSet: 'FontAwesome5', iconName: 'wind' }, // Placeholder
        { name: 'Pusher', iconSet: 'FontAwesome', iconName: 'magic' }, // Placeholder
        { name: 'Ear', iconSet: 'Entypo', iconName: 'eye' }, // Replaced ear
        { name: 'timer', iconSet: 'MaterialCommunityIcons', iconName: 'timer-outline' }, // Replaced ear
        { name: '1 (number1)', iconSet: 'MaterialCommunityIcons', iconName: 'numeric-1' },
        { name: '2 (number2)', iconSet: 'MaterialCommunityIcons', iconName: 'numeric-2' },
        { name: '3 (number3)', iconSet: 'MaterialCommunityIcons', iconName: 'numeric-3' },
        { name: '4 (number4)', iconSet: 'MaterialCommunityIcons', iconName: 'numeric-4' },
        { name: 'Question', iconSet: 'AntDesign', iconName: 'questioncircleo' },
        { name: 'swap', iconSet: 'AntDesign', iconName: 'swap' },

    ];

    // Map icon sets to their components
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

    // Handle icon press
    const handlePress = (icon: any) => {
        console.log(`Icon pressed: ${icon}`);
        if (onIconPress) {
            onIconPress(icon);
        }
    };

    return (
        <ScrollView className="flex-1 p-4">
            <View className="flex-row flex-wrap justify-between">
                {icons.map((item) => {
                    const IconComponent = iconComponents[item.iconSet];
                    return (
                        <TouchableOpacity
                            key={item.name}
                            className="w-1/4 p-2 items-center"
                            onPress={() => handlePress(item)}
                        >
                            <PlaceIcon>
                                {IconComponent && (
                                    <IconComponent name={item.iconName} size={24} color="#00B8D4" />
                                )}
                            </PlaceIcon>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
};

export default IconGrid;