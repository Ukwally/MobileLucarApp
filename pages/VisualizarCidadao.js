import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; //para o logout



const VisualizarCidadao = () => {
  //Adicionado para fazer consulta
  const rota = useRoute();
  const { NumeroBI } = rota.params || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
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

  //para logout      LD-404-AO
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
    if (NumeroBI) {
      fetch(`http://192.168.43.22:3000/cidadao/${encodeURIComponent(NumeroBI)}`) // Chamada para a nova rota
        .then(response => response.json())
        .then(data => {
          setData(data[0]); // pegar apenas o primeiro item do array
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro ao buscar histórico:', error);
          setError(error);
          setLoading(false);
        });
    }
  }, [NumeroBI]);

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
      <View style={styles.main}>
        <View>
          <Text style={styles.textoCamecalho}>DADOS DO CIDADÃO</Text>
        </View>
        {data ? (
          <View style={styles.content}>
            <View style={styles.card1}>
              <View style={styles.userImage}>
                <MIcon name="person" size={60} color="#fff" />
              </View>
              <Text style={styles.nomeCidadao}>{data.Nome}</Text>
            </View>
            <View style={styles.card2}>

              <View style={styles.cardRow}>
                <View style={styles.iconCard}>
                  <MIcon style={styles.icon} name="fingerprint" size={20} color="#fff" />
                </View>
                <View>
                  <Text style={styles.RowTxt}>BI: <Text style={styles.RowTxtSpan}>{data.NumeroBI}</Text></Text>
                </View>
              </View>

              <View style={styles.cardRow}>
                <View style={styles.iconCard}>
                  <MIcon style={styles.icon} name="location-on" size={20} color="#fff" />
                </View>
                <Text style={styles.RowTxt}>Morada: <Text style={styles.RowTxtSpan}>{data.Endereco}</Text>  </Text>
              </View>

              <View style={styles.cardRow}>
                <View style={styles.iconCard}>
                  <FIcon style={styles.icon} name="venus" size={18} color="#fff" />
                </View>
                <Text style={styles.RowTxt}>Genero: <Text style={styles.RowTxtSpan}>{data.genero}</Text> </Text>
              </View>

              <View style={styles.cardRow}>
                <View style={styles.iconCard}>
                  <FIcon style={styles.icon} name="calendar" size={16} color="#fff" />
                </View>
                <Text style={styles.RowTxt}>Nascimento: <Text style={styles.RowTxtSpan}>{data.DataNascimento}</Text></Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Nenhum dado disponível.</Text>
          </View>
        )}
      </View>
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
const styles = StyleSheet.create({
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  noDataText: {
    color: 'grey',
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


  // SCROLL CONTENT COSTOMIZATION
  main: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60, // altura do cabeçalho
    paddingBottom: 60, // altura do rodapé
    backgroundColor: '#e6f2ff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    width: '100%',
  },
  card1: {
    backgroundColor: 'white',
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
    flexDirection: 'row',

    shadowColor: '#005780',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10, // Para Android

    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#98d0ec',
    borderStyle: 'solid',
    //backgroundColor:'#85c8eb' //Golden card color
    //backgroundColor:'#57acd8'

  },
  userImage: {
    //backgroundColor: '#98d0ec',
    //backgroundColor: '#1780b509',
    //backgroundColor: '#1a90cb60',//cor do footer claro da pagina ver dados
    backgroundColor: '#98d0ec',
    width: 76,
    height: 76,
    borderRadius: 38,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.9,
    //borderColor: '#1780b51c',
    borderColor: '#fff',
    borderStyle: 'dashed',

  },
  nomeCidadao: {
    textAlignVertical: 'center',
    fontWeight: '900',
    fontSize: 20,
    color: '#007599',
  },
  card2: {
    //backgroundColor: '#7ac7ee',
    backgroundColor: 'white',
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,

    shadowColor: '#005780',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10, // Para Android


  },
  cardRow: {
    //backgroundColor: '#cce6ff',
    backgroundColor: '#eaf5ff',
    flexDirection: 'row', // Para alinhar ícone e texto em linha
    alignItems: 'center',
    marginVertical: 3,
    borderRadius: 3,
    padding: 8,


    borderColor: '#1a90cbb4',
    borderWidth: 0.5,
    borderStyle: 'dashed',
  },
  iconCard: {
    /*backgroundColor: '#ffffff48',*/
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,

  },
  icon: {
    borderRadius: 10,
    color: '#1a90cbb4'
  },
  RowTxt: {
    //color: '#608080',
    color: '#404040',
  },
  RowTxtSpan: {
    color: '#404040',
  },
  //FOOTER COSTOMISATION 
  footer: {
    height: 60,
    backgroundColor: '#1a90cbb4',
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
    borderColor: '#ffffff96',
    borderStyle: 'solid',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },

});

export default VisualizarCidadao;