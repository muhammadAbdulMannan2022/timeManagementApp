import ServiceDetailsItems from "@/components/Custom/ServiceDetailsItems";
import { resetStep } from "@/redux/slices/stepSlice";
import { RootState } from "@/redux/store";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function CompleteIndex() {
    const paddingAnim = useRef(new Animated.Value(10)).current; // start from 10
    const stepData = useSelector((state: RootState) => state.clientRecords.processes[0])
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(paddingAnim, {
                    toValue: 25, // max padding
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: false, // padding can't use native driver
                }),
                Animated.timing(paddingAnim, {
                    toValue: 10, // min padding
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);
    return (
        <View className="flex-1">
            <SafeAreaView className="bg-white flex-1">
                <ScrollView className="flex-1">
                    <View>
                        <ImageBackground
                            source={require("@/assets/bg/done.png")}
                            style={{ flex: 1, justifyContent: "center" }}
                            className="bg-no-repeat bg-cover h-[30vh] items-center justify-center"
                        >
                            <View>
                                <Animated.View className={` border-[5px] border-[#ffd50217] rounded-full`} style={{ padding: paddingAnim }}>
                                    <Animated.View className={`border-[5px] border-[#ffd5022a] rounded-full`} style={{ padding: paddingAnim }}>
                                        <View className="bg-white rounded-full">
                                            <View className="p-5 border-[3px] border-[#FFD30269] bg-[#FFEFA736] rounded-full" >
                                                <Image source={require("@/assets/bg/trophy.png")} />
                                            </View>
                                        </View>
                                    </Animated.View>
                                </Animated.View>
                            </View>
                        </ImageBackground>
                        <View className="flex-col px-8">
                            <View className="items-center justify-center">
                                <Text className="text-4xl font-bold text-[#222324]">Service Complete</Text>
                                <View className="w-[150px] rounded-full my-8 h-2 bg-[#FAD50E]"></View>
                                <View className="flex-row items-center gap-2">
                                    <View className="w-2 h-2  bg-[#00B8D4]" style={{ borderRadius: "100%" }}></View>
                                    <View className="w-[80px] h-1 bg-gray-300"></View>
                                    <View className="w-2 h-2  bg-[#00B8D4]" style={{ borderRadius: "100%" }}></View>
                                </View>
                            </View>
                            <View className="items-center justify-center py-12">
                                <Text className="text-xl font-extrabold text-[#818181] py-6">Client 80</Text>
                                <View className="flex-row items-center justify-between px-5 py-4 border-2 rounded-2xl gap-5 border-[#F8E65C] bg-[#FFFCEB]" style={{ shadowColor: "#F8E65C", shadowRadius: 20, shadowOpacity: 0.2 }}>
                                    <MaterialIcons name="offline-bolt" size={40} color="#F8E65C" />
                                    <View className="items-center justify-center">
                                        <Text className="text-[#A0A0A0] text-2xl font-bold">Lightning Efficiency</Text>
                                        <Text className="text-[#A0A0A0] text-lg font-bold">370% efficiency</Text>
                                    </View>
                                </View>
                            </View>
                            <View className='bg-white rounded-xl shadow p-4 mb-4 gap-4'>
                                <View className='flex-row items-center justify-between'>
                                    <Text className='text-lg font-semibold text-gray-400'>Target Time</Text>
                                    <Text className='text-xl font-bold text-black'>00:50:00</Text>
                                </View>
                                <View className='flex-row items-center justify-between'>
                                    <Text className='text-lg font-semibold text-gray-400'>Total Time</Text>
                                    <Text className='text-xl font-bold text-black'>00:45:00</Text>
                                </View>
                                <View className='flex-row items-center justify-between mt-5'>
                                    <Text className='text-lg font-semibold text-gray-400'>Time Difference</Text>
                                    <Text className='text-xl font-bold text-[#00B8D4]'>Ahed 00:05:00</Text>
                                </View>
                            </View>
                            <View

                                className='border border-[#ececec] rounded-xl p-5 mt-4'
                            >
                                <View className='flex-row gap-2 items-center mb-2'>

                                    <Text className='text-xl font-bold'>Step Details</Text>
                                    <Text className='text-[#818181] ml-auto'>
                                        {new Date().toLocaleDateString('en-US', {
                                            weekday: 'long',
                                        })}
                                    </Text>
                                </View>
                                <View>
                                    {
                                        stepData.steps.map((step) => <ServiceDetailsItems key={step.id} item={step} />)
                                    }
                                </View>
                            </View>
                            <View className="py-8 gap-3">
                                <TouchableOpacity className="flex-row items-center gap-5 py-4 rounded-xl border-2 border-[#00b8d4b6] justify-center">
                                    <Ionicons name="download" size={24} color="#00B8D4" />
                                    <Text className="text-[#00B8D4] text-lg font-semibold">Download Report</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    dispatch(resetStep())
                                    router.push("/(tabs)")
                                }} className="flex-row items-center gap-5 py-4 rounded-xl border-2 border-[#00b8d4b7] justify-center bg-[#00B8D4]">
                                    <FontAwesome6 name="circle-plus" size={24} color="#ffffff" />
                                    <Text className="text-white text-lg font-semibold">New Service</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
