import { RootState } from "@/redux/store";
import { Ionicons } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    Easing,
    cancelAnimation,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { useSelector } from "react-redux";
import DynamicStepIndicator from "../helpers/StepIndicator";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Timer({ time = 1, type, client }: { time?: number, type?: string, client?: string }) {
    const { currentStep } = useSelector((state: RootState) => state.step)
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [playing, setPlaying] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | any>(null);

    const { width } = Dimensions.get("window");
    const outerSize = width * 0.6;
    const innerSize = 200;
    const outerRadius = outerSize / 2;
    const innerRadius = innerSize / 2;

    const scale = useSharedValue(1);
    const animatedOrbitRadius = useSharedValue(innerRadius - 14);

    const NUM_DOTS = 15;
    const angle = Math.PI / 2;
    const svgSize = outerSize * 1.5;
    const svgCenter = svgSize / 2;

    const totalSeconds = time * 60;

    // Timer logic
    useEffect(() => {
        if (playing) {
            intervalRef.current = setInterval(() => {
                setCurrentTime((prev) => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [playing]);

    const toggleAnimation = () => {
        if (playing) {
            cancelAnimation(scale);
            cancelAnimation(animatedOrbitRadius);
            scale.value = withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) });
            animatedOrbitRadius.value = withTiming(innerRadius - 10, { duration: 500, easing: Easing.inOut(Easing.ease) });
            setPlaying(false);
        } else {
            scale.value = withRepeat(
                withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );
            animatedOrbitRadius.value = withRepeat(
                withTiming(innerRadius + 15, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );
            setPlaying(true);
        }
    };

    const rewind = () => {
        cancelAnimation(scale);
        cancelAnimation(animatedOrbitRadius);
        scale.value = withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) });
        animatedOrbitRadius.value = withTiming(innerRadius - 10, { duration: 500, easing: Easing.inOut(Easing.ease) });
        setPlaying(false);
        setCurrentTime(0);
    };

    const animatedProps = useAnimatedProps(() => ({
        r: outerRadius * scale.value,
    }));

    const OrbitingDot = ({ index }: any) => {
        const dotAnimatedProps = useAnimatedProps(() => {
            const dotAngle = angle + (index * (2 * Math.PI)) / NUM_DOTS;
            const cx = svgCenter + animatedOrbitRadius.value * Math.cos(dotAngle);
            const cy = svgCenter + animatedOrbitRadius.value * Math.sin(dotAngle);
            return { cx, cy };
        });

        return <AnimatedCircle animatedProps={dotAnimatedProps} r={3} fill={progressColor} />;
    };

    const tabBarHeight = useBottomTabBarHeight();

    // format seconds to mm:ss
    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    // pick color based on progress
    const progress = currentTime / totalSeconds;
    let progressColor = "#00ff00"; // green
    if (progress >= 0.8) progressColor = "#ff0000"; // red
    else if (progress >= 0.5) progressColor = "#ffcc00"; // yellow

    return (
        <View
            className="py-10"
            style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: tabBarHeight + 10,
            }}
        >
            <View>
                <Text className="text-lg font-bold text-center text-secondary-default">Client {client || 81}</Text>
                <Text className="text-3xl font-bold text-center capitalize" style={{ color: progressColor }}>
                    {type || "Removal"}
                </Text>
            </View>

            <View
                style={{
                    width: svgSize,
                    height: svgSize,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Svg height={svgSize} width={svgSize}>
                    <Defs>
                        <RadialGradient id="grad" cx="50%" cy="50%" r="55%">
                            <Stop offset="0%" stopColor={progressColor} stopOpacity="0.6" />
                            <Stop offset="100%" stopColor={progressColor} stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <AnimatedCircle
                        animatedProps={animatedProps}
                        cx={svgCenter}
                        cy={svgCenter}
                        fill="url(#grad)"
                    />
                    {Array.from({ length: NUM_DOTS }).map((_, i) => (
                        <OrbitingDot key={i} index={i} />
                    ))}
                </Svg>

                <View
                    style={{
                        position: "absolute",
                        width: innerSize,
                        height: innerSize,
                        borderRadius: innerRadius,
                        borderColor: progressColor,
                    }}
                    className="items-center justify-center bg-white border-[8px]"
                >
                    <Text className="text-secondary-default text-4xl">{formatTime(currentTime)}</Text>
                    <Text className="text-secondary-default mt-2">Target {time ? `${time}:00` : "00:00"}</Text>

                </View>
                {currentTime > totalSeconds && (
                    <View className="mt-3 rounded bg-red-100 absolute bottom-5 flex-row items-center justify-center px-5 py-3 gap-3">
                        <FontAwesome name="warning" size={18} color={"#ff0000"} />
                        <Text className="text-red-600 font-bold">Over Time {currentTime - time}</Text>
                    </View>
                )}
            </View>

            <View className="w-screen px-5 items-center justify-center gap-y-16">
                <View className="w-1/3">
                    <DynamicStepIndicator
                        currentStep={currentStep}
                        totalSteps={4}
                        stepColors={["#00ff00", "#55ff55", "#aaffaa", "#aaffaa"]}
                        inactiveColor="#00ff00"
                        lineColor="#00ff00"
                    />
                </View>

                <View className="w-full flex-row justify-around items-center" style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={rewind} className="w-12 h-12 items-center justify-center rounded-full">
                        <Ionicons name="refresh" size={24} color={progressColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={toggleAnimation}
                        className="w-24 h-24 rounded-full items-center justify-center"
                        style={{
                            backgroundColor: progressColor,
                            shadowColor: progressColor,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.5,
                            shadowRadius: 6,
                            elevation: 8,
                        }}
                    >
                        <View className="w-full h-full items-center justify-center">
                            <Ionicons name={playing ? "pause" : "play"} size={36} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="w-12 h-12 items-center justify-center rounded-full"
                        onPress={() => {
                            cancelAnimation(scale);
                            cancelAnimation(animatedOrbitRadius);
                            scale.value = withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) });
                            animatedOrbitRadius.value = withTiming(innerRadius - 10, { duration: 500, easing: Easing.inOut(Easing.ease) });
                            setPlaying(false);
                            setShowModal(true); // manual complete
                        }}
                    >
                        <Ionicons name="checkmark" size={24} color={progressColor} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Completion Modal */}
            <Modal transparent={true} visible={showModal} animationType="fade">
                <View className="flex-1 items-center justify-center bg-black/50">
                    <View className="bg-white rounded-2xl p-8 md:p-12 items-center">
                        <View className="flex-col items-center justify-center">
                            <Entypo name="camera" size={34} color="#00B8D4" className="mb-5" />
                            <Text className="text-[#00B8D4] text-3xl font-extrabold mb-2">Design Complete</Text>
                            <Text className="font-extrabold text-xl text-[#818181] mb-6">Take photo?</Text>
                        </View>
                        <View className="flex-row items-center justify-center gap-4">
                            <TouchableOpacity className="bg-blue-400 px-8 py-3 rounded-lg flex-row items-center justify-center gap-2">
                                <Entypo name="camera" size={20} color="white" />
                                <Text className="text-white font-semibold">Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-gray-200 px-8 py-3 rounded-lg">
                                <Text className="text-gray-700 font-semibold">Skip</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
