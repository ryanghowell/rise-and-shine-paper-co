
import React from 'react';

const SectionHeader: React.FC<{ title: string; }> = ({ title }) => (
    <h3 className="text-sm font-semibold text-stone-700 mb-2 border-b border-stone-200 pb-1">{title}</h3>
);

export default SectionHeader;
