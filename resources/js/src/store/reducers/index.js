import { combineReducers } from "redux";
import { apiReducers } from "../api/index";
import authReducer from "./authReducer";
import siteReducer from "./siteReducer";

const rootReducers = combineReducers({
    ...apiReducers,
    auth: authReducer,
    site: siteReducer,
});

export default rootReducers;
