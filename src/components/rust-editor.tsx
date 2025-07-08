"use client";

import React from "react";
import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import { Skeleton } from "./ui/skeleton";

interface RustEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

const RustEditor: React.FC<RustEditorProps> = ({ value, onChange }) => {
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // You can add custom editor configurations here
  };

  return (
    <Editor
      height="100%"
      language="rust"
      theme="vs-dark"
      value={value}
      onChange={onChange}
      onMount={handleEditorDidMount}
      loading={<Skeleton className="h-full w-full rounded-none" />}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: '"Source Code Pro", monospace',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: "on",
      }}
    />
  );
};

export default RustEditor;
