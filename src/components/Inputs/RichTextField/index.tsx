import React from "react";
import cx from "classnames";
import { Editor, Point, Range, Element, Transforms, createEditor } from "slate";
import type { BaseEditor, Node } from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, useSlate, withReact } from "slate-react";
import type { RenderElementProps, RenderLeafProps } from "slate-react";
import InputHelper from "../InputHelper";
import InputLabel from "../InputLabel";
import ColorPicker from "./ColorPicker";
import LinkGenerator from "./LinkGenerator";
import MarkButton from "./MarkButton";
import { deserializeHTMLFromWord } from "../../../libs/richTextField";
import AutoComplete from "../AutoComplete";
import Icon, { IconNames } from "../../Icon";
import AlignButton from "./AlignButton";
import RichTextToolbarButton from "./RichTextToolbarButton";
import RichTextElement from "./RichTextElement";
import IconButton from "../IconButton";
import RichTextLeaf from "./RichTextLeaf";
import BlockButton from "./BlockButton";
import { LIST_TYPES, TEXT_TAG } from "../../../types/richTextField";
import HeadingDropdown from "./HeadingDropdown";

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
      color?: string;
      align?: "left" | "center" | "right" | "justify";
    }
  | {
      type: LIST_TYPES;
      children: RichElementDetail[];
      color?: string;
      align?: "left" | "center" | "right" | "justify";
    }
  | {
      type: "list-item";
      children: RichElementDetail[];
      heading?: RichElementDetail["type"];
      color?: string;
      align?: "left" | "center" | "right" | "justify";
    }
  | { type: "link"; url: string; children: RichTextProps[] }
  | { type: "image"; url: string; children: RichTextProps[] };

// export const LIST_TYPES: RichElementDetail["type"][] = [
//   "numbered-list",
//   "bulleted-list",
// ];

const isBlockActive = (editor: Editor, format: RichElementDetail["type"]) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => {
      if (!Element.isElement(n)) return false;

      if (n.type === format) return true;

      if (n.type === "list-item" && (n as any).heading === format) return true;

      return false;
    },
  });

  console.log("isBlockActive match", match);

  return !!match;
};

const withLists = (editor: Editor) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (...args) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: (n) => Element.isElement(n) && n.type === "list-item",
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
            match: (n) =>
              Element.isElement(n) &&
              (n.type === "bulleted-list" || n.type === "numbered-list"),
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

function toggleBlock(editor: Editor, format: RichElementDetail["type"]) {
  const isList = format === "bulleted-list" || format === "numbered-list";
  console.log("toggleBlock", isList, format);

  const [matchListItem] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === "list-item",
  });

  if (isList) {
    const [parentList] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === format,
    });
    const isActive = !!parentList;

    if (isActive) {
      for (const [node, path] of Editor.nodes(editor, {
        match: (n) => Element.isElement(n) && n.type === "list-item",
      })) {
        const li = node as any;
        const newType = li.heading ?? "paragraph";

        Transforms.setNodes(
          editor,
          { type: newType, heading: undefined },
          { at: path }
        );
      }

      Transforms.unwrapNodes(editor, {
        match: (n) =>
          Element.isElement(n) &&
          (n.type === "bulleted-list" || n.type === "numbered-list"),
        split: true,
      });

      for (const [node, path] of Editor.nodes(editor, {
        at: [],
        match: (n) =>
          Element.isElement(n) &&
          (n.type === "bulleted-list" || n.type === "numbered-list") &&
          Editor.isEmpty(editor, n),
      })) {
        Transforms.removeNodes(editor, { at: path });
      }
    } else {
      const [match] = Editor.nodes(editor, {
        match: (n) =>
          Element.isElement(n) &&
          [
            "paragraph",
            "heading-one",
            "heading-two",
            "heading-three",
            "heading-four",
            "heading-five",
            "heading-six",
          ].includes(n.type),
      });
      const currentHeading = match ? (match[0] as any).type : undefined;

      Transforms.setNodes(
        editor,
        { type: "list-item", heading: currentHeading },
        {
          match: (n) =>
            Element.isElement(n) &&
            [
              "paragraph",
              "heading-one",
              "heading-two",
              "heading-three",
              "heading-four",
              "heading-five",
              "heading-six",
            ].includes(n.type),
        }
      );

      Transforms.unwrapNodes(editor, {
        match: (n) =>
          Element.isElement(n) &&
          (n.type === "bulleted-list" || n.type === "numbered-list"),
        split: true,
      });

      Transforms.wrapNodes(
        editor,
        { type: format, children: [] } as RichElementDetail,
        { match: (n) => Element.isElement(n) && n.type === "list-item" }
      );
    }
  } else {
    const isActive = isBlockActive(editor, format);

    if (matchListItem && format.startsWith("heading")) {
      Transforms.setNodes(editor, { heading: format } as any, {
        match: (n) => Element.isElement(n) && n.type === "list-item",
      });
    } else {
      Transforms.setNodes(
        editor,
        { type: isActive ? "paragraph" : format },
        {
          match: (n) =>
            Element.isElement(n) &&
            [
              "paragraph",
              "heading-one",
              "heading-two",
              "heading-three",
              "heading-four",
              "heading-five",
              "heading-six",
              "block-quote",
            ].includes(n.type),
          split: true,
        }
      );
    }
  }
}

// const HeadingDropdown: React.FC = () => {
//   const editor = useSlate();

//   const headings = [
//     { label: "Heading 1", value: "heading-one" },
//     { label: "Heading 2", value: "heading-two" },
//     { label: "Heading 3", value: "heading-three" },
//     { label: "Heading 4", value: "heading-four" },
//     { label: "Heading 5", value: "heading-five" },
//     { label: "Heading 6", value: "heading-six" },
//     { label: "Normal", value: "paragraph" },
//   ];

