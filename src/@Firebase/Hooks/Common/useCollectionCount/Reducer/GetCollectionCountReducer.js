export const INITIAL_STATE = {
  loading: true,
  error: false,
  count: undefined,
};
export const GetCollectionCountReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        loading: true,
        error: false,
        count: undefined,
      };
    case "FETCH_SUCCESS":
      return {
        loading: false,
        error: false,
        count: action.payload,
      };
    case "FETCH_ERROR":
      return {
        loading: false,
        error: action.payload,
        count: undefined,
      };
  }
};
