import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedContainer } from './src';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <AnimatedContainer active>
        <Text>Animated</Text>
      </AnimatedContainer>
      <AnimatedContainer active forwardDelay={500} outputRange={[0, 1]}>
        <Text>Animated 2</Text>
      </AnimatedContainer>
      <AnimatedContainer active forwardDelay={1000} outputRange={[0, 1]}>
        <Text>Animated 3</Text>
      </AnimatedContainer>
      <AnimatedContainer
        active
        forwardDelay={1500}
        inputRange={[0, 0.5, 0.75, 1]}
        outputRange={['0deg', '90deg', '275deg', '0deg']}
        transformKey="rotate"
      >
        <Text>Animated 465 </Text>
      </AnimatedContainer>

      <AnimatedContainer
        active
        forwardDelay={1500}
        inputRange={[0, 0.5, 0.75, 1]}
        outputRange={['coral', 'blue', 'red', 'white']}
        transformKey="backgroundColor"
        style={{ padding: 32, borderWidth: 2, borderColor: 'black' }}
        useNativeDriver={false}
        forwardAnimationDuration={5000}
      >
        <Text>Animated 4 </Text>
      </AnimatedContainer>
      <Text>Open up App.tsx to start working</Text>
    </View>
  );
}
