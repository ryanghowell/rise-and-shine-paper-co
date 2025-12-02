import { useMemo } from 'react';
import { OrderConfiguration } from '@/types/order';
import { calculateCardPrice } from '@/lib/pricing-engine';

export function useOrderPrice(config: OrderConfiguration) {
    return useMemo(() => {
        const calculatedPrice = calculateCardPrice(config);

        const pricePerUnit = config.quantity > 0 ? calculatedPrice.total / config.quantity : 0;

        // Turnaround Time Logic (Approximation based on complexity)
        // Base: 10 business days
        let businessDays = 10;

        // Add time for multiple ink colors
        const totalInk = config.inkColorsFront + config.inkColorsBack;
        if (totalInk > 1) businessDays += (totalInk - 1) * 2;

        // Add time for foil
        const totalFoil = config.foilColorsFront + config.foilColorsBack;
        if (totalFoil > 0) businessDays += totalFoil * 3;

        // Add time for edge painting
        if (config.edgePaint) businessDays += 3;

        // Add time for digital printing
        if (config.digitalPrintingFront || config.digitalPrintingBack) businessDays += 2;

        // Add time for die cutting
        if (config.dieCut !== 'none') businessDays += 3;

        return {
            pricePerUnit,
            subtotal: calculatedPrice.total,
            breakdown: calculatedPrice,
            turnaroundTime: `${businessDays} Business Days`
        };
    }, [config]);
}
