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
    navigation.navigate('VisualizarDados', { endpoint, extractedText: matricula  });
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
          <FIcon name="user" size={20} color="#a9cce3" />
          {/*<Text style={styles.headerText}>{user.username}</Text>*/}
          <Text style={styles.headerText}>{user?.username || 'Técnico'}</Text>

        </View>
        <MIcon name="logout" onPress={handleLogout} size={20} color="#a9cce3" />
      </View>
      <View style={styles.imageContainer}>
        <View style={styles.inputView}>
          <FIcon name="pencil" size={30} color="#a9cce3" />
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
      </View>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
          <FIcon name="home" size={30} color="#a9cce3" />
          <Text style={styles.iconText}>Home</Text>
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
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 2,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeftSec: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
    fontSize: 12,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    width: '90%',
  },
  txtInput: {
    flex: 1,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 16,
    borderColor: '#f1f1f1ff',
    borderWidth: 2,
    borderRadius: 5,
  },
  btnBuscar: {
    backgroundColor: '#cce6ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    marginLeft: 10,
  },

  btnBuscarTxt: {
    color: '#0086b3',
    fontWeight: 'bold'
  },

});

export default Pesquisar;
