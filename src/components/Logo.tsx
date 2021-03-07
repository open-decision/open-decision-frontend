import clsx from "clsx";
import React from "react";
import { Link } from "./Links";
import logo from "../assets/icons/OD_LOGO.svg";

export const Logo: React.FC<Record<string, unknown>> = () => (
  <Link to="/">
    <h1 className={clsx("w-44")}>
      <img src={logo} alt="open-decision logo" />
    </h1>
  </Link>
);
