import React from 'react';
//import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, Alert, TouchableHighlight, FlatList, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from '../components/ImageViewer';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; //para o logout

import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';

const PlaceholderImage = require('../assets/images/background-image.png');

const HomeS = ({ route }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const navigation = useNavigation();
  const { user } = route.params;

  useEffect(() => {
    if (route.params?.capturedImage) {

      StatusBar.setBarStyle('dark-content');  // Altera a cor do texto da StatusBar
      StatusBar.setBackgroundColor('#ffffff'); // Define a cor do fundo da StatusBar

      const uri = route.params.capturedImage;
      setSelectedImage(uri); // Mostra a imagem tirada

      const file = {
        uri,
        name: "photo.jpg",
        type: "image/jpeg",
      };

      performOCR(file);
    }
  }, [route.params?.capturedImage]);

  const handleNavigate = () => {
    navigation.navigate('VisualizarDados', {
      endpoint: `http://192.168.43.22:3000/data/${encodeURIComponent(extractedText)}`, // Usa o texto extraído na URL
      extractedText: extractedText,  // Adicionado para passar o texto extraído
    });
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,

      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      base64: true,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      performOCR(result.assets[0]); //Adicionado para extrai texto da imagem
    } else {
      Alert.alert('Aviso', 'Nenhuma imagem selecionada');
    }
  };
  const takePhotoAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,

      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      performOCR(result.assets[0]); // Adicionado para extr
    } else {
      Alert.alert('Aviso', 'Nenhuma foto tirada');
    }
  };
  const performOCR = (file) => {
    let myHeaders = new Headers();
    myHeaders.append(
      "apikey",
      "FEmvQr5uj99ZUvk3essuYb6P5lLLBS20"
    );
    myHeaders.append(
      "Content-Type",
      "multipart/form-data"
    );

    let raw = file;
    let requestOptions = {
      method: "POST",
      redirect: "follow",
      headers: myHeaders,
      body: raw,
    };

    fetch(
      "https://api.apilayer.com/image_to_text/upload",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {

        setExtractedText(result["all_text"]);

      })
      .catch((error) => console.log("error", error));
  };


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeftSec}>
          <FIcon name="user" size={20} color="#a9cce3" />
          <Text style={styles.headerText}>{user.username}</Text>
        </View>
        <MIcon name="logout" onPress={handleLogout} size={20} color="#a9cce3" />
      </View>
      <View style={styles.imageContainer}>
        <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
      </View>
      <View style={styles.imageContainer}>
        {selectedImage ? (
          extractedText ? (
            <TouchableHighlight onPress={handleNavigate} style={styles.searchButton}>
              <MIcon name="compare" size={30} color="white" />
            </TouchableHighlight>
          ) : (
            <Text style={styles.text}>Aguarde a extração do texto...</Text>
          )
        ) : (
          <Text style={styles.text}>Selecione uma imagem para Começar</Text>
        )}
      </View>

      <Text style={styles.text2}>
        {extractedText}
      </Text>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconContainer} onPress={pickImageAsync}>
          <FIcon name="image" size={30} color="#a9cce3" />
          <Text style={styles.iconText}>Galeria</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={takePhotoAsync}>
          <FIcon name="camera" size={30} color="#a9cce3" />
          <Text style={styles.iconText}>Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('VisualizarCarta')}>
          <FIcon name="credit-card" size={30} color="#a9cce3" />
          <Text style={styles.iconText}>Carta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Ccamera')}>
          <MIcon name="settings" size={30} color="#a9cce3" />
          <Text style={styles.iconText}>Esboço</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Pesquisar', { user })}>
          <FIcon name="pencil" size={30} color="#a9cce3" />
          <Text style={styles.iconText}>Texto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'scroll',
  },
  header: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#f8f8f8',
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 2,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerLeftSec: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d5986',
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 14,
    color: 'grey',
  },
  text2: {
    fontSize: 20,
    color: '#2d5986',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  iconContainer: {
    alignItems: 'center',
  },

  searchButton: {
    backgroundColor: '#a9cce3',
    padding: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  iconText: {
    marginTop: 5,
    fontSize: 12,
  },
});

export default HomeS;







