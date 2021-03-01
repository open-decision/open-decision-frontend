import React from "react";
import { Button, Field, Logo, Tabs } from "@components/index";
import type { LocationState } from "@internalTypes/types";
import { useAuthMethods } from "./Auth/AuthContext";
import { useHistory, useLocation } from "react-router-dom";

export const LoginCard: React.FunctionComponent = () => {
  return (
    <div className="w-full max-w-xs">
      <div className="bg-white shadow-xl rounded-lg mb-4 flex flex-col overflow-hidden">
        <div className="flex justify-center items-center p-8 bg-gradient-to-r from-gray-100 to-gray-300">
          <Logo />
        </div>
        <Tabs
          className="shadow-inner"
          initialActive="Einloggen"
          Tabs={[
            { label: "Einloggen", Component: LoginForm },
            { label: "Registrieren", Component: SignupForm },
          ]}
        />
      </div>
    </div>
  );
};

const LoginForm: React.FunctionComponent = () => {
  const [email, setEmail] = React.useState("test@outlook.com");
  const [password, setPassword] = React.useState("fogmub-bifaj-sarjo8");
  const { login } = useAuthMethods();

  const history = useHistory();
  const location = useLocation<LocationState>();

  const { from } = location.state || {
    from: { pathname: "/" },
  };

  return (
    <form className="flex flex-col">
      <div className="p-6 space-y-4">
        <Field
          name="email"
          label="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <Field
          name="password"
          label="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <div className="flex justify-center">
          <a
            className="block font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            Passwort vergessen?
          </a>
        </div>
      </div>
      <Button
        rounded={false}
        className="h-20"
        type="submit"
        onClick={(event) => {
          event.preventDefault();
          login({ email, password }, () => history.replace(from));
        }}
      >
        Log-In
      </Button>
    </form>
  );
};

const SignupForm: React.FunctionComponent = () => {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password1, setPassword1] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const { signup } = useAuthMethods();

  const history = useHistory();

  return (
    <form className="flex flex-col">
      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <Field
            name="email"
            label="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <Field
            name="name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
          />
          <Field
            name="password"
            label="Passwort"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            type="password"
            required
          />
          <Field
            name="password"
            label="Passwort wiederholen"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            type="password"
            required
          />
        </div>
        <div>
          Indem Sie auf registrieren klicken akzeptieren Sie unsere{" "}
          <a
            className="font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            AGB
          </a>
          .
        </div>
      </div>
      <Button
        kind="filled"
        className="h-20"
        rounded={false}
        type="submit"
        onClick={(event) => {
          event.preventDefault();
          signup({ email, password1, password2, username: name }, () =>
            history.replace("/")
          );
        }}
      >
        Registrieren
      </Button>
    </form>
  );
};
