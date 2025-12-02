import React from 'react';

const Toggle: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void; disabled?: boolean; id: string; }> = ({ label, enabled, onChange, disabled = false, id }) => (
    <div className="flex items-center justify-between">
        <span id={`label-${id}`} className={`text-xs font-medium transition-colors ${disabled ? 'text-stone-400' : 'text-stone-700'}`}>{label}</span>
        <button
          id={id}
          role="switch"
          aria-checked={enabled}
          aria-labelledby={`label-${id}`}
          onClick={() => !disabled && onChange(!enabled)}
          className={`relative inline-flex items-center h-4 rounded-full w-8 transition-colors ${enabled ? 'bg-green-900' : 'bg-stone-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={disabled}
        >
            <span className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-[1.125rem]' : 'translate-x-0.5'}`} />
        </button>
    </div>
);

export default Toggle;