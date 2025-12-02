
import { useMemo } from 'react';
import { calculateCardPrice, calculateEnvelopePrice } from './pricing';
import { 
  INITIAL_CALCULATION_VARS, 
  INITIAL_PAPER_COSTS, 
  CardSpecsType,
  INITIAL_HANDMADE_PAPER_COSTS,
  INITIAL_DIGITAL_PRINTING_COSTS,
  INITIAL_ENVELOPE_VARS,
  INITIAL_ENVELOPE_COSTS,
  INITIAL_ENVELOPE_LINER_COSTS
} from './config';
import { SuiteItem, SuitePricing, CardItem, EnvelopeItem } from './types';

export const useSuiteCalculator = (
  suite: SuiteItem[], 
  vars: typeof INITIAL_CALCULATION_VARS,
  paperCosts: typeof INITIAL_PAPER_COSTS,
  cardSpecs: CardSpecsType,
  handmadePaperCosts: typeof INITIAL_HANDMADE_PAPER_COSTS,
  digitalPrintingCosts: typeof INITIAL_DIGITAL_PRINTING_COSTS,
  envelopeVars: typeof INITIAL_ENVELOPE_VARS,
  envelopeCosts: typeof INITIAL_ENVELOPE_COSTS,
  envelopeLinerCosts: typeof INITIAL_ENVELOPE_LINER_COSTS
): SuitePricing => {
    return useMemo(() => {
        const pricedItems = suite.map(item => {
            if (item.type === 'card') {
                const price = calculateCardPrice(item.options, vars, paperCosts, cardSpecs, handmadePaperCosts, digitalPrintingCosts);
                return {
                    id: item.id,
                    name: item.name,
                    type: 'card' as const,
                    options: item.options,
                    ...price
                };
            } else { // envelope
                const total = calculateEnvelopePrice(item.options, envelopeVars, envelopeCosts, envelopeLinerCosts);
                return {
                    id: item.id,
                    name: item.name,
                    type: 'envelope' as const,
                    options: item.options,
                    total: total,
                };
            }
        });

        const grandTotal = pricedItems.reduce((acc, p) => acc + p.total, 0);

        const itemPrices = pricedItems.map(p => {
            if (p.type === 'card') {
                return {
                    id: p.id,
                    name: p.name,
                    total: p.total,
                    type: 'card' as const,
                    options: p.options,
                    dieCutCost: p.dieCutCost,
                    edgePaintCost: p.edgePaintCost,
                    duplexCost: p.duplexCost,
                };
            } else { // envelope
                return {
                    id: p.id,
                    name: p.name,
                    total: p.total,
                    type: 'envelope' as const,
                    options: p.options,
                };
            }
        });

        return { itemPrices, grandTotal };

    }, [suite, vars, paperCosts, cardSpecs, handmadePaperCosts, digitalPrintingCosts, envelopeVars, envelopeCosts, envelopeLinerCosts]);
};
