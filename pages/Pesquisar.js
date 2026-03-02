import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, Alert, TouchableHighlight, FlatList, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // para o logout

import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';

const Pesquisar = ({ route }) => {
  const navigation = useNavigation();
  const [matricula, setMatricula] = useState('');
  const { user } = route.params || {};

  const handleNavigate = () => {
    if (matricula.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira uma matrícula para buscar.');
      return;
    }

    const endpoint = `http://192.168.43.22:3000/data/${matricula}`;
    navigation.navigate('VisualizarDados', { endpoint, extractedText: matricula });
  };

  // Função de logout
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeftSec}>
          <View style={styles.userImage}>
            <FIcon name="user" size={20} color="#1a90cb8e" />
          </View>
          {/*<Text style={styles.headerText}>{user.username}</Text>*/}
          <Text style={styles.headerText}>{user?.username || 'Técnico'}</Text>

        </View>
        <MIcon name="logout" onPress={handleLogout} size={20} color="#a9cce3" />
      </View>
      <View style={styles.inputView}>
        <MIcon name="search" size={30} color="#a9cce3" />
        <TextInput
          style={styles.txtInput}
          value={matricula}
          onChangeText={setMatricula}
          placeholder="Pesquisar Viatura..."
        />
        <TouchableOpacity style={styles.btnBuscar} onPress={handleNavigate}>
          <Text style={styles.btnBuscarTxt}>BUSCAR</Text>
        </TouchableOpacity>
      </View>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
          <FIcon name="home" size={30} color="#1a90cbb4" />
          <Text style={styles.iconText}>Página Pricipal</Text>
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
    borderBottomColor: '#fff'
  },
  headerLeftSec: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    backgroundColor: '#1780b51c',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',

  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d5986',
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 14,
    color: 'grey',
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
  iconText: {
    marginTop: 5,
    fontSize: 12,
    color: '#0c405a'
  },
  inputView: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    elevation: 1,
    shadowColor: '#41506b',

  },
  txtInput: {
    flex: 1,
    paddingHorizontal: 5,
    height: 40,
    borderColor: '#f1f1f1ff',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    color: 'grey',
    textTransform: 'uppercase',
    marginLeft: 5,

  },
  btnBuscar: {
    backgroundColor: '#cce6ff',
    padding: 10,
    borderRadius: 4,
    marginLeft: 8,
  },

  btnBuscarTxt: {
    color: '#0086b3',
    fontWeight: 'bold'
  },

});

export default Pesquisar;
