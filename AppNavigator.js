// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from './pages/LoginScreen';
import HomeS from './pages/HomeS'; 
import VisualizarDados from './pages/VisualizarDados'; 
import VisualizarHistorico from './pages/VisualizarHistorico'; 
import VisualizarCidadao from './pages/VisualizarCidadao';
import Ccamera from './pages/Ccamera';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeS" component={HomeS} options={{ headerShown: false }} />
        <Stack.Screen name="VisualizarDados" component={VisualizarDados} options={{ headerShown: false }} />
        <Stack.Screen name="VisualizarHistorico" component={VisualizarHistorico} options={{ headerShown: false }} />
        <Stack.Screen name="VisualizarCidadao" component={VisualizarCidadao} options={{ headerShown: false }} />
        <Stack.Screen name="Ccamera" component={Ccamera} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
