import 'react-native-gesture-handler';
import React, {useContext} from 'react';
import {SafeAreaView, StyleSheet, View, Text, Dimensions} from 'react-native';
import {Provider as VideoProvider} from './src/context/VideoContext';
import {Context as VideoContext} from './src/context/VideoContext';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AnimatedSplash from 'react-native-animated-splash-screen';
import HomeScreen from './src/screens/HomeScreen';
import VideoScreen from './src/screens/VideoScreen';

const Stack = createStackNavigator();

/**
App Constructor with React Stack Navigator
 - const isLoaded keeps track of weather the video details have been fetched
 - AnimatedSplash requires the isLoaded prop and performs a zoom animation to reveal children when isLoaded = true
**/
function App() {
  const {state} = useContext(VideoContext);
  const {isLoaded} = state;

  return (
    <AnimatedSplash
      translucent={true}
      isLoaded={isLoaded}
      logoImage={require('./splash.png')}
      backgroundColor={'#FFFFFF'}
      logoHeight={window.height}
      logoWidth={window.width}>
      <NavigationContainer>
        <Stack.Navigator mode="card">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Video"
            component={VideoScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AnimatedSplash>
  );
}

export default () => {
  return (
    <VideoProvider>
      <App />
    </VideoProvider>
  );
};
