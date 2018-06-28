import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import fetchSmart from "redux-middleware-axios-lite";
import createHistory from "history/createBrowserHistory";
import { ConnectedRouter, routerMiddleware } from "react-router-redux";
import Routes from "./containers/Routes";
import rootReducer from "./reducers";
import axios from "axios";
import "./styles/main.scss";

const history = createHistory();
const historyMiddleware = routerMiddleware(history);

const authorApi = axios.create({
  baseURL: "http://localhost:3030/api/themeforest/author",
  headers: { "Content-Type": "application/json;charset=UTF-8" }
});
const themesApi = axios.create({
  baseURL: "http://localhost:3030/api/themeforest/themes",
  headers: { "Content-Type": "application/json;charset=UTF-8" }
});
const queryProfileApi = axios.create({
  baseURL: "http://localhost:3030/api/themeforest/queryProfile",
  headers: { "Content-Type": "application/json;charset=UTF-8" }
});

const endPoints = {
  authorApi,
  themesApi,
  queryProfileApi
};

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(historyMiddleware, fetchSmart(endPoints)))
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
