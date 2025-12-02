

import React, { useState, useCallback, useEffect } from 'react';
import { 
  INITIAL_CALCULATION_VARS, 
  INITIAL_PAPER_COSTS, 
  INITIAL_CARD_SPECS,
  INITIAL_HANDMADE_PAPER_COSTS,
  INITIAL_DIGITAL_PRINTING_COSTS,
  INITIAL_ENVELOPE_VARS,
  INITIAL_ENVELOPE_COSTS,
  INITIAL_ENVELOPE_LINER_COSTS,
  EnvelopeSizeKey,
  PaperKey,
  PaperWeight,
  SizeKey,
} from './config';
import { CardItem, QuoteOptions, EnvelopeQuoteOptions, ProductType, SuiteItem, EnvelopeItem } from './types';
import { getNewCard, getNewEnvelope } from './utils';
import { PRODUCT_CONFIGS } from './productConfigs';
import CalculatorScreen from './CalculatorScreen';

// --- MAIN APP COMPONENT ---
export default function App() {
  const productType: ProductType = 'invitationSuite';
  const [suite, setSuite] = useState<SuiteItem[]>(() => {
    // Fallback to default initial state
    const config = PRODUCT_CONFIGS[productType];
    const initialCard = getNewCard(Date.now(), config.defaultCardName, config.defaultOptions);
    return [initialCard];
  });
  
  // Use useEffect to load from URL once on component mount
  useEffect(() => {
    const loadSuiteFromUrl = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const quoteId = urlParams.get('id');
        
        if (quoteId) {
          const response = await fetch(`/api/get-quote?id=${quoteId}`);
          if (response.ok) {
            const loadedSuite = await response.json();
            if (Array.isArray(loadedSuite) && loadedSuite.length > 0) {
              setSuite(loadedSuite);
            }
          } else {
            console.error("Failed to fetch shared quote:", await response.text());
          }
          // Clean the URL after attempting to load the quote
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, newUrl);
        }
      } catch (e) {
        console.error("Error loading suite from URL:", e);
      }
    };

    loadSuiteFromUrl();
  }, []); // Empty dependency array means this runs only once.

  const [calculationVars, setCalculationVars] = useState(INITIAL_CALCULATION_VARS);
  const [paperCosts, setPaperCosts] = useState(INITIAL_PAPER_COSTS);
  const [cardSpecs, setCardSpecs] = useState(INITIAL_CARD_SPECS);
  const [handmadePaperCosts, setHandmadePaperCosts] = useState(INITIAL_HANDMADE_PAPER_COSTS);
  const [digitalPrintingCosts, setDigitalPrintingCosts] = useState(INITIAL_DIGITAL_PRINTING_COSTS);
  const [envelopeVars, setEnvelopeVars] = useState(INITIAL_ENVELOPE_VARS);
  const [envelopeCosts, setEnvelopeCosts] = useState(INITIAL_ENVELOPE_COSTS);
  const [envelopeLinerCosts, setEnvelopeLinerCosts] = useState(INITIAL_ENVELOPE_LINER_COSTS);

  const resetSuite = useCallback(() => {
    const config = PRODUCT_CONFIGS[productType];
    setSuite([getNewCard(Date.now(), config.defaultCardName, config.defaultOptions)]);
  }, [productType]);

  const addCard = useCallback(() => {
    const config = PRODUCT_CONFIGS[productType];
    setSuite(prev => {
        const lastItem = prev.length > 0 ? prev[prev.length - 1] : null;
        const quantity = lastItem ? lastItem.options.quantity : 25;
        
        const cardCount = prev.filter(item => item.type === 'card').length;
        
        let newSize: SizeKey;
        if (cardCount === 1) { // Adding the second card
            newSize = 'a2';
        } else if (cardCount >= 2) { // Adding the third card or more
            newSize = 'four_bar';
        } else { // Fallback, though should be covered by initial state
            newSize = config.defaultOptions.size || 'a7';
        }

        const newCardOptions = { 
            ...config.defaultOptions, 
            quantity,
            size: newSize
        };
        
        const newCardName = `${config.defaultCardName.replace(/ #\d+/, '')} #${cardCount + 1}`;
        return [...prev, getNewCard(Date.now(), newCardName, newCardOptions)];
    });
  }, [productType]);
  
  const addEnvelope = useCallback(() => {
    setSuite(prev => {
      const lastItem = prev.length > 0 ? prev[prev.length - 1] : null;
      const quantity = lastItem ? lastItem.options.quantity : 25;
      const newEnvelope = getNewEnvelope(Date.now(), quantity);

      const envelopeCount = prev.filter(item => item.type === 'envelope').length;
      if (envelopeCount > 0) {
        newEnvelope.options.size = 'a2';
        newEnvelope.name = 'RSVP Envelopes';
      }

      return [...prev, newEnvelope];
    });
  }, []);


  const removeItem = useCallback((id: number) => {
    setSuite(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter(item => item.id !== id)
    });
  }, []);

  const updateItem = useCallback((id: number, update: Partial<SuiteItem> | { options: Partial<QuoteOptions> | Partial<EnvelopeQuoteOptions> }) => {
    setSuite(prevSuite =>
      prevSuite.map(item => {
        if (item.id !== id) {
          return item;
        }

        if (item.type === 'card') {
          if ('options' in update && update.options) {
            return {
              ...item,
              options: { ...item.options, ...(update.options as Partial<QuoteOptions>) },
            };
          }
          return { ...item, ...(update as Partial<CardItem>) };
        } 
        
        if (item.type === 'envelope') {
          if ('options' in update && update.options) {
            return {
              ...item,
              options: { ...item.options, ...(update.options as Partial<EnvelopeQuoteOptions>) },
            };
          }
          return { ...item, ...(update as Partial<EnvelopeItem>) };
        }

        return item;
      })
    );
  }, []);

  const currentConfig = PRODUCT_CONFIGS[productType];

  return (
    <div className="w-screen h-screen bg-stone-100 text-stone-800 antialiased flex flex-col">
      <CalculatorScreen
        suite={suite}
        calculationVars={calculationVars}
        paperCosts={paperCosts}
        cardSpecs={cardSpecs}
        handmadePaperCosts={handmadePaperCosts}
        digitalPrintingCosts={digitalPrintingCosts}
        envelopeVars={envelopeVars}
        envelopeCosts={envelopeCosts}
        envelopeLinerCosts={envelopeLinerCosts}
        config={currentConfig}
        onAddCard={addCard}
        onAddEnvelope={addEnvelope}
        onRemoveItem={removeItem}
        onUpdateItem={updateItem}
        onResetSuite={resetSuite}
      />
    </div>
  );
}