import React, { useCallback, useMemo, useRef, useState } from 'react';
import { deserializeHTMLFromWord } from '@/libs/richTextField';
import cx from 'classnames';
import {
  AutoComplete,
  Button,
  Icon,
  IconNames,
  Popper,
  TextField,
} from 'mis-design';
import {
  Editor,
  Point,
  Range,
  Element as SlateElement,
  Text,
  Transforms,
  createEditor,
} from 'slate';
import type { BaseEditor, Node } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { Editable, ReactEditor, Slate, useSlate, withReact } from 'slate-react';
import type { RenderElementProps, RenderLeafProps } from 'slate-react';
import InputHelper from '../InputHelper';
import InputLabel from '../InputLabel';
import ColorPicker from './ColorPicker';
import LinkGenerator from './LinkGenerator';
import MarkButton from './MarkButton';
import ToolbarButton from './ToolbarButton';

export type CustomRichText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  color?: string;
};

export type CustomRichElement =
  | {
      type:
        | 'paragraph'
        | 'heading-one'
        | 'heading-two'
        | 'heading-three'
        | 'heading-four'
        | 'heading-five'
        | 'heading-six'
        | 'block-quote';
      children: CustomRichText[];
      color?: string;
      align?: 'left' | 'center' | 'right' | 'justify';
    }
  | {
      type: 'numbered-list' | 'bulleted-list';
      children: CustomRichElement[];
      color?: string;
      align?: 'left' | 'center' | 'right' | 'justify';
    }
  | {
      type: 'list-item';
      children: CustomRichElement[];
      heading?: CustomRichElement['type'];
      color?: string;
      align?: 'left' | 'center' | 'right' | 'justify';
    }
  | { type: 'link'; url: string; children: CustomRichText[] }
  | { type: 'image'; url: string; children: CustomRichText[] };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & HistoryEditor;
    Element: CustomRichElement;
    Text: CustomRichText;
  }
}

const LIST_TYPES: CustomRichElement['type'][] = [
  'numbered-list',
  'bulleted-list',
];

// --- Mark & Block ---
// const isMarkActive = (editor: Editor, format: keyof CustomRichText) => {
//   const marks = Editor.marks(editor) as Record<string, boolean> | null;
//   return marks?.[format] === true;
// };

// const toggleMark = (editor: Editor, format: keyof CustomRichText) => {
//   const isActive = isMarkActive(editor, format);
//   if (isActive) Editor.removeMark(editor, format);
//   else Editor.addMark(editor, format, true);
// };

const isBlockActive = (editor: Editor, format: CustomRichElement['type']) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => {
      if (!SlateElement.isElement(n)) return false;

      if (n.type === format) return true;

      if (n.type === 'list-item' && (n as any).heading === format) return true;

      return false;
    },
  });

  return !!match;
};

const withLists = (editor: Editor) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (...args) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && n.type === 'list-item',
      });

      if (match) {
        const [, path] = match;
        const start = Editor.start(editor, path);

        if (Point.equals(selection.anchor, start)) {
          Transforms.setNodes(editor, {
            type: 'paragraph',
            heading: undefined,
          });
          Transforms.unwrapNodes(editor, {
            match: (n) =>
              SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
            split: true,
          });
          return;
        }
      }
    }
    deleteBackward(...args);
  };

  return editor;
};

