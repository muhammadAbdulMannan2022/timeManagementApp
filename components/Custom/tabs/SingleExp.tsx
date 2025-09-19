import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

export default function SingleExport({ id, state }: { id: any; state: any }) {
  const { selected, setSelected } = state;
  //   const [selected, setSelected] = useState("today_works");

  const { t } = useTranslation();
  const options = [
    {
      key: "today",
      title: t("calendar.singleExport.options.today.title"),
      subtitle: `2 ${t("calendar.singleExport.options.today.subtitle")}`,
      icon: { name: "calendar-today", color: "#00B8D4" },
    },
    {
      key: "recent_task",
      title: t("calendar.singleExport.options.recent.title"),
      subtitle: `2 ${t("calendar.singleExport.options.recent.subtitle")}`,
      icon: { name: "history", color: "#00B8D4" },
    },
    {
      key: "this_week",
      title: t("calendar.singleExport.options.week.title"),
      subtitle: `2 ${t("calendar.singleExport.options.week.subtitle")}`,
      icon: { name: "calendar-month", color: "#00B8D4" },
    },
  ];

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-lg font-bold mb-4">
        {t("calendar.singleExport.selectRange")}
      </Text>

      {options.map((item) => {
        const isActive = selected === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => {
              setSelected(item.key);
            }}
            className="flex-row my-2 border px-4 py-4 items-center rounded-lg "
            style={{ borderColor: isActive ? "#00B8D4" : "#68686870" }}
          >
            {/* Left side */}
            <View className="flex-row items-center gap-3 flex-1">
              <MaterialIcons
                name={item.icon.name as any}
                size={24}
                color={item.icon.color}
              />
              <View className="flex-1">
                <Text
                  className={`font-semibold ${
                    isActive ? "text-[#00B8D4]" : "text-black"
                  }`}
                >
                  {item.title}
                </Text>
                <Text className="text-gray-500 text-sm">{item.subtitle}</Text>
              </View>
            </View>

            {/* Checkmark if active */}
            {isActive && (
              <MaterialIcons name="check-circle" size={22} color="#00B8D4" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
