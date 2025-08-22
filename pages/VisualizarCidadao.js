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


  //para logout      LD-404-AO
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
      <StatusBar barStyle="light-content" backgroundColor="#007599" />
      <View style={styles.header}>
        <Text style={styles.logoText}>LUCAR</Text>
        <TouchableOpacity>
          <MIcon name="menu" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        <View>
          <Text style={styles.textoCamecalho}>DADOS DO CIDADÃO</Text>
        </View>
        {data ? (
          <View style={styles.content}>
            <View style={styles.card1}>
              <MIcon style={styles.icon} name="person" size={100} color="#a9cce3" />
              <Text style={styles.nomeCidadao}>{data.Nome}</Text>
            </View>
            <View style={styles.card2}>
              <View style={styles.cardRow}>
                <View>
                  <MIcon style={styles.icon} name="fingerprint" size={20} color="#007599" />
                </View>
                <View><Text>BI: {data.NumeroBI}</Text></View>
              </View>
              <View style={styles.cardRow}>
                <MIcon style={styles.icon} name="location-on" size={20} color="#007599" />
                <Text>Morada: {data.Endereco}</Text>
              </View>
              <View style={styles.cardRow}>
                <FIcon style={styles.icon} name="venus" size={15} color="#007599" />
                <Text>Genero: {data.genero}</Text>
              </View>
              <View style={styles.cardRow}>
                <FIcon style={styles.icon} name="calendar" size={15} color="#007599" />
                <Text>Nascimento: {data.DataNascimento}</Text>
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
  textoCamecalho: {
    color: 'grey',
    marginTop: 6,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  logoText: {
    fontSize: 25,
    fontWeight: '300',
    color: '#fff',
    padding: 4,
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
    flex: 1,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
    flexDirection: 'row',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1, // Para Android

  },
  nomeCidadao: {
    textAlignVertical: 'center',
    fontWeight: '900',
    fontSize: 20,
    color: '#007599',
  },
  card2: {
    backgroundColor: 'white',
    flex: 3,
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1, // Para Android

  },
  cardRow: {
    backgroundColor: '#cce6ff',
    //backgroundColor:'#eaf5ff',
    flexDirection: 'row', // Para alinhar ícone e texto em linha
    alignItems: 'center',
    marginVertical: 4,
    borderRadius: 3,
    padding: 10,
  },
  icon: { marginRight: 10 },
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

export default VisualizarCidadao;