const toggleBlock = (editor: Editor, format: CustomRichElement['type']) => {
  const isList = LIST_TYPES.includes(format);

  const [matchListItem] = Editor.nodes(editor, {
    match: (n) => SlateElement.isElement(n) && n.type === 'list-item',
  });

  if (isList) {
    const [parentList] = Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === format,
    });
    const isActive = !!parentList;

    if (isActive) {
      for (const [node, path] of Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && n.type === 'list-item',
      })) {
        const li = node as any;
        const newType = li.heading ?? 'paragraph';

        Transforms.setNodes(
          editor,
          { type: newType, heading: undefined },
          { at: path },
        );
      }

      Transforms.unwrapNodes(editor, {
        match: (n) => SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
        split: true,
      });

      for (const [node, path] of Editor.nodes(editor, {
        at: [],
        match: (n) =>
          SlateElement.isElement(n) &&
          LIST_TYPES.includes(n.type) &&
          Editor.isEmpty(editor, n),
      })) {
        Transforms.removeNodes(editor, { at: path });
      }
    } else {
      const [match] = Editor.nodes(editor, {
        match: (n) =>
          SlateElement.isElement(n) &&
          [
            'paragraph',
            'heading-one',
            'heading-two',
            'heading-three',
            'heading-four',
            'heading-five',
            'heading-six',
          ].includes(n.type),
      });
      const currentHeading = match ? (match[0] as any).type : undefined;

      Transforms.setNodes(
        editor,
        { type: 'list-item', heading: currentHeading },
        {
          match: (n) =>
            SlateElement.isElement(n) &&
            [
              'paragraph',
              'heading-one',
              'heading-two',
              'heading-three',
              'heading-four',
              'heading-five',
              'heading-six',
            ].includes(n.type),
        },
      );

      Transforms.unwrapNodes(editor, {
        match: (n) => SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
        split: true,
      });

      Transforms.wrapNodes(
        editor,
        { type: format, children: [] } as CustomRichElement,
        { match: (n) => SlateElement.isElement(n) && n.type === 'list-item' },
      );
    }
  } else {
    const isActive = isBlockActive(editor, format);

    if (matchListItem && format.startsWith('heading')) {
      Transforms.setNodes(editor, { heading: format } as any, {
        match: (n) => SlateElement.isElement(n) && n.type === 'list-item',
      });
    } else {
      Transforms.setNodes(
        editor,
        { type: isActive ? 'paragraph' : format },
        {
          match: (n) =>
            SlateElement.isElement(n) &&
            [
              'paragraph',
              'heading-one',
              'heading-two',
              'heading-three',
              'heading-four',
              'heading-five',
              'heading-six',
              'block-quote',
            ].includes(n.type),
          split: true,
        },
      );
    }
  }
};

// --- Alignment ---
const toggleAlign = (
  editor: Editor,
  align: 'left' | 'center' | 'right' | 'justify',
) => {
  if (!editor.selection) return;
  Transforms.setNodes(
    editor,
    { align },
    {
      match: (n) =>
        SlateElement.isElement(n) &&
        [
          'paragraph',
          'heading-one',
          'heading-two',
          'block-quote',
          'list-item',
        ].includes(n.type),
    },
  );
};

// --- Buttons ---
// const MarkButton: React.FC<{
//   format: keyof CustomRichText;
//   icon: IconNames;
// }> = ({ format, icon }) => {
//   const editor = useSlate();

//   return (
//     <ToolbarButton
//       active={isMarkActive(editor, format)}
//       onMouseDown={(e) => {
//         e.preventDefault();
//         toggleMark(editor, format);
//       }}
//     >
//       <Icon name={icon} size={16} />
//     </ToolbarButton>
//   );
// };

const BlockButton: React.FC<{
  format: CustomRichElement['type'];
  icon: IconNames;
}> = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <ToolbarButton
      active={isBlockActive(editor, format)}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon name={icon} size={16} />
    </ToolbarButton>
  );
};

