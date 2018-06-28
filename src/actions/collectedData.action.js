import {
  ALL_AUTHORS_FROM_SERVER_FETCHED,
  SELECT_DATA_SOURCE,
  DELETE_COLLECTED_THEMES_BY_KEY
} from "./types";

import { store } from "../index";
import { endPointFree, nodeApi, nodeApiAuthorsGetAll } from "../utils/apis";
import {
  transformArrToDataTable,
  transformArrToById,
  formatDate,
  customFiltredFilds,
  customTransformArrToDataTable
} from "../utils/commonHelpers";

import { getThemeIdsForProfile } from "../utils/themeHelpers";

import { saveCollectedThemesByKey } from "./theme.progress.action";

const transformByIdToDataCol = source => {
  const res = {
    data: [],
    columns: []
  };
  Object.keys(source).forEach((item, i) => {
    if (i === 0) {
      Object.keys(source[item]).forEach(el => {
        res.columns.push({
          Header: el.toUpperCase(),
          accessor: el
        });
      });
    }
    res.data.push(source[item]);
  });
  return res;
};

export const deleteCollectedThemesByKey = (id, dispatch) => {
  const newProfileKey = `profile_${id}`;
  dispatch({
    type: DELETE_COLLECTED_THEMES_BY_KEY,
    payload: {
      sourseList: [newProfileKey],
      sourseMenu: [id],
      queryProfileById: {
        id,
        payload: {
          loadData: false
        }
      }
    }
  });
};

export const selectDataSourse = (id, title, dispatch) => {
  const state = store.getState();
  const dataKey = `profile_${id}`;
  let source = [...state.collectedData[dataKey]];

  source = source.map(item => {
    const { createdTheme, updatedTheme } = item;
    item.createdTheme = formatDate(createdTheme);
    item.updatedTheme = formatDate(updatedTheme);
    return item;
  });

  const filds = ["title", "url", "sales", "rank", "createdTheme"];

  source = customFiltredFilds(source, filds);
  const sourseLength = source.length;
  const fullTitle = `${title} (${sourseLength})`;
  const current = customTransformArrToDataTable(source);

  dispatch({
    type: SELECT_DATA_SOURCE,
    payload: {
      dataSource: fullTitle,
      current
    }
  });
};
