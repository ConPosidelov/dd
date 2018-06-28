import {
  SAVE_THEMES_STAGE_Y_TO_RES_Z,
  SET_PROGRESS_THEMES_DATA,
  SEND_AUTHORS_NAMES_TO_PROGRESS,
  SEND_FULL_AUTHORS_DATA_TO_PROGRESS,
  STOP_SCRAPING,
  START_SCRAPING_AUTHORS,
  FILTER_AUTHORS_DATA,
  START_NEXT_SCRAPING_AUTHORS,
  NEW_AUTHORS_TO_SERVER_SAVING,
  ONE_AUTHOR_TO_SERVER_SAVING,
  NEW_AUTOR_TO_SERVER_SAVED,
  ALL_AUTHORS_FROM_SERVER_FETCHING,
  ALL_AUTHORS_FROM_SERVER_FETCHED,
  ALL_AUTHORS_FROM_SERVER_FAILED
} from "../actions/types";

const initialAuthor = {
  readyProgressBody: true,
  typeOfScraping: "",
  currentPage: "",
  currentUrl: "",
  stopScraping: false,
  numberOfSavedAuthorsOnServer: 0,

  authorsAllRes: {
    byId: {
      test_author: {
        name: "test_author",
        url: "https://themeforest.net/category/wo3"
      }
    }
  },
  authorsRes: {
    status: "",
    byId: {}
  },
  authorsAllRes: {
    byId: {}
  },
  authorsAllFromServer: {
    status: "",
    byId: {}
  }
};

export const progress = (state = initialAuthor, action) => {
  switch (action.type) {
    case SEND_AUTHORS_NAMES_TO_PROGRESS: {
      const { currentPage, currentUrl } = action.payload;
      const byId = { ...state.authorsRes.byId, ...action.payload.byId };
      const authorsRes = { ...state.authorsRes, byId };
      return { ...state, currentPage, currentUrl, authorsRes };
    }

    case FILTER_AUTHORS_DATA: {
      const authorsRes = { ...state.authorsRes, ...action.payload };
      return { ...state, authorsRes };
    }

    case STOP_SCRAPING:
    case START_SCRAPING_AUTHORS:
      return { ...state, ...action.payload };

    case SEND_FULL_AUTHORS_DATA_TO_PROGRESS: {
      const { currentUrl } = action.payload;
      const byId = { ...state.authorsAllRes.byId, ...action.payload.byId };
      const authorsAllRes = { ...state.authorsAllRes, byId };
      return { ...state, currentUrl, authorsAllRes };
    }

    case NEW_AUTHORS_TO_SERVER_SAVING: {
      return { ...state, numberOfSavedAuthorsOnServer: 0 };
    }

    case NEW_AUTOR_TO_SERVER_SAVED: {
      const oldNum = state.numberOfSavedAuthorsOnServer;
      return { ...state, numberOfSavedAuthorsOnServer: oldNum + 1 };
    }

    case ALL_AUTHORS_FROM_SERVER_FETCHING: {
      const authorsAllFromServer = {
        ...state.authorsAllFromServer,
        status: "fetching"
      };
      return { ...state, authorsAllFromServer };
    }
    case ALL_AUTHORS_FROM_SERVER_FETCHED: {
      const authorsAllFromServer = {
        ...state.authorsAllFromServer,
        ...action.payload
      };
      return { ...state, authorsAllFromServer };
    }

    default:
      return state;
  }
};

// =Themes progress ===========================================

const initialThemes = {
  readyProgressBody: true,
  stopScraping: false,
  typeOfScraping: "",
  currentStatus: "end",
  currentPage: "",
  currentUrl: "",
  numberThemsStageOne: "",
  numberThemsStageTwo: "",
  numberThemsStageThreeLoad: "",
  numberThemsStageThreeSaved: "",

  stageOneResult: [],
  stageOneResById: {}
};

export const progressThemes = (state = initialThemes, action) => {
  switch (action.type) {
    case SAVE_THEMES_STAGE_Y_TO_RES_Z: {
      return { ...state, ...action.payload };
    }
    case SET_PROGRESS_THEMES_DATA: {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
};
