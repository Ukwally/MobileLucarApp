//LOGIN COM FETCH
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView,Image,Modal, Pressable, Alert} from 'react-native';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage'; // para o logout


export default function LoginScreen({ navigation }) {

  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(''); // Estado para o ID
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null); 
  
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
        await AsyncStorage.setItem('token', data.user.tech_number);    //para o logout

        setUserData(data.user);
        navigation.navigate('HomeS', { user: data.user}); 
      } else {
        Alert.alert('Erro', 'Credenciais erradas');
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    }
  };  

  return (
    <View style={styles.container}>
      {/* Cabeçalho com botão de configurações */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingsButton}  onPress={() => setModalVisible(true)}>
          <Image
            source={require('../assets/settings-icon2.png')} // Substitua com o caminho do seu ícone de configurações
            style={styles.settingsIcon}
          />
        </TouchableOpacity>
      </View>
      {/* Conteúdo principal */}
      <ScrollView contentContainerStyle={styles.innerContainer}>
        {/*<Image
          source={require('./assets/logo.png')}
          style={styles.logo}
        /> */}
        <Text style={styles.logoText}>LUCAR</Text>
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

        <TouchableOpacity style={styles.button}  onPress={handleLogin}>
          <Text style={styles.buttonText}>COMEÇAR</Text>
        </TouchableOpacity>

        <Text style={styles.privacyPolicy}>
          Políticas e Regulamentos
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
            <TouchableOpacity style={styles.modalButton} >
              <Text style={styles.modalButtonText}>DESFAZER USUÁRIO</Text>
            </TouchableOpacity>
          
            <TouchableOpacity style={styles.modalButton} >
              <Text style={styles.modalButtonText}>DEFINIR USUÁRIO PADRÃO</Text>
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
    backgroundColor: '#87CEFA',
    justifyContent: 'center',
  },

  header: {
    height: 60,
    backgroundColor: '#4682B4',
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
    fontWeight: 'bold',
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
  },
  button: {
    backgroundColor: '#4682B4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 2,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  privacyPolicy: {
    marginTop: 20,
    color: '#fff',
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#5499c7',
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: '#fff',
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
