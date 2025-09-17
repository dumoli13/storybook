import React, { CSSProperties } from "react";
import cx from "classnames";
import { Editor, Point, Range, Element, Transforms, createEditor } from "slate";
import type { BaseEditor } from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import type { RenderElementProps, RenderLeafProps } from "slate-react";
import InputHelper from "../InputHelper";
import InputLabel from "../InputLabel";
import RichTextColorPicker from "./RichTextColorPicker";
import RichTextLink from "./RichTextLink";
import RichTextStyleButton from "./RichTextStyleButton";
import { deserializeHTMLFromWord } from "../../../libs/richTextField";
import Icon from "../../Icon";
import AlignButton from "./AlignButton";
import RichTextElement from "./RichTextElement";
import IconButton from "../IconButton";
import RichTextLeaf from "./RichTextLeaf";
import RichTextListButton from "./RichTextListButton";
import {
  LIST_TYPES,
  TABLE_TYPES,
  TEXT_TAG,
} from "../../../types/richTextField";
import RichTextTag from "./RichTextTag";
import RichTextImage from "./RichTextImage";
import RichTextTable from "./RichTextTable";

export interface RichTextfieldRef {
  element: HTMLInputElement | null;
  value: string;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

export type RichTextProps = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  color?: string;
};

export type RichElementDetail =
  | {
      type: TEXT_TAG;
      children: RichTextProps[];
      style?: CSSProperties;
      heading?: never;
      color?: string;
      url?: never;
      title?: never;
      width?: never;
      height?: never;
      align?: "left" | "center" | "right" | "justify";
    }
  | {
      type: LIST_TYPES;
      children: RichElementDetail[];
      heading?: never;
      color?: string;
      url?: never;
      title?: never;
      width?: never;
      height?: never;
      align?: "left" | "center" | "right" | "justify";
    }
  | {
      type: TABLE_TYPES;
      children: RichElementDetail[];
      heading?: never;
      color?: string;
      url?: never;
      title?: never;
      width?: never;
      height?: never;
      align?: "left" | "center" | "right" | "justify";
    }
  | {
      type: "list-item";
      children: RichElementDetail[];
      heading?: RichElementDetail["type"];
      color?: string;
      url?: never;
      title?: never;
      width?: never;
      height?: never;
      align?: "left" | "center" | "right" | "justify";
    }
  | {
      type: "link";
      children: RichTextProps[];
      heading?: never;
      url?: never;
      title?: never;
      width?: never;
      height?: never;
    }
  | {
      type: "image";
      children: RichTextProps[];
      heading?: never;
      url: string;
      title: string;
      width: number;
      height: number;
    };

export interface RichTextRenderElementProps
  extends Omit<RenderElementProps, "element"> {
  element: RichElementDetail;
}

const withLinks = (editor: Editor) => {
  const { isInline } = editor;
  editor.isInline = (element: RichElementDetail) =>
    Element.isElement(element) && element.type === "link"
      ? true
      : isInline(element);
  return editor;
};

