import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; //para o logout


const localImage = require('../assets/logo.png');

const VisualizarDados = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [dadosRoubada, setDadosRoubada] = useState(null); // ou false
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { extractedText } = route.params || {};
  const { endpoint } = route.params || {};

  //para logout
  const handleLogout = async () => {
    try {
      // Limpar qualquer dado armazenado no AsyncStorage, como token, se necessário
      await AsyncStorage.removeItem('token');

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
    const fetchViaturas = async () => {
      try {
        const res = await fetch(endpoint);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err);
      }
    };

    const fetchRoubadas = async () => {
      try {
        const res = await fetch(`http://192.168.43.22:3000/viaturas-roubadas/${extractedText}`);
        const json = await res.json();
        setDadosRoubada(json.length > 0);
      } catch (err) {
        setError(err);
      }
    };

    const fetchAll = async () => {
      await Promise.all([fetchViaturas(), fetchRoubadas()]);
      setLoading(false);
    };

    if (endpoint && extractedText) {
      fetchAll();
    }
  }, [endpoint, extractedText]);


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
    //ATT DELTA:O safAareaView substituio o View pelo problema de barra inferior sobreposta.Antes:<View style={styles.container}>
    <SafeAreaView style={styles.container} edges={['bottom', 'top']}>
      <StatusBar barStyle="light-content" backgroundColor="#007599" />
      <View style={styles.header}>
        <Text style={styles.logoText}>LUCAR</Text>
        <TouchableOpacity>
          <MIcon name="menu" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {dadosRoubada ? (
          <Text style={styles.dadosRoubada}>VIATURA ROUBADA</Text>
        ) : (
          <Text style={styles.textoCamecalho}>VIATURA PESQUISADA: {extractedText || "Nenhum texto extraído"}</Text>
        )}
        <View>
        </View>
        {data && data.length > 0 ? (
          data.map(item => (
            <View key={item.Matricola}>
              <View style={styles.card}>
                <TouchableOpacity>
                  <View style={styles.cardImageA}>
                    <MIcon name="person" size={30} color="#a9cce3" />
                  </View>
                </TouchableOpacity>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>{item.Nome}</Text>
                  <Text style={styles.cardContent}>BI: {item.NumeroBI}</Text>
                </View>
                <View style={styles.iconWrapper}>
                  <TouchableOpacity style={styles.iconContainer} onPress={() => { navigation.navigate('VisualizarCidadao', { NumeroBI: item.NumeroBI }); }}>
                    <MIcon name="more" size={30} color="#a9cce3" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.card2}>
                <View style={styles.card2Header}>
                  <TouchableOpacity>
                    <View style={styles.cardImageA}>
                      <FIcon name="car" size={30} color="#a9cce3" />
                    </View>
                  </TouchableOpacity>
                  <View style={styles.textContainer}>
                    <Text style={styles.cardContent}>MAT:   {item.Matricola}</Text>
                  </View>
                  <View style={styles.iconWrapper}>
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('VisualizarHistorico', { matricola: item.Matricola })}>
                      <MIcon name="history" size={30} color="#a9cce3" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.card2Body}>
                  <ScrollView>
                    <Text style={styles.label}>Marca: {item.Marca}</Text>
                    <Text style={styles.label}>Modelo: {item.Modelo}</Text>
                    <Text style={styles.label}>Ano: {item.Ano}</Text>
                    <Text style={styles.label}>Cor: {item.Cor}</Text>

                    <Text style={styles.label}>NumeroMotor: {item.NumeroMotor}</Text>
                    <Text style={styles.label}>MedidaPmeumaticos: {item.MedidaPmeumaticos}</Text>
                    <Text style={styles.label}>Servico: {item.Servico}</Text>
                    <Text style={styles.label}>Lotacao: {item.Lotacao}</Text>
                    <Text style={styles.label}>Cilindrada: {item.Cilindrada}</Text>
                    <Text style={styles.label}>NumeroCilindros: {item.NumeroCilindros}</Text>
                    <Text style={styles.label}>Combustivel: {item.Combustivel}</Text>
                    <Text style={styles.label}>PesoBruto: {item.PesoBruto}</Text>
                    <Text style={styles.label}>Tara: {item.Tara}</Text>
                    <Text style={styles.label}>NumeroQuadro: {item.NumeroQuadro}</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textoCamecalho: {
    color: 'grey',
    marginTop: 6,
  },
  dadosRoubada: {
    color: 'red',
    marginTop: 6,
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
    fontWeight: 800,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#007599',
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
    paddingBottom: 60,
    paddingHorizontal: 10,
    backgroundColor: '#e6f2ff',

  },
  contentText: {
    fontSize: 16,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1, // Para Android
  },
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
    marginVertical: 10,
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
    //alignItems: 'flex-start', // Garante que o conteúdo fique à esquerda
    /*overflow: 'scroll',*/
    maxHeight: 270,
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
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 0, 
    right: 0,
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
    //position: 'absolute',  //ATT DELTA comentado para currigir a sobreposilção de teclas inferiores
    //bottom: 0,  //ATT DELTA  comentado para currigir a sobreposilção de teclas inferiores
    //bottom: 0,  //ATT DELTA  comentado para currigir a sobreposilção de teclas inferiores
    //bottom: 0,  //ATT DELTA  comentado para currigir a sobreposilção de teclas inferiores
    //left: 0,  //ATT DELTA  comentado para currigir a sobreposilção de teclas inferiores
    //right: 0,  //ATT DELTA  comentado para currigir a sobreposilção de teclas inferiores
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

export default VisualizarDados;

