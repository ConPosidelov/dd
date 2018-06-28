import {
  SEND_AUTHORS_NAMES_TO_PROGRESS,
  SEND_FULL_AUTHORS_DATA_TO_PROGRESS,
  STOP_SCRAPING,
  START_SCRAPING_AUTHORS,
  FILTER_AUTHORS_DATA,
  START_NEXT_SCRAPING_AUTHORS,
  NEW_AUTHORS_TO_SERVER_SAVING,
  ONE_AUTHOR_TO_SERVER_SAVING,
  NEW_AUTOR_TO_SERVER_SAVED
} from "./types";

import { store } from "../index";

import {
  srpAuthUrlFromThemeList,
  fullPager,
  srpAllFromAuthorPage,
  goToTheAddressList
} from "../utils/scrapingHelpers";

import { endPointFree, nodeApi, nodeApiAuthorsGetAll } from "../utils/apis";

// store-config-model for AUTHORS scrap =====================

const authorsScrapManageConfig = {
  stop: false,

  sendAuthorsNames(res, dispatch) {
    dispatch({
      type: SEND_AUTHORS_NAMES_TO_PROGRESS,
      payload: res
    });
  },

  sendFullAuthorsData(res, dispatch) {
    dispatch({
      type: SEND_FULL_AUTHORS_DATA_TO_PROGRESS,
      payload: res
    });
  }
};

export const startScrapingAutors = (data, dispatch) => {
  const { type, pageStart, pageOffset, url } = data;

  if (type === "author_custom_1") {
    const dataConfig = {
      timeOut: 1000,
      startPage: pageStart,
      endPage: pageOffset - pageStart + 1,
      url
    };

    dispatch({
      type: START_SCRAPING_AUTHORS,
      payload: { stopScraping: false, typeOfScraping: data.type }
    });

    fullPager(
      dataConfig,
      srpAuthUrlFromThemeList,
      endPointFree,
      authorsScrapManageConfig,
      dispatch
    );
  }
};

export const stopScraping = () => {
  authorsScrapManageConfig.stop = true;
  return {
    type: STOP_SCRAPING,
    payload: { stopScraping: true }
  };
};

export const filterAuthorsData = (data, dispatch) => {
  const {
    progress: {
      authorsAllFromServer: { byId: serverById }
    }
  } = store.getState();
  const byId = { ...data };

  if (Object.keys(serverById).length) {
    Object.keys(data).forEach(item => {
      if (serverById[item]) delete byId[item];
    });
  } else {
    console.log("no server data");
  }

  dispatch({
    type: FILTER_AUTHORS_DATA,
    payload: {
      status: "filtred",
      byId
    }
  });
};

export const saveAutorsDataToServer = (byId, dispatch) => {
  // get all authors
  const config = {
    createNewAuthorAction(data, i, dispatch) {
      //console.log('createNewAuthorAction(data)=======', data);
      dispatch({
        type: NEW_AUTOR_TO_SERVER_SAVED
      });
    }
  };

  const compareAuthorsLists = (byId, savedList = []) => {
    const newById = { ...byId };
    const sameArrOfData = [];

    if (savedList.length) {
      savedList.forEach(({ name, _id }) => {
        if (byId[name]) {
          delete newById[name];
          sameArrOfData.push({
            name,
            _id
          });
        }
      });
    }

    const newArrOfData = Object.keys(newById).map(item => {
      return newById[item];
    });

    return {
      sameArrOfData,
      newArrOfData
    };
  };

  const createNewAuthorsOnServer = (
    list,
    createApiInstance,
    config,
    dispatch
  ) => {
    dispatch({
      type: NEW_AUTHORS_TO_SERVER_SAVING
    });

    const { createNewAuthorAction } = config;
    const { newArrOfData } = list;

    newArrOfData.forEach((item, i) => {
      console.log("newArrOfData-item", item);
      createApiInstance.post("author", item).then(
        res => {
          createNewAuthorAction(res, i, dispatch);
        },
        error => console.log(`Rejected: ${error}`)
      );
    });
  };

  const saveNewAuthors = (
    serverData,
    byIdObj,
    createApiInstance,
    config,
    dispatch
  ) => {
    const list = compareAuthorsLists(byIdObj, serverData);
    createNewAuthorsOnServer(list, createApiInstance, config, dispatch);
  };

  nodeApiAuthorsGetAll().then(
    res => {
      console.log("res:", res);
      const { data, status } = res;
      if (status === 200) {
        saveNewAuthors(data, byId, nodeApi, config, dispatch);
      }
    },
    error => console.log(`Rejected: ${error}`)
  );
};
