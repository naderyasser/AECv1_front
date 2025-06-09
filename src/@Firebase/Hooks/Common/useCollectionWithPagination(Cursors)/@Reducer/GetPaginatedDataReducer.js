export const INITIAL_STATE = {
  loading: true,
  error: undefined,
  data: [],
  page: 0,
};
export const GetDataPaginatedReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        loading: true,
        error: undefined,
        data: state.data,
        page: state.page,
      };
    case "FETCH_SUCCESS":
      return {
        loading: false,
        error: undefined,
        data: action.payload,
        page: state.page,
      };
    case "FETCH_ERROR":
      return {
        loading: false,
        error: action.payload,
        data: [],
        page: state.page,
      };
    case "NEXT_PAGE":
      return {
        ...state,
        page: state.page + 1,
      };
    case "PREVIOUS_PAGE":
      return { ...state, page: state.page - 1 };
    case "PAGE_RESET":
      return {
        ...state,
        page: 0,
      };
  }
};
