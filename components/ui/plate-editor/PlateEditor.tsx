import React from 'react';
import { createEditor, Descendant, BaseEditor } from 'slate';
import { withReact, Slate, Editable, ReactEditor } from 'slate-react';
import { PlateToolbar } from './PlateToolbar';

// Custom types
type CustomElement = {
  type?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  listType?: 'bullet' | 'number';
  children: CustomText[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  fontFamily?: string;
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface PlateEditorProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  placeholder?: string;
  className?: string;
}

export function PlateEditor({ value, onChange, placeholder, className }: PlateEditorProps) {
  const editor = React.useMemo(() => withReact(createEditor()), []);
  const initialValue = React.useMemo(() => value || [{ type: 'paragraph', children: [{ text: '' }] }], [value]);

  return (
    <div className={className}>
      <Slate editor={editor} initialValue={initialValue} onChange={onChange}>
        <div className="border rounded-md">
          <PlateToolbar className="bg-[#F3EFF0]" />
          <Editable
            placeholder={placeholder}
            className="min-h-[150px] px-3 py-2 text-sm focus-visible:outline-none"
            renderElement={(props) => {
              const element = props.element as CustomElement;
              const style: React.CSSProperties = {
                textAlign: element.align || 'left',
              };

              switch (element.type) {
                case 'h1':
                  return <h1 {...props.attributes} style={style} className="text-2xl font-bold">{props.children}</h1>;
                case 'h2':
                  return <h2 {...props.attributes} style={style} className="text-xl font-bold">{props.children}</h2>;
                case 'h3':
                  return <h3 {...props.attributes} style={style} className="text-lg font-bold">{props.children}</h3>;
                case 'blockquote':
                  return <blockquote {...props.attributes} style={style} className="border-l-2 pl-4 italic">{props.children}</blockquote>;
                case 'list-item':
                  return <li {...props.attributes} style={style}>{props.children}</li>;
                case 'bulleted-list':
                  return <ul {...props.attributes} style={style} className="list-disc pl-5">{props.children}</ul>;
                case 'numbered-list':
                  return <ol {...props.attributes} style={style} className="list-decimal pl-5">{props.children}</ol>;
                default:
                  return <p {...props.attributes} style={style}>{props.children}</p>;
              }
            }}
            renderLeaf={(props) => {
              const leaf = props.leaf as CustomText;
              let children = props.children;
              
              const style: React.CSSProperties = {
                fontFamily: leaf.fontFamily,
                fontSize: leaf.fontSize,
                color: leaf.color,
                backgroundColor: leaf.backgroundColor,
              };
              
              if (leaf.bold) {
                children = <strong>{children}</strong>;
              }
              
              if (leaf.italic) {
                children = <em>{children}</em>;
              }
              
              if (leaf.underline) {
                children = <u>{children}</u>;
              }
              
              if (leaf.code) {
                children = <code className="bg-gray-100 px-1 rounded">{children}</code>;
              }
              
              return <span {...props.attributes} style={style}>{children}</span>;
            }}
          />
        </div>
      </Slate>
    </div>
  );
}

export default PlateEditor; 