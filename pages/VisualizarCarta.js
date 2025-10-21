import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; //para o logout
import { InputAccessoryView } from 'react-native';

import ImageViewer from '../components/ImageViewer';

const PlaceholderImage = require('../assets/images/carta.png');


const VisualizarCarta = () => {

  const navigation = useNavigation();

  const route = useRoute();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');  // Armazena o texto da pesquisa

  const dataAtual = new Date();
  const dataExpiracao = new Date(data.data_expiracao); //Talvez seja melhor usar isto em vez de data.data_expiracao

  const handleSearch = async () => {
    if (!searchText.trim()) {
      return;  // Evita buscar se o campo de pesquisa estiver vazio
    }
    setLoading(true);
    setError(null);

    try {
      const isNumeric = !isNaN(searchText);
      const endpoint = `http://192.168.43.22:3000/cartas?${isNumeric ? 'numeroBI' : 'numero_carta'}=${searchText}`;

      const response = await fetch(endpoint);
      const result = await response.json();

      if (response.ok) {
        setData(result);  // Atualiza os dados com a carta encontrada
      } else {
        setError('Carta não encontrada');
      }

    } catch (err) {
      setError('Erro ao buscar a carta');
    } finally {
      setLoading(false);
    }
  };
  //para logout
  const handleLogout = async () => {
    try {
      // Limpar qualquer dado armazenado no AsyncStorage, como token, se necessário
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
      //await AsyncStorage.clear(); //limpa tudo!
      //await AsyncStorage.multiRemove(['token', 'userData']); // paga as duas chaves

      // Redefine a pilha de navegação para enviar o usuário apenas para a tela de login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.msgConsulta}>
        <ActivityIndicator size={30} color="#a9cce3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.msgConsulta}>
        <Text>Erro ao carregar dados!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007599" />
      <View style={styles.header}>
        <Text style={styles.logoText}>LUCAR</Text>

      </View>
      <View style={styles.inputView}>
        <FIcon name="pencil" size={30} color="#a9cce3" />
        <TextInput
          style={styles.txtInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Pesquisar carta..."
        >
        </TextInput>
        <TouchableOpacity style={styles.btnBuscar} onPress={handleSearch}>
          <Text style={styles.btnBuscarTxt}>BUSCAR</Text>
        </TouchableOpacity>
      </View>
      {/*
      <View style={styles.imageContainer}>
        <Image 
          source={PlaceholderImage} 
          style={[styles.image, { opacity: 1 }]}
          blurRadius={1} 
        />
      </View>
      */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/*<View>
          <Text style={styles.textoCamecalho}>PESQUISAR CARTA:</Text>
        </View>*/}
        {data && data.length > 0 ? (
          data.map(data => (
            <View key={data.id}>
              <View style={styles.textoErroDataCarta}>
                {new Date(data.data_expiracao) <= dataAtual ?
                  <Text style={styles.textoErroDataCartatxtExp}>Expirado</Text> :
                  <Text style={styles.textoErroDataCartatxtAti}>Ativo</Text>
                }
              </View>

              <View style={styles.card2}>
                <View style={styles.card2Header}>
                  <TouchableOpacity>
                    <View style={styles.cardImageA}>
                      <FIcon name="tag" size={30} color="#a9cce3" />
                    </View>
                  </TouchableOpacity>
                  <View style={styles.textContainer}>
                    <Text style={styles.cardContent}>Nº:   {data.numero_carta}</Text>
                  </View>
                </View>
                <View style={styles.card2Body}>
                  <ScrollView>
                    <Text style={styles.label}>id: {data.id}</Text>
                    <Text style={styles.label}>nome: {data.nome}</Text>
                    <Text style={styles.label}>numeroBI: {data.numeroBI}</Text>
                    <Text style={styles.label}>dataNascimento: {data.dataNascimento}</Text>
                    <Text style={styles.label}>emitido_por: {data.emitido_por}</Text>
                    <Text style={styles.label}>data_emissao: {data.data_emissao}</Text>
                    <Text style={styles.label}>data_expiracao: {data.data_expiracao}</Text>
                  </ScrollView>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Nenhum dado disponível.</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.footerText}>VOLTAR</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <MIcon name="logout" size={20} color="#a9cce3" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  msgConsulta: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  msgConsulta: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 60,
    paddingTop: 15,
    backgroundColor: '#007599',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
  },
  logoText: {
    fontSize: 25,
    fontWeight: '300',
    color: '#fff',
    padding: 4,
  },
  inputView: {
    marginTop: 60,
    backgroundColor: 'white',
    borderColor: '#a9cce3',
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 5,
    // position:'absolute',
    // zIndex:1
  },
  txtInput: {
    backgroundColor: 'whitesmoke',
    width: '60%',
    height: 40,
    marginLeft: 10,
    color: 'grey',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  btnBuscar: {
    backgroundColor: '#cce6ff',
    padding: 10,
    borderRadius: 4
  },
  btnBuscarTxt: {
    color: '#0086b3',
    fontWeight: 'bold'
  },
  imageContainer: {
    marginTop: 60,
  },
  image: {
    width: '100%',
    height: 190,
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 4,
    opacity: .4,
    blurRadius: 4,
  },
  textoCamecalho: {
    color: 'grey',
    marginTop: 6,
  },
  textoErroDataCarta: {
    backgroundColor: 'yellow',
    borderRadius: 5,
    padding: 5,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowRadius: 5,
    elevation: 1,
  },
  textoErroDataCartatxtExp: {
    color: 'red',
    fontWeight: 'bold',
  },
  textoErroDataCartatxt: {
    color: 'green',
    fontWeight: 'bold',

  },
  // SCROLL CONTENT COSTOMIZATION
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 60, // altura do rodapé
    paddingHorizontal: 10,
    backgroundColor: '#e6f2ff',
  },
  contentText: {
    fontSize: 16,
  },
  //start card
  cardImageA: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0086b3',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageB: {
    width: 50,
    height: 50,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card2: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1, // Para Android
  },
  card2Header: {
    backgroundColor: '#cce6ff',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    //elevation: 1,
  },
  card2Body: {
    width: '100%',
    marginTop: 15,
    /*overflow: 'scroll',*/
  },
  //costomozando os dados da viatura
  label: {
    flex: 1,
    fontWeight: 'bold',
    color: 'green',
    backgroundColor: '#eaf5ff',
    marginVertical: 3,
    padding: 8,
  },
  textContainer: {
    flex: 1,
    paddingRight: 20, // Faz o contêiner do texto ocupar o restante do espaço disponível
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardContent: {
    fontSize: 14,
    color: '#333',
  },
  iconWrapper: {
    justifyContent: 'center', // Centraliza o ícone verticalmente
  },
  iconContainer: {
    position: 'absolute',
    bottom: 0, // Ajuste a distância do topo conforme necessário
    right: 0, // Ajuste a distância da borda direita conforme necessário
  },
  // end card
  //FOOTER COSTOMISATION 
  footer: {
    height: 60,
    backgroundColor: '#007599',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopColor: '#a9cce3',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderTopWidth: 4,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});

export default VisualizarCarta;

