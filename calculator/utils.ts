import { CardItem, QuoteOptions, EnvelopeItem, SuiteItem } from './types';

export const DEFAULT_CARD_NAME = "Card #1";

export const getNewCard = (id: number, name: string, defaultOptions: Partial<QuoteOptions> = {}): CardItem => ({
    id,
    type: 'card',
    name,
    options: {
        quantity: 25,
        paper: 'lettra_pearl',
        paperWeight: 110,
        size: 'a7',
        inkColorsFront: 1,
        foilColorsFront: 0,
        digitalPrintingFront: false,
        blindDebossFront: false,
        blindEmbossFront: false,
        inkColorsBack: 0,
        foilColorsBack: 0,
        digitalPrintingBack: false,
        blindDebossBack: false,
        blindEmbossBack: false,
        edgePaint: false,
        dieCut: 'none',
        ...defaultOptions,
    },
});

export const getNewEnvelope = (id: number, quantity: number): EnvelopeItem => ({
    id,
    type: 'envelope',
    name: 'Envelopes',
    options: {
        quantity,
        size: 'a7',
        type: 'single',
        returnAddressPrinting: 'none',
        returnAddressLocation: 'back',
        guestAddressing: false,
        innerGuestAddressing: false,
        liner: false,
        linerAssembly: false,
    }
});


export const formatCurrency = (value: number | null) => {
  if (value === null) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
