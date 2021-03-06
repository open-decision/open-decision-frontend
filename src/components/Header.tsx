import React from "react";
import { LogoutButton } from "features";
import { Logo, Dropdown } from "components";
import { useAuth } from "features/Auth/AuthContext";
import { Link } from "./Links";
import { UserCircleOutline } from "@graywolfai/react-heroicons";

export const Header: React.FC = ({ children }) => {
  const { token } = useAuth();

  return (
    <div className="bg-gray-100 px-4 md:px-8 shadow-md z-50 py-2">
      <div className="flex justify-between items-center space-x-8">
        <Logo className="my-4" />
        {children}
        <Dropdown
          className="self-center"
          icon={
            token ? (
              <img
                src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80"
                alt="Anonymer User"
              />
            ) : (
              <UserCircleOutline className="w-full" />
            )
          }
        >
          <Link to="./profile" className="menu-link">
            Profil
          </Link>
          <Link to="./settings" className="menu-link">
            Einstellungen
          </Link>
          <div className="flex space-x-6 border-t-2 pt-3 mt-6 border-gray-400">
            <LogoutButton />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};
