import React from 'react';
import { RenderLeafProps } from "slate-react";

const RichTextLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;
    if (leaf.strikethrough) children = <s>{children}</s>;
    if (leaf.code) children = <code>{children}</code>;
    if (leaf.color)
        children = <span style={{ color: leaf.color }}>{children}</span>;
    return <span {...attributes}>{children}</span>;
};

export default RichTextLeaf;