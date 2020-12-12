import React from "react";
import ReactDOM from "react-dom";
import "regenerator-runtime/runtime";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { client } from "./features/Data/DataFetchingClient";
import { Provider } from "urql";
import { AuthProvider } from "./features/Auth/AuthContext";

const AppContext = () => {
  return (
    <Provider value={client}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
};

ReactDOM.render(<AppContext />, document.getElementById("root"));
