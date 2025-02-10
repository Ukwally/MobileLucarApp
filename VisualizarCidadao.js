import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';


const VisualizarCidadao = () => {
  //Adicionado para fazer consulta
  const rota = useRoute();
  const {NumeroBI} = rota.params || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const navigation = useNavigation();

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
    return <ActivityIndicator size="large" color="#a9cce3"/>;
  }

  if (error) {
    return <Text>Erro ao carregar dados!</Text>;
  }

    return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <View style={styles.header}>
        <Text style={styles.logoText}>LUCAR</Text>
        <TouchableOpacity>
            <MIcon name="menu" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        {/*
        <View>
          <Text style={styles.textoCamecalho}>DADOS DO CIDADÃO</Text>
        </View>*/}
         {data ? (
            <View style={styles.content}>
              <View style={styles.card1}>
                <MIcon name="person" size={100} color="#a9cce3"/>
              </View>
                
              <View style={styles.card2}>

                <View style={styles.cardRow}>
                  <Text>{data.Nome}</Text>
                </View>
                <View style={styles.cardRow}>
                  <View>
                  <MIcon name="fingerprint" size={20} color="#a9cce3" />
                  </View>
                  <View><Text>BI: {data.NumeroBI}</Text></View>
                </View>
                <View style={styles.cardRow}>
                  <MIcon name="location-on" size={20} color="#a9cce3" />
                  <Text>Morada: {data.Endereco}</Text>
                </View>
                <View style={styles.cardRow}>
                  <FIcon name="calendar" size={20} color="#a9cce3" />
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
        <TouchableOpacity>
          <MIcon name="logout" size={20} color="#a9cce3" />
        </TouchableOpacity>
      </View>
    </View>
  );

};
const styles=StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#007599',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute',
    zIndex:1,
    top: 0,
    left: 0,
    right: 0,
  },
  textoCamecalho:{
    color:'grey',
    marginTop:6,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  
  logoText: {
    fontSize: 25,
    fontWeight: '300',
    color: '#fff',
    backgroundColor:'#0086b3',
    borderRadius: 4,
    padding:4,
  },
  
  // SCROLL CONTENT COSTOMIZATION
  main: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60, // altura do cabeçalho
    paddingBottom: 60, // altura do rodapé
    paddingHorizontal: 10,
    backgroundColor:'#e6f2ff',

  },
  content:{
    flexGrow: 1,
  },
  card1:{
    backgroundColor:'white',
    flex:1,
    marginVertical:5,
    borderRadius:5,
    width:'100%',

  },
  card2:{
    backgroundColor:'white',
    flex:3,
    marginVertical:5,
    borderRadius:5,
    padding:10,

  },
  cardRow:{
    backgroundColor:'#cce6ff',
    flexDirection: 'row', // Para alinhar ícone e texto em linha
    alignItems: 'center',
    marginVertical:4,
    borderRadius:3,
    padding:10,
  },
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
    borderTopColor: 'grey', 
    borderTopLeftRadius: 3, 
    borderTopRightRadius: 3,
    borderTopWidth: 1,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 15,
  },

});

export default VisualizarCidadao;