import createDataContext from './createDataContext';

const videoReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_videos':
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

const fetchVideos = (dispatch) => {
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
          type: 'fetch_videos',
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

export const {Provider, Context} = createDataContext(
  videoReducer,
  {fetchVideos},
  {video: null, isLoaded: false},
);
