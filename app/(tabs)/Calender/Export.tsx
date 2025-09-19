import ClientList from "@/components/Custom/tabs/bulkExp";
import SingleExport from "@/components/Custom/tabs/SingleExp";
import { useSavePdf } from "@/hooks/useSaveFile";
import {
  baseUrl,
  useGetDataBySingleDateMutation,
  useMultipleItemPdfMutation,
} from "@/redux/apis/appSlice";
import {
  AntDesign,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";

const ExportPreview = ({
  data,
  date,
  state,
}: {
  data: any[];
  date: any;
  state: any;
}) => {
  const { t } = useTranslation();

  // ✅ Calculate counts
  const clientCount = data?.length || 0;
  const photoCount = data?.reduce(
    (acc, client) =>
      acc +
      client.tasks.reduce(
        (taskAcc: number, task: any) => taskAcc + task.images.length,
        0
      ),
    0
  );
  const pdfCount = clientCount / 2 + photoCount / 2; // 🔹 replace with actual pdf count when API gives it

  // ✅ Collect all images
  const images =
    data?.flatMap((client) =>
      client.tasks.flatMap((task: any) =>
        task.images.map((img: any) => img.image)
      )
    ) || [];

  return (
    <ScrollView className="flex-1">
      <SingleExport state={state} id={date} />
      <View className="px-5 mt-5 gap-10">
        <View className="flex-row items-center gap-5">
          <AntDesign name="eye" size={24} color="#00B8D4" />
          <Text className="text-xl font-bold">
            {t("calendar.exportTabs.exportPreview")}
          </Text>
        </View>

        {/* ✅ Counters */}
        <View className="flex-row justify-between items-center">
          <View className="items-center justify-center gap-2">
            <Text className="text-[#00B8D4] text-4xl font-bold">
              {clientCount}
            </Text>
            <Text className="text-xl text-[#22232470]">
              {t("calendar.exportTabs.clientsLabel")}
            </Text>
          </View>
          <View className="items-center justify-center gap-2">
            <Text className="text-[#00B8D4] text-4xl font-bold">
              {photoCount}
            </Text>
            <Text className="text-xl text-[#22232470]">
              {t("calendar.exportTabs.photoLabel")}
            </Text>
          </View>
          <View className="items-center justify-center gap-2">
            <Text className="text-[#00B8D4] text-4xl font-bold">
              {pdfCount}
            </Text>
            <Text className="text-xl text-[#22232470]">
              {t("calendar.exportTabs.pdfLabel")}
            </Text>
          </View>
        </View>
      </View>

      {/* ✅ Photo Preview */}
      <View className="px-5 pt-10">
        <View className="flex-row items-center gap-5 mb-5">
          <Text className="text-xl font-bold">
            {t("calendar.exportTabs.photoPreview")}
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.length > 0 ? (
            images.map((item, index) => (
              <View
                key={index}
                className="border rounded-lg border-gray-50 mr-2"
              >
                <Image
                  source={{ uri: baseUrl + item }}
                  style={{ width: 200, height: 110, borderRadius: 10 }}
                  resizeMode="cover"
                />
              </View>
            ))
          ) : (
            <Text className="text-gray-500">
              {t("calendar.exportTabs.noPhotos")}
            </Text>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

// 🔹 Main Component
export default function CustomTabs() {
  const { t } = useTranslation();
  const res = useLocalSearchParams<{ date: string }>();
  const pagerRef = useRef<PagerView>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [getData, { data, error, isLoading }] =
    useGetDataBySingleDateMutation();
  const router = useRouter();
  //
  const [selected, setSelected] = useState("today");
  const [getPdfLink, { isUninitialized }] = useMultipleItemPdfMutation();
  const [loadingPdf, setLoadingPdf] = useState<boolean>(false);
  const { savePdf, isDownloading, downloadProgress } = useSavePdf();

  const goToPage = (page: number) => {
    pagerRef.current?.setPage(page);
    setActiveTab(page);
  };

  useEffect(() => {
    // console.log(res);
    if (res !== undefined) {
      console.log(res.date);
      getData({ date: res.date });
    } else {
      router.push("/Calender");
    }
  }, []);

  // 🔹 Handle Unauthorized
  useEffect(() => {
    if (error && "status" in error && error.status === 401) {
      router.replace("/(auth)");
    }
  }, [error]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#00B8D4" />
      </SafeAreaView>
    );
  }

  const images =
    data?.flatMap((group: any) =>
      group.tasks.flatMap((task: any) =>
        task.images.map((img: any) => img.image)
      )
    ) || [];

  const getPdfData = async () => {
    console.log(selected);
    try {
      setLoadingPdf(true);
      const res = await getPdfLink({ filter_type: selected });
      savePdf(res.data?.pdf_link);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white px-8 pt-5"
      style={{ paddingBottom: 85 }}
    >
      {/* Header */}
      <View className="flex-row gap-5 items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <View className="flex-row items-center justify-between flex-1">
          <View>
            <Text className="text-2xl font-bold">
              {t("calendar.exportTabs.headerTitle")}
            </Text>
            <Text className="text-lg">
              {t("calendar.exportTabs.headerSubtitle")}
            </Text>
          </View>
          <TouchableOpacity
            onPress={getPdfData}
            className="flex-row items-center gap-2 bg-[#00B8D4AB] px-3 py-3 rounded-lg"
          >
            {loadingPdf ? (
              <ActivityIndicator />
            ) : (
              <>
                <FontAwesome6 name="file-export" size={18} color="#ffffff" />
                <Text className="text-white">
                  {t("calendar.exportTabs.exportButton")}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Custom Tab Bar */}
      <View className="flex-row m-3 p-1">
        {/* Tab 1 */}
        <TouchableOpacity
          onPress={() => goToPage(0)}
          className={`flex-1 flex-row items-center justify-center gap-3 py-3 rounded-xl ${
            activeTab === 0 ? "border-2 border-gray-100" : "border-0"
          }`}
        >
          <MaterialIcons
            name="offline-bolt"
            size={24}
            color={activeTab === 0 ? "#00B8D4" : "#000000"}
          />
          <Text
            className={`text-center font-semibold ${
              activeTab === 0 ? "text-black" : "text-gray-600"
            }`}
          >
            {t("calendar.exportTabs.tab1")}
          </Text>
        </TouchableOpacity>

        {/* Tab 2 */}
        <TouchableOpacity
          onPress={() => goToPage(1)}
          className={`flex-1 flex-row items-center justify-center gap-3 py-3 rounded-xl ${
            activeTab === 1 ? "border-2 border-gray-100" : "border-0"
          }`}
        >
          <MaterialIcons
            name="settings"
            size={24}
            color={activeTab === 1 ? "#00B8D4" : "#000000"}
          />
          <Text
            className={`text-center font-semibold ${
              activeTab === 1 ? "text-black" : "text-gray-600"
            }`}
          >
            {t("calendar.exportTabs.tab2")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pager */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setActiveTab(e.nativeEvent.position)}
      >
        {/* Tab 1 Content */}
        <View key="1" style={{ flex: 1 }}>
          <ExportPreview
            date={data}
            state={{ selected, setSelected }}
            data={data || []}
          />
        </View>

        {/* Tab 2 Content */}
        <View key="2" style={{ flex: 1 }}>
          <ClientList />
        </View>
      </PagerView>
    </SafeAreaView>
  );
}
