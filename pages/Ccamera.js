//APENAS CAPTURAR IMAGEM
import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';

const CustomCameraScreen = ({ onCapture }) => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View style={styles.center}><Text>Verificando permissões...</Text></View>;
  }

  if (!hasPermission) {
    return <View style={styles.center}><Text>Permissão negada</Text></View>;
  }

  const handleCapture = async () => {
    if (cameraReady && cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: true });
        onCapture(photo.uri);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível capturar a imagem');
      }
    }
  };
  return (
  <View style={styles.container}>
    <Camera
      ref={cameraRef}
      style={styles.camera}
      type={Camera.Constants.Type.back}
      onCameraReady={() => setCameraReady(true)}
    />

    {/* Overlay de foco */}
    <View style={styles.overlay}>
      <View style={styles.focusBox}>
        {/* Você pode adicionar aqui uma imagem ou animação se quiser */}
      </View>
    </View>

    <View style={styles.controls}>
      <TouchableOpacity onPress={handleCapture} style={styles.captureButton}>
        <Text style={styles.buttonText}>Capturar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  controls: { position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' },
  captureButton: { backgroundColor: 'white', padding: 10, borderRadius: 5 },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  overlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
},

focusBox: {
  width: 250,
  height: 100,
  borderColor: 'white',
  borderWidth: 2,
  borderRadius: 20,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  justifyContent: 'center',
  alignItems: 'center',
},

});

export default CustomCameraScreen;