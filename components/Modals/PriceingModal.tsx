import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FreePlanPage from "./plans/Free";
import PremiumPlanPage from "./plans/Premium";

interface PricingModalProps {
  visible: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);

  const handleTabChange = (index: number) => {
    setPage(index);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 relative">
          {/* Close Button */}
          <View className="px-5 py-2 flex-row justify-end">
              <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
                <Entypo name="cross" size={24} color="black" />
              </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View className="flex-row justify-around mb-4 border-b border-gray-100 pb-2 mx-4">
            <TouchableOpacity onPress={() => handleTabChange(0)} className="pb-2" style={{ borderBottomWidth: page === 0 ? 2 : 0, borderColor: '#00B8D4'}}>
              <Text
                className={`text-lg font-bold ${page === 0 ? "text-[#00B8D4]" : "text-gray-500"}`}
              >
                {t("pricing.tabs.free")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabChange(1)} className="pb-2" style={{ borderBottomWidth: page === 1 ? 2 : 0, borderColor: '#00B8D4'}}>
              <Text
                className={`text-lg font-bold ${page === 1 ? "text-[#00B8D4]" : "text-gray-500"}`}
              >
                {t("pricing.tabs.premium")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            {page === 0 ? <FreePlanPage /> : <PremiumPlanPage />}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PricingModal;
