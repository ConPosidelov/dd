import {CHANGE_PROGRESS_MODE} from './types';

export const changeProgressMode = (mode) => {
  return {
    type: CHANGE_PROGRESS_MODE,
    payload: {
      progressMode: mode
    }
  }
};