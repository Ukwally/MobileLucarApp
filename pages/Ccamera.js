//Camera Reacn-native-vision-camera do Video do YOUTUBE
import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from "react-native";
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission } from "react-native-vision-camera";

export default function Ccamera() {
    const device = useCameraDevice("back");
    const { hasPermission, requestPermission } = useCameraPermission();
    const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();
    const [permission, setPermission] = useState(null);

    const [isRecording, setIsRecording] = useState(false);

    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const status = await requestPermission();
            const statusMic = await requestMicPermission();

            if (status && statusMic) {
                setPermission(true);
            }
        })()
    }, [])

    const startRecording = () => {
        if (!cameraRef.current || !device) return;
        setIsRecording(true);

        cameraRef.current.startRecording({
            onRecordingFinished: (video) => {
                console.log(video);
            },
            onRecordingError: (error) => {
                console.log(error);
            }
        })
    }

    const stopRecording = async () => {
        if (cameraRef.current) {
            await cameraRef.current.stopRecording();
            setIsRecording(false);
        }
    }

    if (!permission) return <View></View>

    if (!device) return <View></View>

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            <Camera
                style={StyleSheet.absoluteFill}
                ref={cameraRef}
                device={device}
                isActive={true}
                video={true}
                audio={true}
            />
            <TouchableOpacity
                onPressIn={startRecording}
                onPressOut={stopRecording}
                style={{
                    width: 70,
                    height: 70,
                    borderRadius: 99,
                    borderWidth: 8,
                    borderColor: 'red',
                    position: 'absolute',
                    bottom: 70,
                    alignSelf: 'center'
                }}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
