
import React from 'react';
import { ProductConfig, ProductType, QuoteOptions } from './types';

const INVITATION_SUITE_OPTIONS: Partial<QuoteOptions> = {
  quantity: 25,
  size: 'a7',
  paper: 'lettra_pearl',
  paperWeight: 110,
  inkColorsFront: 1,
};

export const PRODUCT_CONFIGS: Record<ProductType, ProductConfig> = {
  invitationSuite: {
    productName: 'Invitation Suite',
    description: 'Build a full wedding or event invitation suite with multiple cards and finishing options.',
    icon: React.createElement('svg', 
      { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" })
    ),
    defaultCardName: 'Card #1',
    defaultOptions: INVITATION_SUITE_OPTIONS,
    allowedSizes: ['business_card', 'small_f', 'four_bar', 'four_bar_f', 'a2', 'a2f', 'a6', 'a6f', 'a7', 'a7f', 'square_5_25', 'a8', 'a9'],
    allowedPapers: ['lettra_pearl', 'lettra_fluorescent', 'handmade'],
    allowEnvelopes: true,
    allowMultipleCards: true,
    showProcessTimeline: true,
  },
};