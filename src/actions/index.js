import * as actionQueryProfiles from './action.queryProfiles'; 
import * as authorProgress from './author.progress.action';
import * as themeProgress from './theme.progress.action'; 
import * as collectedData from './collectedData.action'; 
import * as home from './home.action';

export default {
  ...actionQueryProfiles,
  ...authorProgress,
  ...themeProgress,
  ...collectedData,
  ...home
};