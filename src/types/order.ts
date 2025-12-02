import { PaperKey, PaperWeight, SizeKey, EnvelopeSizeKey } from "@/lib/pricing-config";

// Re-export types that are needed elsewhere but not exported from pricing-config
export type DieCutType = 'none' | 'stock' | 'custom';
export type EnvelopeType = 'single' | 'double';
export type ReturnAddressPrinting = 'none' | 'letterpress' | 'foil' | 'digital';

export type { PaperKey, PaperWeight, SizeKey, EnvelopeSizeKey };

export interface OrderConfiguration {
    quantity: number;
    size: SizeKey;
    paper: PaperKey;
    paperWeight: PaperWeight;

    // Front Specs
    inkColorsFront: number;
    foilColorsFront: number;
    digitalPrintingFront: boolean;
    blindDebossFront: boolean;
    blindEmbossFront: boolean;

    // Back Specs
    inkColorsBack: number;
    foilColorsBack: number;
    digitalPrintingBack: boolean;
    blindDebossBack: boolean;
    blindEmbossBack: boolean;

    // Finishing
    edgePaint: boolean;
    dieCut: DieCutType;

    // File
    uploadedFile: File | null;
}

export interface EnvelopeConfiguration {
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
