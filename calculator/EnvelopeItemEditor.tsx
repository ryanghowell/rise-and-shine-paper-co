import React, { useMemo, useState, useEffect } from 'react';
import { EnvelopeItem, EnvelopeQuoteOptions, ReturnAddressPrinting, SuiteItem, QuoteOptions } from './types';
import { SIZES, EnvelopeSizeKey, ENVELOPE_DETAILS } from './config';
import SectionHeader from './SectionHeader';
import Toggle from './Toggle';
import { formatCurrency } from './utils';

const ENVELOPE_DIMENSIONS: Record<EnvelopeSizeKey, { width: number, height: number }> = {
    'a9': { width: 8.75, height: 5.75 },
    'a7': { width: 7.25, height: 5.25 },
    'a6': { width: 6.5, height: 4.75 },
    'a2': { width: 5.625, height: 4.375 },
    'four_bar': { width: 5.125, height: 3.625 },
    'square_5_25': { width: 5.5, height: 5.5 },
};

const MAX_PREVIEW_WIDTH_PX = 240;
const MAX_ENVELOPE_WIDTH_IN = Math.max(...Object.values(ENVELOPE_DIMENSIONS).map(d => d.width));

const EnvelopePreview: React.FC<{ options: EnvelopeQuoteOptions }> = ({ options }) => {
    const { size } = options;

    const previewData = useMemo(() => {
        const dims = ENVELOPE_DIMENSIONS[size] ?? { width: 4, height: 3 };
        const aspectRatio = dims.width / dims.height;
        const relativeWidth = dims.width / MAX_ENVELOPE_WIDTH_IN;
        const displayWidth = relativeWidth * MAX_PREVIEW_WIDTH_PX;
        return { aspectRatio, displayWidth };
    }, [size]);
    
    const envelopeDetails = ENVELOPE_DETAILS[options.size];

    return (
        <div className="sticky top-4 flex flex-col items-center justify-center p-1">
             <div
                className="transition-all duration-300"
                style={{ 
                    aspectRatio: previewData.aspectRatio,
                    width: `${previewData.displayWidth}px`,
                    maxWidth: '100%',
                }}
            >
                <div
                    className="relative w-full h-full bg-white rounded-md shadow-md border border-stone-200/50"
                >
                    <svg viewBox="0 0 100 75" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                        <defs>
                            <filter id="flap-shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="0.5" stdDeviation="0.5" floodColor="#000" floodOpacity="0.1"/>
                            </filter>
                        </defs>
                        {/* The Euro Flap, a deep V-shape with a rounded tip. The stroke defines the edge, and a filter adds a subtle shadow to lift it from the envelope body. */}
                        <path d="M 0 1 L 100 1 L 55 60 Q 50 67 45 60 Z" className="fill-white stroke-stone-300/90" strokeWidth="0.5" filter="url(#flap-shadow)" />
                    </svg>
                </div>
            </div>
             <div className="text-center mt-2">
                <p className="font-medium text-xs text-stone-700">{envelopeDetails.name}</p>
                <p className="text-[10px] text-stone-500">{options.type === 'double' ? "Double Envelope Set" : "Single Envelope"}</p>
            </div>
        </div>
    );
};

