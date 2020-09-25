// @ts-nocheck
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button } from "theme-ui";
import { useAuth } from "./useAuth";

export const AuthButton = ({ className = "" }) => {
  const auth = useAuth();
  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };
  //TODO handle Auth Failure in UI
  return (
    <Button
      onClick={() => {
        return auth.user
          ? auth.signout(() => history.push("/"))
          : auth.signin({ callback: () => history.replace(from) });
      }}
      className={className}
    >
      {auth.user ? "Logout" : "Login"}
    </Button>
  );
};