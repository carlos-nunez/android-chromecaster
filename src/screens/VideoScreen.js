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
import {Avatar, ListItem} from 'react-native-elements';
import VideoPlayer from 'react-native-video-controls';
import {Context as VideoContext} from '../context/VideoContext';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import GoogleCast, {CastButton} from 'react-native-google-cast';
import Orientation from 'react-native-orientation-locker';
const window = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Feather';

const VideoScreen = ({navigation}) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [session, setSession] = useState(false);

  const {state, fetchVideo} = useContext(VideoContext);
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
When the component mounts, lock it in portrait mode (and therefore control the initial orientation).
- Orientation Event Listener to detect changes and sync them accordingly
- GoogleCast Event Listeners to detect status and sync accordingly.
**/
  useEffect(() => {
    Orientation.lockToPortrait();
    Orientation.addOrientationListener(handleOrientationChange);
    GoogleCast.EventEmitter.addListener(
      GoogleCast.SESSION_STARTED,
      sessionStart,
    );
    GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_ENDING, sessionEnd);
    return () => {
      GoogleCast.EventEmitter.removeListener(
        GoogleCast.SESSION_STARTED,
        sessionStart,
      );
      GoogleCast.EventEmitter.removeListener(
        GoogleCast.SESSION_ENDING,
        sessionEnd,
      );
      Orientation.removeOrientationListener(handleOrientationChange);
    };
  }, []);

  /**
Helper Functions
**/
  const toPortrait = () => Orientation.lockToPortrait();
  const toLandscape = () => Orientation.lockToLandscape();

  const sessionEnd = () => {
    setSession(true);
  };

  const sessionStart = () => {
    setSession(true);
  };

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

  /**
 Casts the media after the session is established
  **/

  const cast = () => {
    GoogleCast.castMedia({
      mediaUrl: video.videoUrl,
      imageUrl: video.thumbnailUrl,
      title: video.video.title,
      subtitle: 'Now Streaming',
      studio: 'Carlos Nunez',
      streamDuration: 596, // seconds
      contentType: 'video/mp4', // Optional, default is "video/mp4"
      playPosition: 0, // seconds
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView style={styles.scrollView}>
          {video == null ? null : (
            <>
              <VideoPlayer
                toggleResizeModeOnFullscreen={false}
                style={fullscreen ? styles.fullscreenVideo : styles.video}
                source={{uri: video.videoUrl}}
                onExitFullscreen={toPortrait}
                onEnterFullscreen={toLandscape}
                onBack={onBackButtonPressed}
              />

              <ListItem
                title={video.video.title}
                subtitle={video.video.owner.name}
                leftAvatar={
                  <Avatar
                    rounded
                    source={{
                      uri: video.video.owner.img,
                    }}
                  />
                }
              />
              <View
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  paddingBottom: 10,
                  paddingRight: 10,
                }}>
                <TouchableOpacity
                  style={{paddingRight: 10}}
                  onPress={() => {
                    GoogleCast.showCastPicker();
                  }}>
                  <Icon name="cast" size={24} color={'black'} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    GoogleCast.getCastState().then((res) => {
                      res == 'NoDevicesAvailable'
                        ? GoogleCast.showCastPicker()
                        : cast();
                    });
                  }}>
                  <Icon name="film" size={24} color={'black'} />
                </TouchableOpacity>
                <CastButton style={{width: 0, height: 0, tintColor: 'black'}} />
              </View>
            </>
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
