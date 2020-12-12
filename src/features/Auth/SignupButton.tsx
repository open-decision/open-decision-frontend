import React from "react";
import { FunctionComponent } from "react";
import { Button } from "@components/index";
import { useAuthMethods } from "./AuthContext";

type SignupButton = {
  className?: string;
  email: string;
  username: string;
  password1: string;
  password2: string;
};

export const SignupButton: FunctionComponent<SignupButton> = ({
  className,
  email,
  username,
  password1,
  password2,
}) => {
  const { signup } = useAuthMethods();

  //TODO handle Auth Failure in UI
  return (
    <Button
      kind="filled"
      onClick={() => signup({ email, username, password1, password2 })}
      className={className}
    >
      Registrieren
    </Button>
  );
};
