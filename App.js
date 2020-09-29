/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';
import GoogleCast, {CastButton} from 'react-native-google-cast';
import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Navigator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Provider as VideoProvider} from './context/VideoContext';
import VideoPlayer from 'react-native-video-controls';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Orientation from 'react-native-orientation-locker';
import {Context as VideoContext} from './context/VideoContext';
import {createStackNavigator} from '@react-navigation/stack';

const App2: () => React$Node = ({navigation}) => {
  const [fullscreen, setFullscreen] = useState(false);
  const window = Dimensions.get('window');
  const {state, fetchVideos} = useContext(VideoContext);
  const {video} = state;

  var useOrientationChange = (o) => {
    o == 'PORTRAIT'
      ? (setFullscreen(false), StatusBar.setHidden(false))
      : (setFullscreen(true), StatusBar.setHidden(true));

    // Handle orientation change
  };

  useEffect(() => {
    var initial = Orientation.getInitialOrientation();
    Orientation.lockToPortrait();

    Orientation.addOrientationListener(useOrientationChange);
    return () => {
      Orientation.removeOrientationListener(useOrientationChange);
    };
  }, []);

  var vid = {
    thumbnailUrl: video.video.thumbs['640'],
    videoUrl:
      video.request.files.hls.cdns[video.request.files.hls.default_cdn].url,
    video: video.video,
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView style={styles.scrollView}>
          {vid == null ? null : (
            <VideoPlayer
              toggleResizeModeOnFullscreen={false}
              style={fullscreen ? styles.fullscreenVideo : styles.video}
              source={{uri: vid.videoUrl}}
              onExitFullscreen={() => {
                {
                  Orientation.lockToPortrait();
                }
              }}
              onEnterFullscreen={() => {
                Orientation.lockToLandscape();
              }}
              onLoad={() => {
                console.log('Load');
              }}
              onBack={() => {
                Orientation.getOrientation((o) => {
                  o !== 'PORTRAIT'
                    ? Orientation.lockToPortrait()
                    : navigation.goBack();
                });
              }}
            />
          )}
          <CastButton style={{width: 24, height: 24, tintColor: 'black'}} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

function HomeScreen({navigation}) {
  const {state, fetchVideos} = useContext(VideoContext);
  const {video} = state;
  useEffect(() => {
    fetchVideos();
  }, []);

  var vid = video
    ? {
        thumbnailUrl: video.video.thumbs['640'],
        videoUrl:
          video.request.files.hls.cdns[video.request.files.hls.default_cdn].url,
        video: video.video,
      }
    : {};
  console.log(vid.thumbnailUrl);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity onPress={() => navigation.navigate('Video')}>
        <Text>Home Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator mode="card">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Video"
          component={App2}
          options={{headerBackTitle: 'Cancel', headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  video: {
    height: Dimensions.get('window').width * (9 / 16),
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height,
    backgroundColor: 'black',
  },
});

export default () => {
  return (
    <VideoProvider>
      <App />
    </VideoProvider>
  );
};
