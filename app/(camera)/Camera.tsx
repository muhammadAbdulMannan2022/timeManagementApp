import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Camera() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [flash, setFlash] = useState<FlashMode>('off');
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter()
    const cameraRef = useRef<CameraView>(null)

    // --- Permission Handling ---
    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.permissionContainer}>
                <Text style={{ textAlign: 'center', marginBottom: 10 }}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }
    // --- End of Permission Handling ---


    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function takePicture() {
        if (cameraRef.current) {
            console.log("Taking picture...");
            const photo = await cameraRef.current.takePictureAsync()
            router.push({
                pathname: "/View",
                params: {
                    uri: photo.uri,
                    width: String(photo.width),
                    height: String(photo.height),
                    format: photo.format
                },
            });
            console.log("Clicked photo:", photo)
        }
        // Add logic to handle the captured image here
    }

    function closeCamera() {
        console.log("Closing camera...");
        // Add navigation logic to go back or close the modal
        router.back()
    }

    return (
        <SafeAreaView className='flex-1 bg-black'>
            <StatusBar style='light' />
            <View style={styles.container}>
                <CameraView style={styles.camera} facing={facing} flash={flash} ref={cameraRef}>
                </CameraView>

                {/* --- Top Controls --- */}
                <View className='absolute top-5 left-6 right-6 flex-row justify-between'>
                    <TouchableOpacity onPress={() => setFlash(prv => prv === "on" ? "off" : "on")} className='p-3'>
                        {/* A real flash dropdown would require a state for visibility */}
                        <Ionicons name={
                            flash === 'on' ? 'flash' :
                                flash === 'auto' ? 'flash-outline' : 'flash-off'
                        } size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity className='p-3'>
                        <Ionicons name="settings-outline" size={28} color="white" />
                    </TouchableOpacity>
                </View>

                {/* --- Bottom Controls --- */}
                <View className='absolute bottom-8 left-5 right-5 flex-row justify-between items-center'>
                    <TouchableOpacity className='p-3' onPress={closeCamera}>
                        <Ionicons name="close" size={40} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity className="w-20 h-20 rounded-full bg-white items-center justify-center" onPress={takePicture}>
                        <View className='w-[65px] h-[65px] rounded-full border-4' />
                    </TouchableOpacity>
                    <TouchableOpacity className='p-3' onPress={toggleCameraFacing}>
                        <Ionicons name="camera-reverse-outline" size={40} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',

    },
    camera: {
        flex: 0.8,
    },
});