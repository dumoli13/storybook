import React, { useState } from 'react';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';
import IconButton from '../IconButton';
import Icon from '../../Icon';
import Button from '../Button';
import { CustomElement } from '.';
import { Modal } from '../../Modals';
import RichTextToolbarButton from './RichTextToolbarButton';

interface TableOptions {
  rows: number;
  columns: number;
  withHeaderRow: boolean;
}
interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (options: TableOptions) => void;
}

const TableModal: React.FC<TableModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ rows, columns, withHeaderRow });
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            htmlFor="rich-text-table-rows"
          >
            Rows
          </label>
          <input
            id="rich-text-table-rows"
            type="number"
            min="1"
            max="10"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            htmlFor="rich-text-table-columns"
          >
            Columns
          </label>
          <input
            id="rich-text-table-columns"
            type="number"
            min="1"
            max="10"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={withHeaderRow}
              onChange={(e) => setWithHeaderRow(e.target.checked)}
              className="mr-2"
            />
            Include header row
          </label>
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Insert Table
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface RichTextTableProps {
  disabled: boolean;
}

const RichTextTable = ({ disabled }: RichTextTableProps) => {
  const editor = useSlate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const createTable = (options: TableOptions) => {
    const { rows, columns, withHeaderRow } = options;

    const tableRows = [];

    // Create header row if requested
    if (withHeaderRow) {
      const headerCells = Array.from({ length: columns }, (_, i) => ({
        type: 'table-cell' as const,
        isHeader: true,
        children: [{ text: `Header ${i + 1}` }],
      }));
      tableRows.push({
        type: 'table-row' as const,
        isHeader: true,
        children: headerCells,
      });
    }

    // Create data rows
    for (let i = 0; i < rows; i++) {
      const cells = Array.from({ length: columns }, (_, j) => ({
        type: 'table-cell' as const,
        children: [{ text: `Cell ${i + 1}-${j + 1}` }],
      }));
      tableRows.push({
        type: 'table-row' as const,
        children: cells,
      });
    }

    Transforms.insertNodes(editor, {
      type: 'table',
      children: tableRows,
    } as CustomElement);
  };

  return (
    <>
      <RichTextToolbarButton
        onClick={() => setIsModalOpen(true)}
        disabled={disabled}
      >
        <Icon name="table-cells" size={20} />
      </RichTextToolbarButton>
      <TableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={createTable}
      />
    </>
  );
};

export default RichTextTable;
