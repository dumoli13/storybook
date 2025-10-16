export interface TabItem {
  key: string | number;
  label: React.ReactNode;
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
