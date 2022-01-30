import React from "react";
import ReactDOM from "react-dom";
import "./common/asset/style/index.css";
import reportWebVitals from "./reportWebVitals";
import { initializeRootStore } from "./app/service/common/store/rootBusinessStore";
import App from "./App";
import appRouter from "./app/component/route/appRouter";
import { Provider } from "react-redux";
import StoreService from "./common/service/store/StoreService";

const rootEl = document.getElementById("root");

initializeRootStore();

const renderApp = (router: any) => {
  // init redux store
  const appStore = StoreService.getStore();
  console.log("appStore", appStore);

  ReactDOM.render(
    <Provider store={appStore}>
      <App>{router}</App>
    </Provider>,
    rootEl
  );
};

renderApp(appRouter);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
