import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";

import ProjectsReducer from "./Projects/ProjectsReducer";
import CandidatesReducer from './Candidates/CandidatesReducer';
import FiltersReducer from './Filters/FiltersReducer';
import UserReducer from './User/userReducer';

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user","candidates"], //what info to store
  };
  

const rootReducer = combineReducers({
    projects: ProjectsReducer, 
    filters: FiltersReducer,
    user: UserReducer,
    candidates: CandidatesReducer
  
  });

  export default persistReducer(persistConfig, rootReducer);