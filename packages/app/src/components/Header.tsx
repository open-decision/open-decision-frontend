import React from "react";
import { LogoutButton } from "@features/index";
import { Logo, Dropdown } from "@components/index";
import { useAuth } from "@features/Auth/AuthContext";
import { InternalLink } from "./Links";
import { UserCircleOutline } from "@graywolfai/react-heroicons";

export const Header: React.FC = () => {
  const { token } = useAuth();

  return (
    <div className="bg-gray-200 px-4 md:px-8 py-4">
      <div className="flex justify-between items-center">
        <Logo />
        <Dropdown
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
          <InternalLink to="./profile" className="menu-link">
            Profil
          </InternalLink>
          <InternalLink to="./settings" className="menu-link">
            Einstellungen
          </InternalLink>
          <div className="flex space-x-6 border-t-2 pt-3 mt-6 border-gray-400">
            <LogoutButton />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};
