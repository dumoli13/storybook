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

export type TABLE_TYPES = "table" | "table-row" | "table-cell";

export type RICH_ELEMENT_TYPE =
  | LIST_TYPES
  | TEXT_TAG
  | TABLE_TYPES
  | "list-item"
  | "link"
  | "image";
