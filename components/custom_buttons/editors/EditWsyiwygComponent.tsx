'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertToRaw,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

const EditWysiwygComponent = ({ initialHtml }: { initialHtml: string }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    const contentBlock = convertFromHTML(initialHtml);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks,
      contentBlock.entityMap
    );
    setEditorState(EditorState.createWithContent(contentState));
  }, [initialHtml]);

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const getHtmlOutput = () => {
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    console.log(content); // Log the updated HTML output
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
      <button onClick={getHtmlOutput} className="mt-4 p-2 bg-green-500 text-white rounded">
        Save Changes
      </button>
    </div>
  );
};

export default EditWysiwygComponent;