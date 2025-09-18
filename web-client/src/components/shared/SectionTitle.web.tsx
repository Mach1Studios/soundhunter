import React from 'react';

interface SectionTitleProps {
  label: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ label, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 mb-4 ${className}`}>
      <div className="h-px flex-1 bg-neutral-300" />
      <div className="text-xs tracking-widest uppercase text-neutral-500 font-mono">
        {label}
      </div>
      <div className="h-px flex-1 bg-neutral-300" />
    </div>
  );
};

export default SectionTitle;