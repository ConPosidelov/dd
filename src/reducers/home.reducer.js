import { 
  CHANGE_PROGRESS_MODE
} from '../actions/types';

const initial = {
  progressMode: 'themes'
};

export const home = (state = initial, action) => {
  switch (action.type) {
    case CHANGE_PROGRESS_MODE:
      return { ...state, ...action.payload }
        
    default:
      return state
  } 
};