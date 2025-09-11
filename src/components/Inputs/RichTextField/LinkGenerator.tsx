import { useState } from 'react';
import { Button, Icon, Popper, TextField } from 'mis-design';

interface LinkGeneratorProps {
  onSubmit: (url: string, name: string) => void;
}

const LinkGenerator = ({ onSubmit }: LinkGeneratorProps) => {
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');

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
              onClick={() => setLinkModalOpen(false)}
              variant="outlined"
              color="danger"
              size="small"
            >
              Cancel
            </Button>
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
      <Icon
        name="link"
        className="cursor-pointer p-2 "
        onClick={() => setLinkModalOpen(true)}
      />
    </Popper>
  );
};

export default LinkGenerator;
