
import type React from 'react';
import { PaperKey, PaperWeight, SizeKey, EnvelopeSizeKey } from './config';

// --- TYPE DEFINITIONS ---
export type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';
export type EnvelopeType = 'single' | 'double';
export type ReturnAddressPrinting = 'none' | 'letterpress' | 'foil' | 'digital';
export type DieCutType = 'none' | 'stock' | 'custom';
export type ProductType = 'invitationSuite';

export interface EnvelopeQuoteOptions {
    quantity: number;
    size: EnvelopeSizeKey;
    type: EnvelopeType;
    returnAddressPrinting: ReturnAddressPrinting;
    returnAddressLocation: 'front' | 'back';
    guestAddressing: boolean;
    innerGuestAddressing: boolean;
    liner: boolean;
    linerAssembly: boolean;
}

export interface QuoteOptions {
  quantity: number;
  paper: PaperKey;
  paperWeight: PaperWeight;
  size: SizeKey;
  inkColorsFront: number;
  foilColorsFront: number;
  digitalPrintingFront: boolean;
  blindDebossFront: boolean;
  blindEmbossFront: boolean;
  inkColorsBack: number;
  foilColorsBack: number;
  digitalPrintingBack: boolean;
  blindDebossBack: boolean;
  blindEmbossBack: boolean;
  edgePaint: boolean;
  dieCut: DieCutType;
}

export interface CardItem {
  id: number;
  type: 'card';
  name: string;
  options: QuoteOptions;
}

export interface EnvelopeItem {
  id: number;
  type: 'envelope';
  name: string;
  options: EnvelopeQuoteOptions;
}

export type SuiteItem = CardItem | EnvelopeItem;

export interface CalculatedPrice {
  basePrice: number;
  edgePaintCost: number;
  dieCutCost: number;
  duplexCost: number;
  total: number;
}

// Fix: Created a discriminated union for priced items to allow for better type inference.
export interface PricedCardItem {
  id: number;
  name: string;
  total: number;
  type: 'card';
  options: QuoteOptions;
  dieCutCost?: number;
  edgePaintCost?: number;
  duplexCost?: number;
}

export interface PricedEnvelopeItem {
  id: number;
  name: string;
  total: number;
  type: 'envelope';
  options: EnvelopeQuoteOptions;
}

export interface SuitePricing {
  itemPrices: Array<PricedCardItem | PricedEnvelopeItem>;
  grandTotal: number;
}

export interface ProductConfig {
  productName: string;
  description: string;
  // Fix: Use React.ReactElement to avoid JSX namespace error in a .ts file.
  icon: React.ReactElement;
  defaultCardName: string;
  defaultOptions: Partial<QuoteOptions>;
  allowedSizes: SizeKey[];
  allowedPapers: PaperKey[];
  allowEnvelopes: boolean;
  allowMultipleCards: boolean;
  showProcessTimeline: boolean;
}
