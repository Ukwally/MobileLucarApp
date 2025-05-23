import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, PermissionsAndroid, Platform } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

const CustomCameraScreen = ({ onCapture }) => {
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permissão para acessar a câmera',
          message: 'Precisamos de acesso para tirar fotos.',
          buttonPositive: 'OK',
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permissão necessária', 'Você deve permitir o acesso à câmera');
      } else {
        setHasPermission(true);
      }
    } else {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: 'off',
        });
        onCapture(photo.path);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível capturar a imagem');
      }
    } else {
      Alert.alert('Erro', 'Câmera não está carregada');
    }
  };

  if (device == null || !hasPermission) {
    return <View style={styles.container} />;
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
        <TouchableOpacity
          onPress={handleCapture}
          style={styles.captureButton}
        >
          <Text style={styles.buttonText}>Capturar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 4,
  },
  controls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ff0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default CustomCameraScreen;