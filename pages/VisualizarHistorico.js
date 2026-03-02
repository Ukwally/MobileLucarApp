import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; //para o logout


const localImage = require('../assets/logo.png');

const VisualizarHistorico = () => {
  const route = useRoute();
  const { matricola } = route.params || {};
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();


  const goHome = async () => {
    //by elisabeth
    try {
      const userData = await AsyncStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : null; //get User

      if (user) {
        navigation.navigate('HomeS', { user: user })
      } else {
        alert('ERRO: Me desculpe, Use a tecla VOLTAR abaixo');
      }

    } catch (error) {
      console.log('Erro: Tenta pegar dados do usuário', error.message)
    }
  }
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



  useEffect(() => {
    if (matricola) {
      fetch(`http://192.168.43.22:3000/historico/${encodeURIComponent(matricola)}`) // Chamada para a nova rota
        .then(response => response.json())
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro ao buscar histórico:', error);
          setError(error);
          setLoading(false);
        });
    }
  }, [matricola]);

  if (loading) {
    return <ActivityIndicator size="large" color="#a9cce3" />;
  }

  if (error) {
    return <Text>Erro ao carregar dados!</Text>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a90cbbd" />
      <View style={styles.header}>
        <Text style={styles.logoText}>LUCAR</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={goHome} >
          <FIcon name="home" size={23} color="#f7f7f7" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
          <Text style={styles.textoCamecalho}>HISTÓRICO DE PROPIETÁRIOS DA VIATURA</Text>
        </View>
        {data && data.length > 0 ? (
          data.map(item => (
            <View key={item.Id} style={styles.card}>
              <TouchableOpacity>
                <View style={styles.cardImageA}>
                  <MIcon name="person" size={30} color="#fff" />
                </View>
              </TouchableOpacity>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{item.Nome}</Text>
                <View style={styles.Row}>
                  <MIcon name="fingerprint" marginRight={1} size={20} color="#a9cce3" />
                  <Text style={styles.cardContent}>BI: {item.NumeroBI}</Text>
                </View>

                <View style={styles.Row}>
                  <MIcon name="location-on" marginRight={1} size={20} color="#a9cce3" />
                  <Text style={styles.cardContent}>local: {item.Endereco}</Text>
                </View>
              </View>
              <View style={styles.iconWrapper}>
                {/* Adicionado o navigation para ver dados do cidadão */}
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('VisualizarCidadao', { NumeroBI: item.NumeroBI })}>
                  <MIcon name="chevron-right" marginRight={1} size={30} color="#a9cce3" />
                </TouchableOpacity>
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
        <TouchableOpacity style={styles.footerBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.footerText}>VOLTAR</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <MIcon name="logout" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export const styles = StyleSheet.create({
  textoCamecalho: {
    color: 'grey',
    marginTop: 6,
    fontWeight: '300',
    fontSize: 13,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  msgConsulta: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 60,
    paddingTop: 15,
    /*backgroundColor: '#007599',*/
    backgroundColor: '#1a90cbb4',
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
  headerIcon: {
    backgroundColor: '#ffffff1a',
    height: 30,
    width: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dataImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  // SCROLL CONTENT COSTOMIZATION
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60, // altura do cabeçalho
    paddingBottom: 60, // altura do rodapé
    paddingHorizontal: 10,
    backgroundColor: '#e6f2ff',

  },
  contentText: {
    fontSize: 16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  noDataText: {
    color: 'grey',
  },
  //start card
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    //shadowColor: '#000',
    shadowColor: '#005780',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6, // Para Android

    //borderColor: '#1a90cbb4',
    borderColor: '#98d0ec',
    borderLeftWidth: 1,
    borderStyle: 'solid',
  },
  cardImageA: {
    width: 50,
    height: 50,
    borderRadius: 25,
    /*backgroundColor: '#0086b3',*/
    //backgroundColor: '#1a90cbb4',
    backgroundColor: '#98d0eca6',

    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 0.7,
    borderColor: '#98d0ec',
    borderStyle: 'dashed',
  },
  cardImageB: {
    width: 50,
    height: 50,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Row: {
    flexDirection: 'row', // Para alinhar ícone e texto em linha
    alignItems: 'center',
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
    color: '#404040',
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
    /*backgroundColor: '#007599',*/
    backgroundColor: '#1a90cb60',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

  },
  footerBtn: {
    backgroundColor: '#ffffff00',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,

    borderWidth: 0.5,
    borderColor: '#ffffff',
    borderStyle: 'solid',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default VisualizarHistorico;

