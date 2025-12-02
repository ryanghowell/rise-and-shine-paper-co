import {
    INITIAL_CALCULATION_VARS,
    INITIAL_PAPER_COSTS,
    INITIAL_HANDMADE_PAPER_COSTS,
    INITIAL_DIGITAL_PRINTING_COSTS,
    INITIAL_CARD_SPECS,
    INITIAL_ENVELOPE_VARS,
    INITIAL_ENVELOPE_COSTS,
    INITIAL_ENVELOPE_LINER_COSTS
} from './pricing-config';
import { OrderConfiguration, EnvelopeConfiguration } from '@/types/order';

export interface CalculatedPrice {
    basePrice: number;
    edgePaintCost: number;
    dieCutCost: number;
    duplexCost: number;
    total: number;
}

export const calculateCardPrice = (
    options: OrderConfiguration
): CalculatedPrice => {
    const vars = INITIAL_CALCULATION_VARS;
    const paperCosts = INITIAL_PAPER_COSTS;
    const cardSpecs = INITIAL_CARD_SPECS;
    const handmadePaperCosts = INITIAL_HANDMADE_PAPER_COSTS;
    const digitalPrintingCosts = INITIAL_DIGITAL_PRINTING_COSTS;

    let basePrice = 0, edgePaintCost = 0, dieCutCost = 0, duplexCost = 0;

    const noPrintingSelected = options.inkColorsFront === 0 && options.foilColorsFront === 0 && !options.digitalPrintingFront && !options.blindDebossFront && !options.blindEmbossFront && options.inkColorsBack === 0 && options.foilColorsBack === 0 && !options.digitalPrintingBack && !options.blindDebossBack && !options.blindEmbossBack;

    const originalIsFolding = options.size.endsWith('f');
    const hasBackLetterpress = options.inkColorsBack > 0 || options.foilColorsBack > 0 || options.blindDebossBack || options.blindEmbossBack;
    const hasBackPrinting = hasBackLetterpress || options.digitalPrintingBack;

    const isFoldOverBusinessCard = options.size === 'business_card' &&
        options.paperWeight === 220 &&
        hasBackPrinting &&
        options.paper !== 'handmade';

    const calcOptions = { ...options };
    if (isFoldOverBusinessCard) {
        calcOptions.size = 'small_f';
        calcOptions.paperWeight = 110;
    }

    if (!noPrintingSelected) {
        let setupCost = 0, plateCost = 0, paperCost = 0, runLaborCost = 0, digitalCost = 0;

        const totalInkColors = calcOptions.inkColorsFront + calcOptions.inkColorsBack;
        const totalFoilColors = calcOptions.foilColorsFront + calcOptions.foilColorsBack;
        const totalDebossPasses = (calcOptions.blindDebossFront ? 1 : 0) + (calcOptions.blindDebossBack ? 1 : 0);
        const totalEmbossPasses = (calcOptions.blindEmbossFront ? 1 : 0) + (calcOptions.blindEmbossBack ? 1 : 0);

        const effectiveLetterpressPasses = totalInkColors + totalDebossPasses;
        const effectiveFoilPasses = totalFoilColors + totalEmbossPasses;

        const hasInk = totalInkColors > 0 || totalDebossPasses > 0;
        const hasFoil = totalFoilColors > 0 || totalEmbossPasses > 0;

        const isCalculatingForFolding = calcOptions.size.endsWith('f');
        const effectivePaperWeight = isCalculatingForFolding || calcOptions.paper === 'handmade' ? 110 : calcOptions.paperWeight;

        const spec = cardSpecs[calcOptions.size];
        const weightSpec = spec.weights[effectivePaperWeight];

        if (spec && weightSpec && !(isCalculatingForFolding && effectivePaperWeight === 220) && !(calcOptions.paper !== 'handmade' && weightSpec.yield === 0) && !(isCalculatingForFolding && calcOptions.paper === 'handmade')) {
            let setupHours = 0;
            setupHours += vars.letterpressSetupHours * effectiveLetterpressPasses;
            setupHours += vars.foilSetupHours * effectiveFoilPasses;
            setupCost = (setupHours * vars.baseLaborRate);

            const inkPlateCost = hasInk ? spec.plateInches * vars.photopolymerPlateCost * effectiveLetterpressPasses : 0;
            const foilPlateCost = hasFoil ? spec.plateInches * vars.copperPlateCost * effectiveFoilPasses : 0;
            plateCost = inkPlateCost + foilPlateCost;

            const printingProcesses = effectiveLetterpressPasses + effectiveFoilPasses + (calcOptions.digitalPrintingFront || calcOptions.digitalPrintingBack ? 1 : 0);
            let additionalProcessEvents = 0;
            if (printingProcesses > 1) {
                additionalProcessEvents += (printingProcesses - 1);
            }
            if (calcOptions.dieCut !== 'none') {
                additionalProcessEvents++;
            }
            if (calcOptions.edgePaint) {
                additionalProcessEvents++;
            }

            const makereadySheets = vars.baseMakereadySheets + (additionalProcessEvents * vars.additionalProcessMakereadySheets);
            const runWastePieces = calcOptions.quantity * vars.runWastePercentage;
            const totalPiecesToProduce = calcOptions.quantity + makereadySheets + runWastePieces;

            const isStandardDuplexing = (options.paperWeight === 220 && !originalIsFolding && !isFoldOverBusinessCard && options.paper !== 'handmade') && (hasBackPrinting || options.digitalPrintingFront);

            if (isStandardDuplexing) {
                const paperInfo = paperCosts[options.paper];
                const costPer110Sheet = paperInfo.costs[110]?.cost ?? 0;
                const yieldFor110 = cardSpecs[options.size].weights[110]?.yield ?? 1;
                const sheetsNeededForDuplex = Math.ceil((totalPiecesToProduce * 2) / yieldFor110);
                paperCost = sheetsNeededForDuplex * costPer110Sheet;
            } else if (calcOptions.paper === 'handmade') {
                const costPerPiece = handmadePaperCosts[calcOptions.size] ?? 0;
                paperCost = totalPiecesToProduce * costPerPiece;
            } else {
                const paperInfo = paperCosts[calcOptions.paper];
                const costPerSheet = paperInfo.costs[effectivePaperWeight]?.cost ?? 0;
                const sheetsNeeded = Math.ceil(totalPiecesToProduce / (weightSpec.yield ?? 1));
                paperCost = sheetsNeeded * costPerSheet;
            }

            let printingRunHours = 0;
            const letterpressImpressions = calcOptions.quantity * effectiveLetterpressPasses;
            const foilImpressions = calcOptions.quantity * effectiveFoilPasses;
            printingRunHours += letterpressImpressions / vars.letterpressIPH;
            printingRunHours += foilImpressions / vars.foilIPH;
            runLaborCost = printingRunHours * vars.baseLaborRate;

            if (calcOptions.digitalPrintingFront || calcOptions.digitalPrintingBack) {
                const digitalSetup = vars.digitalPrintingSetupCost;
                const sideCost = (digitalPrintingCosts[calcOptions.size] ?? 0) * calcOptions.quantity;
                let digitalRun = 0;
                if (calcOptions.digitalPrintingFront) { digitalRun += sideCost; }
                if (calcOptions.digitalPrintingBack) { digitalRun += sideCost; }
                digitalCost = digitalSetup + digitalRun;
            }

            const scoringCost = (originalIsFolding && !isFoldOverBusinessCard) ? (vars.dieCutSetupHours * vars.baseLaborRate) + ((options.quantity / vars.dieCutIPH) * vars.baseLaborRate) : 0;

            basePrice = setupCost + plateCost + paperCost + runLaborCost + scoringCost + digitalCost;
        }
    }

    edgePaintCost = options.edgePaint && options.dieCut === 'none'
        ? vars.edgePaintSetup + (options.quantity * vars.edgePaintPerPiece)
        : 0;

    if (options.dieCut !== 'none') {
        const dieCutRunLaborHours = (options.quantity / vars.dieCutIPH);
        const dieCutSetupCost = (vars.dieCutSetupHours * vars.baseLaborRate);
        const dieCutRunCost = dieCutRunLaborHours * vars.baseLaborRate;
        const customDieCost = options.dieCut === 'custom' ? vars.customDieBaseCost : 0;
        dieCutCost = dieCutSetupCost + dieCutRunCost + customDieCost;
    } else {
        dieCutCost = 0;
    }

    const isStandardDuplexing = (options.paperWeight === 220 && !originalIsFolding && !isFoldOverBusinessCard && options.paper !== 'handmade') && (hasBackPrinting || options.digitalPrintingFront);
    if (isStandardDuplexing) {
        const duplexRunLaborHours = (options.quantity / vars.duplexIPH);
        const duplexRunCost = duplexRunLaborHours * vars.baseLaborRate;
        duplexCost = vars.duplexSetupCost + duplexRunCost;
    } else if (isFoldOverBusinessCard) {
        const perforationCost = (vars.dieCutSetupHours * vars.baseLaborRate) + ((options.quantity / vars.dieCutIPH) * vars.baseLaborRate);
        duplexCost = perforationCost;
    } else {
        duplexCost = 0;
    }

    const total = basePrice + edgePaintCost + dieCutCost + duplexCost;

    return {
        basePrice: Math.round(basePrice),
        edgePaintCost: Math.round(edgePaintCost),
        dieCutCost: Math.round(dieCutCost),
        duplexCost: Math.round(duplexCost),
        total: Math.round(total)
    };
};