const AlignButton: React.FC<{
  align: 'left' | 'center' | 'right' | 'justify';
  icon: IconNames;
}> = ({ align, icon }) => {
  const editor = useSlate();
  return (
    <ToolbarButton
      onMouseDown={(e) => {
        e.preventDefault();
        toggleAlign(editor, align);
      }}
    >
      <Icon name={icon} size={16} />
    </ToolbarButton>
  );
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const editor = useSlate();
  const style: React.CSSProperties = {};

  if ('color' in element && element.color) style.color = element.color;
  if ('align' in element && element.align) style.textAlign = element.align;

  switch (element.type) {
    case 'heading-one':
      return (
        <h1 {...attributes} className="text-30px font-bold" style={style}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 {...attributes} className="text-24px font-semibold" style={style}>
          {children}
        </h2>
      );
    case 'heading-three':
      return (
        <h3 {...attributes} className="text-20px font-semibold" style={style}>
          {children}
        </h3>
      );
    case 'heading-four':
      return (
        <h4 {...attributes} className="text-18px font-medium" style={style}>
          {children}
        </h4>
      );
    case 'heading-five':
      return (
        <h5 {...attributes} className="text-16px font-medium" style={style}>
          {children}
        </h5>
      );
    case 'heading-six':
      return (
        <h6 {...attributes} className="text-14px font-medium" style={style}>
          {children}
        </h6>
      );
    case 'paragraph': {
      const hasListChild = element.children.some(
        (child: any) =>
          child.type === 'bulleted-list' || child.type === 'numbered-list',
      );

      if (hasListChild) {
        return (
          <div {...attributes} style={style}>
            {children}
          </div>
        );
      }

      const parent = Editor.above(editor, {
        at: ReactEditor.findPath(editor, element),
        match: (n) => SlateElement.isElement(n) && n.type === 'list-item',
      });

      if (parent) {
        return (
          <span {...attributes} style={style}>
            {children}
          </span>
        );
      }

      return (
        <p {...attributes} style={style}>
          {children}
        </p>
      );
    }

    case 'block-quote':
      return (
        <blockquote
          {...attributes}
          className="border-l-4 pl-3 italic"
          style={style}
        >
          {children}
        </blockquote>
      );
    case 'bulleted-list':
    case 'numbered-list': {
      const Tag: any = element.type === 'bulleted-list' ? 'ul' : 'ol';

      if (!element.children || element.children.length === 0) {
        return <>{children}</>;
      }
      return (
        <Tag
          {...attributes}
          style={{
            textAlign: element.align || 'left',
            listStyleType:
              element.type === 'bulleted-list' ? 'disc' : 'decimal',
            listStylePosition: 'inside',
          }}
        >
          {children}
        </Tag>
      );
    }
    case 'list-item': {
      const parent = Editor.above(editor, {
        at: ReactEditor.findPath(editor, element),
        match: (n) =>
          SlateElement.isElement(n) &&
          (n.type === 'bulleted-list' || n.type === 'numbered-list'),
      });

      if (!parent) {
        return (
          <p {...attributes} style={{ textAlign: element.align || 'left' }}>
            {children}
          </p>
        );
      }

      const headingType = (element as any).heading;
      const classNameMap: Record<string, string> = {
        'heading-one': 'text-30px font-bold',
        'heading-two': 'text-24px font-semibold',
        'heading-three': 'text-20px font-semibold',
        'heading-four': 'text-18px font-medium',
        'heading-five': 'text-16px font-medium',
        'heading-six': 'text-14px font-medium',
      };
      return (
        <li
          {...attributes}
          className={headingType ? classNameMap[headingType] : ''}
          style={{ textAlign: element.align || 'left' }}
        >
          {children}
        </li>
      );
    }
    case 'link':
      return (
        <a
          {...attributes}
          href={(element as any).url}
          className="text-blue-600 underline cursor-pointer"
          target="_blank"
          rel="noreferrer"
          onClick={(e) => {
            e.preventDefault();
            window.open((element as any).url, '_blank');
          }}
        >
          {children}
        </a>
      );
    case 'image':
      return (
        <div
          {...attributes}
          contentEditable={false}
          className="relative inline-block"
        >
          <img
            src={(element as any).url}
            alt="pasted image"
            className="max-w-[200px] max-h-[200px] object-contain rounded border"
          />

          <button
            onClick={() => {
              const path = ReactEditor.findPath(editor, element);
              Transforms.removeNodes(editor, { at: path });
            }}
            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full"
          >
            ✕
          </button>
          {children}
        </div>
      );

    default:
      return (
        <p {...attributes} style={style}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.strikethrough) children = <s>{children}</s>;
  if (leaf.code) children = <code>{children}</code>;
  if (leaf.color)
    children = <span style={{ color: leaf.color }}>{children}</span>;
  return <span {...attributes}>{children}</span>;
};

const HeadingDropdown: React.FC = () => {
  const editor = useSlate();

  const headings = [
    { label: 'Heading 1', value: 'heading-one' },
    { label: 'Heading 2', value: 'heading-two' },
    { label: 'Heading 3', value: 'heading-three' },
    { label: 'Heading 4', value: 'heading-four' },
    { label: 'Heading 5', value: 'heading-five' },
    { label: 'Heading 6', value: 'heading-six' },
    { label: 'Normal', value: 'paragraph' },
  ];

  const [value, setValue] = useState(headings[6]);

  React.useEffect(() => {
    if (!editor.selection) return;

    const [match] = Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && 'type' in n,
    });

    const type = match ? (match[0] as any).type : 'paragraph';
    const headingOption = headings.find((h) => h.value === type) || headings[6];
    setValue(headingOption);
  }, [editor.selection]);

  return (
    <div className="w-40">
      <AutoComplete
        placeholder="Select heading..."
        options={headings}
        value={value}
        onChange={(selected) => {
          if (selected) {
            setValue(selected);
            toggleBlock(editor, selected.value as any);
          }
        }}
        size="default"
      />
    </div>
  );
};

