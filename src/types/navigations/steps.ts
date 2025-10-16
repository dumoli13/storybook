export interface StepProps {
  active: number;
  items: Array<{
    title: string;
    description?: string;
    error?: boolean;
    success?: boolean;
    available?: boolean;
    progress?: number;
  }>;
  onChange?: (index: number) => void;
  disabled?: boolean;
}
