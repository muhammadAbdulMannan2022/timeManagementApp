import GradientTab from "@/components/Custom/GradientBar";
import ItemsCard from "@/components/Custom/ItemsCard";
import {
  useGetDataBySingleDateMutation,
  useGetDatesQuery,
} from "@/redux/apis/appSlice";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";

// Define navigation param list
type RootStackParamList = {
  "(auth)": undefined;
  // Add other routes as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type MarkedDatesType = Record<
  string,
  {
    selected?: boolean;
    selectedColor?: string;
    marked?: boolean;
    dotColor?: string;
    disabled?: boolean;
  }
>;

export default function App() {
  // RTK Query for dates
  const {
    data: dates,
    isLoading: isDateLoading,
    isError,
    error,
  }: any = useGetDatesQuery(undefined);
  const [getSingeDatesData, { isLoading: isDateDataLoading }] =
    useGetDataBySingleDateMutation();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [processedData, setProcessesData] = useState([]);

  const formatDate = (date: string | undefined | null) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Collect dates from API response
  const datesList: string[] = useMemo(
    () =>
      dates
        ? (dates
            .map((d: any) => formatDate(d.created_at))
            .filter(Boolean) as string[])
        : [],
    [dates]
  );

  const [selectedDate, setSelectedDate] = useState<string>(
    datesList[0] || new Date().toISOString().split("T")[0]
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const bottomBarHeight = 85;

  // Processes for selected date
  const processesInADay = useMemo(
    () =>
      processedData.filter(
        (p: { created_at: string | null | undefined }) =>
          formatDate(p.created_at) === selectedDate
      ),
    [processedData, selectedDate]
  );

  // Tasks for selected processes
  const tasksInADay = useMemo(
    () =>
      processesInADay.flatMap((proc: { tasks: any[] }) =>
        proc.tasks.map((task) => ({
          ...task,
          processName: task.task_name,
          photo: task.images ?? [],
        }))
      ),
    [processesInADay]
  );

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

  // Marked dates for calendar: All datesList dates get a dot, only selectedDate gets background
  const markedDates: MarkedDatesType = useMemo(
    () =>
      datesList.reduce((acc, date) => {
        acc[date] = {
          marked: true,
          dotColor: "#00B8D4",
          selected: date === selectedDate,
          selectedColor: date === selectedDate ? "#00B8D4" : undefined,
        };
        return acc;
      }, {} as MarkedDatesType),
    [datesList, selectedDate]
  );

  const onDayPress = async (day: DateData) => {
    // Only allow selection if the date is in datesList
    if (datesList.includes(day.dateString)) {
      setSelectedDate(day.dateString);
      try {
        const res = await getSingeDatesData({ date: day.dateString });
        setProcessesData(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
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

  const totalProcesses = processedData?.length ?? 0;
  const totalProcessesToday = processesInADay?.length ?? 0;

  // Handle loading state
  if (isDateLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  // Handle error state
  if (isError) {
    // Check for token_not_valid error
    const isTokenInvalid =
      error && "data" in error && error.data?.code === "token_not_valid";
    if (isTokenInvalid) {
      // Clear tokens from SecureStore
      SecureStore.deleteItemAsync("accessToken");
      SecureStore.deleteItemAsync("refreshToken");
      navigation.push("(auth)");
      return null;
    }

    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg text-red-500">
          {t("calendar.error")} {error?.data?.detail || "Failed to load data"}
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-white pt-16"
      style={{ paddingBottom: bottomBarHeight }}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="flex-row items-center gap-4 my-8">
          <Ionicons name="calendar-sharp" size={40} color="#00B8D4" />
          <View>
            <Text className="text-[#00B8D4] text-3xl font-bold">
              {t("calendar.title")}
            </Text>
            <Text className="text-[#818181] text-xl">
              {t("calendar.subtitle")}
            </Text>
          </View>
        </View>

        {/* Month Navigation */}
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
          <TouchableOpacity
            className="bg-[#00B8D42E] p-1.5 rounded-full"
            onPress={goPrevMonth}
          >
            <Ionicons name="chevron-back" size={28} color="#00B8D4" />
          </TouchableOpacity>
          <Text className="text-xl font-bold" style={{ flexShrink: 1 }}>
            {formatHeaderDate()}
          </Text>
          <TouchableOpacity
            className="bg-[#00B8D42E] p-1.5 rounded-full"
            onPress={goNextMonth}
          >
            <Ionicons name="chevron-forward" size={28} color="#00B8D4" />
          </TouchableOpacity>
        </View>

        {/* Calendar */}
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

        {/* Processes + Tasks */}
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
              <Text className="text-2xl font-bold">
                {totalProcessesToday}/{totalProcesses} {t("calendar.processes")}
              </Text>
            </View>
            <View className="bg-[#00B8D447] px-4 py-2 rounded-full">
              <Text className="text-[#00B8D4]">
                {totalProcessesToday} {t("calendar.clients")}
              </Text>
            </View>
          </View>

          <View className="mt-8">
            {processesInADay.length > 0 ? (
              processesInADay.map((process: any, i) => (
                <ItemsCard
                  key={process.uid}
                  item={process} // pass whole process, let child decide how to render
                  titleId={i}
                />
              ))
            ) : (
              <Text
                style={{ textAlign: "center", color: "gray", marginTop: 12 }}
              >
                {t("calendar.noSteps")}
              </Text>
            )}
            <GradientTab date={selectedDate} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
