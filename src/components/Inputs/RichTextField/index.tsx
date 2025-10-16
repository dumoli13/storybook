import React from 'react';
import cx from 'classnames';
import { Editor, Point, Range, Element, Transforms, createEditor } from 'slate';
import type { BaseEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import type { RenderElementProps, RenderLeafProps } from 'slate-react';
import RichTextColorPicker from './RichTextColorPicker';
import RichTextLink from './RichTextLink';
import RichTextStyleButton from './RichTextStyleButton';
import { deserializeHTMLFromWord } from '../../../libs/richTextField';
import Icon from '../../Icon';
import AlignButton from './AlignButton';
import RichTextElement from './RichTextElement';
import IconButton from '../IconButton';
import RichTextLeaf from './RichTextLeaf';
import RichTextListButton from './RichTextListButton';
import RichTextTag from './RichTextTag';
import RichTextImage from './RichTextImage';
import RichTextTable from './RichTextTable';
import InputContainer from '../InputContainer';
import { EMAIL_REGEX, URL_REGEX } from '../../../const/regex';

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  color?: string;
  table?: string;
};

interface BaseElement {
  heading?: CustomElement['type'];
  style?: React.CSSProperties;
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
}
export interface TextElement extends BaseElement {
  type:
    | 'heading-one'
    | 'heading-two'
    | 'heading-three'
    | 'heading-four'
    | 'heading-five'
    | 'heading-six'
    | 'paragraph'
    | 'block-quote';
  children: CustomText[];
}
export interface ListItemElement extends BaseElement {
  type: 'list-item';
  children: TextElement[]; // keep list-item children as paragraph(s)
}
export interface ListElement extends BaseElement {
  type: 'bulleted-list' | 'numbered-list';
  children: ListItemElement[];
}

export interface LinkElement extends BaseElement {
  type: 'link';
  link: { hyperlink: string; title?: string };
  children: CustomText[];
}

export interface ImageElement extends BaseElement {
  type: 'image';
  image: {
    url: string;
    title: string;
    hyperlink: string | null;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  };
  children: CustomText[];
}

export interface TableElement extends BaseElement {
  type: 'table' | 'table-row' | 'table-cell';
  children: Descendant[];
  align?: 'left' | 'center' | 'right' | 'justify';
  isHeader?: boolean;
  colspan?: number;
  rowspan?: number;
}

export type CustomElement =
  | TextElement
  | ListElement
  | ListItemElement
  | LinkElement
  | ImageElement
  | TableElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor &
      ReactEditor &
      ReturnType<typeof withHistory> & {
        // optional: add custom helpers if you wrap editor further
      };
    Element: CustomElement;
    Text: CustomText;
  }
}

