import React, { useMemo, useEffect, useState } from 'react';
import { CardItem, QuoteOptions, DieCutType, EnvelopeQuoteOptions, SuiteItem } from './types';
import { SIZES, PaperKey, SizeKey, INITIAL_PAPER_COSTS } from './config';
import { CardPreview } from './CardPreview';
import SectionHeader from './SectionHeader';
import NumberInput from './NumberInput';
import Toggle from './Toggle';
import { formatCurrency } from './utils';

const CardEditorComponent: React.FC<{ 
    card: CardItem;
    cardIndex: number;
    onUpdate: (id: number, update: Partial<SuiteItem> | { options: Partial<QuoteOptions> | Partial<EnvelopeQuoteOptions> }) => void; 
    onRemove: (id: number) => void; 
    cardTotal: number; 
    paperCosts: typeof INITIAL_PAPER_COSTS;
    allowedSizes: SizeKey[];
    allowedPapers: PaperKey[];
}> = ({ card, cardIndex, onUpdate, onRemove, cardTotal, paperCosts, allowedSizes, allowedPapers }) => {
    const { id, name, options } = card;
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


    const onOptionChange = <K extends keyof QuoteOptions>(key: K, value: QuoteOptions[K]) => {
        const newOptions: Partial<QuoteOptions> = { [key]: value };
        // Enforce mutual exclusivity
        if (key === 'dieCut' && value !== 'none') {
            newOptions.edgePaint = false;
        }
        if (key === 'edgePaint' && value === true) {
            newOptions.dieCut = 'none';
        }
        onUpdate(id, { options: newOptions });
    };

    const isFoldingCard = options.size.endsWith('f');
    const isHandmadePaper = options.paper === 'handmade';
    const noPrintingSelected = options.inkColorsFront === 0 && options.foilColorsFront === 0 && !options.digitalPrintingFront && !options.blindDebossFront && !options.blindEmbossFront && options.inkColorsBack === 0 && options.foilColorsBack === 0 && !options.digitalPrintingBack && !options.blindDebossBack && !options.blindEmbossBack;
    
    const isBackPressurePrintingDisabled = isHandmadePaper || (!isFoldingCard && options.paperWeight !== 220);
    
    const frontLabel = isFoldingCard ? "Outside Panels (Front & Back)" : "Front Side";
    const backLabel = isFoldingCard ? "Inside Panel (Right Side Only)" : "Back Side";

    const isFoldOverBusinessCard = useMemo(() => {
        const hasBackPressurePrinting = options.inkColorsBack > 0 || options.foilColorsBack > 0 || options.blindDebossBack || options.blindEmbossBack;
        return options.size === 'business_card' && 
               options.paperWeight === 220 &&
               !isHandmadePaper &&
               !isFoldingCard &&
               (hasBackPressurePrinting || options.digitalPrintingBack);
    }, [options.size, options.paperWeight, options.inkColorsBack, options.foilColorsBack, options.blindDebossBack, options.blindEmbossBack, options.digitalPrintingBack, isHandmadePaper, isFoldingCard]);

    // Effect to enforce paper thickness rules
    useEffect(() => {
        let changesMade = false;
        const newOptions: Partial<QuoteOptions> = {};

        if (isFoldingCard && options.paperWeight === 220) {
            newOptions.paperWeight = 110;
            changesMade = true;
        }

        if (isHandmadePaper && isFoldingCard) {
            newOptions.paper = 'lettra_pearl';
            changesMade = true;
        }

        if (options.edgePaint && (options.paperWeight !== 220 || isHandmadePaper)) {
            newOptions.edgePaint = false;
            changesMade = true;
        }
        
        if (isBackPressurePrintingDisabled) {
            if (options.inkColorsBack > 0) {
                newOptions.inkColorsBack = 0;
                changesMade = true;
            }
            if (options.foilColorsBack > 0) {
                newOptions.foilColorsBack = 0;
                changesMade = true;
            }
            if (options.blindDebossBack) {
                newOptions.blindDebossBack = false;
                changesMade = true;
            }
            if (options.blindEmbossBack) {
                newOptions.blindEmbossBack = false;
                changesMade = true;
            }
        }

        // Reset back-side digital printing if on handmade paper
        if (isHandmadePaper && options.digitalPrintingBack) {
            newOptions.digitalPrintingBack = false;
            changesMade = true;
        }

        if (!allowedSizes.includes(options.size)) {
            newOptions.size = allowedSizes[0];
            changesMade = true;
        }
        
        if (!allowedPapers.includes(options.paper)) {
            newOptions.paper = allowedPapers[0];
            changesMade = true;
        }
        
        if (Object.keys(newOptions).length > 0) {
           onUpdate(id, { options: { ...options, ...newOptions } });
        }
    }, [id, onUpdate, options, isFoldingCard, isHandmadePaper, allowedSizes, allowedPapers, isBackPressurePrintingDisabled]);

    const availableSizes = useMemo(() => Object.entries(SIZES).filter(([key]) => allowedSizes.includes(key as SizeKey)), [allowedSizes]);
    const availablePapers = useMemo(() => Object.entries(paperCosts).filter(([key]) => allowedPapers.includes(key as PaperKey)), [allowedPapers, paperCosts]);
    
    return (
        <div className="bg-white rounded-lg shadow p-3 space-y-2 relative">
            <div className="flex justify-between items-center gap-4">
              <div className="relative group flex-grow">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => onUpdate(id, { name: e.target.value })}
                  className="text-lg font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-900 p-1 w-full pr-8 transition-colors"
                  aria-label="Card Name"
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
                {/* Visual Preview Column */}
                <div className="hidden md:block">
                    <CardPreview options={options} />
                </div>
                
                {/* Controls Column */}
                <div className="space-y-4">
                    <div>
                        <SectionHeader title="Quantity Per Set" />
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
                                <span className="text-sm font-medium text-stone-600 ml-2">pieces</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <SectionHeader title="Card Specifications" />
                        <div className="grid grid-cols-1 gap-3">
                             <div>
                                <label htmlFor={`size-${id}`} className="block text-xs font-medium text-stone-600 mb-1">Card Size</label>
                                <select id={`size-${id}`} value={options.size} onChange={(e) => onOptionChange('size', e.target.value as SizeKey)} className="w-full p-1.5 border border-stone-300 rounded-md shadow-sm focus:ring-green-900 focus:border-green-900 bg-stone-100 text-xs">{availableSizes.map(([key, value]) => (<option key={key} value={key}>{`${value.name} (${value.dimensions})`}</option>))}</select>
                            </div>
                             <div>
                                <label htmlFor={`paper-${id}`} className="block text-xs font-medium text-stone-600 mb-1">Paper Stock</label>
                                <select id={`paper-${id}`} value={options.paper} onChange={(e) => onOptionChange('paper', e.target.value as PaperKey)} className="w-full p-1.5 border border-stone-300 rounded-md shadow-sm focus:ring-green-900 focus:border-green-900 bg-stone-100 text-xs">{availablePapers.map(([key, value]) => (<option key={key} value={key}>{value.name}</option>))}</select>
                            </div>
                        </div>
                         <div className="mt-3">
                            <div role="radiogroup" aria-labelledby={`paper-thickness-label-${id}`}>
                                <span id={`paper-thickness-label-${id}`} className="block text-xs font-medium text-stone-600 mb-1.5">Paper Thickness</span>
                                <div className="flex gap-2 text-xs">
                                    <button role="radio" aria-checked={options.paperWeight === 110} onClick={() => onOptionChange('paperWeight', 110)} className={`flex-1 p-1.5 text-center rounded-md border transition-colors ${options.paperWeight === 110 ? 'bg-green-900 text-white border-green-900' : 'bg-white hover:bg-stone-100'} disabled:opacity-50 disabled:cursor-not-allowed`} disabled={isHandmadePaper}><span className="font-semibold">Single Thick</span><span className="block text-[10px] opacity-80">{options.paperWeight === 110 ? 'Selected' : '110lb'}</span></button>
                                    <button role="radio" aria-checked={options.paperWeight === 220} onClick={() => onOptionChange('paperWeight', 220)} className={`flex-1 p-1.5 text-center rounded-md border transition-colors ${options.paperWeight === 220 ? 'bg-green-900 text-white border-green-900' : 'bg-white hover:bg-stone-100'} disabled:opacity-50 disabled:cursor-not-allowed`} disabled={isFoldingCard || isHandmadePaper}><span className="font-semibold">Double Thick</span><span className="block text-[10px] opacity-80">{options.paperWeight === 220 ? 'Selected' : '220lb'}</span></button>
                                </div>
                            </div>
                            {isFoldingCard && <p className="text-xs text-stone-500 mt-1.5 text-center">Double thick paper is not available for folded cards.</p>}
                            {isHandmadePaper && <p className="text-xs text-stone-500 mt-1.5 text-center">Thickness does not apply to handmade paper.</p>}
                            {options.digitalPrintingFront && options.paperWeight === 220 && !isFoldingCard && !isHandmadePaper && (
                                <p className="text-xs text-stone-500 mt-1.5 text-center">This combination requires a duplexing process to achieve the final thickness.</p>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <SectionHeader title="Printing Methods" />
                        <div className="space-y-3">
                            <div className="p-2 bg-stone-50/50 rounded-lg border border-stone-200/80">
                                <div className="font-semibold text-stone-600 text-sm mb-2">{frontLabel}</div>
                                <div className="space-y-2">
                                    <NumberInput id={`${id}-ink-front`} label="Letterpress Ink Colors" value={options.inkColorsFront} onChange={(val) => onOptionChange('inkColorsFront', val)} />
                                    <NumberInput id={`${id}-foil-front`} label="Foil Colors" value={options.foilColorsFront} onChange={(val) => onOptionChange('foilColorsFront', val)} />
                                    <Toggle id={`${id}-deboss-front`} label="Blind Deboss (no ink)" enabled={options.blindDebossFront} onChange={(val) => onOptionChange('blindDebossFront', val)} />
                                    <Toggle id={`${id}-emboss-front`} label="Blind Emboss (raised)" enabled={options.blindEmbossFront} onChange={(val) => onOptionChange('blindEmbossFront', val)} />
                                    <Toggle id={`${id}-digital-front`} label="Digital Printing (Full Color)" enabled={options.digitalPrintingFront} onChange={(val) => onOptionChange('digitalPrintingFront', val)} />
                                </div>
                            </div>
                            <div className={`p-2 bg-stone-50/50 rounded-lg border border-stone-200/80`}>
                                <div className="font-semibold text-stone-600 text-sm mb-2">{backLabel}</div>
                                <div className="space-y-2">
                                    <NumberInput id={`${id}-ink-back`} label="Letterpress Ink Colors" value={options.inkColorsBack} onChange={(val) => onOptionChange('inkColorsBack', val)} disabled={isBackPressurePrintingDisabled} />
                                    <NumberInput id={`${id}-foil-back`} label="Foil Colors" value={options.foilColorsBack} onChange={(val) => onOptionChange('foilColorsBack', val)} disabled={isBackPressurePrintingDisabled} />
                                    <Toggle id={`${id}-deboss-back`} label="Blind Deboss (no ink)" enabled={options.blindDebossBack} onChange={(val) => onOptionChange('blindDebossBack', val)} disabled={isBackPressurePrintingDisabled}/>
                                    <Toggle id={`${id}-emboss-back`} label="Blind Emboss (raised)" enabled={options.blindEmbossBack} onChange={(val) => onOptionChange('blindEmbossBack', val)} disabled={isBackPressurePrintingDisabled}/>
                                    <Toggle id={`${id}-digital-back`} label="Digital Printing (Full Color)" enabled={options.digitalPrintingBack} onChange={(val) => onOptionChange('digitalPrintingBack', val)} disabled={isHandmadePaper} />
                                </div>
                                {isBackPressurePrintingDisabled && !isFoldingCard ? (
                                    <p className="text-xs text-amber-700 mt-2 text-center">
                                        Back-side traditional printing only available on Double Thick (220lb) paper.
                                    </p>
                                ) : null}
                                {isFoldingCard && (options.inkColorsBack > 0 || options.foilColorsBack > 0) ? (
                                    <p className="text-xs text-green-900 bg-green-100 p-1.5 rounded-md mt-2 text-center">
                                        Letterpress/Foil printing applies to the right-side panel only. For full inside printing, please select Digital Printing.
                                    </p>
                                ) : null}
                                {isFoldOverBusinessCard && (
                                    <p className="text-xs text-green-900 bg-green-100 p-1.5 rounded-md mt-2 text-center">
                                        To provide the best value, this is priced as a larger fold-over card.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <SectionHeader title="Finishing" />
                        <div className="space-y-2">
                           <div>
                                <label htmlFor={`die-cut-${id}`} className="block text-xs font-medium text-stone-600 mb-1">Die Cutting</label>
                                <select 
                                    id={`die-cut-${id}`}
                                    value={options.dieCut} 
                                    onChange={(e) => onOptionChange('dieCut', e.target.value as DieCutType)} 
                                    className="w-full p-1.5 text-xs border border-stone-300 rounded-md shadow-sm focus:ring-green-900 focus:border-green-900 bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={options.edgePaint}
                                >
                                    <option value="none">None</option>
                                    <option value="stock">Stock Shape</option>
                                    <option value="custom">Custom Shape</option>
                                </select>
                            </div>
                           {options.dieCut === 'custom' && (
                                <p className="text-xs text-stone-600">
                                    A one-time fee for custom die creation is included. The final price may vary with complexity and will be confirmed in the formal quote.
                                </p>
                            )}
                           <Toggle id={`${id}-edge-paint`} label="Edge Painting" enabled={options.edgePaint} onChange={(val) => onOptionChange('edgePaint', val)} disabled={options.dieCut !== 'none' || options.paperWeight !== 220 || isHandmadePaper} />
                        </div>
                         {(options.edgePaint && options.paperWeight !== 220) && <p className="text-xs text-red-500 mt-1.5 text-center">Edge painting requires Double Thick paper.</p>}
                         {(options.edgePaint && isHandmadePaper) && <p className="text-xs text-red-500 mt-1.5 text-center">Edge painting is not available for handmade paper.</p>}
                        {(options.dieCut !== 'none' && options.edgePaint) && <p className="text-xs text-stone-500 mt-2 text-center">Edge painting and die cutting are not compatible. Please choose one.</p>}
                    </div>
                </div>
            </div>
            
            <div className="border-t border-stone-200 mt-3 pt-2 flex justify-end items-center">
              {noPrintingSelected ? (
                <div className="text-xs text-amber-700 bg-amber-50 p-1.5 rounded-md w-full text-center">
                  Please select at least one printing method to get a price.
                </div>
              ) : (
                <div className="flex items-baseline gap-2 w-full justify-end">
                    <span className="text-sm font-semibold text-stone-600">Card Total:</span>
                    <span className="text-lg font-bold text-stone-800">{formatCurrency(cardTotal)}</span>
                </div>
              )}
            </div>
        </div>
    );
};

export const CardEditor = React.memo(CardEditorComponent);