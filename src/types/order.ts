export type ProductType = 'Business Card' | 'Note Card' | 'Invite';
export type PaperType = 'Cotton 110lb' | 'Cotton 220lb (Double Thick)';
export type Quantity = 50 | 100 | 250 | 500 | 1000 | 2500;

export interface OrderConfiguration {
    productType: ProductType;
    quantity: Quantity;
    paperType: PaperType;
    inkColors: number; // 0-3
    foilColors: number; // 0-2
    edgePainting: boolean;
    uploadedFile: File | null;
}
