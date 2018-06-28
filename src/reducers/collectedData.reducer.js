import {
  SELECT_DATA_SOURCE,
  SAVE_COLLECTED_THEMES_BY_KEY,
  DELETE_COLLECTED_THEMES_BY_KEY
} from "../actions/types";

const initial = {
  readyCollectedData: true,
  dataSource: "select data source",

  current: {
    data: [],
    columns: []
  }
};

export const collectedData = (state = initial, action) => {
  switch (action.type) {
    case SELECT_DATA_SOURCE:
      return { ...state, ...action.payload };

    case SAVE_COLLECTED_THEMES_BY_KEY: {
      const sourseMenu = { ...state.sourseMenu, ...action.payload.sourseMenu };
      return { ...state, ...action.payload.sourseList, sourseMenu };
    }

    case DELETE_COLLECTED_THEMES_BY_KEY: {
      const sourseMenu = { ...state.sourseMenu };
      delete sourseMenu[action.payload.sourseMenu];
      const newState = { ...state, sourseMenu };
      delete newState[action.payload.sourseList];
      return newState;
    }

    default:
      return state;
  }
};
