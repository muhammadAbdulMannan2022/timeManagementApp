// App.tsx
import { Ionicons } from "@expo/vector-icons";
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

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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

  // Build marked dates with dots
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
    const prev = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    setCurrentMonth(prev);
  };

  const goNextMonth = () => {
    const next = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    setCurrentMonth(next);
  };

  // Always return YYYY-MM-DD format for current
  const getCalendarCurrentMonth = () => {
    const y = currentMonth.getFullYear();
    const m = (currentMonth.getMonth() + 1).toString().padStart(2, "0");
    return `${y}-${m}-01`;
  };

  // Use key prop to force re-render when month changes
  const calendarKey = getCalendarCurrentMonth();

  return (
    <View className="flex-1 bg-white pt-16 px-4">
      <ScrollView>
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={goPrevMonth}>
            <Ionicons name="chevron-back" size={28} color="#00B8D4" />
          </TouchableOpacity>
          {/* 👇 only month name, no year */}
          <Text className="text-xl font-bold">
            {monthNames[currentMonth.getMonth()]}
          </Text>
          <TouchableOpacity onPress={goNextMonth}>
            <Ionicons name="chevron-forward" size={28} color="#00B8D4" />
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <Calendar
          key={calendarKey}
          onDayPress={onDayPress}
          current={getCalendarCurrentMonth()}
          markingType="dot"
          markedDates={{
            ...markedDates,
            ...(selectedDate
              ? {
                [selectedDate]: {
                  selected: true,
                  selectedColor: "#FF6B6B",
                  marked: true,
                  dotColor: "#00B8D4",
                },
              }
              : {}),
          }}
          hideArrows={true} // custom arrows
          renderHeader={() => <View />} // hide built-in month/year, keep weekdays
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#000000", // day names color
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
        {
          Array(100).fill(0).map((_, i) => <Text key={i}>hello</Text>)
        }
      </ScrollView>

    </View>
  );
}
