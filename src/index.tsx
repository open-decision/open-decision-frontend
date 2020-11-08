import React from "react";
import ReactDOM from "react-dom";
import "regenerator-runtime/runtime";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { client } from "./features/Data/DataFetchingClient";
import { Provider } from "urql";

const AppContext = () => {
  return (
    <BrowserRouter>
      <Provider value={client}>
        <App />
      </Provider>
    </BrowserRouter>
  );
};

ReactDOM.render(<AppContext />, document.getElementById("root"));
