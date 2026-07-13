import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, TouchableHighlight } from 'react-native';
import ImageViewer from '../components/ImageViewer';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; //para o logout

import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';

//No cameraS ao clicar em deep, redireciona poara aqui emquanto processa o python, e quando encontrado mostra o texto com o BTN Ver Dados
//ao clicar em deep redireciona para o python, corta, identifica a matricula, corta, salva em assets, ou faz replace em assets, executa ocr tudo no servidor, e apenas retorna o txt
const DeepResult = ({ route }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const navigation = useNavigation();
    const { user } = route.params;

    useEffect(() => {
        if (route.params?.imagemDetectada) {

            const uri = `http://192.168.43.22:3000${route.params.imagemDetectada}`;
            setSelectedImage(uri); //Mostra a imagem tirada
            console.log(uri)

            const file = {
                uri,
                name: "photo.jpg",
                type: "image/jpeg",
            };

            performOCR(file);
        }
    }, [route.params?.imagemDetectada]);

    const handleNavigate = () => {
        navigation.navigate('VisualizarDados', {
            endpoint: `http://192.168.43.22:3000/data/${encodeURIComponent(extractedText)}`, // Usa o texto extraído na URL
            extractedText: extractedText,  // Adicionado para passar o texto extraído
        });
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
                //setExtractedText(result["all_text"]); // versão anterior removida para padronizarMatricula antes de setExtractedText

                // ABAIXO ADIONADO PARA padronizarMatricula ANDES DE setExtractedText - Padroniza antes de mostar na tela.
                const textoOCR = result["all_text"];
                const textoPadronizado = padronizarMatricula(textoOCR);
                setExtractedText(textoPadronizado);
                // FIM DO ADIONADO PARA padronizarMatricula ANDES DE setExtractedText
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

    const padronizarMatricula = (textoBruto) => {
        if (!textoBruto || textoBruto.trim() === "") return "";

        // Lista de códigos de província (conforme o Artigo 27º do Presidencial n.º 202/16)
        const codigosNovos = [
            "BGO", "BIE", "BLA", "CCU", "CDA", "CNE", "CNO", "CSU",
            "HBO", "HLA", "LDA", "LNO", "LSU", "LTO", "MCO", "MIE",
            "NBE", "UGE", "ZRE"
        ];

        // Códigos antigos
        const codigosAntigos = [
            "BG", "BL", "BI", "CB", "CC", "CN", "CS", "CU",
            "HB", "HL", "LD", "LN", "LS", "AN", "MO", "NB", "UI", "ZR"
        ];

        // Unifica os dois arrays
        const codigosProvincia = [...codigosNovos, ...codigosAntigos];

        let resultadoEncontrado = "";

        // Para cada código de província
        for (const codigo of codigosProvincia) {
            // Procura o código mesmo que tenha letras extras na frente
            // Ex: "FLDA 97-93-AH" -> encontra "LDA"
            const regex = new RegExp(`${codigo}[\\s-]?(\\d{2})[\\s-]?(\\d{2})[\\s-]?([A-Z]{2})`, 'i');
            const match = textoBruto.match(regex);

            if (match) {
                // Reconstrói no formato oficial: LDA-97-93-AH
                resultadoEncontrado = `${codigo.toUpperCase()}-${match[1]}-${match[2]}-${match[3].toUpperCase()}`;
                break;
            }
        }

        // Fallback: tenta encontrar qualquer padrão de matrícula no texto
        if (!resultadoEncontrado) {
            const fallbackRegex = /([A-Z]{2,3})[\s-]?(\d{2})[\s-]?(\d{2})[\s-]?([A-Z]{2})/i;
            const fallbackMatch = textoBruto.match(fallbackRegex);
            if (fallbackMatch) {
                resultadoEncontrado = `${fallbackMatch[1].toUpperCase()}-${fallbackMatch[2]}-${fallbackMatch[3]}-${fallbackMatch[4].toUpperCase()}`;
            }
        }

        if (!resultadoEncontrado) {
            return textoBruto.trim();
        }

        // Limpeza
        let matriculaLimpa = resultadoEncontrado
            .replace(/\s+/g, '')           // Remove espaços
            .replace(/-+/g, '-')           // Remove hífens duplicados
            .replace(/[^\w-]/g, '')        // Remove caracteres especiais
            .toUpperCase();

        return matriculaLimpa;
    };
    return (
        <View style={styles.container}>
            <StatusBar barStyle="ligth-content" backgroundColor="#0087c5db" />
            <View style={styles.header}>
                <MIcon name="logout" onPress={handleLogout} size={20} color="#fff" />
            </View>
            <View style={styles.imageContainer}>
                {/*<ImageViewer
                    placeholderImageSource={PlaceholderImage}
                    selectedImage={selectedImage}
                />*/}
            </View>
            <View style={styles.imageContainer}>
                {extractedText ? (
                    <TouchableHighlight onPress={handleNavigate} style={styles.searchButton}>
                        <MIcon name="compare" size={30} color="white" />
                    </TouchableHighlight>
                ) : (
                    < ActivityIndicator size={30} color="#a9cce3" />
                    /*<Text style={styles.text}>Aguarde...</Text>*/
                )}
            </View>

            <Text style={styles.text2}>
                {extractedText}
            </Text>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.iconContainer} onPress={navigation.goBack}>
                    <FIcon name="home" size={30} color="#1a90cbb4" />
                    <Text style={styles.iconText}>HOME</Text>
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
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 2,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0.7,
        borderBottomColor: '#fff',

        top: 3,
        backgroundColor: '#0087c5db',
        width: '98%',
        borderBottomRightRadius: 10,
        borderBottomStartRadius: 10,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,

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
        elevation: 20,
        shadowColor: '#41506b',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    iconContainer: {
        alignItems: 'center',
    },
    searchButton: {
        backgroundColor: '#1a90cbb4',
        padding: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    iconText: {
        marginTop: 5,
        fontSize: 12,
        color: '#0c405a'
    },
});

export default DeepResult;







