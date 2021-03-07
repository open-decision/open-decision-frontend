import React from "react";
import ReactDOM from "react-dom";
import "regenerator-runtime/runtime";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { client, AuthProvider } from "features";
import { Provider } from "urql";

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
