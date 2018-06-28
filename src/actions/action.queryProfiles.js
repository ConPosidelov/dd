import {
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
  SET_ERROR_OF_PROFILE_FORM,
  SEND_SCRAP_DATA_TO_PROGRESS,
  STOP_SCRAPING,
  START_SCRAPING_AUTHORS,
  START_NEXT_SCRAPING_AUTHORS,
  SAVE_NEW_AUTHORS_TO_SERVER,
  SAVE_ONE_AUTHOR_TO_SERVER
} from "./types";

import { store } from "../index";
import { endPointFree, nodeApi, nodeApiAuthorsGetAll } from "../utils/apis";

import {
  transformArrToDataTable,
  transformArrToById,
  inputfilterCollFromServer
} from "../utils/commonHelpers";

import { getThemeIdsForProfile } from "../utils/themeHelpers";

import { startScrapingAutors } from "./author.progress.action";
import {
  startScrapingThemes,
  saveCollectedThemesByKey,
  deleteCollectedThemesByKey
} from "./theme.progress.action";

export const getAllQueryProfiles = () => {
  return {
    axios: {
      base: "queryProfileApi",
      requestAction: {
        type: GET_ALL_PROFILES_FETCHING,
        payload: { getAllProfilesStatus: "fetching" }
      },
      successAction: {
        type: GET_ALL_PROFILES_FETCHED,
        payload: { getAllProfilesStatus: "fetched" }
      },
      failureAction: {
        type: GET_ALL_PROFILES_FAILED,
        payload: { getAllProfilesStatus: "fetchFailed" }
      }
    }
  };
};

export const manageNewQueryProfile = newProfileStatus => {
  return {
    type: NEW_PROFILE_MANAGE,
    payload: {
      newProfileStatus
    }
  };
};

export const setErrorOfProfileForm = errorOfForm => {
  return {
    type: SET_ERROR_OF_PROFILE_FORM,
    payload: {
      errorOfForm
    }
  };
};

// save QueryProfile to server
export const saveNewQueryProfile = (data, forceUpdate) => {
  return {
    axios: {
      base: "queryProfileApi",
      method: "post",
      config: {
        data
      },
      requestAction: {
        type: NEW_PROFILE_FETCHING,
        payload: { newProfileStatus: "fetching" }
      },
      successAction: {
        type: NEW_PROFILE_FETCHED,
        payload: {
          newProfileStatus: "fetched",
          forceUpdate: !forceUpdate
        }
      },
      failureAction: {
        type: NEW_PROFILE_FETCH_FAILED,
        payload: { newProfileStatus: "fetchFailed" }
      }
    }
  };
};

// remove QueryProfile from server
export const removeQueresProfile = (id, forceUpdate, results, dispatch) => {
  results.forEach(id => {
    nodeApi.delete(`themes/${id}`).then(
      res => {
        console.log('delete===========', res);
      },
      err => {
        console.log("delete-err===========", err);
      }
    );
  });

  dispatch({
    axios: {
      base: "queryProfileApi",
      method: "delete",
      url: `/${id}`,
      requestAction: {
        type: REMOVE_PROFILE_FETCHING,
        payload: { removeProfileStatus: "fetching" }
      },
      successAction: {
        type: REMOVE_PROFILE_FETCHED,
        payload: {
          removeProfileStatus: "fetched",
          forceUpdate: !forceUpdate
        }
      },
      failureAction: {
        type: REMOVE_PROFILE_FAILED,
        payload: { removeProfileStatus: "fetchFailed" }
      }
    }
  });
};

export const getCollectedData = (qProfiles_id, profileName, type, dispatch) => {
  getThemeIdsForProfile(qProfiles_id, nodeApi).then(
    res => {
      const themesList = res.data.theme;
      const filtredList = inputfilterCollFromServer(themesList, "themes");
      saveCollectedThemesByKey(
        qProfiles_id,
        profileName,
        filtredList,
        dispatch
      );
    },
    err => {
      console.log("err==getThemeIdsForProfile=========", err);
    }
  );
};

export const startScraping = (data, dispatch) => {
  const { _id, type } = data;

  dispatch({
    type: NEW_PROFILE_MANAGE,
    payload: {
      runningProfileId: _id
    }
  });

  if (type === "author_custom_1") {
    startScrapingAutors(data, dispatch);
  } else if (type === "themes") {
    startScrapingThemes(data, dispatch);
  }
};
