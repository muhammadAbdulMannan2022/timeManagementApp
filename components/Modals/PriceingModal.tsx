import { Entypo } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import FreePlanPage from "./plans/Free";
import PremiumPlanPage from "./plans/Premium";

interface PricingModalProps {
    visible: boolean;
    onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ visible, onClose }) => {
    const pagerRef = useRef<PagerView>(null);
    const [page, setPage] = useState(0);

    const handleTabChange = (index: number) => {
        setPage(index);
        pagerRef.current?.setPage(index);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View className="flex-1 bg-black/40 justify-center items-center relative">
                <View className="bg-white w-11/12 h-3/4 rounded-2xl p-4 pt-14">
                    {/* Tabs */}
                    <View className="flex-row justify-around mb-4">
                        <TouchableOpacity onPress={() => handleTabChange(0)}>
                            <Text className={`text-lg font-bold ${page === 0 ? "text-[#00B8D4]" : "text-gray-500"}`}>
                                Free
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleTabChange(1)}>
                            <Text className={`text-lg font-bold ${page === 1 ? "text-[#00B8D4]" : "text-gray-500"}`}>
                                Premium
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Pager */}
                    <PagerView
                        ref={pagerRef}
                        style={{ flex: 1 }}
                        initialPage={0}
                        onPageSelected={(e) => setPage(e.nativeEvent.position)}
                    >
                        {/* Free Tab */}
                        <View key="1" className="flex-1 items-center justify-center">
                            <FreePlanPage />
                        </View>

                        {/* Premium Tab */}
                        <View key="2" className="flex-1 items-center justify-center">
                            <PremiumPlanPage />
                        </View>
                    </PagerView>

                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="absolute top-5 left-5"
                    >
                        <Entypo name="cross" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default PricingModal;
