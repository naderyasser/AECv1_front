export const INITIAL_STATE = {
  loading: true,
  data: undefined,
  error: false,
  render: false,
};
export const GetUserDataReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        loading: true,
        data: undefined,
        error: false,
      };

    case "FETCH_SUCCESS":
      return {
        loading: false,
        data: action.payload,
        error: false,
      };
    case "FETCH_ERROR":
      return {
        loading: false,
        data: undefined,
        error: true,
      };
    case "FETCH_RENDER":
      return {
        ...state,
        render: !state.render,
      };
  }
};
