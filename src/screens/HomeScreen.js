import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';

import {Context as VideoContext} from '../context/VideoContext';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const window = Dimensions.get('window');

function HomeScreen({navigation}) {
  const {state, fetchVideos} = useContext(VideoContext);
  const {video} = state;

  /**
Fetches the Video configuration file containing information such as the
thumbnailUrl, direct mp4 url, and video details.
  **/
  useEffect(() => {
    fetchVideos();
  }, []);

  video ? console.log(video.video) : null;

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      {video ? (
        <>
          <StatusBar barStyle="dark-content" />
          <TouchableOpacity onPress={() => navigation.navigate('Video')}>
            <Image
              style={{height: 225, width: window.width}}
              source={{
                uri: video.thumbnailUrl,
              }}
            />
            <ListItem
              title={video.video.title}
              subtitle={video.video.owner.name}
              chevron
              leftAvatar={
                <Avatar
                  rounded
                  source={{
                    uri: video.video.owner.img,
                  }}
                />
              }
            />
          </TouchableOpacity>
        </>
      ) : (
        <ActivityIndicator size="small" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
});

export default HomeScreen;
