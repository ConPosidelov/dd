import {
  PROFILES_FORCE_UPDATE,
  NEW_PROFILE_MANAGE,
  NEW_PROFILE_FETCHING,
  NEW_PROFILE_FETCHED,
  NEW_PROFILE_FETCH_FAILED,
  GET_ALL_PROFILES_FETCHING,
  GET_ALL_PROFILES_FETCHED,
  GET_ALL_PROFILES_FAILED,
  REMOVE_PROFILE_FETCHING,
  REMOVE_PROFILE_FETCHED,
  REMOVE_PROFILE_FAILED,
  SAVE_COLLECTED_THEMES_BY_KEY,
  SET_ERROR_OF_PROFILE_FORM,
  DELETE_COLLECTED_THEMES_BY_KEY
} from "../actions/types";

const initial = {
  runningProfileId: "none",
  byId: {},
  allIds: [],
  newProfileStatus: "fetched",
  errorOfForm: true,
  getAllProfilesStatus: "",
  removeProfileStatus: "",
  forceUpdate: false,
  types: {
    "Choose Type": {
      url: ""
    },
    themes: {
      url: ""
    },
    autors: {
      url: ""
    }
  }
};

const transformServerData = data => {
  const res = {};
  res.byId = {};
  res.allIds = [];
  data.forEach((item, i) => {
    res.byId[item._id] = { ...item, loadData: false };
    res.allIds.push(item._id);
  });
  return res;
};

export const queryProfiles = (state = initial, action) => {
  switch (action.type) {
    case PROFILES_FORCE_UPDATE: {
      const forceUpdate = !state.forceUpdate;
      return { ...state, forceUpdate };
    }

    case GET_ALL_PROFILES_FETCHING:
    case GET_ALL_PROFILES_FAILED:
      return { ...state, ...action.payload };

    case GET_ALL_PROFILES_FETCHED:
      const data = transformServerData(action.payload.data);
      data.getAllProfilesStatus = action.payload.getAllProfilesStatus;
      return { ...state, ...data };

    case REMOVE_PROFILE_FETCHING:
    case REMOVE_PROFILE_FETCHED:
    case REMOVE_PROFILE_FAILED:
      return { ...state, ...action.payload };

    case NEW_PROFILE_MANAGE:
    case NEW_PROFILE_FETCHING:
    case NEW_PROFILE_FETCHED:
    case NEW_PROFILE_FETCH_FAILED:
      return { ...state, ...action.payload };

    case SET_ERROR_OF_PROFILE_FORM:
      return { ...state, ...action.payload };

    case SAVE_COLLECTED_THEMES_BY_KEY: {
      const {
        queryProfileById: { id, payload }
      } = action.payload;
      const byId = { ...state.byId };
      byId[id] = { ...byId[id], ...payload };

      return { ...state, byId };
    }

    case SAVE_COLLECTED_THEMES_BY_KEY: {
      const {
        queryProfileById: { id, payload }
      } = action.payload;
      const byId = { ...state.byId };
      byId[id] = { ...byId[id], ...payload };
      return { ...state, byId };
    }
    case DELETE_COLLECTED_THEMES_BY_KEY: {
      const {
        queryProfileById: { id, payload }
      } = action.payload;
      const byId = { ...state.byId };
      byId[id] = { ...byId[id], ...payload };
      return { ...state, byId };
    }

    default:
      return state;
  }
};
