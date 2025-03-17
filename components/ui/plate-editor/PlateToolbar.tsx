import React from 'react';
import { useSlate } from 'slate-react';
import { Editor, Transforms, Element as SlateElement, BaseEditor } from 'slate';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';
import { ReactEditor } from 'slate-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from '../icon';

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

type CustomEditor = BaseEditor & ReactEditor;

interface ToolbarButtonProps {
  icon: React.ReactNode;
  isActive?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  title: string;
}

const FONT_FAMILIES = [
  { label: 'Default', value: 'system-ui' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Garamond', value: 'Garamond, serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
  { label: 'Monaco', value: 'Monaco, monospace' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Open Sans', value: 'Open Sans, sans-serif' },
  { label: 'Lato', value: 'Lato, sans-serif' },
];

const FONT_SIZES = [
  '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'
];

const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
];

const ToolbarButton = ({ icon, isActive, onMouseDown, title }: ToolbarButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    className={`p-2 text-[#7D7177] hover:text-[#84012A] hover:bg-[#E9DFE9] ${isActive ? 'bg-[#E9DFE9] ' : ''}`}
    onMouseDown={onMouseDown}
    title={title}
  >
    {icon}
  </Button>
);

const isMarkActive = (editor: CustomEditor, format: keyof Omit<CustomText, 'text'>) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const isBlockActive = (editor: CustomEditor, format: string, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && 
        SlateElement.isElement(n) && 
        (n as CustomElement)[blockType as keyof CustomElement] === format,
    })
  );
  return !!match;
};

const toggleMark = (editor: CustomEditor, format: keyof Omit<CustomText, 'text'>) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(editor, format);
  
  Transforms.setNodes(
    editor,
    { type: isActive ? 'paragraph' : format } as Partial<CustomElement>,
    { match: n => !Editor.isEditor(n) && SlateElement.isElement(n) }
  );
};

const toggleAlign = (editor: CustomEditor, align: string) => {
  Transforms.setNodes(
    editor,
    { align } as Partial<CustomElement>,
    { match: n => !Editor.isEditor(n) && SlateElement.isElement(n) }
  );
};

const toggleList = (editor: CustomEditor, format: 'bulleted-list' | 'numbered-list') => {
  const isList = isBlockActive(editor, format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      ['bulleted-list', 'numbered-list'].includes((n as CustomElement).type || ''),
    split: true,
  });

  if (!isList) {
    Transforms.setNodes(editor, { type: 'list-item' } as Partial<CustomElement>);
    Transforms.wrapNodes(editor, { type: format, children: [] } as CustomElement);
  }
};

const setMark = (editor: CustomEditor, key: keyof Omit<CustomText, 'text'>, value: string) => {
  Editor.addMark(editor, key, value);
};

interface PlateToolbarProps {
  className?: string;
}

export function PlateToolbar({ className }: PlateToolbarProps) {
  const editor = useSlate() as CustomEditor;

  return (
    <div className={cn("flex flex-wrap gap-1 p-1 border-b", className)}>
      {/* Text formatting */}
      <ToolbarButton
        icon={<Icon name="format_bold" />}
        isActive={isMarkActive(editor, 'bold')}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, 'bold');
        }}
        title="Bold"
      />
      <ToolbarButton
        icon={<Icon name="format_italic" />}
        isActive={isMarkActive(editor, 'italic')}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, 'italic');
        }}
        title="Italic"
      />
      <ToolbarButton
        icon={<Icon name="format_underlined" />}
        isActive={isMarkActive(editor, 'underline')}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, 'underline');
        }}
        title="Underline"
      />
      <ToolbarButton
        icon={<Icon name="code" />}
        isActive={isMarkActive(editor, 'code')}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, 'code');
        }}
        title="Code"
      />

      <div className="w-px h-6 mx-1 bg-border" />

      {/* Font controls */}
      <Select
        onValueChange={(value) => setMark(editor, 'fontFamily', value)}
      >
        <SelectTrigger className="w-fit h-8 text-xs font-medium ">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent>
          {FONT_FAMILIES.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              <span style={{ fontFamily: font.value }}>{font.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => setMark(editor, 'fontSize', value)}
      >
        <SelectTrigger className="w-fit h-8 text-xs font-medium">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          {FONT_SIZES.map((size) => (
            <SelectItem key={size} value={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="w-px h-6 mx-1 bg-border" />

      {/* Color controls */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2 text-[#7D7177] hover:text-[#84012A] hover:bg-[#E9DFE9] data-[state=open]:bg-[#E9DFE9] data-[state=open]:text-[#84012A]">
            <Icon name="palette" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid grid-cols-10 gap-1">
            {COLORS.map((color) => (
              <Button
                key={color}
                variant="ghost"
                className="w-5 h-5 p-0"
                style={{ backgroundColor: color }}
                onClick={() => setMark(editor, 'color', color)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2 text-[#7D7177] hover:text-[#84012A] hover:bg-[#E9DFE9] data-[state=open]:bg-[#E9DFE9] data-[state=open]:text-[#84012A]">
            <Icon name="format_color_text" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid grid-cols-10 gap-1">
            {COLORS.map((color) => (
              <Button
                key={color}
                variant="ghost"
                className="w-5 h-5 p-0"
                style={{ backgroundColor: color }}
                onClick={() => setMark(editor, 'backgroundColor', color)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 mx-1 bg-border" />

      {/* Alignment Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-0 px-2 text-[#7D7177] hover:text-[#84012A] hover:bg-[#E9DFE9] data-[state=open]:bg-[#E9DFE9] data-[state=open]:text-[#84012A]">
            <Icon name="format_align_left" />
            <Icon name="keyboard_arrow_down" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            toggleAlign(editor, 'left');
          }}>
            <Icon name="format_align_left" />
            <span>Left</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            toggleAlign(editor, 'center');
          }}>
            <Icon name="format_align_center" />
            <span>Center</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            toggleAlign(editor, 'right');
          }}>
            <Icon name="format_align_right" />
            <span>Right</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            toggleAlign(editor, 'justify');
          }}>
            <Icon name="format_align_justify" />
            <span>Justify</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Lists Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-0 px-2 text-[#7D7177] hover:text-[#84012A] hover:bg-[#E9DFE9] data-[state=open]:bg-[#E9DFE9] data-[state=open]:text-[#84012A]">
            <Icon name="format_list_bulleted" />
            <Icon name="keyboard_arrow_down" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            toggleList(editor, 'bulleted-list');
          }}>
            <Icon name="format_list_bulleted" />
            <span>Bullet List</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            toggleList(editor, 'numbered-list');
          }}>
            <Icon name="format_list_numbered" />
            <span>Numbered List</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Headings Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-0 px-2 text-[#7D7177] hover:text-[#84012A] hover:bg-[#E9DFE9] data-[state=open]:bg-[#E9DFE9] data-[state=open]:text-[#84012A]">
            <Icon name="format_h1" />
            <Icon name="keyboard_arrow_down" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'h1');
          }}>
            <Icon name="format_h1" />
            <span className="text-xl font-bold">Heading 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'h2');
          }}>
            <Icon name="format_h2" />
            <span className="text-lg font-bold">Heading 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'h3');
          }}>
            <Icon name="format_h3" />
            <span className="text-base font-bold">Heading 3</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'paragraph');
          }}>
            <Icon name="format_paragraph" />
            <span>Normal Text</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'blockquote');
          }}>
            <Quote className="h-4 w-4 mr-2" />
            <span>Quote</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 