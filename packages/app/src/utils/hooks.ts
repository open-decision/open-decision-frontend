import React from "react";

export const useKeyboardEvent = (key: string, callback: () => void): void => {
  React.useEffect(() => {
    const handler = function (event: KeyboardEvent) {
      if (event.key === key) {
        callback();
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [key, callback]);
};

type localStorage = [
  getItem: () => string | null,
  setItem: (token: string) => void,
  removeItem: () => void
];

export const useLocalStorage = (name: string): localStorage => {
  const getItem = () => localStorage.getItem(name);
  const setItem = (token: string) => localStorage.setItem(name, token);
  const removeItem = () => localStorage.removeItem(name);

  return [getItem, setItem, removeItem];
};

export const useFileReader = <S>(): [
  fileContent: S | undefined,
  setFileContent: React.Dispatch<React.SetStateAction<S | undefined>>,
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void | null
] => {
  const [fileContent, setFileContent] = React.useState<S>();

  const fileReader = new FileReader();

  const handleFileRead = () =>
    setFileContent(JSON.parse(fileReader.result as string));

  const handleFileChosen = (file: File) => {
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
    e?.currentTarget?.files && handleFileChosen(e.currentTarget.files[0]);

  return [fileContent, setFileContent, handleUpload];
};
