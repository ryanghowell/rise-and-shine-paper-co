

import React from 'react';
import { useSuiteCalculator } from './useSuiteCalculator';
import { CardEditor } from './CardEditor';
import { PriceDisplay } from './PriceDisplay';
import { SuiteItem, QuoteOptions, EnvelopeQuoteOptions, ProductConfig } from './types';
import { 
  INITIAL_CALCULATION_VARS, 
  INITIAL_PAPER_COSTS, 
  INITIAL_CARD_SPECS,
  INITIAL_HANDMADE_PAPER_COSTS,
  INITIAL_DIGITAL_PRINTING_COSTS,
  INITIAL_ENVELOPE_VARS,
  INITIAL_ENVELOPE_COSTS,
  INITIAL_ENVELOPE_LINER_COSTS,
} from './config';
import EnvelopeItemEditor from './EnvelopeItemEditor';

interface CalculatorScreenProps {
  suite: SuiteItem[];
  calculationVars: typeof INITIAL_CALCULATION_VARS;
  paperCosts: typeof INITIAL_PAPER_COSTS;
  cardSpecs: typeof INITIAL_CARD_SPECS;
  handmadePaperCosts: typeof INITIAL_HANDMADE_PAPER_COSTS;
  digitalPrintingCosts: typeof INITIAL_DIGITAL_PRINTING_COSTS;
  envelopeVars: typeof INITIAL_ENVELOPE_VARS;
  envelopeCosts: typeof INITIAL_ENVELOPE_COSTS;
  envelopeLinerCosts: typeof INITIAL_ENVELOPE_LINER_COSTS;
  config: ProductConfig;
  onAddCard: () => void;
  onAddEnvelope: () => void;
  onRemoveItem: (id: number) => void;
  onUpdateItem: (id: number, update: Partial<SuiteItem> | { options: Partial<QuoteOptions> | Partial<EnvelopeQuoteOptions> }) => void;
  onResetSuite: () => void;
}

const CalculatorScreen: React.FC<CalculatorScreenProps> = ({
  suite,
  calculationVars,
  paperCosts,
  cardSpecs,
  handmadePaperCosts,
  digitalPrintingCosts,
  envelopeVars,
  envelopeCosts,
  envelopeLinerCosts,
  config,
  onAddCard,
  onAddEnvelope,
  onRemoveItem,
  onUpdateItem,
  onResetSuite,
}) => {
  const suitePricing = useSuiteCalculator(
      suite, 
      calculationVars, 
      paperCosts, 
      cardSpecs, 
      handmadePaperCosts, 
      digitalPrintingCosts,
      envelopeVars,
      envelopeCosts,
      envelopeLinerCosts
  );

  return (
    <>
      <div className="flex-grow overflow-y-auto p-2 md:p-4 bg-white">
        <main className="max-w-5xl mx-auto p-4 md:p-6 bg-stone-100 rounded-xl shadow">
          <div className="lg:flex lg:gap-3">
              <div className="lg:w-2/3 space-y-3">
                  {suite.map((item, index) => {
                    const itemPriceInfo = suitePricing.itemPrices.find(p => p.id === item.id);
                    const itemTotal = itemPriceInfo ? itemPriceInfo.total : 0;

                    if (item.type === 'card') {
                      return (
                        <CardEditor 
                          key={item.id} 
                          card={item}
                          cardIndex={index}
                          onUpdate={onUpdateItem} 
                          onRemove={onRemoveItem} 
                          cardTotal={itemTotal} 
                          paperCosts={paperCosts}
                          allowedSizes={config.allowedSizes}
                          allowedPapers={config.allowedPapers}
                        />
                      );
                    } else {
                      return (
                          <EnvelopeItemEditor
                              key={item.id}
                              item={item}
                              onUpdate={onUpdateItem}
                              onRemove={onRemoveItem}
                              itemTotal={itemTotal}
                          />
                      );
                    }
                  })}

                  <div className="flex justify-center items-center flex-wrap pt-2 gap-2">
                      {config.allowMultipleCards && (
                          <button onClick={onAddCard} className="bg-green-900 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-green-950 transition-colors shadow-sm text-xs">
                              + Add Another Card
                          </button>
                      )}
                       <button onClick={onAddEnvelope} className="bg-white text-green-900 border border-green-900 font-semibold py-1.5 px-3 rounded-md hover:bg-green-50 transition-colors shadow-sm text-xs">
                          + Add Envelopes
                      </button>
                  </div>
              </div>
              
              <div className="lg:w-1/3">
                <div className="lg:sticky top-3 mt-3 lg:mt-0">
                  <PriceDisplay suite={suite} suitePricing={suitePricing} paperCosts={paperCosts} onReset={onResetSuite} onRemove={onRemoveItem} />
                </div>
              </div>
          </div>
        </main>
      </div>
      <footer className="text-center py-3 text-xs text-stone-500 shrink-0 bg-white">
        <p>&copy; {new Date().getFullYear()} Letterpress Estimator. All rights reserved.</p>
      </footer>
    </>
  );
};

export default CalculatorScreen;