const EnvelopeItemEditorComponent: React.FC<{
    item: EnvelopeItem;
    onUpdate: (id: number, update: Partial<SuiteItem> | { options: Partial<QuoteOptions> | Partial<EnvelopeQuoteOptions> }) => void;
    onRemove: (id: number) => void;
    itemTotal: number;
}> = ({ item, onUpdate, onRemove, itemTotal }) => {
    const { id, name, options } = item;
    const [quantityInput, setQuantityInput] = useState(options.quantity.toString());
    const [isQuantityFocused, setIsQuantityFocused] = useState(false);

    useEffect(() => {
        // Sync local state with parent prop, but only if the input is not focused.
        // This prevents the user's input (like an empty string) from being overwritten
        // while they are still typing.
        if (!isQuantityFocused) {
            setQuantityInput(options.quantity.toString());
        }
    }, [options.quantity, isQuantityFocused]);


    const onOptionChange = <K extends keyof EnvelopeQuoteOptions>(key: K, value: EnvelopeQuoteOptions[K]) => {
        onUpdate(id, { options: { ...options, [key]: value } });
    };

    React.useEffect(() => {
        const newOptions: Partial<EnvelopeQuoteOptions> = {};
        let changesMade = false;

        const isDoubleAvailable = ['a7', 'a9'].includes(options.size);
        if (!isDoubleAvailable && options.type === 'double') {
            newOptions.type = 'single';
            changesMade = true;
        }
        
        if(options.type !== 'double' && options.innerGuestAddressing) {
            newOptions.innerGuestAddressing = false;
            changesMade = true;
        }

        if (options.returnAddressLocation === 'front' && !(options.size === 'a2' || options.size === 'four_bar')) {
            newOptions.returnAddressLocation = 'back';
            changesMade = true;
        }
        
        const isGuestAddressingAvailable = ['a6', 'a7', 'a9', 'square_5_25'].includes(options.size);
        if (!isGuestAddressingAvailable) {
            if(options.guestAddressing) {
                newOptions.guestAddressing = false;
                changesMade = true;
            }
            if(options.innerGuestAddressing) {
                newOptions.innerGuestAddressing = false;
                changesMade = true;
            }
        }
        
        if (changesMade) {
            onUpdate(id, { options: newOptions });
        }
    }, [id, options, onUpdate]);
    
    const availableEnvelopeSizes = useMemo(() => {
        return (Object.keys(SIZES) as EnvelopeSizeKey[]).filter(key => ['four_bar', 'a2', 'a6', 'a7', 'a9', 'square_5_25'].includes(key));
    }, []);

    const isDoubleAvailable = ['a7', 'a9'].includes(options.size);
    const isGuestAddressingAvailable = ['a6', 'a7', 'a9', 'square_5_25'].includes(options.size);

    return (
        <div className="bg-white rounded-lg shadow p-3 space-y-2 relative">
            <div className="flex justify-between items-center gap-4">
                <div className="relative group flex-grow">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => onUpdate(id, { name: e.target.value })}
                        className="text-lg font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-900 p-1 w-full pr-8 transition-colors"
                        aria-label="Item Name"
                    />
                     <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none opacity-30 group-hover:opacity-70 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <button onClick={() => onRemove(id)} aria-label={`Remove ${name}`} className="text-stone-400 hover:text-red-500 transition-colors shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                 <div className="hidden md:block">
                    <EnvelopePreview options={options}/>
                </div>

                <div className="space-y-4">
                    <div>
                        <SectionHeader title="Quantity" />
                        <div className="px-1">
                            <input
                                type="range"
                                min="25"
                                max="1000"
                                step="1"
                                value={options.quantity}
                                onChange={(e) => onOptionChange('quantity', parseInt(e.target.value, 10))}
                                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-green-900"
                                aria-label="Quantity"
                            />
                            <div className="flex justify-between text-xs text-stone-500 mt-1">
                                <span>25</span>
                                <span>1000</span>
                            </div>
                            <div className="text-center mt-2 flex justify-center items-baseline text-lg font-bold text-green-900" aria-live="polite" aria-atomic="true">
                                <input
                                    type="number"
                                    id={`quantity-input-${id}`}
                                    value={quantityInput}
                                    onFocus={() => setIsQuantityFocused(true)}
                                    onChange={(e) => {
                                        setQuantityInput(e.target.value);
                                        const val = parseInt(e.target.value, 10);
                                        if (!isNaN(val)) {
                                            onOptionChange('quantity', val);
                                        }
                                    }}
                                    onBlur={(e) => {
                                        setIsQuantityFocused(false);
                                        const val = parseInt(e.target.value, 10);
                                        onOptionChange('quantity', Math.max(25, Math.min(1000, val || 25)));
                                    }}
                                    className="w-20 bg-transparent text-center text-green-900 font-bold focus:outline-none focus:bg-stone-100 rounded-md"
                                    min="25"
                                    max="1000"
                                    aria-label="Exact quantity"
                                />
                                <span className="text-sm font-medium text-stone-600 ml-2">sets</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <SectionHeader title="Envelope Options" />
                        <div className="space-y-3">
                            <div>
                                <label htmlFor={`envelope-size-${id}`} className="block text-xs font-medium text-stone-600 mb-1">Envelope Size</label>
                                <select id={`envelope-size-${id}`} value={options.size} onChange={(e) => onOptionChange('size', e.target.value as EnvelopeSizeKey)} className="w-full p-1.5 text-xs border border-stone-300 rounded-md shadow-sm focus:ring-green-900 focus:border-green-900 bg-stone-100">
                                    {availableEnvelopeSizes.map(key => (
                                        <option key={key} value={key}>{`${ENVELOPE_DETAILS[key].name} (for ${SIZES[key].name})`}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <div role="radiogroup" aria-labelledby={`envelope-type-label-${id}`}>
                                    <span id={`envelope-type-label-${id}`} className="block text-xs font-medium text-stone-600 mb-1.5">Envelope Type</span>
                                    <div className="flex gap-2 text-xs">
                                        <button role="radio" aria-checked={options.type === 'single'} onClick={() => onOptionChange('type', 'single')} className={`flex-1 p-1.5 text-center rounded-md border transition-colors ${options.type === 'single' ? 'bg-green-900 text-white border-green-900' : 'bg-white hover:bg-stone-100'}`}>
                                            <span className="font-semibold">Single</span>
                                            <span className="block text-[10px] opacity-80">Outer Envelope</span>
                                        </button>
                                        <button role="radio" aria-checked={options.type === 'double'} onClick={() => onOptionChange('type', 'double')} disabled={!isDoubleAvailable} className={`flex-1 p-1.5 text-center rounded-md border transition-colors ${options.type === 'double' ? 'bg-green-900 text-white border-green-900' : 'bg-white hover:bg-stone-100'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                                            <span className="font-semibold">Double</span>
                                            <span className="block text-[10px] opacity-80">Inner & Outer</span>
                                        </button>
                                    </div>
                                </div>
                                {!isDoubleAvailable && options.size !== 'square_5_25' && <p className="text-xs text-stone-500 mt-1.5 text-center">Double envelopes are only available for A7 and A9 sizes.</p>}
                                {options.size === 'square_5_25' && <p className="text-xs text-stone-500 mt-1.5 text-center">Double envelopes are not available for this size.</p>}
                            </div>

                            <div>
                                <label htmlFor={`return-address-${id}`} className="block text-xs font-medium text-stone-600 mb-1">Return Address Printing</label>
                                <select id={`return-address-${id}`} value={options.returnAddressPrinting} onChange={(e) => onOptionChange('returnAddressPrinting', e.target.value as ReturnAddressPrinting)} className="w-full p-1.5 text-xs border border-stone-300 rounded-md shadow-sm focus:ring-green-900 focus:border-green-900 bg-stone-100">
                                    <option value="none">None</option>
                                    <option value="digital">Digital Printing</option>
                                    <option value="letterpress">Letterpress</option>
                                    <option value="foil">Foil</option>
                                </select>
                                {(options.size === 'a2' || options.size === 'four_bar') && options.returnAddressPrinting !== 'none' && (
                                    <div className="mt-2">
                                        <div role="radiogroup" aria-labelledby={`return-address-location-label-${id}`}>
                                            <span id={`return-address-location-label-${id}`} className="block text-xs font-medium text-stone-600 mb-1.5">Return Address Location</span>
                                            <div className="flex gap-2 text-xs">
                                                <button role="radio" aria-checked={options.returnAddressLocation === 'back'} onClick={() => onOptionChange('returnAddressLocation', 'back')} className={`flex-1 p-1.5 text-center rounded-md border transition-colors ${options.returnAddressLocation === 'back' ? 'bg-green-900 text-white border-green-900' : 'bg-white hover:bg-stone-100'}`}>
                                                    <span className="font-semibold">Back Flap</span>
                                                    <span className="block text-[10px] opacity-80">(Standard)</span>
                                                </button>
                                                <button role="radio" aria-checked={options.returnAddressLocation === 'front'} onClick={() => onOptionChange('returnAddressLocation', 'front')} className={`flex-1 p-1.5 text-center rounded-md border transition-colors ${options.returnAddressLocation === 'front' ? 'bg-green-900 text-white border-green-900' : 'bg-white hover:bg-stone-100'}`}>
                                                    <span className="font-semibold">Front</span>
                                                    <span className="block text-[10px] opacity-80">(for RSVPs)</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Toggle id={`${id}-guest-addressing`} label="Digital Guest Addressing" enabled={options.guestAddressing} onChange={(val) => onOptionChange('guestAddressing', val)} disabled={!isGuestAddressingAvailable} />
                                {options.type === 'double' && (
                                    <div className="pl-6">
                                        <Toggle id={`${id}-inner-guest-addressing`} label="Digital Addressing on Inner" enabled={options.innerGuestAddressing} onChange={(val) => onOptionChange('innerGuestAddressing', val)} disabled={!isGuestAddressingAvailable} />
                                    </div>
                                )}
                                {!isGuestAddressingAvailable && <p className="text-xs text-stone-500 text-center">Guest addressing is available for A6, A7, A9, and Square sizes.</p>}
                            </div>

                            <div className="space-y-2 pt-2 border-t border-stone-200">
                                <Toggle id={`${id}-liner`} label="Add Envelope Liners" enabled={options.liner} onChange={(val) => onOptionChange('liner', val)} />
                                {options.liner && (
                                    <div className="pl-6 pt-1 space-y-2">
                                        <Toggle id={`${id}-liner-assembly`} label="Assemble Liners" enabled={options.linerAssembly} onChange={(val) => onOptionChange('linerAssembly', val)} />
                                        <p className="text-xs text-stone-500">Liners are digitally printed. For letterpress or foil liners, please contact us for a custom quote.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-stone-200 mt-3 pt-2 flex justify-end items-center">
                <div className="flex items-baseline gap-2 w-full justify-end">
                    <span className="text-sm font-semibold text-stone-600">Envelope Total:</span>
                    <span className="text-lg font-bold text-stone-800">{formatCurrency(itemTotal)}</span>
                </div>
            </div>
        </div>
    );
};

const EnvelopeItemEditor = React.memo(EnvelopeItemEditorComponent);
export default EnvelopeItemEditor;