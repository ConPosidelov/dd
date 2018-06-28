import {
  PROFILES_FORCE_UPDATE,
  SAVE_THEMES_STAGE_Y_TO_RES_Z,
  SAVE_THEMES_STAGE_ONE_TO_PROGRESS,
  STOP_SCRAPING,
  SAVE_COLLECTED_THEMES_BY_KEY,
  DELETE_COLLECTED_THEMES_BY_KEY,
  SET_PROGRESS_THEMES_DATA,
  NEW_PROFILE_MANAGE
} from "./types";

import moment from "moment";
import { store } from "../index";
import { endPointFree, nodeApi, nodeApiAuthorsGetAll } from "../utils/apis";

import {
  purePager,
  srpAllDataFromThemeList,
  srpAllFromThemePage,
  sortOutAddressList,
  createNewItemOnServer,
  reduceByUpdateFild,
  addRankByFild,
  filterByRankBySales,
  getUrlArr,
  addRankFild,
  getThemeIdsForProfile,
  addThemeIdsListForProfile
} from "../utils/themeHelpers";

import {
  transformArrToDataTable,
  transformArrToById,
  inputfilterCollFromServer
} from "../utils/commonHelpers";

export const saveCollectedThemesByKey = (id, name, themesList, dispatch) => {
  const newProfileKey = `profile_${id}`;
  const results = themesList.map(item => item._id);
  dispatch({
    type: SAVE_COLLECTED_THEMES_BY_KEY,
    payload: {
      sourseList: {
        [newProfileKey]: themesList
      },
      sourseMenu: {
        [id]: name
      },
      queryProfileById: {
        id,
        payload: {
          loadData: true,
          results
        }
      }
    }
  });

  dispatch({
    type: SET_PROGRESS_THEMES_DATA,
    payload: {
      currentStatus: "end"
    }
  });

  dispatch({
    type: NEW_PROFILE_MANAGE,
    payload: {
      runningProfileId: 0
    }
  });
};

export const startScrapingThemes = (data, dispatch) => {
  dispatch({
    type: SET_PROGRESS_THEMES_DATA,
    payload: {
      currentStatus: "stageOne"
    }
  });

  const { name, pageStart, pageOffset, url, _id, minRank, minSales } = data;

  let resStageOne = [];
  let resStageTwo = [];
  let counter = {
    loadThemes: 0,
    savedThemes: 0
  };

  const configOne = {
    url,
    startPage: pageStart,
    endPage: pageStart + pageOffset - 1,
    timeOut: 1000,
    minRank,
    minSales
  };

  const configThree = {
    timeOut: 1000,
    addData: {
      qProfiles_id: _id,
      profileName: name
    },
    byIdKey: "title",
    minRank,
    minSales,
    addressList: []
  };

  const manageConfigThree = {
    stop: false,
    entity: "themes",

    sendData: function(res, dispatch) {
      const { data, dataConfig, manageConfig } = res;
      let workCol = [];
      workCol.push(data);
      counter.loadThemes++;

      dispatch({
        type: SET_PROGRESS_THEMES_DATA,
        payload: {
          numberThemsStageThreeLoad: counter.loadThemes,
          currentPage: counter.loadThemes,
          currentUrl: data.url
        }
      });
      workCol = addRankFild(workCol);

      const { minRank, minSales } = dataConfig;
      workCol = filterByRankBySales(workCol, minRank, minSales);

      if (workCol.length) {
        //console.log(' сохраняем workCol', workCol);

        counter.savedThemes++;
        dispatch({
          type: SET_PROGRESS_THEMES_DATA,
          payload: {
            numberThemsStageThreeSaved: counter.savedThemes
          }
        });

        createNewItemOnServer(workCol, nodeApi, manageConfig, dispatch);
      }
    },

    createEndAction(config, dispatch) {
      dispatch({
        type: SET_PROGRESS_THEMES_DATA,
        payload: {
          currentStatus: "stageFour"
        }
      });

      const {
        addData: { qProfiles_id, profileName }
      } = config;
      getThemeIdsForProfile(qProfiles_id, nodeApi).then(
        res => {
          const themesList = res.data.theme;
          const idList = themesList.map(item => item._id);
          addThemeIdsListForProfile(qProfiles_id, nodeApi, idList);

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
    }
  };

  const manageConfOne = {
    stop: false,

    sendResData(source) {
      const { data, end, currentPage, currentUrl, config } = source;
      const { minRank, minSales } = config;
      resStageOne = [...resStageOne, ...data];

      dispatch({
        type: SET_PROGRESS_THEMES_DATA,
        payload: {
          currentPage,
          currentUrl,
          numberThemsStageOne: resStageOne.length
        }
      });

      if (end) {
        dispatch({
          type: SET_PROGRESS_THEMES_DATA,
          payload: {
            currentStatus: "stageTwo"
          }
        });

        resStageTwo = reduceByUpdateFild(resStageOne);
        resStageTwo = addRankByFild(resStageTwo, "updatedTheme");
        resStageTwo = filterByRankBySales(resStageTwo, minRank, minSales);
        const stageThreeSourse = getUrlArr(resStageTwo);

        dispatch({
          type: SET_PROGRESS_THEMES_DATA,
          payload: {
            currentStatus: "stageThree",
            numberThemsStageTwo: stageThreeSourse.length
          }
        });
        configThree.addressList = stageThreeSourse;
        sortOutAddressList(
          configThree,
          srpAllFromThemePage,
          endPointFree,
          manageConfigThree,
          dispatch
        );
      }
    }
  };

  purePager(configOne, srpAllDataFromThemeList, endPointFree, manageConfOne);
};





























