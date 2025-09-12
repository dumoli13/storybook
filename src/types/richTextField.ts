export type LIST_TYPES = "numbered-list" | "bulleted-list";

export type TEXT_TAG =
  | "paragraph"
  | "heading-one"
  | "heading-two"
  | "heading-three"
  | "heading-four"
  | "heading-five"
  | "heading-six"
  | "block-quote";

export type RICH_ELEMENT_TYPE =
  | LIST_TYPES
  | TEXT_TAG
  | "list-item"
  | "link"
  | "image";
