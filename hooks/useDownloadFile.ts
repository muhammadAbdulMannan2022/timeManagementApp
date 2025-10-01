import { useDownloadPdfMutation } from "@/redux/apis/appSlice";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";

export const useDownloadFile = () => {
  const [getPdf, { isLoading: isPdfLoading }] = useDownloadPdfMutation();
  const [downloadProgress, setDownloadProgress] = useState(0);

  const download = useCallback(
    async (ids: string | string[]) => {
      try {
        const uids = Array.isArray(ids) ? ids : [ids];
        const res = await getPdf({ uids }).unwrap();
        if (!res?.pdf_link) {
          Alert.alert("Error", "File URL not found");
          return;
        }

        const fileUrl = res.pdf_link;
        const fileName = fileUrl.split("/").pop() || `file_${Date.now()}.pdf`;
        const downloadPath = FileSystem.documentDirectory;

        const downloadCallback = (progress: any) => {
          setDownloadProgress(
            progress.totalBytesWritten / progress.totalBytesExpectedToWrite
          );
        };

        const downloadResumable = FileSystem.createDownloadResumable(
          fileUrl,
          downloadPath + fileName,
          {},
          downloadCallback
        );

        const { uri }: any = await downloadResumable.downloadAsync();

        if (Platform.OS === "android") {
          const permissions =
            await StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (!permissions.granted) {
            Alert.alert(
              "Permission denied",
              "Cannot save file without permission."
            );
            return;
          }

          const fileString = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const savedUri = await StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName,
            "application/pdf"
          );
          await FileSystem.writeAsStringAsync(savedUri, fileString, {
            encoding: FileSystem.EncodingType.Base64,
          });
          Alert.alert("Success", "File saved to chosen folder.");
        } else {
          // iOS: Share to save
          await Sharing.shareAsync(uri);
        }
      } catch (err) {
        console.error("Download error:", err);
        Alert.alert("Error", "Failed to download file.");
      }
    },
    [getPdf]
  );

  return { download, isPdfLoading, downloadProgress };
};
