import { Alert } from "react-native";
import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { useNavigation } from "@react-navigation/native";
import PhotoManipulator from 'react-native-photo-manipulator';//para recorte
import AsyncStorage from '@react-native-async-storage/async-storage';// get user


export default function Ccamera() {
    const device = useCameraDevice("back");
    const { hasPermission, requestPermission } = useCameraPermission();
    const [permission, setPermission] = useState(null);
    const cameraRef = useRef(null);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const status = await requestPermission();
            if (status) {
                setPermission(true);
            }
        })()
    }, []);

    const takePhoto = async () => {
        if (!cameraRef.current || !device) return;

        try {
            const photo = await cameraRef.current.takePhoto({
                qualityPrioritization: "balanced", // opcional
            });
            //console.log("FOTO CAPTURADA:", photo);
            //Alert.alert('Foto capturada', JSON.stringify(photo));

            const savedUser = await AsyncStorage.getItem('userData'); //get User
            const user = savedUser ? JSON.parse(savedUser) : null; //get User

            const fullPath = photo?.path?.startsWith('file://') ? photo.path : `file://${photo.path}`; //para adicionar file:// ao path

            // inicio Dimensões de recorte: cortar o centro
            const cropRegion = {
                /*x: 0,
                y: photo.height * 0.25,   // corta 25% do topo
                width: photo.width,
                height: photo.height * 0.5, // fica só a metade central */

                //Abaixo para contar o centro no retangolo limite 
                /*
                x: photo.width * 0.25,  // Início do corte em X (25% da largura)
                y: photo.height * 0.25, // Início do corte em Y (25% da altura)
                width: photo.width * 0.5, // Largura de 50%
                height: photo.height * 0.5, // Altura de 50%*/

                x: photo.width * 0.05,
                y: photo.height * 0.35, 
                width: photo.width * 0.9,
                height: photo.height * 0.3,
            };
            const croppedImage = await PhotoManipulator.crop(fullPath, cropRegion);
            //Fim recorte

            navigation.navigate("HomeS", {
                //capturedImage: photo.path, // ou photo.uri dependendo da lib
                //capturedImage: photo.path || photo.uri, // para o caso de não saber se é path ou uri
                //capturedImage: fullPath, // Emviar o caminho completo para o caso de foto com react-native-vision-camera
                capturedImage: croppedImage,
                user: user, // envia os dados do user
            });

        } catch (error) {
            console.log("ERRO AO TIRAR FOTO:", error);
            Alert.alert("Erro ao tirar foto", error.message);
        }
    };

    if (!permission) return <View></View>;
    if (!device) return <View></View>;

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Camera
                style={StyleSheet.absoluteFill}
                //style={{ flex: 0.5 }} // apenas metade da tela pelo corte
                ref={cameraRef}
                device={device}
                isActive={true}
                photo={true}  // IMPORTANTE: Somente fotos
            />
            < View style={styles.limite} />

            <TouchableOpacity
                onPress={takePhoto}
                style={{
                    width: 70,
                    height: 70,
                    borderRadius: 99,
                    borderWidth: 8,
                    borderColor: '#e0e1e6',
                    backgroundColor: '#ffffffff',
                    position: 'absolute',
                    bottom: 70,
                    alignSelf: 'center'
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    limite: {
        position: 'absolute',
        top: '35%',  // 25% da altura da tela (centrado)
        left: '5%', // 25% da largura da tela (centrado)
        width: '90%',  // 50% da largura da tela
        height: '30%', // 50% da altura da tela
        borderWidth: 4,
        borderColor: '#a9cce3', // Cor do contorno do retângulo
        backgroundColor: 'transparent', // Transparente para ser apenas o contorno
    },
});
