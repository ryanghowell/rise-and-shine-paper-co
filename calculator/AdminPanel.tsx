

import React from 'react';
import { 
  INITIAL_CALCULATION_VARS, 
  INITIAL_PAPER_COSTS, 
  INITIAL_HANDMADE_PAPER_COSTS,
  INITIAL_DIGITAL_PRINTING_COSTS,
  INITIAL_ENVELOPE_VARS,
  INITIAL_ENVELOPE_COSTS,
  INITIAL_ENVELOPE_LINER_COSTS,
  SIZES, 
  SizeKey, 
  PaperKey, 
  PaperWeight, 
  CardSpecsType,
  EnvelopeSizeKey,
  ENVELOPE_DETAILS
} from './config';

const AdminPanel: React.FC<{
  vars: typeof INITIAL_CALCULATION_VARS;
  paperCosts: typeof INITIAL_PAPER_COSTS;
  cardSpecs: CardSpecsType;
  handmadePaperCosts: typeof INITIAL_HANDMADE_PAPER_COSTS;
  digitalPrintingCosts: typeof INITIAL_DIGITAL_PRINTING_COSTS;
  envelopeVars: typeof INITIAL_ENVELOPE_VARS;
  envelopeCosts: typeof INITIAL_ENVELOPE_COSTS;
  envelopeLinerCosts: typeof INITIAL_ENVELOPE_LINER_COSTS;
  onVarChange: (key: keyof typeof INITIAL_CALCULATION_VARS, value: number) => void;
  onPaperCostChange: (paper: PaperKey, weight: PaperWeight, value: number) => void;
  onCardSpecChange: (size: SizeKey, weight: PaperWeight, key: 'yield' | 'plateInches', value: number) => void;
  onHandmadePaperCostChange: (size: SizeKey, value: number) => void;
  onDigitalPrintingCostChange: (size: SizeKey, value: number) => void;
  onEnvelopeVarChange: (key: keyof typeof INITIAL_ENVELOPE_VARS, value: number) => void;
  onEnvelopeCostChange: (size: EnvelopeSizeKey, value: number) => void;
  onEnvelopeLinerCostChange: (size: EnvelopeSizeKey, value: number) => void;
  onClose: () => void;
}> = ({ 
  vars, paperCosts, cardSpecs, handmadePaperCosts, digitalPrintingCosts, envelopeVars, envelopeCosts, envelopeLinerCosts,
  onVarChange, onPaperCostChange, onCardSpecChange, onHandmadePaperCostChange, onDigitalPrintingCostChange, onEnvelopeVarChange, onEnvelopeCostChange, onEnvelopeLinerCostChange,
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-stone-50 rounded-lg shadow-2xl p-3 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold font-serif">Setup Panel</h3>
          <button onClick={onClose} aria-label="Close settings panel" className="text-stone-500 hover:text-stone-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {/* General Variables */}
          <div>
              <h4 className="text-sm font-semibold font-serif text-green-900 border-b border-green-200 mb-2 pb-1">General Variables</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(vars).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-stone-500 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</label>
                      <input
                        type="number"
                        step={key.includes('Rate') || key.includes('Cost') || key.includes('Setup') || key.includes('Piece') || key.includes('Multiplier') || key.includes('Percentage') ? '0.01' : '1'}
                        value={value}
                        onChange={e => onVarChange(key as any, parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full px-2 py-1 bg-white border border-stone-300 rounded-md shadow-sm text-xs focus:outline-none focus:ring-green-900 focus:border-green-900"
                      />
                    </div>
                  ))}
              </div>
          </div>
          {/* Envelope Variables */}
           <div>
              <h4 className="text-sm font-semibold font-serif text-green-900 border-b border-green-200 mb-2 pb-1">Envelope Variables</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(envelopeVars).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-stone-500 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</label>
                      <input
                        type="number"
                        step="0.01"
                        value={value}
                        onChange={e => onEnvelopeVarChange(key as any, parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full px-2 py-1 bg-white border border-stone-300 rounded-md shadow-sm text-xs focus:outline-none focus:ring-green-900 focus:border-green-900"
                      />
                    </div>
                  ))}
              </div>
          </div>
          {/* Paper Costs */}
          <div>
              <h4 className="text-sm font-semibold font-serif text-green-900 border-b border-green-200 mb-2 pb-1">Paper Costs Per Sheet</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  {/* Fix: Replaced Object.entries with Object.keys and type assertion to correctly type the iterated values. */}
                  {(Object.keys(paperCosts) as PaperKey[]).filter((key) => key !== 'handmade').map((key) => {
                    const value = paperCosts[key];
                    return (
                    <div key={key} className="p-2 bg-white rounded-lg border border-stone-200">
                      <h5 className="font-semibold text-stone-600 mb-2 text-sm">{value.name}</h5>
                       <div className="flex gap-4">
                          {value.costs[110] !== undefined && (
                            <div>
                                <label className="block text-xs font-medium text-stone-500">110lb Cost / Sheet</label>
                                <input type="number" step="0.01" value={value.costs[110].cost} onChange={e => onPaperCostChange(key, 110, parseFloat(e.target.value) || 0)} className="mt-1 block w-full px-2 py-1 bg-white border border-stone-300 rounded-md shadow-sm text-xs focus:outline-none focus:ring-green-900 focus:border-green-900"/>
                            </div>
                          )}
                          {value.costs[220] !== undefined && (
                            <div>
                                <label className="block text-xs font-medium text-stone-500">220lb Cost / Sheet</label>
                                <input type="number" step="0.01" value={value.costs[220].cost} onChange={e => onPaperCostChange(key, 220, parseFloat(e.target.value) || 0)} className="mt-1 block w-full px-2 py-1 bg-white border border-stone-300 rounded-md shadow-sm text-xs focus:outline-none focus:ring-green-900 focus:border-green-900"/>
                            </div>
                          )}
                       </div>
                    </div>
                  )})}
              </div>
          </div>
           {/* Handmade Paper Costs */}
          <div>
              <h4 className="text-sm font-semibold font-serif text-green-900 border-b border-green-200 mb-2 pb-1">Handmade Paper Costs (Per Piece)</h4>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(SIZES).filter(([, val]) => !val.name.toLowerCase().includes('folding')).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-stone-500">{value.name}</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={handmadePaperCosts[key as SizeKey] || 0}
                        onChange={e => onHandmadePaperCostChange(key as SizeKey, parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full px-2 py-1 bg-white border border-stone-300 rounded-md shadow-sm text-xs focus:outline-none focus:ring-green-900 focus:border-green-900"
                       />
                    </div>
                  ))}
              </div>
          </div>
          {/* Digital Printing Costs */}
          <div>
              <h4 className="text-sm font-semibold font-serif text-green-900 border-b border-green-200 mb-2 pb-1">Digital Printing Costs (Per Piece)</h4>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(SIZES).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-stone-500">{value.name}</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={digitalPrintingCosts[key as SizeKey] || 0}
                        onChange={e => onDigitalPrintingCostChange(key as SizeKey, parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full px-2 py-1 bg-white border border-stone-300 rounded-md shadow-sm text-xs focus:outline-none focus:ring-green-900 focus:border-green-900"
                       />
                    </div>
                  ))}
              </div>
          </div>
           {/* Envelope Costs */}
          <div>
              <h4 className="text-sm font-semibold font-serif text-green-900 border-b border-green-200 mb-2 pb-1">Blank Envelope Costs (Per Piece)</h4>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(envelopeCosts).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-stone-500">{ENVELOPE_DETAILS[key as EnvelopeSizeKey].name}</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={value}
                        onChange={e => onEnvelopeCostChange(key as EnvelopeSizeKey, parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full px-2 py-1 bg-white border border-stone-300 rounded-md shadow-sm text-xs focus:outline-none focus:ring-green-900 focus:border-green-900"
                       />
                    </div>
                  ))}
              </div>
          </div>
          {/* Envelope Liner Costs */}
          <div>
              <h4 className="text-sm font-semibold font-serif text-green-900 border-b border-green-200 mb-2 pb-1">Envelope Liner Costs (Per Piece)</h4>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(envelopeLinerCosts).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-stone-500">{ENVELOPE_DETAILS[key as EnvelopeSizeKey].name}</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={value}
                        onChange={e => onEnvelopeLinerCostChange(key as EnvelopeSizeKey, parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full px-2 py-1 bg-white border border-stone-300 rounded-md shadow-sm text-xs focus:outline-none focus:ring-green-900 focus:border-green-900"
                       />
                    </div>
                  ))}
              </div>
          </div>
          {/* Card Specs */}
          <div>
              <h4 className="text-sm font-semibold font-serif text-green-900 border-b border-green-200 mb-2 pb-1">Card Specifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Fix: Replaced Object.entries with Object.keys and type assertion to correctly type the iterated values. */}
                  {(Object.keys(cardSpecs) as SizeKey[]).map((sizeKey) => {
                      const sizeSpec = cardSpecs[sizeKey];
                      return (
                      <div key={sizeKey} className="p-2 bg-white rounded-lg border border-stone-200">
                          <h5 className="font-semibold text-stone-600 mb-2 text-sm">{SIZES[sizeKey as SizeKey].name}</h5>
                          <div>
                              <label className="block text-xs font-medium text-stone-500">Plate Size (sq. in.)</label>
                              <input type="number" step="0.01" value={sizeSpec.plateInches} onChange={e => onCardSpecChange(sizeKey as SizeKey, 110, 'plateInches', parseFloat(e.target.value) || 0)} className="mt-1 block w-full px-2 py-1 bg-white border border-stone-300 rounded-md shadow-sm text-xs focus:outline-none focus:ring-green-900 focus:border-green-900"/>
                          </div>
                          <div className="mt-2 space-y-2">
                              {/* Fix: Replaced Object.entries with Object.keys and proper parsing to correctly type iterated values. */}
                              {Object.keys(sizeSpec.weights).map((weightKeyStr) => {
                                  const weightKey = parseInt(weightKeyStr, 10) as PaperWeight;
                                  const weightSpec = sizeSpec.weights[weightKey];
                                  return (
                                  !weightSpec ? null :
                                  (weightKey === 220 && sizeKey.endsWith('f')) ? null :
                                  <div key={weightKey}>
                                      <h6 className="text-xs font-bold text-stone-500 mt-2 pt-2 border-t border-stone-200">{weightKey}lb Stock</h6>
                                      <div className="flex gap-4">
                                          <div>
                                              <label className="block text-xs font-medium text-stone-500">Yield / Sheet</label>
                                              <input type="number" step="1" value={weightSpec.yield} onChange={e => onCardSpecChange(sizeKey as SizeKey, weightKey, 'yield', parseFloat(e.target.value) || 0)} className="mt-1 block w-full px-2 py-1 bg-white border border-stone-300 rounded-md shadow-sm text-xs focus:outline-none focus:ring-green-900 focus:border-green-900"/>
                                          </div>
                                      </div>
                                  </div>
                                )
                              })}
                          </div>
                      </div>
                  )})}
              </div>
          </div>
        </div>
        <div className="mt-4 text-center">
            <button onClick={onClose} className="bg-green-900 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-green-950 transition-colors shadow-sm">Done</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;