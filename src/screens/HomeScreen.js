import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';

import {Context as VideoContext} from '../context/VideoContext';
import {Colors} from 'react-native/Libraries/NewAppScreen';

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

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <TouchableOpacity onPress={() => navigation.navigate('Video')}>
        <Image
          style={{height: 200, width: Dimensions.get('window').width}}
          source={{
            uri: vid.thumbnailUrl,
          }}
        />
        <Text>{vid.video != null ? vid.video.title : null}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
});

export default HomeScreen;
