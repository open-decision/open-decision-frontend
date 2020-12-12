import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FunctionComponent } from "react";
import { LocationState } from "@internalTypes/types";
import { Button } from "@components/index";
import { useAuthMethods } from "./AuthContext";

//This type defines the props the LoginButton component accepts
type Props = {
  className?: string;
  email?: string;
  password?: string;
};

export const LoginButton: FunctionComponent<Props> = ({
  //for development purposes are email and password provided with a default value
  className,
  email = "test@outlook.com",
  password = "fogmub-bifaj-sarjo8",
}) => {
  const { login } = useAuthMethods();

  const history = useHistory();
  const location = useLocation<LocationState>();

  const { from } = location.state || {
    from: { pathname: "/" },
  };

  //FIXME handle Errors in UI
  //This is the Button that is shown in the UI. onClick is called when the user clicks the Button.
  return (
    <Button
      kind="filled"
      className={className}
      onClick={(e) => login({ email, password }, () => history.replace(from))}
    >
      Login
    </Button>
  );
};
