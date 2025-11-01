import GradientTab from "@/components/Custom/GradientBar";
import ItemsCard from "@/components/Custom/ItemsCard";
import {
  useGetDataBySingleDateMutation,
  useGetDatesQuery,
} from "@/redux/apis/appSlice";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
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
  const navigation = useRouter();
  const [processedData, setProcessesData] = useState<any[]>([]);

  // Format date with error handling
  const formatDate = (date: string | undefined | null) => {
    if (!date) {
      console.warn("Invalid date input:", date);
      return "";
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.warn("Invalid date format:", date);
      return "";
    }
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Log raw dates for debugging
  useEffect(() => {
    if (dates) {
      console.log("Raw dates from API:", dates);
    }
  }, [dates]);

  // Current date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Collect dates from API response + add today if empty
  const datesList: string[] = useMemo(() => {
    if (!dates || !Array.isArray(dates)) return [today];

    const apiDates = dates
      .map((d: any) => {
        if (typeof d === "string") {
          return d; // Already formatted string
        }
        return formatDate(d.created_at); // Object with created_at
      })
      .filter((date: string) => date && /^\d{4}-\d{2}-\d{2}$/.test(date));

    // If no valid dates from API, use today
    const finalDates = apiDates.length > 0 ? apiDates : [today];

    console.log("datesList (final):", finalDates);
    return finalDates;
  }, [dates, today]);

  // Set initial selected date (first in list or today)
  const [selectedDate, setSelectedDate] = useState<string>(datesList[0]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const bottomBarHeight = 85;

  // Fetch data for initial selected date
  useEffect(() => {
    if (datesList.length > 0) {
      const fetchInitialData = async () => {
        try {
          const res = await getSingeDatesData({ date: selectedDate });
          setProcessesData(Array.isArray(res?.data) ? res.data : []);
          console.log("Initial data for selected date:", res.data);
        } catch (error) {
          console.error("Error fetching initial data:", error);
        }
      };
      fetchInitialData();
    }
  }, [datesList, selectedDate, getSingeDatesData]);

  // Processes for selected date
  const processesInADay = useMemo(
    () =>
      (Array.isArray(processedData) ? processedData : []).filter(
        (p: { created_at: string | null | undefined }) =>
          formatDate(p.created_at) === selectedDate
      ),
    [processedData, selectedDate]
  );

  // Tasks for selected processes
  const tasksInADay = useMemo(
    () =>
      processesInADay.flatMap((proc: { tasks: any[] }) =>
        (Array.isArray(proc.tasks) ? proc.tasks : []).map((task) => ({
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

  // Marked dates: dot for all, background for selected
  const markedDates: MarkedDatesType = useMemo(() => {
    const marked = datesList.reduce((acc, date) => {
      acc[date] = {
        marked: true,
        dotColor: "#00B8D4",
        selected: date === selectedDate,
        selectedColor: date === selectedDate ? "#00B8D4" : undefined,
      };
      return acc;
    }, {} as MarkedDatesType);

    // Always mark today with a dot even if not in API
    if (!datesList.includes(today)) {
      marked[today] = {
        marked: true,
        dotColor: "#00B8D4",
        selected: today === selectedDate,
        selectedColor: today === selectedDate ? "#00B8D4" : undefined,
      };
    }

    console.log("markedDates:", marked);
    return marked;
  }, [datesList, selectedDate, today]);

  const onDayPress = async (day: DateData) => {
    const dateStr = day.dateString;
    if (datesList.includes(dateStr) || dateStr === today) {
      setSelectedDate(dateStr);
      try {
        const res = await getSingeDatesData({ date: dateStr });
        setProcessesData(Array.isArray(res?.data) ? res.data : []);
        console.log("Data for selected date:", res.data);
      } catch (error) {
        console.error("Error fetching data for date:", error);
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
        <ActivityIndicator size="large" color="#00B8D4" />
        <Text className="mt-4 text-gray-500">{t("calendar.loadingDates")}</Text>
      </View>
    );
  }

  // Handle error state
  if (isError) {
    const isTokenInvalid =
      error && "data" in error && error.data?.code === "token_not_valid";
    if (isTokenInvalid) {
      SecureStore.deleteItemAsync("accessToken");
      SecureStore.deleteItemAsync("refreshToken");
      navigation.push("/(auth)");
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
          }}
        >
          <Calendar
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
              todayTextColor: "#00B8D4",
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
            {isDateDataLoading ? (
              <View className="items-center">
                <ActivityIndicator size="large" color="#00B8D4" />
                <Text className="mt-2 text-gray-500">
                  {t("calendar.loadingData")}
                </Text>
              </View>
            ) : processesInADay.length > 0 ? (
              processesInADay.map((process: any, i) => (
                <ItemsCard key={process.uid} item={process} titleId={i} />
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
