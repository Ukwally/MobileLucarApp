import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; //para o logout //para pegar o user


const localImage = require('../assets/logo.png');

const VisualizarDados = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [dadosRoubada, setDadosRoubada] = useState(null); // ou false
  const [data, setData] = useState([]);
  const [seguro, setSeguro] = useState(null);  // Novo estado para seguro
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { extractedText } = route.params || {};
  const { endpoint } = route.params || {};

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

    const fetchSeguro = async () => {
      try {
        const res = await fetch(`http://192.168.43.22:3000/seguro/${extractedText}`);
        const json = await res.json();
        setSeguro(json.length > 0 ? json[0] : null);  // Assume que retorna um array com um item ou vazio
      } catch (err) {
        setError(err);
      }
    };

    // Função para buscar todos os dados
    const fetchAll = async () => {
      await Promise.all([fetchViaturas(), fetchRoubadas(), fetchSeguro()]);
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
      <StatusBar barStyle="light-content" backgroundColor="#1a90cbbd" />
      <View style={styles.header}>
        <Text style={styles.logoText}>LUCAR</Text>

        <TouchableOpacity style={styles.headerIcon} onPress={goHome} >
          <FIcon name="home" size={23} color="#f7f7f7" />
        </TouchableOpacity>

      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} nestedScrollEnabled={true}>
        {dadosRoubada ? (
          <View style={styles.dadosRoubada}>
            <MIcon name="info" size={30} color="#caae32f6" />
            <Text style={{ color: '#fff', fontWeight: 800, marginLeft: 7 }}>VIATURA ROUBADA !</Text>
          </View>
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
                    <MIcon name="person" size={30} color="#fff" />
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
                      <FIcon name="car" size={30} color="#fff" />
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
                  {/* Status do seguro*/}
                  {seguro ? (
                    <View >
                      {new Date(seguro.data_validade) < new Date() ?
                        <View style={styles.alertLabel} marginTop='0'>
                          <MIcon name="security" size={25} color="#adad00ff" />
                          <Text style={{ color: '#adad00ff', marginLeft: 6, fontSize: 12 }}> SEGURO: EXPIRADO {seguro.data_validade}</Text>
                        </View>
                        :
                        <View style={styles.alertLabel} marginTop='0'>
                          <MIcon name="security" size={25} color="#008060" />
                          <Text style={{ color: '#008060', marginLeft: 6, fontSize: 12 }}>SEGURO: ATIVO - {seguro.data_validade}</Text>
                        </View>
                      }
                    </View>
                  ) : (
                    <View style={styles.alertLabel}>
                      <MIcon name="security" size={25} color="#d60000ff" />
                      <Text style={{ color: '#d60000ff', marginLeft: 6, fontSize: 12 }}>INSEGURO</Text>
                    </View>
                  )}
                  {/* Status da Inspeção */}
                  {item.data_validade ? (
                    <View style={styles.alertLabel}>
                      <MIcon name="car-repair" size={25} color={item.inspecao_expirada ? "#d60000ff" : "green"} />
                      {item.inspecao_expirada ?
                        <Text style={{ color: '#adad00ff', marginLeft: 6, fontSize: 12 }}>
                          INSPEÇÃO: EXPIRADA - {item.data_validade}
                        </Text>
                        :
                        <Text style={{ color: 'green', marginLeft: 6, fontSize: 12 }}>
                          INSPEÇÃO: VÁLIDA - {item.data_validade}
                        </Text>
                      }
                    </View>
                  ) : (
                    <View style={styles.alertLabel}>
                      <MIcon name="car-repair" size={25} color="#d60000ff" />
                      <Text style={{ color: '#d60000ff', marginLeft: 6, fontSize: 12 }}>SEM INSPEÇÃO REGISTADA</Text>
                    </View>
                  )}


                  <ScrollView nestedScrollEnabled={true}>
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
        {/*seguro ? (
          <View>
            <Text>Id: {seguro.Id}</Text>
            <Text>matricula_veiculo: {seguro.matricula_veiculo}</Text>
            <Text>numero_seguro: {seguro.numero_seguro}</Text>
            <Text>data_emissao: {seguro.data_emissao}</Text>
            <Text>data_validade: {seguro.data_validade}</Text>
            <Text>observacoes: {seguro.observacoes}</Text>
            <Text>seguradora: {seguro.seguradora}</Text>
          </View>
        ) : (
          <Text style={styles.textoCamecalho}>INSEGURO</Text>
        )*/}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.footerText}>VOLTAR</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <MIcon name="logout" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textoCamecalho: {
    color: 'grey',
    marginTop: 6,
    fontWeight: '300',
    fontSize: 13,
  },
  dadosRoubada: {
    marginTop: 6,
    borderRadius: 5,
    backgroundColor: '#cc0000',
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#41506b',
    elevation: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#e6f2ff',
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
    backgroundColor: '#57acd8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    elevation:5,
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
    paddingBottom: 60,
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


    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowColor: '#005780',
    shadowRadius: 5,
    elevation: 10, // Para Android


  },
  cardImageA: {
    width: 50,
    height: 50,
    borderRadius: 25,
    /*backgroundColor: '#0086b3',*/
    backgroundColor: '#57acd8',
    marginRight: 10,
   
    justifyContent: 'center',
    alignItems: 'center',

  },
  card2: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    //width:'100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    //elevation: 1, // Para Android

    borderColor: '#0087c525',
    borderWidth: 0.5,
    borderRadius: 4,
  },
  card2Header: {
    backgroundColor: '#cce6ff',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    //elevation: 1,
    borderRadius: 6,

  },
  card2Body: {
    width: '100%',
    marginTop: 15,
    maxHeight: 270,
  },
  //costomozando os dados da viatura
  alertLabel: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#0087c511',
    padding: 4,
    marginBottom: 3,
    borderColor: '#0087c54d',
    borderWidth: 0.6,
    borderStyle: 'dashed',
    borderRadius: 4,
  },
  label: {
    flex: 1,
    //fontWeight: 'bold',
    //color: '#008060f1',
    color: '#333',
    backgroundColor: '#eaf5ff',
    marginVertical: 3,
    borderRadius: 3,
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
    /*backgroundColor: '#007599',*/
    backgroundColor: '#1a90cb60',
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

  },
  footerBtn: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  footerText: {
    color: '#1a90cbb4',
    fontSize: 14,
    fontWeight: '400',
  },
});

export default VisualizarDados;

