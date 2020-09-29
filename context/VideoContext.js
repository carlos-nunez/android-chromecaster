import createDataContext from './createDataContext';

const videoReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_videos':
      return {
        video: action.payload,
      };
    default:
      return state;
  }
};

const fetchVideos = (dispatch) => {
  return async () => {
    fetch(`https://player.vimeo.com/video/392590844/config`)
      .then((res) => res.json())
      .then((res) =>
        dispatch({
          type: 'fetch_videos',
          payload: res,
        }),
      );
  };
};

export const {Provider, Context} = createDataContext(
  videoReducer,
  {fetchVideos},
  {video: null},
);
