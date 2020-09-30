import createDataContext from './createDataContext';

/**
Actions to modify the state.
- fetch_videos: dispatches when a video is successfully fetched. Stores the video in state,
  sets isLoaded to true, and clears any previous error.
- set_error: dispatches when a video is not successfully fetched.
  The payload contains the error message to the user.
**/
const videoReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_video':
      return {
        video: action.payload,
        isLoaded: true,
        error: '',
      };
    case 'set_error':
      return {
        error: action.payload,
        isLoaded: true,
      };
    default:
      return state;
  }
};

/**
Fetches a video from vimeo and stores its details in global state.
**/
const fetchVideo = (dispatch) => {
  return async () => {
    fetch(`https://player.vimeo.com/video/392590844/config`)
      .then((res) => res.json())
      .then((res) => {
        var vid = {
          thumbnailUrl: res.video.thumbs['640'],
          videoUrl:
            res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
          video: res.video,
        };
        dispatch({
          type: 'fetch_video',
          payload: vid,
        });
      })
      .catch((e) => {
        console.log('Error');
        dispatch({
          type: 'set_error',
          payload:
            'Error loading video, please check your internet connection.',
        });
      });
  };
};

/**
Export the Provider and Context that is created by our Helper function createDataContext(reducer, actions, defaultValue)
**/
export const {Provider, Context} = createDataContext(
  videoReducer,
  {fetchVideo},
  {video: null, isLoaded: false},
);
