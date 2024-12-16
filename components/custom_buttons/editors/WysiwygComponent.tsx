'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import htmlToDraft from 'html-to-draftjs';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false } 
);

const WysiwygComponent = ({value, onChange}: {
  value: string;
  onChange: (content: string) => void;
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (value) {
      const blocksFromHtml = htmlToDraft(value);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [value]);


  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const content = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    onChange(content);
  };

  // const getHtmlOutput = () => {
  //   const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  //   console.log("content",content);
  //   return content;
  // };

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onEditorStateChange}
      />
      {/* <Button onClick={getHtmlOutput} className="mt-4 p-2 text-white rounded">
        Save Content
      </Button> */}
    </div>
  );
};

export default WysiwygComponent;
