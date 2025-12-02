
import React from 'react';

const NumberInput: React.FC<{ label: string; value: number; onChange: (value: number) => void; max?: number; disabled?: boolean; id: string }> = ({ label, value, onChange, max = 4, disabled = false, id }) => (
    <div className={disabled ? 'opacity-50' : ''}>
        <label id={`label-${id}`} className="block text-xs font-medium text-stone-600 mb-0.5">{label}</label>
        <div className="flex items-center gap-1.5">
            <button aria-label={`Decrement ${label}`} disabled={disabled} onClick={() => onChange(Math.max(0, value - 1))} className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors disabled:cursor-not-allowed">-</button>
            <span aria-live="polite" className="w-6 text-center font-semibold text-sm">{value}</span>
            <button aria-label={`Increment ${label}`} disabled={disabled} onClick={() => onChange(Math.min(max, value + 1))} className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors disabled:cursor-not-allowed">+</button>
        </div>
    </div>
);

export default NumberInput;
