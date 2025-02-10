// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from './LoginScreen';
import HomeS from './HomeS'; 
import VisualizarDados from './VisualizarDados'; 
import VisualizarHistorico from './VisualizarHistorico'; 
import VisualizarCidadao from './VisualizarCidadao';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
