import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';

const CustomCameraScreen = ({ onCapture }) => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: true });
        console.log(photo); // Verifica os dados retornados
        onCapture(photo.uri);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível capturar a imagem');
      }
    } else {
      Alert.alert('Erro', 'Câmera não está carregada');
    }
  };

  if (hasPermission === null) {
    return <View><Text>Verificando permissões...</Text></View>;
  }

  if (!hasPermission) {
    return <View><Text>Permissão de câmera negada</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
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
  container: { flex: 1 },
  camera: { flex: 1 },
  controls: { position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' },
  captureButton: { backgroundColor: 'white', padding: 10, borderRadius: 5 },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
});

export default CustomCameraScreen;
