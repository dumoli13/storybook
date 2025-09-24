import React from 'react';
import cx from 'classnames';
import Popper from '../Displays/Popper';
import Icon from '../Icon';
import IconButton from '../Inputs/IconButton';
import TextField, { TextfieldRef } from '../Inputs/TextField';

export interface TableFilterSearchProps {
  value?: string;
  label?: string;
  onChange: (value: string) => void;
}

const TableFilterSearch = ({
  value,
  label,
  onChange,
}: TableFilterSearchProps) => {
  const inputRef = React.useRef<TextfieldRef>(null);
  const [open, setOpen] = React.useState(false);

  const handleChange = (value: string) => {
    onChange?.(value);
    if (value === '') {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Popper
      open={open}
      onOpen={setOpen}
      className="py-4 px-2"
      content={
        <TextField
          id={`search_${label}`}
          inputRef={inputRef}
          value={value}
          onChange={handleChange}
          placeholder={`Search ${label}`}
          startIcon={<Icon name="magnifying-glass" size={16} />}
          clearable
          width={280}
        />
      }
    >
      <IconButton
        icon={
          <Icon
            name="magnifying-glass"
            size={16}
            className={cx({
              'text-primary-main dark:text-parimary-main-dark': value,
            })}
          />
        }
        variant="outlined"
        className={cx({
          'border-primary-main dark:border-primary-main-dark bg-primary-surface dark:bg-primary-surface-dark':
            value,
        })}
        title="Search by Keyword"
        size="small"
      />
    </Popper>
  );
};

export default TableFilterSearch;
