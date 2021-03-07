import React from "react";
import { Switch, Route } from "react-router-dom";
import { Builder } from "features";

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
