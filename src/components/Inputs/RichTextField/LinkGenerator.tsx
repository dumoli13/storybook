import React from 'react';
import { Popper } from '../../Displays';
import TextField from '../TextField';
import Button from '../Button';
import Icon from '../../Icon';

interface LinkGeneratorProps {
  onSubmit: (url: string, name: string) => void;
}

const LinkGenerator = ({ onSubmit }: LinkGeneratorProps) => {
  const [linkModalOpen, setLinkModalOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const [linkName, setLinkName] = React.useState('');

  const handleSubmit = () => {
    onSubmit(linkUrl, linkName);

    setLinkUrl('');
    setLinkName('');
    setLinkModalOpen(false);
  };

  return (
    <Popper
      offset={8}
      placement="bottom-left"
      open={linkModalOpen}
      onOpen={setLinkModalOpen}
      content={
        <div
          className="bg-neutral-10 p-2 rounded shadow-md z-50 flex flex-col gap-2 w-64"
          onClick={(e) => e.stopPropagation()}
        >
          <TextField
            labelPosition="top"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={setLinkUrl}
            size="default"
          />
          <TextField
            labelPosition="top"
            placeholder="Enter Link Name"
            value={linkName}
            onChange={setLinkName}
            size="default"
          />
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              size="small"
              disabled={!linkUrl}
            >
              Insert
            </Button>
          </div>
        </div>
      }
    >
      <div className="shrink-0 w-8 h-8 flex items-center justify-center hover:border border-neutral-40 rounded-md">
        <Icon
          name="link"
          onClick={() => setLinkModalOpen(true)}
        />
      </div>

    </Popper>
  );
};

export default LinkGenerator;
