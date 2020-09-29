/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Navigator,
  Dimensions,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Orientation from 'react-native-orientation-locker';

const App: () => React$Node = () => {
  const [vid, setVid] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const window = Dimensions.get('window');

  var useOrientationChange = (o) => {
    o == 'PORTRAIT'
      ? (setFullscreen(false), StatusBar.setHidden(false))
      : (setFullscreen(true), StatusBar.setHidden(true));

    // Handle orientation change
    console.log('Handi');
    console.log(o);
  };

  useEffect(() => {
    var initial = Orientation.getInitialOrientation();
    Orientation.lockToPortrait();
    fetch(`https://player.vimeo.com/video/392590844/config`)
      .then((res) => res.json())
      .then((res) =>
        setVid({
          thumbnailUrl: res.video.thumbs['640'],
          videoUrl:
            res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
          video: res.video,
        }),
      );

    Orientation.addOrientationListener(useOrientationChange);
    return () => {
      Orientation.removeOrientationListener(useOrientationChange);
    };
  }, []);

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
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

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

export default App;
