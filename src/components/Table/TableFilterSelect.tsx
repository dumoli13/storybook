import React from 'react';
import cx from 'classnames';
import { SelectRef, SelectValue } from '../../types';
import Popper from '../Displays/Popper';
import Icon from '../Icon';
import AutoComplete from '../Inputs/AutoComplete';
import IconButton from '../Inputs/IconButton';
import Select from '../Inputs/Select';
import { TableFilterSelectProps } from '../../types/table/tableFilterSelect';

const TableFilterSelect = <T, D>({
  type,
  value,
  option,
  label,
  onChange,
}: TableFilterSelectProps<T, D>) => {
  const inputRef = React.useRef<SelectRef<T, D>>(null);
  const [open, setOpen] = React.useState(false);

  const handleChange = (value: SelectValue<T, D> | null) => {
    onChange?.(value);
    if (value === null) {
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
        <>
          {type === 'select' && (
            <Select<T, D>
              value={value}
              inputRef={inputRef}
              onChange={handleChange}
              options={option}
              placeholder={`Select ${label}`}
              width={280}
              clearable
            />
          )}
          {type === 'autocomplete' && (
            <AutoComplete<T, D>
              value={value}
              inputRef={inputRef}
              onChange={handleChange}
              options={option}
              placeholder={`Select ${label}`}
              width={280}
              clearable
            />
          )}
        </>
      }
    >
      <IconButton
        icon={
          <Icon
            name="chevron-down"
            size={16}
            className={cx({
              'text-primary-main dark:text-primary-main-dark': value,
            })}
          />
        }
        variant="outlined"
        className={cx({
          'border-primary-main dark:border-primary-main-dark bg-primary-surface dark:bg-primary-surface-dark':
            value,
        })}
        title="Search by Option"
        size="small"
      />
    </Popper>
  );
};

export default TableFilterSelect;
