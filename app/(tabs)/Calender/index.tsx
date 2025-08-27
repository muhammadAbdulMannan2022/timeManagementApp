import GradientTab from "@/components/Custom/GradientBar";
import ItemsCard from "@/components/Custom/ItemsCard";
import { RootState } from "@/redux/store";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useSelector } from "react-redux";

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
    const processes = useSelector((state: RootState) => state.clientRecords?.processes ?? []);
    const { t } = useTranslation()
    const formatDate = (date: string | undefined | null) => {
        if (!date) return "";
        const d = new Date(date);
        if (isNaN(d.getTime())) return "";
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    // collect process dates
    const datesList: string[] = useMemo(
        () => processes.map(p => formatDate(p.date)).filter(Boolean) as string[],
        [processes]
    );

    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const bottomBarHeight = 85;

    // processes for selected date
    const processesInADay = useMemo(
        () => processes.filter((p: { date: string | null | undefined; }) => formatDate(p.date) === selectedDate),
        [processes, selectedDate]
    );

    // all steps under selected processes
    const stepsInADay = useMemo(
        () =>
            processesInADay.flatMap((proc: { steps: any[]; name: any; }) =>
                proc.steps.map(step => ({
                    ...step,
                    processName: proc.name, // keep track of parent process
                }))
            ),
        [processesInADay]
    );

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const markedDates: MarkedDatesType = datesList.reduce((acc, date) => {
        acc[date] = { marked: true, dotColor: "#00B8D4" };
        return acc;
    }, {} as MarkedDatesType);

    if (selectedDate) {
        markedDates[selectedDate] = {
            ...markedDates[selectedDate],
            selected: true,
            selectedColor: "#00B8D4",
            marked: datesList.includes(selectedDate),
            dotColor: "#00B8D4",
        };
    }

    const onDayPress = (day: DateData) => {
        setSelectedDate(day.dateString);
    };

    const goPrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };
    const goNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
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

    const totalProcesses = processes?.length ?? 0;
    const totalProcessesToday = processesInADay?.length ?? 0;

    return (
        <View className="flex-1 bg-white pt-16" style={{ paddingBottom: bottomBarHeight }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                {/* Header */}
                <View className="flex-row items-center gap-4 my-8">
                    <Ionicons name="calendar-sharp" size={40} color="#00B8D4" />
                    <View>
                        <Text className="text-[#00B8D4] text-3xl font-bold">{t("calendar.title")}</Text>
                        <Text className="text-[#818181] text-xl">
                            {t("calendar.subtitle")}
                        </Text>
                    </View>
                </View>

                {/* Month Nav */}
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
                        className="bg[#00B8D42E] p-1.5 rounded-full"
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

                {/* Processes + Steps */}
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
                            <Text className="text-[#00B8D4]">{totalProcessesToday} {t("calendar.clients")}</Text>
                        </View>
                    </View>

                    <View className="mt-8">
                        {stepsInADay.length > 0 ? (
                            stepsInADay.map((step: any) => (
                                <ItemsCard
                                    key={`${step.processName}-${step.id}`}
                                    item={{
                                        ...step,
                                        // ItemsCard expects photo array
                                        photo: step.photo ?? [],
                                    }}
                                />
                            ))
                        ) : (
                            <Text style={{ textAlign: "center", color: "gray", marginTop: 12 }}>
                                {t("calendar.noSteps")}
                            </Text>
                        )}
                        <GradientTab />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
