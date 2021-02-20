import React from "react";
export const Layout: React.FunctionComponent = ({ children }) => {
  return (
    <div
      className="grid h-screen"
      style={{ gridTemplateRows: "max-content 1fr" }}
    >
      {children}
    </div>
  );
};