// --- Plugins ---
const withLinks = (editor: Editor) => {
  const { isInline } = editor;
  editor.isInline = (element) =>
    SlateElement.isElement(element) && element.type === 'link'
      ? true
      : isInline(element);
  return editor;
};

const withImages = (editor: Editor) => {
  const { isVoid } = editor;
  editor.isVoid = (element) =>
    SlateElement.isElement(element) && element.type === 'image'
      ? true
      : isVoid(element);
  return editor;
};

// const ColorPicker: React.FC = () => {
//   const editor = useSlate();
//   const [color, setColorState] = useState('#000000');

//   const handleChange = (newColor: string) => {
//     setColorState(newColor);
//     setColor(editor, newColor);
//   };

//   return (
//     <div className="inline-flex flex-col items-center">
//       <span className="text-base font-bold select-none leading-none pt-2">
//         A
//       </span>
//       <input
//         type="color"
//         value={color}
//         onChange={(e) => handleChange(e.target.value)}
//         className="bg-neutral-10 w-[20px] h-[12px] cursor-pointer  "
//       />
//     </div>
//   );
// };

const InsertImageFromFile = (editor: Editor) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = () => {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        Transforms.insertNodes(editor, {
          type: 'image',
          url,
          children: [{ text: '' }],
        });
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
};

// --- Component ---
interface RichTextFieldProps {
  name?: string;
  label?: string;
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  helperMessage?: string;
  fullWidth?: boolean;
  isError?: boolean;
  successProp?: boolean;
  size?: 'default' | 'large';
  width?: string;
  disabled?: boolean;
  focused?: boolean;
}

