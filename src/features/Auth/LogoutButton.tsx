import React from "react";
import { useHistory } from "react-router-dom";

import { Button } from "@components/index";
import { useAuthMethods } from "./AuthContext";

export const LogoutButton: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { logout } = useAuthMethods();
  const history = useHistory();

  //TODO handle Failure in UI
  return (
    <Button
      kind="filled"
      onClick={(e) => logout(() => history.push("/"))}
      className={className}
    >
      Logout
    </Button>
  );
};
