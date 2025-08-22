import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

type MarkedDatesType = Record<
  string,
  {
    selected?: boolean;
    selectedColor?: string;
    marked?: boolean;
    dotColor?: string;
  }
>;

export default function App() {
  const datesList: string[] = ["2025-08-21", "2025-08-22", "2025-08-25", "2025-09-03"];
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const bottomBarHeight = useBottomTabBarHeight();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const markedDates: MarkedDatesType = datesList.reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: "#00B8D4" };
    return acc;
  }, {} as MarkedDatesType);

  const onDayPress = (day: DateData) => {
    if (datesList.includes(day.dateString)) {
      setSelectedDate(day.dateString);
      Alert.alert("Selected Date", day.dateString);
    }
  };

  const goPrevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(prev);
  };

  const goNextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(next);
  };

  const getCalendarCurrentMonth = () => {
    const y = currentMonth.getFullYear();
    const m = (currentMonth.getMonth() + 1).toString().padStart(2, "0");
    return `${y}-${m}-01`;
  };

  // Format date for header
  const formatHeaderDate = () => {
    const selected = selectedDate ? new Date(selectedDate) : new Date();
    const current = new Date(getCalendarCurrentMonth());
    // Check if selected date's month and year match the current displayed month
    if (
      selected.getMonth() === current.getMonth() &&
      selected.getFullYear() === current.getFullYear()
    ) {
      return `${monthNames[selected.getMonth()]} ${selected.getDate()}, ${selected.getFullYear()}`;
    }
    // Show only month and year if selected date is not in the current month
    return `${monthNames[current.getMonth()]} ${current.getFullYear()}`;
  };

  const calendarKey = getCalendarCurrentMonth();

  return (
    <View className="flex-1 bg-white pt-16" style={{ paddingBottom: bottomBarHeight }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <View className="flex-row items-center gap-4 my-8">
          <Ionicons name="calendar-sharp" size={40} color="#00B8D4" />
          <View>
            <Text className="text-[#00B8D4] text-3xl font-bold">Service Calendar</Text>
            <Text className="text-[#818181] text-xl">Professional nail service tracking</Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#ffffff",
            shadowColor: "#818181",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 1.5,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginBottom: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity className="bg-[#00B8D42E] p-1.5 rounded-full" onPress={goPrevMonth}>
            <Ionicons name="chevron-back" size={28} color="#00B8D4" />
          </TouchableOpacity>
          <Text className="text-xl font-bold" style={{ flexShrink: 1 }}>
            {formatHeaderDate()}
          </Text>
          <TouchableOpacity className="bg-[#00B8D42E] p-1.5 rounded-full" onPress={goNextMonth}>
            <Ionicons name="chevron-forward" size={28} color="#00B8D4" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: "#ffffff",
            shadowColor: "#000000",
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 1.5,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Calendar
            key={calendarKey}
            onDayPress={onDayPress}
            current={getCalendarCurrentMonth()}
            markingType="dot"
            markedDates={{
              ...markedDates,
              [selectedDate]: {
                selected: true,
                selectedColor: "#FF6B6B",
                marked: datesList.includes(selectedDate),
                dotColor: "#00B8D4",
              },
            }}
            hideArrows={true}
            renderHeader={() => <View />}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#000000",
              dayTextColor: "#000000",
              todayBackgroundColor: "#00B8D4",
              todayTextColor: "#000000",
              selectedDayBackgroundColor: "#FF6B6B",
              selectedDayTextColor: "#ffffff",
              textDisabledColor: "#999999",
              dotColor: "#00B8D4",
              selectedDotColor: "#ffffff",
              textDayFontWeight: "bold",
              textDayHeaderFontWeight: "bold",
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}