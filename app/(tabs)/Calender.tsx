import GradientTab from "@/components/Custom/GradientBar";
import ItemsCard from "@/components/Custom/ItemsCard";
import { RootState } from "@/redux/store";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useSelector } from "react-redux";

type MarkedDatesType = Record<
  string,
  {
    selected?: boolean;
    selectedColor?: string;
    marked?: boolean;
    dotColor?: string;
    disabled?: boolean; // Added for potential disabling
  }
>;

export default function App() {
  const records = useSelector((state: RootState) => state.clientRecords.tasks);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const datesList: string[] = records.map((item: any) => formatDate(item.date));

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const bottomBarHeight = useBottomTabBarHeight();
  const [clientRecordInADay, setClientRecordInADay] = useState<any[]>([]);

  useEffect(() => {
    console.log(datesList);
  }, [datesList]);

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

  // Highlight selected date for ALL dates
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: "#00B8D4",
      marked: datesList.includes(selectedDate), // Only show dot if date has data
      dotColor: "#00B8D4",
    };
  }

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    if (datesList.includes(day.dateString)) {
      Alert.alert("Selected Date", `Records available for ${day.dateString}`);
    } else {
      Alert.alert("Selected Date", `No records for ${day.dateString}`);
    }
  };

  const goPrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };
  const goNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };
  const getCalendarCurrentMonth = () => {
    const y = currentMonth.getFullYear();
    const m = String(currentMonth.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}-01`;
  };

  const formatHeaderDate = () => {
    const selected = new Date(selectedDate);
    const current = new Date(getCalendarCurrentMonth());
    if (
      selected.getMonth() === current.getMonth() &&
      selected.getFullYear() === current.getFullYear()
    ) {
      return `${monthNames[selected.getMonth()]} ${selected.getDate()}, ${selected.getFullYear()}`;
    }
    return `${monthNames[current.getMonth()]} ${current.getFullYear()}`;
  };

  useEffect(() => {
    if (records) {
      setClientRecordInADay(
        records.filter((item: any) => formatDate(item.date) === selectedDate)
      );
    }
  }, [records, selectedDate]);

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
            shadowColor: "#818181",
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 1.5,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Calendar
            key={getCalendarCurrentMonth()}
            onDayPress={onDayPress}
            current={getCalendarCurrentMonth()}
            markingType="dot"
            markedDates={markedDates}
            hideArrows={true}
            renderHeader={() => <View />}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#000000",
              dayTextColor: "#000000",
              todayBackgroundColor: "#00B8ff",
              todayTextColor: "#ffffff",
              selectedDayBackgroundColor: "#00B8D4",
              selectedDayTextColor: "#ffffff",
              textDisabledColor: "#999999",
              dotColor: "#00B8D4",
              selectedDotColor: "#ffffff",
              textDayFontWeight: "bold",
              textDayHeaderFontWeight: "bold",
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: "#ffffff",
            shadowColor: "#818181",
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 1.5,
            borderRadius: 8,
          }}
          className="mt-10 px-1 py-5"
        >
          <View className="flex-row items-center justify-between px-4">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="clock" size={24} color="#00B8D4" />
              <Text className="text-2xl font-bold">{clientRecordInADay.length}/{records.length} Records</Text>
            </View>
            <View className="bg-[#00B8D447] px-4 py-2 rounded-full">
              <Text className="text-[#00B8D4]">{clientRecordInADay.length} clients</Text>
            </View>
          </View>
          <View className="mt-8">
            {clientRecordInADay && clientRecordInADay.length > 0 ? (
              clientRecordInADay.map((item: any) => (
                <ItemsCard key={item.id} item={item} />
              ))
            ) : (
              <Text style={[{ textAlign: "center", color: "gray", marginTop: 12 }]}>
                No records for this date
              </Text>
            )}
            <GradientTab />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}