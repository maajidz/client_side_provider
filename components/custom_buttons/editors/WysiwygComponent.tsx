'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button } from '@/components/ui/button';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false } 
);

const WysiwygComponent = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const getHtmlOutput = () => {
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    console.log(content);
    return content;
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onEditorStateChange}
      />
      <Button onClick={getHtmlOutput} className="mt-4 p-2 text-white rounded">
        Save Content
      </Button>
    </div>
  );
};

export default WysiwygComponent;
