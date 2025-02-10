import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Card = ({ title, content, imageSource }) => {
  return (
    <View style={styles.card}>
      {imageSource && <Image source={imageSource} style={styles.image} />}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Para Android
  },
  
  image: {
    width: '100%',
    height: 150, // Ajuste conforme necessário
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor:'blue',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    color: '#333',
  },
});

export default Card;
