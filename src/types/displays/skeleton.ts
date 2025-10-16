export interface SkeletonProps {
  width?: number;
  height?: number;
  type?: 'circle' | 'rounded' | 'rect';
}

export interface SkeletonInputProps {
  size?: 'default' | 'large';
  height?: number;
}

export interface SkeletonTableProps {
  column?: number;
  row?: number;
  size?: 'small' | 'default' | 'large';
}
