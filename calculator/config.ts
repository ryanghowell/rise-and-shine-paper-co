// --- TYPE DEFINITIONS ---
export type SizeKey = 'business_card' | 'small_f' | 'four_bar' | 'four_bar_f' | 'a2' | 'a2f' | 'a6' | 'a6f' | 'a7' | 'a7f' | 'a8' | 'a9' | 'square_5_25';
export type PaperKey = 'lettra_pearl' | 'lettra_fluorescent' | 'handmade';
export type PaperWeight = 110 | 220;
export type EnvelopeSizeKey = 'four_bar' | 'a2' | 'a6' | 'a7' | 'a9' | 'square_5_25';

export type CardSpecsType = Record<SizeKey, {
    plateInches: number;
    weights: Partial<Record<PaperWeight, { yield: number; }>>;
}>;

// --- CONSTANTS & DATA ---
export const INITIAL_CALCULATION_VARS = {
  baseLaborRate: 100,      // Per Hour
  letterpressIPH: 800,     // Impressions Per Hour
  foilIPH: 500,            // Impressions Per Hour
  dieCutIPH: 800,          // Impressions Per Hour
  duplexIPH: 200,          // Impressions Per Hour
  dieCutSetupHours: 0.5,
  customDieBaseCost: 95,
  letterpressSetupHours: 1,
  foilSetupHours: 1,
  plateChangeCost: 25,     // Cost to change a plate mid-run for a new set
  digitalPrintingSetupCost: 50, // Flat fee
  duplexSetupCost: 55,      // Flat fee
  photopolymerPlateCost: 3, // Per Square Inch
  copperPlateCost: 6,       // Per Square Inch
  edgePaintSetup: 50,      // Flat fee
  edgePaintPerPiece: 0.50,
  baseMakereadySheets: 75,
  additionalProcessMakereadySheets: 25,
  runWastePercentage: 0.10, // 10%
};

export const INITIAL_ENVELOPE_VARS = {
  letterpressReturnAddressSetup: 135,
  letterpressReturnAddressRun: 0.25,
  foilReturnAddressSetup: 135,
  foilReturnAddressRun: 0.50,
  digitalReturnAddress: 0.50,
  digitalGuestAddress: 0.50,
  digitalInnerGuestAddress: 0.50,
  envelopeLinerAssemblyCost: 0.50,
  envelopePrintingMakeready: 25,
  envelopePrintingWastePercentage: 0.05, // 5%
};

export const INITIAL_ENVELOPE_COSTS: Record<EnvelopeSizeKey, number> = {
  'four_bar': 0.45,
  'a2': 0.55,
  'a6': 0.65,
  'a7': 0.75,
  'a9': 0.95,
  'square_5_25': 0.85,
};

export const INITIAL_ENVELOPE_LINER_COSTS: Record<EnvelopeSizeKey, number> = {
  'four_bar': 1.25,
  'a2': 1.35,
  'a6': 1.45,
  'a7': 1.55,
  'a9': 1.65,
  'square_5_25': 1.65,
};


export const INITIAL_PAPER_COSTS: Record<PaperKey, { name: string; costs: Partial<Record<PaperWeight, { cost: number; }>> }> = {
  'lettra_pearl': { name: "Crane's Lettra Pearl White", costs: { 110: { cost: 8 }, 220: { cost: 10 } } },
  'lettra_fluorescent': { name: "Crane's Lettra Fluorescent White", costs: { 110: { cost: 8 }, 220: { cost: 10 } } },
  'handmade': { name: "Handmade Paper", costs: { 110: { cost: 0 }, 220: { cost: 0 } } }, // Costs are per-piece, not per-sheet
};


export const INITIAL_HANDMADE_PAPER_COSTS: Partial<Record<SizeKey, number>> = {
  'business_card': 0.85,
  'four_bar': 1.10,
  'a2': 1.25,
  'a6': 1.40,
  'a7': 1.50,
  'a8': 1.60,
  'a9': 1.75,
  'square_5_25': 1.50,
};

export const INITIAL_DIGITAL_PRINTING_COSTS: Partial<Record<SizeKey, number>> = {
  'business_card': 0.50,
  'small_f': 0.90,
  'four_bar': 0.60,
  'four_bar_f': 1.10,
  'a2': 0.65,
  'a2f': 1.20,
  'a6': 0.70,
  'a6f': 1.30,
  'a7': 0.76,
  'a7f': 1.40,
  'a8': 0.80,
  'a9': 0.85,
  'square_5_25': 0.76,
 };


