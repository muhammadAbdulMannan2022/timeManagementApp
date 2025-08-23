import { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, View } from "react-native";

const filters = ["1W", "1M", "6M", "1Y"];

export default function FilterBar({ active, setActive }: { active: number; setActive: (i: number) => void }) {
    const animValues = useRef<Animated.Value[]>(filters.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        filters.forEach((_, i) => {
            Animated.timing(animValues[i], {
                toValue: i === active ? 1 : 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        });
    }, [active]);

    return (
        <View className="flex-row justify-between px-4 py-2 bg-white rounded-xl shadow-md">
            {filters.map((f, index) => {
                const backgroundColor = animValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ffffff", "#00B8D4"],
                });

                const textColor = animValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#222", "#fff"],
                });

                return (
                    <TouchableOpacity key={f} onPress={() => setActive(index)} activeOpacity={0.8}>
                        <Animated.View
                            style={{
                                backgroundColor,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 12,

                            }}
                        >
                            <Animated.Text style={{ color: textColor, fontWeight: "bold", fontSize: 16 }}>
                                {f}
                            </Animated.Text>
                        </Animated.View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
