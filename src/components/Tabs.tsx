import clsx from "clsx";
import React from "react";

type Tabs = {
  Tabs: { Component: React.FunctionComponent; label: string }[];
  initialActive: string;
  className?: string;
};

export const Tabs: React.FunctionComponent<Tabs> = ({
  Tabs,
  initialActive,
  className,
}) => {
  const [active, setActive] = React.useState(initialActive);

  return (
    <div>
      <div className={clsx(className, "flex justify-around")}>
        {Tabs.map((Tab) => (
          <button
            key={Tab.label}
            className={clsx(
              "flex-grow flex-basis-0 p-4 border-b-2 hover:bg-green-200 focus:bg-green-100 focus:outline-none",
              { ["border-green-500 bg-green-50"]: active === Tab.label }
            )}
            onClick={() => setActive(Tab.label)}
          >
            {Tab.label}
          </button>
        ))}
      </div>

      {Tabs.filter((Tab) => Tab.label === active).map((Tab) => (
        <Tab.Component key={Tab.label} />
      ))}
    </div>
  );
};
