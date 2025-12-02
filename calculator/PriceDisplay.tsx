


import React, { useState } from 'react';
import { SuitePricing, QuoteOptions, EnvelopeQuoteOptions, SuiteItem } from './types';
import { INITIAL_PAPER_COSTS, SIZES, ENVELOPE_DETAILS } from './config';
import { formatCurrency } from './utils';
import { SubmissionForm } from './SubmissionForm';

const PriceDisplayComponent: React.FC<{ 
    suite: SuiteItem[];
    suitePricing: SuitePricing, 
    paperCosts: typeof INITIAL_PAPER_COSTS,
    onReset: () => void, 
    onRemove: (id: number) => void,
}> = ({ suite, suitePricing, onReset, onRemove }) => {
  const finalGrandTotal = suitePricing.grandTotal;
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'sharing' | 'copied' | 'error'>('idle');

  const hasItemsToQuote = finalGrandTotal > 0 && suitePricing.itemPrices.every(item => {
      if (item.type === 'card') {
          const options = item.options as QuoteOptions;
          return !(options.inkColorsFront === 0 && options.foilColorsFront === 0 && !options.digitalPrintingFront && !options.blindDebossFront && !options.blindEmbossFront && options.inkColorsBack === 0 && options.foilColorsBack === 0 && !options.digitalPrintingBack && !options.blindDebossBack && !options.blindEmbossBack);
      }
      return true;
  });

  const handleShare = async () => {
    setCopyState('sharing');
    try {
      const response = await fetch('/api/create-share-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suite),
      });

      if (!response.ok) {
        throw new Error('Failed to create share link on the server.');
      }

      const { id } = await response.json();
      const url = `${window.location.origin}${window.location.pathname}?id=${id}`;
      
      await navigator.clipboard.writeText(url);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2500);

    } catch (err) {
      console.error('Failed to copy share link: ', err);
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 3000);
    }
  };

  const getShareButtonText = () => {
    switch (copyState) {
        case 'sharing':
            return 'Creating Link...';
        case 'copied':
            return 'Copied to Clipboard!';
        case 'error':
            return 'Error! Please Try Again';
        case 'idle':
        default:
            return 'Share This Quote';
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-3">
            <h2 className="text-lg font-bold text-center font-serif text-stone-800">Estimate</h2>
        </div>
        <div className="bg-stone-50 p-3">
          {suitePricing.itemPrices.map(item => {
            if (item.type === 'card') {
              const options = item.options as QuoteOptions;
              const paperInfo = INITIAL_PAPER_COSTS[options.paper];
              const sizeInfo = SIZES[options.size];
              const isHandmade = options.paper === 'handmade';
              const effectivePaperWeight = isHandmade ? '' : ` (${options.paperWeight}lb)`;
              const noPrintingSelected = options.inkColorsFront === 0 && options.foilColorsFront === 0 && !options.digitalPrintingFront && !options.blindDebossFront && !options.blindEmbossFront && options.inkColorsBack === 0 && options.foilColorsBack === 0 && !options.digitalPrintingBack && !options.blindDebossBack && !options.blindEmbossBack;
              
              const printingMethods: string[] = [];
                if (options.digitalPrintingFront && options.digitalPrintingBack) {
                    printingMethods.push('Digital (Double-Sided)');
                } else if (options.digitalPrintingFront) {
                    printingMethods.push('Digital (Front)');
                } else if (options.digitalPrintingBack) {
                    printingMethods.push('Digital (Back)');
                }
                if (options.inkColorsFront > 0) printingMethods.push(`${options.inkColorsFront} Ink (Front)`);
                if (options.foilColorsFront > 0) printingMethods.push(`${options.foilColorsFront} Foil (Front)`);
                if (options.blindDebossFront) printingMethods.push('Blind Deboss (Front)');
                if (options.blindEmbossFront) printingMethods.push('Blind Emboss (Front)');
                if (options.inkColorsBack > 0) printingMethods.push(`${options.inkColorsBack} Ink (Back)`);
                if (options.foilColorsBack > 0) printingMethods.push(`${options.foilColorsBack} Foil (Back)`);
                if (options.blindDebossBack) printingMethods.push('Blind Deboss (Back)');
                if (options.blindEmbossBack) printingMethods.push('Blind Emboss (Back)');
                const printingSummary = printingMethods.length > 0 ? printingMethods.join(' + ') : 'No Printing';

              return (
                <div key={item.id} className="pb-1.5 mb-1.5 border-b border-stone-200 last:border-b-0 last:mb-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-600 text-sm">{item.name}</span>
                      {suitePricing.itemPrices.length > 1 && (
                         <button onClick={() => onRemove(item.id)} title={`Remove ${item.name}`} aria-label={`Remove ${item.name}`} className="text-stone-400 hover:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                         </button>
                      )}
                    </div>
                    <span className="font-semibold text-stone-800 text-sm">
                        {noPrintingSelected ? (
                            <span className="text-amber-600 text-xs font-medium">Select Options</span>
                        ) : (
                            formatCurrency(item.total)
                        )}
                    </span>
                  </div>
                  
                  <div className="pl-2 mt-0.5 space-y-0.5 text-xs text-stone-500">
                    <p>{options.quantity} × {sizeInfo.name} on {paperInfo.name}{effectivePaperWeight}</p>
                    <p>Printing: {printingSummary}</p>
                  </div>

                  {item.edgePaintCost > 0 &&
                    <div className="flex justify-between items-center pt-1 pb-0 pl-2">
                      <span className="text-xs text-stone-500">↳ Edge Painting</span>
                      <span className="font-medium text-xs text-stone-600">{formatCurrency(item.edgePaintCost)}</span>
                    </div>
                  }
                  {item.dieCutCost > 0 &&
                    <div className="flex justify-between items-center pt-1 pb-0 pl-2">
                      <span className="text-xs text-stone-500">↳ Die Cutting</span>
                      <span className="font-medium text-xs text-stone-600">{formatCurrency(item.dieCutCost)}</span>
                    </div>
                  }
                  {item.duplexCost > 0 &&
                    <div className="flex justify-between items-center pt-1 pb-0 pl-2">
                      <span className="text-xs text-stone-500">↳ Duplexing</span>
                      <span className="font-medium text-xs text-stone-600">{formatCurrency(item.duplexCost)}</span>
                    </div>
                  }
                </div>
              );
            } else { // Envelope Item
              const options = item.options as EnvelopeQuoteOptions;
              const envelopeInfo = ENVELOPE_DETAILS[options.size];
              
              const envelopeDetails: string[] = [];
              envelopeDetails.push(options.type === 'double' ? 'Double' : 'Single');
              if (options.returnAddressPrinting !== 'none') {
                  const printMethod = options.returnAddressPrinting.charAt(0).toUpperCase() + options.returnAddressPrinting.slice(1);
                  const locationInfo = (options.size === 'a2' || options.size === 'four_bar')
                      ? `, ${options.returnAddressLocation}`
                      : '';
                  envelopeDetails.push(`Return Address (${printMethod}${locationInfo})`);
              }
              if (options.guestAddressing) envelopeDetails.push('Guest Addressing');
              if (options.liner) envelopeDetails.push('Liners');

              return (
                <div key={item.id} className="pb-1.5 mb-1.5 border-b border-stone-200 last:border-b-0 last:mb-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-600 text-sm">{item.name}</span>
                       {suitePricing.itemPrices.length > 1 && (
                         <button onClick={() => onRemove(item.id)} title={`Remove ${item.name}`} aria-label={`Remove ${item.name}`} className="text-stone-400 hover:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                         </button>
                      )}
                    </div>
                     <span className="font-semibold text-stone-800 text-sm">{formatCurrency(item.total)}</span>
                  </div>
                   <div className="pl-2 mt-0.5 space-y-0.5 text-xs text-stone-500">
                    <p>{options.quantity} × {envelopeInfo.name}</p>
                    <p>Options: {envelopeDetails.join(' + ')}</p>
                  </div>
                </div>
              )
            }
          })}
        </div>
        <div className="p-3 bg-stone-100 space-y-2">
          <div>
              <h4 className="text-sm font-medium text-stone-600">Production Speed</h4>
              <p className="mt-1 text-xs text-stone-500">
                  Standard production is 15-20 business days, plus shipping time.
              </p>
          </div>
          <div className="flex justify-between items-center border-t border-stone-200 pt-2">
              <span className="text-base font-bold text-stone-800">Total</span>
              <span className="text-xl font-bold font-serif text-green-900">{formatCurrency(finalGrandTotal)}</span>
          </div>
        </div>
        <div className="p-3 bg-white border-t border-stone-200">
          <div className="flex flex-col gap-2">
            <button
                onClick={() => setIsFormModalOpen(true)}
                disabled={!hasItemsToQuote}
                className="w-full bg-green-900 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-950 transition-colors shadow-sm text-sm disabled:bg-stone-400 disabled:cursor-not-allowed"
            >
                Ready for a Formal Quote?
            </button>
            <button
              onClick={handleShare}
              disabled={copyState === 'sharing'}
              className="w-full bg-white text-green-900 border border-green-900 font-semibold py-1.5 px-3 rounded-md hover:bg-green-50 transition-colors shadow-sm text-xs disabled:bg-stone-200 disabled:cursor-not-allowed"
            >
              {getShareButtonText()}
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-stone-500 my-2 px-3">This is an estimate. Final price may vary. Taxes and shipping not included.</p>
      </div>

      {isFormModalOpen && (
          <SubmissionForm
              suitePricing={suitePricing}
              paperCosts={INITIAL_PAPER_COSTS}
              onReset={onReset}
              finalGrandTotal={finalGrandTotal}
              onClose={() => setIsFormModalOpen(false)}
          />
      )}
    </>
  );
};

export const PriceDisplay = React.memo(PriceDisplayComponent);