export const RichTextField: React.FC<RichTextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  helperMessage,
  fullWidth,
  isError,
  successProp,
  size = 'default',
  width,
  disabled,
  focused,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const editor = useMemo(
    () =>
      withLinks(
        withImages(withLists(withHistory(withReact(createEditor())))),
      ) as unknown as BaseEditor & ReactEditor & HistoryEditor,
    [],
  );
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );

  const [color, setColor] = useState('#000000');

  const handleConfirmLink = (url: string, name: string) => {
    const { selection } = editor;
    if (!selection) return;
    const isCollapsed = Range.isCollapsed(selection);

    if (!isCollapsed) {
      Transforms.wrapNodes(
        editor,
        { type: 'link', url: url, children: [] },
        { split: true, at: selection },
      );
      Transforms.collapse(editor, { edge: 'end' });
      Transforms.insertText(editor, ' ');
    } else {
      const linkNode: Node = {
        type: 'link',
        url: url,
        children: [{ text: name || url }],
      };
      Transforms.insertNodes(editor, linkNode);
      const { selection: newSel } = editor;
      if (newSel) {
        Transforms.move(editor, { distance: 1, unit: 'offset' });
      }
      Transforms.insertText(editor, ' ');
    }
  };

  return (
    <div>
      {label && <InputLabel size={size}>{label}</InputLabel>}
      <div
        className={cx('relative border rounded-md flex flex-col ', {
          'w-full': fullWidth,
          'border-danger-main dark:border-danger-main-dark focus:ring-danger-focus dark:focus:ring-danger-focus-dark':
            isError,
          'border-success-main dark:border-success-main-dark focus:ring-success-focus dark:focus:ring-success-focus-dark':
            !isError && successProp,
          'border-neutral-50 dark:border-neutral-50-dark hover:border-primary-hover dark:hover:border-primary-hover-dark focus:ring-primary-main dark:focus:ring-primary-main-dark':
            !isError && !successProp && !disabled,
          'bg-neutral-20 dark:bg-neutral-30-dark cursor-not-allowed text-neutral-60 dark:text-neutral-60-dark':
            disabled,
          'bg-neutral-10 dark:bg-neutral-10-dark shadow-box-3 focus:ring-3 focus:ring-primary-focus focus:!border-primary-main':
            !disabled,
          'ring-3 ring-primary-focus dark:ring-primary-focus-dark !border-primary-main dark:!border-primary-main-dark':
            focused,
        })}
        style={width ? { width } : undefined}
        ref={parentRef}
      >
        <Slate
          editor={editor as unknown as ReactEditor}
          initialValue={
            value
              ? JSON.parse(value)
              : [{ type: 'paragraph', children: [{ text: '' }] }]
          }
          onChange={(v) => onChange?.(JSON.stringify(v))}
        >
          <div className="flex gap-0.5 border-b p-2 bg-gray-100">
            <HeadingDropdown />
            <MarkButton format="bold" icon="bold" />
            <MarkButton format="italic" icon="italic" />
            <MarkButton format="underline" icon="underline" />
            <MarkButton format="strikethrough" icon="strikethrough" />
            <ColorPicker color={color} onChange={setColor} />
            <LinkGenerator onSubmit={handleConfirmLink} />
            <ToolbarButton
              onMouseDown={(e) => {
                e.preventDefault();
                InsertImageFromFile(editor);
              }}
            >
              <Icon name="photo" />
            </ToolbarButton>
            <BlockButton format="bulleted-list" icon="list-bullet" />
            <BlockButton format="numbered-list" icon="numbered-list" />
            <AlignButton align="left" icon="bars-3-bottom-left" />
            <AlignButton align="center" icon="bars-3-center-left" />
            <AlignButton align="right" icon="bars-3-bottom-right" />
            <AlignButton align="justify" icon="bars-4" />
          </div>
          <div
            className={cx(
              'flex-1 px-4 overflow-y-auto overflow-x-hidden p-3 min-h-[120px] max-h-[106px]',
              {
                'py-[0px]': size === 'default',
                'py-[9px]': size === 'large',
              },
            )}
          >
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder={focused ? '' : placeholder}
              spellCheck
              className="outline-none w-full"
              onPaste={(event: React.ClipboardEvent) => {
                event.preventDefault();

                const html = event.clipboardData.getData('text/html');
                const text = event.clipboardData.getData('text/plain');
                const image = event.clipboardData.files?.[0];

                if (image && image.type.startsWith('image/')) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const src = e.target?.result;
                    if (src) {
                      Transforms.insertNodes(editor, {
                        type: 'image',
                        url: src,
                        children: [{ text: '' }],
                      });
                    }
                  };
                  reader.readAsDataURL(image);
                  return;
                }

                if (html) {
                  const fragment = deserializeHTMLFromWord(html);
                  Transforms.insertFragment(editor, fragment);
                  return;
                }

                if (text) {
                  const lines = text.split(/\r?\n/);
                  let currentListType:
                    | 'numbered-list'
                    | 'bulleted-list'
                    | null = null;
                  let listItems: any[] = [];

                  const flushList = () => {
                    if (listItems.length > 0 && currentListType) {
                      Transforms.insertNodes(editor, {
                        type: currentListType,
                        children: listItems,
                      });
                      listItems = [];
                      currentListType = null;
                    }
                  };

                  lines.forEach((line) => {
                    const cleanedLine = (line ?? '')
                      .replace(/\u00A0/g, ' ')
                      .replace(/[\r\n]+/g, ' ')
                      .trim();

                    // cek link/email
                    const isUrl = /^https?:\/\/[^\s]+$/i.test(cleanedLine);
                    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(
                      cleanedLine,
                    );

                    if (isUrl || isEmail) {
                      flushList();
                      const url = isEmail
                        ? `mailto:${cleanedLine}`
                        : cleanedLine;
                      Transforms.insertNodes(editor, {
                        type: 'link',
                        url,
                        children: [{ text: cleanedLine }],
                      });
                      return;
                    }

                    // cek list
                    let listType: 'numbered-list' | 'bulleted-list' | null =
                      null;
                    let textContent = cleanedLine;

                    if (/^\d+\.\s+/.test(cleanedLine)) {
                      listType = 'numbered-list';
                      textContent = cleanedLine.replace(/^\d+\.\s+/, '');
                    } else if (/^[-*•]\s+/.test(cleanedLine)) {
                      listType = 'bulleted-list';
                      textContent = cleanedLine.replace(/^[-*•]\s+/, '');
                    }

                    if (listType) {
                      if (currentListType && currentListType !== listType)
                        flushList();
                      currentListType = listType;
                      listItems.push({
                        type: 'list-item',
                        children: [
                          {
                            type: 'paragraph',
                            children: [{ text: textContent }],
                          },
                        ],
                      });
                    } else {
                      flushList();
                      Transforms.insertNodes(editor, {
                        type: 'paragraph',
                        children: [{ text: cleanedLine }],
                      });
                    }
                  });

                  flushList();
                }
              }}
            />
          </div>
        </Slate>

        <InputHelper message={helperMessage} error={isError} size={size} />
      </div>
    </div>
  );
};

export default RichTextField;
