import React from 'react';
import cx from 'classnames';
import Popper from '../Displays/Popper';
import Icon from '../Icon';
import IconButton from '../Inputs/IconButton';
import TextField, { TextfieldRef } from '../Inputs/TextField';

interface FilterSearchProps {
  value?: string;
  label?: string;
  onChange: (value: string) => void;
}

/**
 * @component FilterSearch
 *
 * A component that provides a search input within a popper dropdown. This component is typically
 * used for filtering or searching functionality, allowing users to enter a keyword and display a
 * filtered result set.
 *
 * @property {string} [value] - The current value of the search input. Used for controlled input behavior.
 * @property {string} [label] - A label for the search input, displayed as part of the placeholder text.
 * @property {(value: string) => void} onChange - Callback function triggered whenever the value of the search input changes.
 *
 */

const FilterSearch = ({ value, label, onChange }: FilterSearchProps) => {
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
      />
    </Popper>
  );
};

export default FilterSearch;
