import React from 'react';
import { useState , useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity ,Image,FlatList,ActivityIndicator} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const localImage = require('./assets/logo.png');

const VisualizarDados = () => {

  const navigation = useNavigation();

  const route = useRoute();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { extractedText } = route.params || {};
  const { endpoint } = route.params || {};
  
  useEffect(() => {
    if (endpoint) {
      fetch(endpoint)
        .then(response => response.json())
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro ao buscar dados:', error);
          setError(error);
          setLoading(false);
        });
    }
  }, [endpoint]);

  if (loading) {
    return (
      <View style={styles.msgConsulta}>
        <ActivityIndicator size={30} color="#a9cce3"/>
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
      <StatusBar barStyle="light-content"/>
      <View style={styles.header}>
        {/*
        <Image
          source={require('./assets/logo.png')}
          style={styles.headerImage}
        />*/}
        <Text style={styles.logoText}>LUCAR</Text>
        <TouchableOpacity>
            <MIcon name="menu" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>        
        <View style={styles.container}>
          <Text style={styles.textoCamecalho}>VIATURA PESQUISADA: {extractedText || "Nenhum texto extraído"}</Text>
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
                  <Text style={styles.cardContent}>{item.NumeroBI}</Text>
                </View>
                <View style={styles.iconWrapper}>
                  <TouchableOpacity style={styles.iconContainer}>
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
                    <TouchableOpacity style={styles.iconContainer}  onPress={() => navigation.navigate('VisualizarHistorico', { matricola: item.Matricola })}>
                      <MIcon name="history" size={30} color="#a9cce3" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.card2Body}>
                  <Text style={styles.label}>Marca: {item.Marca}</Text>
                  <Text style={styles.label}>Modelo: {item.Modelo}</Text>
                  <Text style={styles.label}>Ano: {item.Ano}</Text>
                  <Text style={styles.label}>Cor: {item.Cor}</Text>
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
        {/*data && data.length > 0 ? (
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
            />
            ) : (
              <Text style={styles.noDataText}>Nenhum dado disponível.</Text>
            )*/} 
      <View style={styles.footer}>
        <Text style={styles.footerText}>Rodapé</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textoCamecalho:{
    color:'grey',
    marginTop:6,
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

  headerImage: {
    width: 100,
    height: 40,
    backgroundColor:'#0086b3',
    borderRadius: 7,
  },
  
  logoText: {
    fontSize: 25,
    fontWeight: '300',
    color: '#fff',
    backgroundColor:'#0086b3',
    borderRadius: 4,
    padding:4,
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
    backgroundColor:'#e6f2ff',

  },
  contentText: {
    fontSize: 16,
  },
  //start card
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    width:'100%',
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
    backgroundColor:'#0086b3',
    marginRight:10,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  cardImageB: {
    width: 50,
    height: 50,
    marginRight:10,
    justifyContent: 'center', 
    alignItems: 'center',
  },

  card2:{
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    width:'100%',
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
  card2Header:{
    backgroundColor: '#cc660018',
    width:'100%',
    flexDirection: 'row',
    alignItems: 'center', 
    elevation: 1,
  },
  card2Body:{
    Color:'red',
    overflow: 'scroll',
    alignItems: 'flex-start', // Garante que o conteúdo fique à esquerda
    marginTop:25,
    /*maxHeight: 200, 
    overflow: 'scroll',*/
  },
  //costomozando os dados da viatura
    label: {
      fontWeight: 'bold',
      color: 'green',
    },
  textContainer: {
    flex: 1,
    paddingRight:20, // Faz o contêiner do texto ocupar o restante do espaço disponível
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
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 18,
  },
});

export default VisualizarDados;

