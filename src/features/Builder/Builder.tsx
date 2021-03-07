import React from "react";
import { EditorState, NodeEditor } from "./node-editor";
import { FilledButton, FileInput, Header, Input } from "components";
import { ChevronRightOutline } from "@graywolfai/react-heroicons";
import { useFileReader } from "utils";
import {
  // exampleNodes,
  exampleNodeTypes,
  examplePortTypes,
} from "./node-editor/tests/nodes";
import { edges, nodes } from "./node-editor/types";

const randomProperty = (obj: any) => {
  const keys = Object.keys(obj);
  return keys[(keys.length * Math.random()) << 0];
};

const exampleNodes = (numberOfElements: number): [nodes, edges] => {
  const elements: nodes = {};
  const edges: edges = {};

  for (let index = 0; index < numberOfElements; index++) {
    elements[index] = {
      coordinates: [
        Math.floor(Math.random() * 1000),
        Math.floor(Math.random() * 1000),
      ],
      type: "addNumbers",
      width: 250,
      height: 100,
      name: "Addiere zwei Zahlen",
    };

    const randomIndex = randomProperty(elements);

    if (index !== Number(randomIndex)) edges[index] = [{ nodeId: randomIndex }];
  }

  return [elements, edges];
};

const initialEditorState = (numberOfElements: number): EditorState => {
  const [nodes, edges] = exampleNodes(numberOfElements);

  return {
    comments: {},
    id: "1234",
    nodes: nodes,
    edges: edges,
    coordinates: [0, 0],
    zoom: 1,
    nodeTypes: exampleNodeTypes,
    portTypes: examplePortTypes,
    treeName: "Test",
  };
};

const Editor: React.FC<{
  state: EditorState;
  setState?: (value: EditorState) => void;
  setComments?: any;
}> = ({ state, setState }) => {
  return <NodeEditor state={state} setState={setState} />;
};

export const Builder: React.FC = () => {
  const [data, setData, setFile] = useFileReader<EditorState>();
  const [number, setNumber] = React.useState(10);

  return (
    <>
      <Header>
        <div className="flex space-x-4 flex-1 justify-between">
          {data ? (
            <>
              <Input
                className="shadow-none border-none max-w-2xl text-xl px-4 bg-gray-50"
                value={data.treeName}
                onChange={(event) =>
                  setData({ ...data, treeName: event.target.value })
                }
              />
              <div className="space-x-4 self-center py-2">
                <FilledButton>Preview</FilledButton>
                <FilledButton>Export</FilledButton>
                <FilledButton>Speichern</FilledButton>
              </div>
            </>
          ) : null}
        </div>
      </Header>
      <div className="relative min-h-0">
        {data?.nodes ? (
          <Editor state={data} setState={(value) => setData(value)} />
        ) : (
          <div className="h-full w-full flex justify-center items-center flex-col">
            <div className="space-y-10">
              <h1 className="text-5xl">Starte mit Testen!</h1>

              <div className="flex space-x-4">
                <Input
                  className=""
                  type="number"
                  value={number}
                  onChange={(event) => setNumber(Number(event.target.value))}
                />
                <FilledButton
                  onClick={() => setData(initialEditorState(number))}
                >
                  <ChevronRightOutline className="w-6" />
                  Starten
                </FilledButton>
              </div>

              <p className="text-lg">
                Es kann ein bestehender Datensatz importiert werden.
                <FileInput
                  className="mt-4"
                  name="file"
                  accept=".json"
                  onChange={setFile}
                >
                  Datei hochladen
                </FileInput>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