//   const [value, setValue] = React.useState(headings[6]);

//   React.useEffect(() => {
//     if (!editor.selection) return;

//     const [match] = Editor.nodes(editor, {
//       match: (n) => Element.isElement(n) && "type" in n,
//     });

//     const type = match ? (match[0] as any).type : "paragraph";
//     const headingOption = headings.find((h) => h.value === type) || headings[6];
//     setValue(headingOption);
//   }, [editor.selection]);

//   return (
//     <AutoComplete
//       placeholder="Select heading..."
//       options={headings}
//       value={value}
//       onChange={(selected) => {
//         if (selected) {
//           setValue(selected);
//           toggleBlock(editor, selected.value as any);
//         }
//       }}
//       size="default"
//       className="shrink-0 w-40"
//     />
//   );
// };

const withLinks = (editor: Editor) => {
  const { isInline } = editor;
  editor.isInline = (element) =>
    Element.isElement(element) && element.type === "link"
      ? true
      : isInline(element);
  return editor;
};

const withImages = (editor: Editor) => {
  const { isVoid } = editor;
  editor.isVoid = (element) =>
    Element.isElement(element) && element.type === "image"
      ? true
      : isVoid(element);
  return editor;
};

const InsertImageFromFile = (editor: Editor) => (e: React.MouseEvent) => {
  e.preventDefault();

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = () => {
    if (input.files?.[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        Transforms.insertNodes(editor, {
          type: "image",
          url,
          children: [{ text: "" }],
        });
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
};

export interface RichTextFieldProps {
  name?: string;
  label?: string;
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  helperMessage?: string;
  fullWidth?: boolean;
  isError?: boolean;
  successProp?: boolean;
  size?: "default" | "large";
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
  size = "default",
  width,
  disabled,
  focused,
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const editor = React.useMemo(
    () =>
      withLinks(
        withImages(withLists(withHistory(withReact(createEditor()))))
      ) as unknown as BaseEditor & ReactEditor & HistoryEditor,
    []
  );

  const renderElement = React.useCallback(
    (props: RenderElementProps) => <RichTextElement {...props} />,
    []
  );

  const renderLeaf = React.useCallback(
    (props: RenderLeafProps) => <RichTextLeaf {...props} />,
    []
  );

  const [expand, setExpand] = React.useState(false);

  const handleConfirmLink = (url: string, name: string) => {
    const { selection } = editor;
    if (!selection) return;
    const isCollapsed = Range.isCollapsed(selection);

    if (!isCollapsed) {
      Transforms.wrapNodes(
        editor,
        { type: "link", url: url, children: [] },
        { split: true, at: selection }
      );
      Transforms.collapse(editor, { edge: "end" });
      Transforms.insertText(editor, " ");
    } else {
      const linkNode: Node = {
        type: "link",
        url: url,
        children: [{ text: name || url }],
      };
      Transforms.insertNodes(editor, linkNode);
      const { selection: newSel } = editor;
      if (newSel) {
        Transforms.move(editor, { distance: 1, unit: "offset" });
      }
      Transforms.insertText(editor, " ");
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");
    const image = e.clipboardData.files?.[0];

    if (image?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result;
        if (src) {
          Transforms.insertNodes(editor, {
            type: "image",
            url: src,
            children: [{ text: "" }],
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
      let currentListType: "numbered-list" | "bulleted-list" | null = null;
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
          });
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
          });
        }
      });

      flushList();
    }
  };

  return (
    <div>
      {label && <InputLabel size={size}>{label}</InputLabel>}
      <div
        className={cx("relative border rounded-md flex flex-col", {
          "w-full": fullWidth,
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
          initialValue={
            value
              ? JSON.parse(value)
              : [{ type: "paragraph", children: [{ text: "" }] }]
          }
          onChange={(v) => onChange?.(JSON.stringify(v))}
        >
          <div className="select-none flex items-center justify-between gap-10 p-2 border-b border-neutral-50 dark:border-neutral-50-dark">
            <div className="flex items-center gap-0.5 overflow-x-auto">
              <HeadingDropdown />
              <div className="h-8 w-0 border-r border-neutral-30 mx-2" />
              <MarkButton format="bold" icon="bold" />
              <MarkButton format="italic" icon="italic" />
              <MarkButton format="underline" icon="underline" />
              <MarkButton format="strikethrough" icon="strikethrough" />
              <ColorPicker />
              <div className="h-8 w-0 border-r border-neutral-30 mx-2" />
              <BlockButton format="bulleted-list" icon="list-bullet" />
              <BlockButton format="numbered-list" icon="numbered-list" />
              <div className="h-8 w-0 border-r border-neutral-30 mx-2" />
              <AlignButton align="left" icon="bars-3-bottom-left" />
              <AlignButton align="center" icon="bars-2" />
              <AlignButton align="right" icon="bars-3-bottom-right" />
              <AlignButton align="justify" icon="bars-3" />
              <div className="h-8 w-0 border-r border-neutral-30 mx-2" />
              <LinkGenerator onSubmit={handleConfirmLink} />
              <RichTextToolbarButton onMouseDown={InsertImageFromFile(editor)}>
                <Icon name="photo" size={20} />
              </RichTextToolbarButton>
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
              className="outline-none w-full flex flex-col gap-2 h-full"
              onPaste={handlePaste}
            />
          </div>
        </Slate>
        <InputHelper message={helperMessage} error={isError} size={size} />
      </div>
    </div>
  );
};

export default RichTextField;
