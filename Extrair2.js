//CODIGO GPT TESSERACT
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Tesseract from 'tesseract.js';
import RNFS from 'react-native-fs';

const PlaceholderImage = require('./assets/images/background-image.png');

const HomeS = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      extractText(result.assets[0].uri);
    } else {
      Alert.alert('Aviso', 'Nenhuma imagem selecionada');
    }
  };

  const takePhotoAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      extractText(result.assets[0].uri);
    } else {
      Alert.alert('Aviso', 'Nenhuma foto tirada');
    }
  };

  const extractText = async (uri) => {
    try {
      // Copie o arquivo da imagem para o diretório temporário
      const filePath = `${RNFS.TemporaryDirectoryPath}/image.jpg`;
      await RNFS.copyFile(uri, filePath);

      // Extraia o texto da imagem usando o Tesseract.js
      Tesseract.recognize(
        filePath,
        'eng',
        {
          logger: info => console.log(info), // Opção para ver logs do progresso
        }
      ).then(({ data: { text } }) => {
        setExtractedText(text);
      }).catch(error => {
        console.error(error);
        Alert.alert('Erro', 'Erro ao extrair texto da imagem');
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao processar a imagem');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImageAsync} style={styles.button}>
        <Text style={styles.buttonText}>Escolher Imagem</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={takePhotoAsync} style={styles.button}>
        <Text style={styles.buttonText}>Tirar Foto</Text>
      </TouchableOpacity>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}
      {extractedText && (
        <Text style={styles.text}>{extractedText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
  text: {
    margin: 10,
    fontSize: 16,
  },
});

export default HomeS;
