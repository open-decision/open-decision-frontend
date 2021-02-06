import React from "react";
import { EditorState, NodeEditor } from "./node-editor";
import { Button, FileInput, Header, Link } from "@components/index";
import { ChevronRightOutline } from "@graywolfai/react-heroicons";
import { useFileReader } from "@utils/index";
import {
  exampleNodes,
  exampleNodeTypes,
  examplePortTypes,
  exampleEdges,
} from "./node-editor/tests/nodes";

const initialEditorState: EditorState = {
  comments: {},
  id: "1234",
  nodes: exampleNodes,
  edges: exampleEdges,
  coordinates: [0, 0],
  zoom: 1,
  nodeTypes: exampleNodeTypes,
  portTypes: examplePortTypes,
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

  return (
    <>
      <Header />
      <div className="relative">
        {data?.nodes ? (
          <Editor state={data} setState={(value) => setData(value)} />
        ) : (
          <div className="h-full w-full flex justify-center items-center flex-col">
            <div>
              <h1 className="text-5xl">Starte mit Testen!</h1>
              <p className="mt-6 text-xl">
                Um den Builder auszuprobieren klicke auf{" "}
                <Button
                  onClick={() => setData(initialEditorState)}
                  className="mx-2"
                >
                  <ChevronRightOutline className="w-6" />
                  Starten
                </Button>
              </p>
              <p className="text-lg mt-12">
                Alternativ kann ein bestehender Datensatz importiert werden.
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
