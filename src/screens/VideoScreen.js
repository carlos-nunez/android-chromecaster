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

const VideoScreen: () => React$Node = ({navigation}) => {
  const [fullscreen, setFullscreen] = useState(false);

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

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
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

export default VideoScreen;
