//Camera GPT versao co vision-Camera do DS
import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const CustomCameraScreen = ({ onCapture }) => {
  const devices = useCameraDevices();
  const cameraRef = useRef(null);
  const device = devices.back;

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission !== 'authorized') {
        await Camera.requestCameraPermission();
      }

      const microphonePermission = await Camera.getMicrophonePermissionStatus();
      if (microphonePermission !== 'authorized') {
        await Camera.requestMicrophonePermission();
      }
    };

    requestPermissions();
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'quality',
        });
        console.log(photo);
        onCapture(photo.path);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível capturar a foto');
      }
    }
  };

  if (device == null) {
    return <Text>Carregando câmera...</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleCapture} style={styles.captureButton}>
          <Text style={styles.buttonText}>Capturar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  captureButton: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
  },
});

export default CustomCameraScreen;