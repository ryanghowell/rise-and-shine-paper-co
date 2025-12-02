import { useMemo } from 'react';
import { OrderConfiguration } from '@/types/order';

export function useOrderPrice(config: OrderConfiguration) {
    return useMemo(() => {
        // Pricing Constants
        const BASE_SETUP_FEE = 150;
        const PAPER_COST_110LB = 0.50; // Per unit
        const INK_RUN_FEE = 40; // Per color setup
        const INK_UNIT_COST = 0.10; // Per color per unit
        const FOIL_RUN_FEE = 80; // Per color setup
        const FOIL_UNIT_COST = 0.30; // Per color per unit
        const EDGE_PAINTING_FEE = 75; // Flat fee

        let subtotal = BASE_SETUP_FEE;

        // Paper Cost
        let paperUnitCost = PAPER_COST_110LB;
        if (config.paperType === 'Cotton 220lb (Double Thick)') {
            paperUnitCost *= 2;
        }
        subtotal += paperUnitCost * config.quantity;

        // Ink Costs
        if (config.inkColors > 0) {
            subtotal += (INK_RUN_FEE * config.inkColors);
            subtotal += (INK_UNIT_COST * config.inkColors * config.quantity);
        }

        // Foil Costs
        if (config.foilColors > 0) {
            subtotal += (FOIL_RUN_FEE * config.foilColors);
            subtotal += (FOIL_UNIT_COST * config.foilColors * config.quantity);
        }

        // Edge Painting
        if (config.edgePainting) {
            subtotal += EDGE_PAINTING_FEE;
        }

        const pricePerUnit = subtotal / config.quantity;

        // Turnaround Time Logic
        // Base: 10 business days
        // +2 days per ink color > 1
        // +3 days per foil color
        // +3 days for edge painting
        let businessDays = 10;
        if (config.inkColors > 1) businessDays += (config.inkColors - 1) * 2;
        if (config.foilColors > 0) businessDays += config.foilColors * 3;
        if (config.edgePainting) businessDays += 3;

        return {
            pricePerUnit,
            subtotal,
            turnaroundTime: `${businessDays} Business Days`
        };
    }, [config]);
}