export const INITIAL_CARD_SPECS: CardSpecsType = {
  'a7':          { plateInches: 48,    weights: { 110: { yield: 20 }, 220: { yield: 9 } } },
  'a9':          { plateInches: 61.75, weights: { 110: { yield: 16 }, 220: { yield: 8 } } },
  'a8':          { plateInches: 56,    weights: { 110: { yield: 16 }, 220: { yield: 8 } } },
  'a2':          { plateInches: 35,    weights: { 110: { yield: 30 }, 220: { yield: 15 } } },
  'a6':          { plateInches: 40,    weights: { 110: { yield: 24 }, 220: { yield: 12 } } },
  'four_bar':    { plateInches: 33,    weights: { 110: { yield: 30 }, 220: { yield: 15 } } },
  'business_card': { plateInches: 13.5,  weights: { 110: { yield: 56 }, 220: { yield: 28 } } },
  'a7f':         { plateInches: 48,    weights: { 110: { yield: 10 } } },
  'a2f':         { plateInches: 35,    weights: { 110: { yield: 12 } } },
  'a6f':         { plateInches: 40,    weights: { 110: { yield: 11 } } },
  'four_bar_f':  { plateInches: 33,    weights: { 110: { yield: 18 } } },
  'small_f':     { plateInches: 27,    weights: { 110: { yield: 30 } } },
  'square_5_25': { plateInches: 48,    weights: { 110: { yield: 20 }, 220: { yield: 9 } } },
};

export const SIZES: Record<SizeKey, { name: string; dimensions: string; }> = {
  'business_card': { name: "Business Card", dimensions: "3.5 x 2 in" },
  'small_f': { name: "Small Folding Card", dimensions: "3.5 x 4 in (folds to 3.5 x 2 in)" },
  'four_bar': { name: "4-Bar Card", dimensions: "3.5 x 4.875 in" },
  'four_bar_f': { name: "4-Bar Folded Card", dimensions: "7 x 4.875 in (folds to 3.5 x 4.875 in)" },
  'a2': { name: "A2 Card", dimensions: "4.25 x 5.5 in" },
  'a2f': { name: "A2 Folded Card", dimensions: "8.5 x 5.5 in (folds to 4.25 x 5.5 in)" },
  'a6': { name: "A6 Card", dimensions: "4.5 x 6.25 in" },
  'a6f': { name: "A6 Folded Card", dimensions: "9 x 6.25 in (folds to 4.5 x 6.25 in)" },
  'a7': { name: "A7 Card", dimensions: "5 x 7 in" },
  'a7f': { name: "A7 Folded Card", dimensions: "10 x 7 in (folds to 5 x 7 in)" },
  'square_5_25': { name: "5.25\" Square Card", dimensions: "5.25 x 5.25 in" },
  'a8': { name: "A8 Card", dimensions: "5.25 x 7.875 in" },
  'a9': { name: "A9 Card", dimensions: "5.5 x 8.5 in" },
};

export const ENVELOPE_DETAILS: Record<EnvelopeSizeKey, { name: string; dimensions: string; }> = {
  'four_bar': { name: "4-Bar Envelope", dimensions: "3.625 x 5.125 in" },
  'a2': { name: "A2 Envelope", dimensions: "4.375 x 5.75 in" },
  'a6': { name: "A6 Envelope", dimensions: "4.75 x 6.5 in" },
  'a7': { name: "A7 Envelope", dimensions: "5.25 x 7.25 in" },
  'a9': { name: "A9 Envelope", dimensions: "5.75 x 8.75 in" },
  'square_5_25': { name: "5.5\" Square Envelope", dimensions: "5.5 x 5.5 in" },
};

export const ENVELOPE_SIZES: Partial<Record<SizeKey, EnvelopeSizeKey>> = {
  'four_bar': 'four_bar',
  'four_bar_f': 'four_bar',
  'a2': 'a2',
  'a2f': 'a2',
  'a6': 'a6',
  'a6f': 'a6',
  'a7': 'a7',
  'a7f': 'a7',
  'a9': 'a9',
  'square_5_25': 'square_5_25',
};