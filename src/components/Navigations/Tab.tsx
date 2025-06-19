import React from 'react';
import cx from 'classnames';
import Icon from '../Icon';

export interface TabItem {
  key: string | number;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface TabProps {
  items: TabItem[];
  defaultActiveKey?: string | number;
  activeKey?: string | number;
  onChange?: (key: string | number) => void;
  onTabClick?: (key: string | number) => void;
  onTabClose?: (key: string | number) => void;
}

/**
 * Tabs make it easy to explore and switch between different views.
 */
const Tab = ({
  items,
  defaultActiveKey,
  activeKey: propActiveKey,
  onChange,
  onTabClick,
  onTabClose,
}: TabProps) => {
  const [activeKey, setActiveKey] = React.useState(
    propActiveKey ?? defaultActiveKey ?? items[0]?.key,
  );

  // Sync internal state with prop changes
  React.useEffect(() => {
    if (propActiveKey !== undefined) {
      setActiveKey(propActiveKey);
    }
  }, [propActiveKey]);

  const handleTabClick = (key: string | number) => {
    if (propActiveKey === undefined) {
      setActiveKey(key);
    }
    onTabClick?.(key);
    onChange?.(key);
  };

  const handleClose = (key: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    onTabClose?.(key);
  };

  const activeTab = React.useMemo(
    () => items.find((tab) => tab.key === activeKey) || items[0],
    [activeKey],
  );

  const closeable = React.useMemo(() => !!onTabClose, [onTabClose]);

  return (
    <div className="flex flex-col">
      {/* Tab Headers */}
      <div className="flex gap-1" role="tablist">
        {items.map((tab) => {
          const isActive = activeKey === tab.key;

          return isActive ? (
            <div
              key={tab.key}
              role="none"
              className={cx(
                'text-14px font-bold flex items-center gap-2 border rounded-md px-4 py-2 cursor-default',
                'text-primary-main bg-primary-surface border-primary-surface',
                'dark:text-primary-main-dark dark:bg-primary-surface-dark dark:border-primary-surface-dark',
              )}
            >
              <div role="tab">{tab.label}</div>
              {closeable && (
                <Icon
                  name="x-mark"
                  size={16}
                  onClick={(e) => handleClose(tab.key, e)}
                  aria-label={`Close ${tab.label}`}
                  className="text-neutral-60 dark:text-neutral-60-dark"
                  strokeWidth={1}
                />
              )}
            </div>
          ) : (
            <div
              key={tab.key}
              role="none"
              className={cx(
                'text-14px font-bold flex items-center gap-2 border rounded-md px-4 py-2 cursor-pointer',
                'bg-neutral-15 dark:bg-neutral-20-dark border-neutral-40 dark:border-neutral-40-dark',
                {
                  'text-neutral-90 dark:text-neutral-100-dark hover:bg-primary-hover dark:hover:bg-primary-hover-dark hover:text-neutral-10 dark:hover:text-neutral-10-dark':
                    !tab.disabled,
                  'text-neutral-40 dark:text-neutral-40-dark ': tab.disabled,
                },
              )}
              onClick={() => handleTabClick(tab.key)}
            >
              <div role="tab">{tab.label}</div>
              {closeable && (
                <Icon
                  name="x-mark"
                  size={16}
                  onClick={(e) => handleClose(tab.key, e)}
                  aria-label={`Close ${tab.label}`}
                  className="text-neutral-60 dark:text-neutral-60-dark"
                  strokeWidth={1}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Tab Content */}
      <div
        className="p-4"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab.key}`}
        id={`tabpanel-${activeTab.key}`}
      >
        {activeTab?.children || (
          <div className="text-gray-500">No content available</div>
        )}
      </div>
    </div>
  );
};

export default Tab;
