import { combineReducers } from 'redux';
import databaseReducer from "./database";
import trackReducer from "./track";
import sessionReducer from "./session";
import databaseAdminReducer from "./database-admin";

export default combineReducers({
    databaseReducer,
    trackReducer,
    sessionReducer,
    databaseAdminReducer
})