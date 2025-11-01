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
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";

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

  const formatDate = (date: string | undefined | null) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const today = new Date().toISOString().split("T")[0];

  const datesList: string[] = useMemo(() => {
    if (!dates || !Array.isArray(dates)) return [today];
    const apiDates = dates
      .map((d: any) => (typeof d === "string" ? d : formatDate(d.created_at)))
      .filter((d: string) => d && /^\d{4}-\d{2}-\d{2}$/.test(d));
    return apiDates.length > 0 ? apiDates : [today];
  }, [dates, today]);

  const [selectedDate, setSelectedDate] = useState<string>(datesList[0]);

  // This controls the visible month in header AND calendar
  const [displayMonth, setDisplayMonth] = useState<string>(() => {
    const [y, m] = selectedDate.split("-").map(Number);
    return `${y}-${String(m).padStart(2, "0")}-01`;
  });

  const calendarRef = useRef<any>(null);

  // Sync displayMonth when selectedDate changes
  useEffect(() => {
    const [y, m] = selectedDate.split("-").map(Number);
    const newMonth = `${y}-${String(m).padStart(2, "0")}-01`;
    setDisplayMonth(newMonth);
  }, [selectedDate]);

  // Fetch data on selectedDate change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSingeDatesData({ date: selectedDate });
        setProcessesData(Array.isArray(res?.data) ? res.data : []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [selectedDate, getSingeDatesData]);

  const processesInADay = useMemo(
    () =>
      (Array.isArray(processedData) ? processedData : []).filter(
        (p: any) => formatDate(p.created_at) === selectedDate
      ),
    [processedData, selectedDate]
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

  const markedDates: MarkedDatesType = useMemo(() => {
    const map = datesList.reduce((acc, d) => {
      acc[d] = {
        marked: true,
        dotColor: "#00B8D4",
        selected: d === selectedDate,
        selectedColor: d === selectedDate ? "#00B8D4" : undefined,
      };
      return acc;
    }, {} as MarkedDatesType);

    if (!datesList.includes(today)) {
      map[today] = {
        marked: true,
        dotColor: "#00B8D4",
        selected: today === selectedDate,
        selectedColor: today === selectedDate ? "#00B8D4" : undefined,
      };
    }
    return map;
  }, [datesList, selectedDate, today]);

  // CRITICAL: Handle month change from calendar swipe
  const onMonthChange = (date: DateData) => {
    const newMonth = `${date.year}-${String(date.month).padStart(2, "0")}-01`;
    setDisplayMonth(newMonth);
  };

  const onDayPress = async (day: DateData) => {
    const dateStr = day.dateString;
    if (datesList.includes(dateStr) || dateStr === today) {
      setSelectedDate(dateStr);
    }
  };

  const goPrevMonth = () => {
    const prev = new Date(displayMonth);
    prev.setMonth(prev.getMonth() - 1);
    const newMonth = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}-01`;
    setDisplayMonth(newMonth);
    calendarRef.current?.addMonth?.(-1); // Force calendar to go back
  };

  const goNextMonth = () => {
    const next = new Date(displayMonth);
    next.setMonth(next.getMonth() + 1);
    const newMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-01`;
    setDisplayMonth(newMonth);
    calendarRef.current?.addMonth?.(1); // Force calendar to go forward
  };

  const formatHeaderDate = () => {
    const cur = new Date(displayMonth);
    const sel = new Date(selectedDate);

    if (
      sel.getFullYear() === cur.getFullYear() &&
      sel.getMonth() === cur.getMonth()
    ) {
      return `${monthNames[sel.getMonth()]} ${sel.getDate()}, ${sel.getFullYear()}`;
    }
    return `${monthNames[cur.getMonth()]} ${cur.getFullYear()}`;
  };

  const totalProcesses = processedData?.length ?? 0;
  const totalProcessesToday = processesInADay?.length ?? 0;

  const bottomBarHeight = 85;

  if (isDateLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#00B8D4" />
        <Text className="mt-4 text-gray-500">{t("calendar.loadingDates")}</Text>
      </View>
    );
  }

  if (isError) {
    const tokenInvalid =
      error && "data" in error && error.data?.code === "token_not_valid";
    if (tokenInvalid) {
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

        {/* Calendar – FULLY CONTROLLED */}
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
            ref={calendarRef}
            initialDate={displayMonth} // Only for first render
            onDayPress={onDayPress}
            onMonthChange={onMonthChange} // CRITICAL: Sync swipe
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
              processesInADay.map((process: any, i: number) => (
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
