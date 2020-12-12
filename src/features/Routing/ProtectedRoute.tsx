import React, { FunctionComponent } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "@features/Auth/AuthContext";

export const ProtectedRoute: FunctionComponent<RouteProps> = ({
  children,
  ...props
}) => {
  const { token } = useAuth();

  return (
    <Route
      {...props}
      render={({ location }) =>
        token ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
