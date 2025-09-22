import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, View } from "react-native";
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
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center relative">
        <View className="bg-white w-11/12 h-3/4 rounded-2xl p-4 pt-14">
          {/* Tabs */}
          <View className="flex-row justify-around mb-4">
            <TouchableOpacity onPress={() => handleTabChange(0)}>
              <Text
                className={`text-lg font-bold ${page === 0 ? "text-[#00B8D4]" : "text-gray-500"}`}
              >
                {t("pricing.tabs.free")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabChange(1)}>
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

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} className="absolute top-5 left-5">
            <Entypo name="cross" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PricingModal;
