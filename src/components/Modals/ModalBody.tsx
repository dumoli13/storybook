import React from 'react';

interface ModalBodyProps {
  children: React.ReactNode;
}

const ModalBody = ({ children }: ModalBodyProps) => {
  return (
    <div className="pb-4 px-6 h-full text-neutral-80 dark:text-neutral-90-dark text-14px flex-1 overflow-auto">
      {children}
    </div>
  );
};

export default ModalBody;
