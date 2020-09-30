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
  Image,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import {Context as VideoContext} from '../context/VideoContext';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import GoogleCast, {CastButton} from 'react-native-google-cast';
import Orientation from 'react-native-orientation-locker';
const window = Dimensions.get('window');

const VideoScreen = ({navigation}) => {
  const [fullscreen, setFullscreen] = useState(false);

  const {state, fetchVideos} = useContext(VideoContext);
  const {video} = state;

  /**
- Syncs the fullscreen state of the video with the Orientation of the screen
- Hides and StatusBar accordingly
**/
  var handleOrientationChange = (o) => {
    o == 'PORTRAIT'
      ? (setFullscreen(false), StatusBar.setHidden(false))
      : (setFullscreen(true), StatusBar.setHidden(true));
  };

  /**
When the component mounts, lock it in portrait mode (and therefore control the initial orientation),
and add an onChange event listener.
**/
  useEffect(() => {
    Orientation.lockToPortrait();
    Orientation.addOrientationListener(handleOrientationChange);
    return () => {
      Orientation.removeOrientationListener(handleOrientationChange);
    };
  }, []);

  const toPortrait = () => Orientation.lockToPortrait();
  const toLandscape = () => Orientation.lockToLandscape();

  /**
Defines the action when the back button is pressed on the video controls
- If the screen is in fullscreen, it will go go to portrait mode. If it is in portrait mode, it will
  go back to the prevous screen.
**/
  const onBackButtonPressed = () => {
    Orientation.getOrientation((o) => {
      o !== 'PORTRAIT' ? toPortrait() : navigation.goBack();
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView style={styles.scrollView}>
          {video == null ? null : (
            <VideoPlayer
              toggleResizeModeOnFullscreen={false}
              style={fullscreen ? styles.fullscreenVideo : styles.video}
              source={{uri: video.videoUrl}}
              onExitFullscreen={toPortrait}
              onEnterFullscreen={toLandscape}
              onBack={onBackButtonPressed}
            />
          )}
          <CastButton style={{width: 24, height: 24, tintColor: 'black'}} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  video: {
    height: window.width * (9 / 16),
    width: window.width,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    height: window.width,
    width: window.height,
    backgroundColor: 'black',
  },
});

export default VideoScreen;
