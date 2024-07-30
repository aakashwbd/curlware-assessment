import { configureStore } from "@reduxjs/toolkit";
import { compose } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import rootReducers from "./reducers";
import { apiMiddleWares } from "./api";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleWare = [...apiMiddleWares];
middleWare.push(thunk);

const loggerMiddleware = createLogger({
    predicate: () => import.meta.env.VITE_NODE_ENV === "development",
});
middleWare.push(loggerMiddleware);

const store = configureStore({
    reducer: rootReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleWare),
});

export default store;
