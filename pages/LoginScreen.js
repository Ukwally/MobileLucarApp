//LOGIN COM FETCH
import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, Text, View, TextInput, TouchableOpacity, ScrollView, Image, Modal, Pressable, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage'; // para o logout
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Logo from "../components/Logo";


export default function LoginScreen({ navigation }) {

  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(''); // Estado para o ID
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const [menuVisivel, setMenuVisivel] = useState(false);

  useEffect(() => {  //para não ser necessário fazer login sempre que abrir e fechar a tela, ATT: REVER, POIS TALVES FAÇA LAGIN DUAS VESES, REQUISITANDPO DESNECESSARIAMENTE
    const verificarLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUserData = await AsyncStorage.getItem('userData');

        if (token && storedUserData) {
          const user = JSON.parse(storedUserData);
          navigation.replace('HomeS', { user });
        }
      } catch (error) {
        console.error(error);
      }
    };
    verificarLogin();

  }, []);

  useEffect(() => {
    const carregarUsuarioPadrao = async () => {
      try {
        const saved = await AsyncStorage.getItem('defaultUser');
        if (saved) {
          const { userId, password } = JSON.parse(saved);
          setUserId(userId);
          setPassword(password);
        }
      } catch (error) {
        console.error(error);
      }
    };
    carregarUsuarioPadrao();
  }, []);


  const salvarUsuarioPadrao = async () => {
    try {
      await AsyncStorage.setItem('defaultUser', JSON.stringify({
        userId,
        password,
      }));
      Alert.alert('Sucesso', 'Usuário guardado!');
    } catch (error) {
      console.error(error);
    }
  }


  const removerUsuarioPadrao = async () => {
    try {
      await AsyncStorage.removeItem('defaultUser');
      setUserId('');
      setPassword('');
      Alert.alert('Removido', 'Usuário padrão apagado');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    if (!userId || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      const response = await fetch('http://192.168.43.22:3000/login', {  // Use o IP correto da sua máquina
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,    // Certifique-se de que 'userId' está sendo passado corretamente
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.user.tech_number); // get user   //para o logout 
        await AsyncStorage.setItem('userData', JSON.stringify(data.user)); // get User


        setUserData(data.user);
        navigation.replace('HomeS', { user: data.user });
      } else {
        Alert.alert('Erro', 'Credenciais erradas');
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    }
    console.log(data);

  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0087c5ff" />

      {/* Cabeçalho com botão de configurações */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingsButton} onPress={() => setModalVisible(true)}>
          {/*<Image source={require('../assets/settings-icon2.png')} style={styles.settingsIcon} />*/}
          <MIcon name="settings" size={30} color="#ffffffff" />
        </TouchableOpacity>
      </View>
      {/* Conteúdo principal */}
      <ScrollView contentContainerStyle={styles.innerContainer}>
        {/*<Image
          source={require('./assets/logo.png')}
          style={styles.logo}
        /> */}
        {/*<Text style={styles.logoText}>LUCAR</Text>*/}

        <View style={styles.svg}>
          <Logo width={225} height={90} />
          {/*<Logo width={200} height={80} />*/}
        </View>

        <Text style={styles.welcomeText}>Bem-vindo</Text>

        <TextInput
          style={styles.input}
          placeholder="ID"
          placeholderTextColor="#aaa"
          value={userId}
          onChangeText={setUserId}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>COMEÇAR</Text>
        </TouchableOpacity>

        <Text style={styles.privacyPolicy}>
          Powered by Elisabeth Pedro
        </Text>
      </ScrollView>
      {/* Modal de Configurações */}

      {/* Modal de Configurações */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {/* BlurView aplicado ao fundo */}
          <BlurView
            style={styles.absolute}
            intensity={400}
            blurType="dark"
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configurações</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setMenuVisivel(!menuVisivel)} >
              <Text style={styles.modalButtonText}>PREDEFINIR USUÁRIO</Text>
            </TouchableOpacity>

            {menuVisivel && (
              <View style={styles.Modallista}>
                <TextInput
                  style={styles.Modalinput}
                  placeholder="ID"
                  placeholderTextColor="#aaa"
                  value={userId}
                  onChangeText={setUserId}
                />
                <TextInput
                  style={styles.Modalinput}
                  placeholder="Senha"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.modalCloseButton} onPress={salvarUsuarioPadrao}>
                  <MIcon name='save' color={'#fff'} size={20} />
                  <Text style={styles.modalButtonText}>GUARDAR USUÁRIO</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.modalButton} onPress={removerUsuarioPadrao}>
              <Text style={styles.modalButtonText}>DESFAZER USUÁRIO PADRÃO</Text>
            </TouchableOpacity>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>


    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#57acd8',
    justifyContent: 'center',
    /*backgroundColor: '#61c0fcff',*/
  },

  header: {
    height: 60,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  settingsIcon: {
    width: 30,
    height: 30,
  },

  innerContainer: {
    //flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  svg: {
    marginBottom: 40,
  },

  logo: {
    width: 170,
    height: 50,
    marginBottom: 10,
  },

  logoText: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 40,
    color: '#4682B4',
  },

  welcomeText: {
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 40,
    color: '#fff',
  },
  input: {
    height: 40,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
    paddingHorizontal: 10,
    marginBottom: 15,
    color:'#2d4753bf',
    fontWeight:'500',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: '#0087c5bf',
    /*
    backgroundColor: '#4682B4',
    */
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  privacyPolicy: {
    marginTop: 100,
    color: '#f1f1f1',
    textDecorationLine: 'underline',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowColor: '#005780',
    shadowRadius: 5,
    elevation: 10, // Para Android
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Modallista: {
    width: '100%',
  },
  Modalinput: {
    marginTop: 10,
    height: 40,
    backgroundColor: '#e2ecec',
    borderRadius: 2,
    paddingHorizontal: 10,
  },
  modalButton: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#a9cce3',
    marginVertical: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#5499c7',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalCloseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
