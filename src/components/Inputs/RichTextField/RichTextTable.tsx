import { useSlate } from "slate-react";
import { Transforms } from "slate";
import Icon from "../../Icon";
import RichTextToolbarButton from "./RichTextToolbarButton";

const RichTextTable = () => {
  const editor = useSlate();

  const insertTable = () => {
    Transforms.insertNodes(editor, {
      type: "table",
      children: [
        {
          type: "table-row",
          children: [
            { type: "table-cell", children: [{ text: "Cell 1" }] },
            { type: "table-cell", children: [{ text: "Cell 2" }] },
          ],
        },
        {
          type: "table-row",
          children: [
            { type: "table-cell", children: [{ text: "Cell 3" }] },
            { type: "table-cell", children: [{ text: "Cell 4" }] },
          ],
        },
      ],
    });
  };

  return (
    <RichTextToolbarButton onMouseDown={insertTable}>
      <Icon
        name="table-cells"
        size={20}
        className="text-neutral-100 dark:text-neutral-100-dark"
      />
    </RichTextToolbarButton>
  );
};

export default RichTextTable;