export interface RichTextfieldRef {
  element: HTMLInputElement | null;
  value: Descendant[];
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

export interface RichTextRenderElementProps
  extends Omit<RenderElementProps, 'element'> {
  element: CustomElement;
}

const Toolbar: React.FC<{ children: React.ReactNode }> = React.memo(
  ({ children }) => {
    return (
      <div className="flex items-center gap-0.5 overflow-x-auto">
        {children}
      </div>
    );
  },
);

// const withLinks = (editor: Editor) => {
//   const { isInline } = editor;
//   editor.isInline = (element: CustomElement) =>
//     Element.isElement(element) && element.type === 'link'
//       ? true
//       : isInline(element);
//   return editor;
// };

// const withLists = (editor: Editor) => {
//   const { deleteBackward } = editor;
//   editor.deleteBackward = (...args) => {
//     const { selection } = editor;
//     if (selection && Range.isCollapsed(selection)) {
//       const [match] = Array.from(
//         Editor.nodes(editor, {
//           match: (element: CustomElement) =>
//             Element.isElement(element) && element.type === 'list-item',
//         }),
//       );

//       if (match) {
//         const [, path] = match;
//         const start = Editor.start(editor, path);

//         if (Point.equals(selection.anchor, start)) {
//           Transforms.setNodes(editor, {
//             type: 'paragraph',
//             heading: undefined,
//           } as CustomElement);

//           Transforms.unwrapNodes(editor, {
//             match: (element: CustomElement) =>
//               Element.isElement(element) &&
//               (element.type === 'bulleted-list' ||
//                 element.type === 'numbered-list'),
//             split: true,
//           });

//           return;
//         }
//       }
//     }
//     deleteBackward(...args);
//   };
//   return editor;
// };

// const withImages = (editor: Editor) => {
//   const { isVoid } = editor;
//   editor.isVoid = (element: CustomElement) =>
//     Element.isElement(element) && element.type === 'image'
//       ? true
//       : isVoid(element);
//   return editor;
// };

export interface RichTextFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'defaultValue'
    | 'initialValue'
    | 'onChange'
    | 'size'
    | 'required'
    | 'checked'
  > {
  value?: Descendant[];
  defaultValue?: Descendant[];
  initialValue?: Descendant[];
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  onChange?: (val: Descendant[]) => void;
  helperText?: React.ReactNode;
  placeholder?: string;
  inputRef?:
    | React.RefObject<RichTextfieldRef | null>
    | React.RefCallback<RichTextfieldRef | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  width?: number;
  required?: boolean;
}

export const RichTextField = ({
  id,
  name,
  value: valueProp,
  defaultValue,
  initialValue = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ],
  label,
  labelPosition = 'top',
  autoHideLabel = false,
  onChange,
  className,
  helperText,
  placeholder = '',
  disabled: disabledProp = false,
  inputRef,
  size = 'default',
  error,
  success,
  loading = false,
  width,
  required,
}: RichTextFieldProps) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const elementRef = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);

  // const parseValue = React.useCallback((raw?: string): Descendant[] => {
  //   if (!raw) return initialValue;
  //   try {
  //     const parsed = JSON.parse(raw);
  //     if (!Array.isArray(parsed)) return initialValue;
  //     return parsed;
  //   } catch {
  //     return initialValue;
  //   }
  // }, []);

  const [internalValue, setInternalValue] = React.useState<Descendant[]>(
    defaultValue || initialValue,
  );

  const isControlled = valueProp !== undefined;
  const value = React.useMemo(
    () => (isControlled ? valueProp : internalValue),
    [isControlled, valueProp, internalValue],
  );

  const disabled = loading || disabledProp;

  React.useImperativeHandle(inputRef, () => ({
    element: elementRef.current,
    value,
    focus: () => elementRef.current?.focus(),
    reset: () => setInternalValue(initialValue),
    disabled,
  }));

  // const editor = React.useMemo(
  //   () =>
  //     withLinks(
  //       withImages(withLists(withHistory(withReact(createEditor())))),
  //     ) as BaseEditor & ReactEditor & HistoryEditor & CustomElement,
  //   [],
  // );

  const [editor] = React.useState(() => {
    const base = withReact(withHistory(createEditor()));
    const origIsInline = base.isInline;
    base.isInline = (element) => {
      if (Element.isElement(element) && element.type === 'link') {
        return true;
      }
      return origIsInline ? origIsInline.call(base, element) : false;
    };

    const origIsVoid = base.isVoid;
    base.isVoid = (element) => {
      if (Element.isElement(element) && element.type === 'image') {
        return true;
      }
      return origIsVoid ? origIsVoid.call(base, element) : false;
    };

    // Improve deleteBackward behavior for lists (as your previous withLists)
    const { deleteBackward } = base;
    base.deleteBackward = (...args) => {
      const { selection } = base;
      if (selection && Range.isCollapsed(selection)) {
        const [match] = Array.from(
          Editor.nodes(base, {
            match: (el) => Element.isElement(el) && el.type === 'list-item',
          }),
        );
        if (match) {
          const [, path] = match;
          const start = Editor.start(base, path);
          if (Point.equals(selection.anchor, start)) {
            Transforms.setNodes(base, { type: 'paragraph' }, { at: path });
            Transforms.unwrapNodes(base, {
              match: (n) =>
                Element.isElement(n) &&
                (n.type === 'bulleted-list' || n.type === 'numbered-list'),
              split: true,
            });
            return;
          }
        }
      }
      return deleteBackward(...args);
    };

    return base;
  });

  const renderElement = React.useCallback(
    (props: RichTextRenderElementProps) => <RichTextElement {...props} />,
    [],
  );

  const renderLeaf = React.useCallback(
    (props: RenderLeafProps) => <RichTextLeaf {...props} />,
    [],
  );

  const handleFocus = () => {
    if (disabled) return;
    setFocused(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget;

    const selectElementContainsTarget =
      parentRef.current?.contains(relatedTarget);
    if (selectElementContainsTarget) {
      return;
    }

    setFocused(false);
  };

  const handleChange = (descendant: Descendant[]) => {
    onChange?.(descendant);
    if (!isControlled) {
      setInternalValue(descendant);
    }
  };

  const inputId = `richtextfield-${id || name}-${React.useId()}`;

  const [expand, setExpand] = React.useState(false);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    const image = e.clipboardData.files?.[0];

    if (html) {
      const fragment = deserializeHTMLFromWord(html);
      if (fragment?.length) {
        Editor.withoutNormalizing(editor, () => {
          Transforms.insertFragment(editor, fragment);
        });
      }
      return;
    }
    if (image?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result;
        if (!src) return;

        const url = reader.result as string;
        const img = new Image();

        img.onload = () => {
          Editor.withoutNormalizing(editor, () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            const resizedHeight = height > 200 ? 200 : height;
            const resizedWidth =
              height > 200 ? Math.ceil((200 / height) * width) : width;

            Transforms.insertNodes(editor, {
              type: 'image',
              image: {
                url,
                title: image.name,
                hyperlink: null,
                width: resizedWidth,
                height: resizedHeight,
                originalWidth: width,
                originalHeight: height,
              },
              children: [{ text: '' }],
            } as CustomElement);
          });
        };
        img.src = url;
      };
      reader.readAsDataURL(image);
      return;
    } else if (text) {
      const lines = text.split(/\r?\n/);
      let currentListType: 'numbered-list' | 'bulleted-list' | null = null;
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

      for (const line of lines) {
        const cleaned = (line ?? '').replace(/\u00A0|[\r\n]+/g, ' ').trim();
        if (!cleaned) {
          flushList();
          // insert newline/empty paragraph
          Transforms.insertNodes(editor, {
            type: 'paragraph',
            children: [{ text: '' }],
          });
          continue;
        }

        const isUrl = URL_REGEX.test(cleaned);
        const isEmail = EMAIL_REGEX.test(cleaned);

        if (isUrl || isEmail) {
          let hyperlink: string = cleaned;
          if (
            isUrl &&
            !/^https?:\/\//i.test(cleaned) &&
            !/^ftp:\/\//i.test(cleaned)
          ) {
            hyperlink = `http://${cleaned}`;
          } else if (isEmail) {
            hyperlink = `mailto:${cleaned}`;
          }
          flushList();
          Transforms.insertNodes(editor, {
            type: 'link',
            link: { hyperlink, title: cleaned },
            children: [{ text: '' }],
          } as CustomElement);
          return;
        }

        let listType: 'numbered-list' | 'bulleted-list' | null = null;
        let textContent = cleaned;

        if (/^\d+\.\s+/.test(cleaned)) {
          listType = 'numbered-list';
          textContent = cleaned.replace(/^\d+\.\s+/, '');
        } else if (/^[-*•]\s+/.test(cleaned)) {
          listType = 'bulleted-list';
          textContent = cleaned.replace(/^[-*•]\s+/, '');
        }

        if (listType) {
          if (currentListType && currentListType !== listType) flushList();
          currentListType = listType;
          listItems.push({
            type: 'list-item',
            children: [
              { type: 'paragraph', children: [{ text: textContent }] },
            ],
          });
        } else {
          flushList();
          Transforms.insertNodes(editor, {
            type: 'paragraph',
            children: [{ text: cleaned }],
          } as CustomElement);
        }
      }

      flushList();
    }
  };

  return (
    <InputContainer
      inputId={inputId}
      label={label}
      labelPosition={labelPosition}
      autoHideLabel={autoHideLabel}
      required={required}
      className={className}
      focused={focused}
      error={error}
      success={success}
      helperText={helperText}
      loading={loading}
      disabled={disabled}
      size={size}
      width={width}
      parentRef={parentRef}
    >
      <Slate
        editor={editor}
        initialValue={internalValue}
        onChange={handleChange}
      >
        {/* HEADER */}
        <div className="select-none flex items-center justify-between gap-10 p-2 border-b border-neutral-50 dark:border-neutral-50-dark">
          <Toolbar>
            <RichTextTag disabled={disabled} />
            <div className="h-8 w-0 border-r border-neutral-30 mx-2" />
            <RichTextStyleButton
              format="bold"
              icon="bold"
              disabled={disabled}
            />
            <RichTextStyleButton
              format="italic"
              icon="italic"
              disabled={disabled}
            />
            <RichTextStyleButton
              format="underline"
              icon="underline"
              disabled={disabled}
            />
            <RichTextStyleButton
              format="strikethrough"
              icon="strikethrough"
              disabled={disabled}
            />
            <RichTextColorPicker disabled={disabled} />
            <div className="h-8 w-0 border-r border-neutral-30 mx-2" />
            <RichTextListButton
              format="bulleted-list"
              icon="list-bullet"
              disabled={disabled}
            />
            <RichTextListButton
              format="numbered-list"
              icon="numbered-list"
              disabled={disabled}
            />
            <div className="h-8 w-0 border-r border-neutral-30 mx-2" />
            <AlignButton
              align="left"
              icon="bars-3-bottom-left"
              disabled={disabled}
            />
            <AlignButton align="center" icon="bars-2" disabled={disabled} />
            <AlignButton
              align="right"
              icon="bars-3-bottom-right"
              disabled={disabled}
            />
            <AlignButton align="justify" icon="bars-3" disabled={disabled} />
            <div className="h-8 w-0 border-r border-neutral-30 mx-2" />
            <RichTextLink disabled={disabled} />
            <RichTextImage disabled={disabled} />
            <RichTextTable disabled={disabled} />
          </Toolbar>
          <IconButton
            className="flex-1"
            title={expand ? 'Expand' : 'Collapse'}
            icon={
              <Icon
                name={expand ? 'arrows-pointing-in' : 'arrows-pointing-out'}
                size={20}
              />
            }
            onClick={() => setExpand((prev) => !prev)}
            variant="outlined"
          />
        </div>

        {/* BODY */}
        <div
          className={cx('flex-1 px-4 overflow-y-auto overflow-x-hidden', {
            'py-[4px]': size === 'default',
            'py-[9px]': size === 'large',
            'min-h-[25vh] max-h-[120px]': !expand,
            'h-[75vh] max-h-[75vh]': expand,
          })}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={focused ? '' : placeholder}
            spellCheck
            className="outline-none"
            onPaste={handlePaste}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
          />
        </div>
      </Slate>
    </InputContainer>
  );
};

export default RichTextField;
