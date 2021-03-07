import React from "react";
import { useHistory } from "react-router-dom";
import { FunctionComponent } from "react";
import { FilledButton } from "components";
import { useAuthMethods } from "./AuthContext";

export const LogoutButton: FunctionComponent<{ className?: string }> = ({
  className,
}) => {
  const { logout } = useAuthMethods();
  const history = useHistory();

  //TODO handle Failure in UI
  return (
    <FilledButton
      onClick={() => logout(() => history.push("/"))}
      className={className}
    >
      Logout
    </FilledButton>
  );
};
