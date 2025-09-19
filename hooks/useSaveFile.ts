import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";

export const useSavePdf = () => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const savePdf = useCallback(async (pdfUrl: string) => {
    try {
      setIsDownloading(true);

      if (!pdfUrl) {
        Alert.alert("Error", "Invalid PDF link");
        return;
      }

      const fileName = pdfUrl.split("/").pop() || `file_${Date.now()}.pdf`;
      const downloadPath = FileSystem.documentDirectory + fileName;

      const downloadCallback = (progress: any) => {
        setDownloadProgress(
          progress.totalBytesWritten / progress.totalBytesExpectedToWrite
        );
      };

      const downloadResumable = FileSystem.createDownloadResumable(
        pdfUrl,
        downloadPath,
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
        // iOS: Share the file
        await Sharing.shareAsync(uri);
      }
    } catch (err) {
      console.error("SavePdf error:", err);
      Alert.alert("Error", "Failed to download file.");
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return { savePdf, isDownloading, downloadProgress };
};