export const calculateEnvelopePrice = (
    options: EnvelopeConfiguration
): number => {
    const envelopeVars = INITIAL_ENVELOPE_VARS;
    const envelopeCosts = INITIAL_ENVELOPE_COSTS;
    const envelopeLinerCosts = INITIAL_ENVELOPE_LINER_COSTS;

    let envelopeCost = 0;
    const envelopeSize = options.size;

    if (envelopeSize) {
        let blankEnvelopeCost = 0;
        let returnAddressCost = 0;
        let guestAddressCost = 0;
        let linerCost = 0;

        const singleEnvelopeCost = envelopeCosts[envelopeSize] ?? 0;
        let outerEnvelopesNeeded = options.quantity;

        const hasOuterPrinting = options.returnAddressPrinting !== 'none' || options.guestAddressing;

        if (hasOuterPrinting) {
            const makeready = envelopeVars.envelopePrintingMakeready;
            const waste = options.quantity * envelopeVars.envelopePrintingWastePercentage;
            outerEnvelopesNeeded += makeready + waste;
        }

        if (options.type === 'double') {
            let innerEnvelopesNeeded = options.quantity;
            const hasInnerPrinting = options.innerGuestAddressing;
            if (hasInnerPrinting) {
                const makeready = envelopeVars.envelopePrintingMakeready;
                const waste = options.quantity * envelopeVars.envelopePrintingWastePercentage;
                innerEnvelopesNeeded += makeready + waste;
            }
            blankEnvelopeCost = (outerEnvelopesNeeded + innerEnvelopesNeeded) * singleEnvelopeCost;
        } else {
            blankEnvelopeCost = outerEnvelopesNeeded * singleEnvelopeCost;
        }

        switch (options.returnAddressPrinting) {
            case 'letterpress':
                returnAddressCost = envelopeVars.letterpressReturnAddressSetup + (options.quantity * envelopeVars.letterpressReturnAddressRun);
                break;
            case 'foil':
                returnAddressCost = envelopeVars.foilReturnAddressSetup + (options.quantity * envelopeVars.foilReturnAddressRun);
                break;
            case 'digital':
                returnAddressCost = options.quantity * envelopeVars.digitalReturnAddress;
                break;
        }

        if (options.guestAddressing) {
            guestAddressCost += options.quantity * envelopeVars.digitalGuestAddress;
        }
        if (options.type === 'double' && options.innerGuestAddressing) {
            guestAddressCost += options.quantity * envelopeVars.digitalInnerGuestAddress;
        }

        if (options.liner) {
            const linerPrintCost = (envelopeLinerCosts[envelopeSize] ?? 0) * options.quantity;
            const linerAssemblyCost = options.linerAssembly ? (envelopeVars.envelopeLinerAssemblyCost * options.quantity) : 0;
            linerCost = linerPrintCost + linerAssemblyCost;
        }

        envelopeCost = blankEnvelopeCost + returnAddressCost + guestAddressCost + linerCost;
    }

    return Math.round(envelopeCost);
};