const withLists = (editor: Editor) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (...args) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: (element: RichElementDetail) =>
          Element.isElement(element) && element.type === "list-item",
      });

      if (match) {
        const [, path] = match;
        const start = Editor.start(editor, path);

        if (Point.equals(selection.anchor, start)) {
          Transforms.setNodes(editor, {
            type: "paragraph",
            heading: undefined,
          });
          Transforms.unwrapNodes(editor, {
            match: (element: RichElementDetail) =>
              Element.isElement(element) &&
              (element.type === "bulleted-list" ||
                element.type === "numbered-list"),
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

const withImages = (editor: Editor) => {
  const { isVoid } = editor;
  editor.isVoid = (element: RichElementDetail) =>
    Element.isElement(element) && element.type === "image"
      ? true
      : isVoid(element);
  return editor;
};

export interface RichTextFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "size" | "required" | "checked"
  > {
  value?: string;
  defaultValue?: string;
  label?: string;
  labelPosition?: "top" | "left";
  autoHideLabel?: boolean;
  onChange?: (val: string) => void;
  helperText?: React.ReactNode;
  placeholder?: string;
  inputRef?:
    | React.RefObject<RichTextfieldRef | null>
    | React.RefCallback<RichTextfieldRef | null>;
  size?: "default" | "large";
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  width?: number;
}

export const RichTextField = ({
  id,
  name,
  value: valueProp,
  defaultValue,
  label,
  labelPosition = "top",
  autoHideLabel = false,
  onChange,
  className,
  helperText,
  placeholder = "",
  disabled: disabledProp = false,
  inputRef,
  size = "default",
  error: errorProp,
  success: successProp,
  loading = false,
  width,
  ...props
}: RichTextFieldProps) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const elementRef = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<RichElementDetail[]>(
    defaultValue
      ? JSON.parse(defaultValue)
      : [{ type: "paragraph", children: [{ text: "" }] }]
  );

  const isControlled = valueProp !== undefined;
  const value = isControlled
    ? valueProp.toString()
    : JSON.stringify(internalValue);

  const helperMessage =
    errorProp && typeof errorProp === "string" ? errorProp : helperText;
  const isError = !!errorProp;
  const disabled = loading || disabledProp;

  React.useImperativeHandle(inputRef, () => ({
    element: elementRef.current,
    value,
    focus: () => {
      elementRef.current?.focus();
    },
    reset: () => {
      setInternalValue([{ type: "paragraph", children: [{ text: "" }] }]);
    },
    disabled,
  }));

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

  const handleChange = (descendant: RichElementDetail[]) => {
    const newValue = descendant;
    onChange?.(JSON.stringify(newValue));
    if (!isControlled) {
      setInternalValue(descendant);
    }
  };

  const inputId = `textfield-${id || name}-${React.useId()}`;

  const editor = React.useMemo(
    () =>
      withLinks(
        withImages(withLists(withHistory(withReact(createEditor()))))
      ) as unknown as BaseEditor & ReactEditor & HistoryEditor,
    []
  );

  const renderElement = React.useCallback(
    (props: RichTextRenderElementProps) => <RichTextElement {...props} />,
    []
  );

  const renderLeaf = React.useCallback(
    (props: RenderLeafProps) => <RichTextLeaf {...props} />,
    []
  );

  const [expand, setExpand] = React.useState(false);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");
    const image = e.clipboardData.files?.[0];

    console.log("HTML", html);
    console.log("TEXT", text);
    console.log("IMAGE", image);

    if (image?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result;
        if (src) {
          Transforms.insertNodes(editor, {
            type: "image",
            url: src,
            children: [{ text: "" }],
          } as RichElementDetail);
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
      let currentListType: "numbered-list" | "bulleted-list" | null = null;
      let listItems: any[] = [];

      const flushList = () => {
        if (listItems.length > 0 && currentListType) {
          Transforms.insertNodes(editor, {
            type: currentListType,
            children: listItems,
          } as RichElementDetail);
          listItems = [];
          currentListType = null;
        }
      };

      lines.forEach((line) => {
        const cleanedLine = (line ?? "")
          .replace(/\u00A0/g, " ")
          .replace(/[\r\n]+/g, " ")
          .trim();

        // cek link/email
        const isUrl = /^https?:\/\/[^\s]+$/i.test(cleanedLine);
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(cleanedLine);

        if (isUrl || isEmail) {
          flushList();
          const url = isEmail ? `mailto:${cleanedLine}` : cleanedLine;
          Transforms.insertNodes(editor, {
            type: "link",
            url,
            children: [{ text: cleanedLine }],
          } as RichElementDetail);
          return;
        }

        let listType: "numbered-list" | "bulleted-list" | null = null;
        let textContent = cleanedLine;

        if (/^\d+\.\s+/.test(cleanedLine)) {
          listType = "numbered-list";
          textContent = cleanedLine.replace(/^\d+\.\s+/, "");
        } else if (/^[-*•]\s+/.test(cleanedLine)) {
          listType = "bulleted-list";
          textContent = cleanedLine.replace(/^[-*•]\s+/, "");
        }

        if (listType) {
          if (currentListType && currentListType !== listType) flushList();
          currentListType = listType;
          listItems.push({
            type: "list-item",
            children: [
              {
                type: "paragraph",
                children: [{ text: textContent }],
              },
            ],
          });
        } else {
          flushList();
          Transforms.insertNodes(editor, {
            type: "paragraph",
            children: [{ text: cleanedLine }],
          } as RichElementDetail);
        }
      });

      flushList();
    }
  };

  return (
    <div
      className={cx(
        "relative w-full",
        {
          "flex items-center gap-4": labelPosition === "left",
        },
        className
      )}
    >
      {((autoHideLabel && focused) || !autoHideLabel) && label && (
        <InputLabel id={inputId} size={size}>
          {label}
        </InputLabel>
      )}
      <div
        className={cx("relative border rounded-md flex flex-col w-full", {
          "border-danger-main dark:border-danger-main-dark focus:ring-danger-focus dark:focus:ring-danger-focus-dark":
            isError,
          "border-success-main dark:border-success-main-dark focus:ring-success-focus dark:focus:ring-success-focus-dark":
            !isError && successProp,
          "border-neutral-50 dark:border-neutral-50-dark hover:border-primary-hover dark:hover:border-primary-hover-dark focus:ring-primary-main dark:focus:ring-primary-main-dark":
            !isError && !successProp && !disabled,
          "bg-neutral-20 dark:bg-neutral-30-dark cursor-not-allowed text-neutral-60 dark:text-neutral-60-dark":
            disabled,
          "bg-neutral-10 dark:bg-neutral-10-dark shadow-box-3 focus:ring-3 focus:ring-primary-focus focus:!border-primary-main":
            !disabled,
          "ring-3 ring-primary-focus dark:ring-primary-focus-dark !border-primary-main dark:!border-primary-main-dark":
            focused,
        })}
        style={width ? { width } : undefined}
        ref={parentRef}
      >
        <Slate
          editor={editor}
          initialValue={internalValue}
          onChange={handleChange}
        >
          {/* HEADER */}
          <div className="select-none flex items-center justify-between gap-10 p-2 border-b border-neutral-50 dark:border-neutral-50-dark">
            <div className="flex items-center gap-0.5 overflow-x-auto">
              <RichTextTag />
              <div className="h-8 w-0 border-r border-neutral-30 mx-2" />
              <RichTextStyleButton format="bold" icon="bold" />
              <RichTextStyleButton format="italic" icon="italic" />
              <RichTextStyleButton format="underline" icon="underline" />
              <RichTextStyleButton
                format="strikethrough"
                icon="strikethrough"
              />
              <RichTextColorPicker />
              <div className="h-8 w-0 border-r border-neutral-30 mx-2" />
              <RichTextListButton format="bulleted-list" icon="list-bullet" />
              <RichTextListButton format="numbered-list" icon="numbered-list" />
              <div className="h-8 w-0 border-r border-neutral-30 mx-2" />
              <AlignButton align="left" icon="bars-3-bottom-left" />
              <AlignButton align="center" icon="bars-2" />
              <AlignButton align="right" icon="bars-3-bottom-right" />
              <AlignButton align="justify" icon="bars-3" />
              <div className="h-8 w-0 border-r border-neutral-30 mx-2" />
              <RichTextLink />
              <RichTextImage />
              <RichTextTable />
            </div>
            <IconButton
              className="flex-1"
              title={expand ? "Expand" : "Collapse"}
              icon={
                <Icon
                  name={expand ? "arrows-pointing-in" : "arrows-pointing-out"}
                  size={20}
                />
              }
              onClick={() => setExpand((prev) => !prev)}
              variant="outlined"
            />
          </div>

          {/* BODY */}
          <div
            className={cx("flex-1 px-4 overflow-y-auto overflow-x-hidden", {
              "py-[4px]": size === "default",
              "py-[9px]": size === "large",
              "min-h-[25vh] max-h-120": !expand,
              "min-h-[75vh]": expand,
            })}
          >
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder={focused ? "" : placeholder}
              spellCheck
              className="outline-none w-full flex flex-col gap-2"
              onPaste={handlePaste}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
        </Slate>
      </div>
      <InputHelper message={helperMessage} error={isError} size={size} />
    </div>
  );
};

export default RichTextField;
