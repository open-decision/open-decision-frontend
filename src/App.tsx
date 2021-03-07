import React from "react";
import { Switch, Route } from "react-router-dom";
import { Layout } from "components";
import { Builder } from "features";
import "./compiled.css";

export const App: React.FC = () => {
  return (
    <Switch>
      {/* <ProtectedRoute path={["/", "/dashboard"]} exact>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>

      <Route path="/login">
        <div className="flex justify-center items-center h-screen">
          <LoginCard />
        </div>
      </Route> */}

      <Route path="/">
        <Layout>
          <Builder />
        </Layout>
      </Route>
    </Switch>
  );
};
