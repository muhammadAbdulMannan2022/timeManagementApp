import { removeImage } from "@/redux/slices/ImagesSlice";
import { updateStepImages, updateStepNote } from "@/redux/slices/StepsDataFinal";
import { setStep } from "@/redux/slices/stepSlice";
import { RootState } from '@/redux/store';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
export default function SelectedImages() {
    const router = useRouter()
    const { currentStep, maxStep } = useSelector((state: RootState) => state.step);
    const stepImages = useSelector((state: RootState) =>
        state.image.find((item: { step: number; images: { uri: string }[] }) => item.step === currentStep)?.images || []
    );
    const stepsDataFinal = useSelector((state: RootState) => state.fullStepData.find(item => item.stepNumber === currentStep))
    const [noteTemp, setNoteTemp] = useState<string>("")
    const [takingFinalNote, setTakingFinalNote] = useState<boolean>(false)
    const [finalNote, setFinalNote] = useState<string>(stepsDataFinal?.stepNote || "")
    const dispatch = useDispatch();

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use correct enum for images
                allowsEditing: true,
                quality: 1,
            });

            console.log(result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const photo = result.assets[0];
                router.push({
                    pathname: "/View",
                    params: {
                        uri: photo.uri,
                        width: String(photo.width),
                        height: String(photo.height),
                        format: photo.mimeType ? photo.mimeType.split('/')[1] : '', // Extracts 'jpeg' from 'image/jpeg' or empty string if undefined
                    },
                });
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    // Render each image item in the FlatList with a remove button
    const renderImageItem = ({ item }: { item: { uri: string } }) => (
        <View className="mr-4 relative">
            <Image
                source={{ uri: item.uri }}
                style={{ width: 100, height: 100, borderRadius: 8 }}
                resizeMode="cover"
            />
            <TouchableOpacity
                className="absolute top-2 right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                onPress={() => dispatch(removeImage({ step: currentStep, uri: item.uri }))}
            >
                <Ionicons name="close" size={14} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    // Render buttons at the end of the FlatList
    const renderFooter = () => (
        <View className="flex-row items-center space-x-4  gap-5">
            <TouchableOpacity onPress={() => router.push("/Camera")} style={{ width: 100, height: 100, borderRadius: 8 }} className="border border-dashed border-[#00B8D4] rounded-full w-20 h-20 items-center justify-center">
                <Ionicons name="camera" size={24} color="#00B8D4" />
                <Text className="text-[#00B8D4] text-sm mt-1">Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pickImage()} style={{ width: 100, height: 100, borderRadius: 8 }} className="border border-dashed border-[#00B8D4] rounded-full w-20 h-20 items-center justify-center">
                <Ionicons name="images" size={24} color="#00B8D4" />
                <Text className="text-[#00B8D4] text-sm mt-1">Library</Text>
            </TouchableOpacity>
        </View>
    );

    const updatImage = () => {
        dispatch(updateStepImages({ stepNumber: currentStep, stepImages: stepImages }))
        if (currentStep < maxStep) {
            dispatch(setStep(currentStep + 1))
            router.navigate("/(tabs)")
        } else {
            router.push("/(complete)")
        }
    }

    // Render the note section
    const renderNoteSection = () => (
        <View
            style={{
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 1.5, // Android shadow
            }}
            className="w-full mt-4 p-4 bg-white rounded-xl shadow-sm"
        >
            <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center justify-center gap-3">
                    <Ionicons name="document-text" size={24} color="#00B8D4" />
                    <View>
                        <Text className="text-gray-700 font-semibold">Photos Note</Text>
                        <Text className="text-gray-500 text-sm">Photo 1 - 14:48</Text>
                    </View>
                </View>
                <View className="flex-row items-center justify-center gap-2">
                    {takingFinalNote ? (
                        <>
                            <TouchableOpacity
                                onPress={() => setTakingFinalNote(false)}
                                className="border py-1.5 px-3 rounded-md border-[#00B8D4]"
                            >
                                <Text className="text-[#00B8D4] font-bold">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    dispatch(updateStepNote({ stepNumber: currentStep, stepNote: noteTemp }));
                                    setFinalNote(noteTemp); // Update finalNote directly with noteTemp
                                    setTakingFinalNote(false);
                                    setNoteTemp(""); // Clear noteTemp after saving
                                }}
                                className="border border-[#00B8D4] py-1.5 px-3 rounded-md bg-[#00B8D4]"
                            >
                                <Text className="text-white font-bold">Save</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            className="flex-row items-center justify-center gap-2"
                            onPress={() => {
                                setTakingFinalNote(true);
                                setNoteTemp(finalNote); // Pre-fill noteTemp with current finalNote when editing
                            }}
                        >
                            <MaterialIcons name="edit-square" size={24} color="#00B8D4" />
                            <Text className="text-[#00B8D4] font-bold">Edit</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View className="items-center justify-center min-h-52">
                {takingFinalNote ? (
                    <View className="w-full">
                        <TextInput
                            placeholder="Add note"
                            className="border border-gray-300 w-full p-3 rounded-md"
                            multiline={true}
                            value={noteTemp}
                            onChangeText={(text) => setNoteTemp(text)}
                            numberOfLines={4}
                            textAlignVertical="top"
                            style={{ minHeight: 100 }}
                        />
                    </View>
                ) : finalNote ? (
                    <ScrollView className="max-h-40 overflow-y-auto">
                        <Text className="text-2xl">{finalNote}</Text>
                    </ScrollView>
                ) : (
                    <View>
                        <View className="mt-4 items-center">
                            <Ionicons className="transform rotate-180" name="document-text" size={54} color="#ccc" />
                            <Text className="text-[#000] font-bold text-2xl my-2 ml-2">No note yet</Text>
                        </View>
                        <Text className="text-gray-500 text-xs mt-1">Tap to edit to add description for this photo</Text>
                    </View>
                )}
            </View>
        </View>
    );

    // Render the save button
    const renderSaveButton = () => {

        return <View className="w-full mt-8">
            <TouchableOpacity
                className="bg-[#C9F0F5] rounded-lg items-center justify-center py-4 "
                onPress={() => {
                    updatImage()


                }}
            >
                <View className="flex-row items-center">
                    <Ionicons name="save" size={24} color="#00B8D4" />
                    <Text className="text-[#00B8D4] text-xl font-bold ml-2">Save</Text>
                </View>
            </TouchableOpacity>
        </View>
    }



    return (
        <ScrollView>
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 items-center px-4">
                    <View
                        className="flex-row items-center justify-between w-full p-3 mt-2 bg-white rounded-md"
                        style={{
                            shadowColor: '#000000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 1.5, // Android shadow
                        }}
                    >
                        <TouchableOpacity onPress={() => router.navigate("/(tabs)")}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                        <View className="items-center">
                            <Text className="text-gray-900 font-bold text-lg">Removal</Text>
                            <Text className="text-gray-500">Photo Records</Text>
                        </View>
                        <View>
                            <Text className="text-gray-500">Photos (1/5)</Text>
                        </View>
                    </View>
                    <View
                        className="w-full mt-4 p-4 bg-white rounded-xl"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            elevation: 4, // Android shadow
                        }}
                    >
                        <View className="flex-row  items-center justify-between mb-5">
                            <Text className="text-black text-xl font-bold mb-2">Photos (1/5)</Text>
                            <Text className="text-gray-500 text-sm mb-4">Tap to select photo for editing notes</Text>
                        </View>
                        <FlatList
                            data={stepImages}
                            renderItem={renderImageItem}
                            keyExtractor={(item, index) => `${item.uri}-${index}`}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            ListFooterComponent={renderFooter}
                            contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 10 }}
                        />
                    </View>
                    {renderNoteSection()}
                    {renderSaveButton()}
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}