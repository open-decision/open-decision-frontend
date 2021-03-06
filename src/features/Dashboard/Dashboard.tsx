import React from "react";
import { PlusCircleOutline } from "@graywolfai/react-heroicons";
import { useAll_TreesQuery, useCreate_TreeMutation } from "internalTypes";
import { TreeList } from "./TreeList";
import { data } from "./testData";
import { validateTreeData } from "./dataValidation";
import { OutlinedButton } from "components";

//FIXME username is hardcoded
export const Dashboard: React.FunctionComponent = () => {
  const [
    {
      //FIXME error and data should be destructured from here. For dev purposes they are hardcoded.
      // data,
      fetching,
      // error
    },
  ] = useAll_TreesQuery();

  //FIXME Testdata
  const error = false;

  const [, createTree] = useCreate_TreeMutation();
  const { invalidData: _invalidData, validData } = validateTreeData(data);

  return (
    <div className="dashboard-grid">
      <div className="col-start-2 mt-24 mx-4 md:mx-8 flex flex-col justify-end items-start">
        <h2 className="text-5xl">Hallo Dirk_laywer23</h2>
        <OutlinedButton
          className="my-8"
          size="large"
          onClick={() =>
            createTree({
              input: {
                name: "Tes",
              },
            }).then((result) => console.log(result))
          }
        >
          <PlusCircleOutline className="w-8 mr-2 inline" />
          Neue Anwendung erstellen
        </OutlinedButton>
      </div>

      <div className="col-start-2 row-start-2 mx-4 md:mx-8">
        {error ? (
          <p>Error :(</p>
        ) : fetching ? (
          <span>Laden</span>
        ) : (
          <TreeList data={validData} />
        )}
      </div>
    </div>
  );
};
