import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { Button, Dimensions, Text, View } from "react-native";
import Animated, {
    Easing,
    cancelAnimation,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Timer() {
    const { width } = Dimensions.get("window");
    const outerSize = width * 0.6; // max outer circle size
    const innerSize = 200; // fixed inner circle size
    const outerRadius = outerSize / 2;
    const innerRadius = innerSize / 2;
    // orbits
    // const orbitRadius = innerRadius;
    const [orbitRadius, setOrbitRadius] = useState(innerRadius - 10)
    const NUM_DOTS = 15
    const angle = Math.PI / 2

    const [playing, setPlaying] = useState(false);
    const scale = useSharedValue(1);

    const startAnimation = () => {
        setOrbitRadius(innerRadius + 15)
        scale.value = withRepeat(
            withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        setPlaying(true);
    };

    const stopAnimation = () => {
        setOrbitRadius(innerRadius - 10)
        cancelAnimation(scale);
        scale.value = 1;
        setPlaying(false);
    };

    const animatedProps = useAnimatedProps(() => ({
        r: outerRadius * scale.value,
    }));

    const tabBarHeight = useBottomTabBarHeight();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: tabBarHeight + 10,
            }}
        >
            {/* Top text */}
            <Text className="text-lg font-bold text-secondary-default">Client 80</Text>

            {/* Center wrapper */}
            <View
                style={{
                    width: outerSize * 1.5,
                    height: outerSize * 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {/* Animated outer gradient */}
                <Svg height={outerSize * 1.5} width={outerSize * 1.5}>
                    <Defs>
                        <RadialGradient id="grad" cx="50%" cy="50%" r="55%">
                            <Stop offset="0%" stopColor="#00ff00" stopOpacity="0.6" />
                            <Stop offset="100%" stopColor="#00ff00" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <AnimatedCircle
                        animatedProps={animatedProps}
                        cx={(outerSize * 1.5) / 2}
                        cy={(outerSize * 1.5) / 2}
                        fill="url(#grad)"
                    />
                    {Array.from({ length: NUM_DOTS }).map((_, i) => {
                        const dotAngle = angle + (i * (2 * Math.PI) / NUM_DOTS);
                        const x = (outerSize * 1.5) / 2 + orbitRadius * Math.cos(dotAngle);
                        const y = (outerSize * 1.5) / 2 + orbitRadius * Math.sin(dotAngle);
                        return (
                            <Circle
                                key={i}
                                cx={x}
                                cy={y}
                                r={3}
                                fill={`#00ff00`}
                            />
                        );
                    })}
                </Svg>

                {/* Inner fixed circle */}
                <View
                    style={{
                        position: "absolute", // center over gradient
                        width: innerSize,
                        height: innerSize,
                        borderRadius: innerRadius,
                        borderColor: "#00ff00",
                    }}
                    className="items-center justify-center bg-white border-[8px]"
                >
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>00:30</Text>
                </View>
            </View>

            {/* Controls */}
            <View style={{ flexDirection: "row", marginTop: 20, gap: 20 }}>
                <Button title="Play" onPress={startAnimation} disabled={playing} />
                <Button title="Stop" onPress={stopAnimation} disabled={!playing} />
            </View>
        </View>
    );
}
