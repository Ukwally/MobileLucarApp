import React, { useRef, useEffect } from 'react';
import {View,TouchableOpacity,Text,StyleSheet,Alert,PermissionsAndroid,Platform,} from 'react-native';
import { RNCamera } from 'react-native-camera';

const CustomCameraScreen = ({ onCapture }) => {
  const cameraRef = useRef(null);

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);
        console.log(data); // Verifique os dados retornados
        onCapture(data.uri);
      } catch (error) {
        console.error(error); // Verifique o erro real
        Alert.alert('Erro', 'Não foi possível capturar a imagem');
      }
    } else {
      Alert.alert('Erro', 'Câmera não está carregada');
    }
  };
  

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
      }
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
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
