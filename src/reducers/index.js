import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { collectedData } from './collectedData.reducer';
import { queryProfiles } from './queryProfiles.reducer';
import { progress, progressThemes } from './progress.reducer';
import { home } from './home.reducer';

const rootReducer = combineReducers({
    routerReducer,
    queryProfiles,
    progress,
    progressThemes,
    collectedData,
    home
});

export default rootReducer;