import {
  useLogin_UserMutation,
  useLogout_UserMutation,
  useRegister_UserMutation,
} from "internalTypes";
import React from "react";

type AuthContext = { token: string; expires: number; refreshToken: string };

type login = (
  variables: { email: string; password: string },
  callback?: () => void
) => void;

type logout = (callback?: () => void) => void;
type signup = (
  variables: {
    email: string;
    password1: string;
    password2: string;
    username: string;
  },
  callback?: () => void
) => void;

type AuthMethods = { login: login; logout: logout; signup: signup };

const AuthContext = React.createContext<AuthContext>({
  token: "",
  expires: 0,
  refreshToken: "",
});

const AuthMethodContext = React.createContext<AuthMethods>({} as AuthMethods);

export const AuthProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState({
    token: "",
    expires: 0,
    refreshToken: "",
  });

  const [, loginQuery] = useLogin_UserMutation();
  const login: login = ({ email, password }, callback) => {
    loginQuery({ email, password }).then(({ data, error }) => {
      if (error) {
        console.error("loginUser failed", error);
      } else {
        const tokenAuth = data?.tokenAuth;

        if (tokenAuth?.token == null) return console.error("no token received");
        if (tokenAuth?.refreshToken == null)
          return console.error("no refreshToken received");

        setState({
          ...state,
          refreshToken: tokenAuth.refreshToken,
          token: tokenAuth.token,
        });
        callback ? callback() : null;
      }
    });
  };

  const [, logoutQuery] = useLogout_UserMutation();
  const logout: logout = (callback) => {
    logoutQuery({ refreshToken: state.refreshToken }).then(({ error }) => {
      if (error) console.error("logoutUser failed", error);

      setState({ ...state, token: "", refreshToken: "" });
      callback ? callback() : null;
    });
  };

  const [, signupQuery] = useRegister_UserMutation();
  const signup: signup = (
    { email, password1, password2, username },
    callback
  ) =>
    signupQuery({
      email,
      password1,
      password2,
      username,
    }).then(({ data, error }) => {
      if (error) {
        console.error("signUpUser failed", error);
      } else {
        const register = data?.register;

        if (register?.token == null) return console.error("no token received");

        if (register.success === false) {
          console.error(register.errors);
        } else {
          setState({ ...state, token: register.token });
          callback ? callback() : null;
        }
      }
    });

  return (
    <AuthContext.Provider value={state}>
      <AuthMethodContext.Provider value={{ login, logout, signup }}>
        {children}
      </AuthMethodContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContext => React.useContext(AuthContext);
export const useAuthMethods = (): AuthMethods =>
  React.useContext(AuthMethodContext);
