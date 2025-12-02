import React, { useMemo } from 'react';
import { SIZES } from './config';
import { QuoteOptions } from './types';

const CardPreviewComponent: React.FC<{ options: QuoteOptions }> = ({ options }) => {
    const { size, edgePaint, inkColorsFront, foilColorsFront, digitalPrintingFront, blindDebossFront, blindEmbossFront, inkColorsBack, foilColorsBack, digitalPrintingBack, blindDebossBack, blindEmbossBack } = options;

    const previewData = useMemo(() => {
        const sizeInfo = SIZES[size];
        const dimensionString = sizeInfo.dimensions.split(' (')[0];
        const [width, height] = dimensionString.split(' x ').map(s => parseFloat(s));
        const aspectRatio = width && height ? width / height : 1;
        const isFolding = size.endsWith('f');

        return { aspectRatio, isFolding };
    }, [size]);

    const frontProcesses = [
        digitalPrintingFront ? "Digital" : null,
        inkColorsFront > 0 ? `${inkColorsFront} Ink` : null,
        foilColorsFront > 0 ? `${foilColorsFront} Foil` : null,
        blindDebossFront ? "Deboss" : null,
        blindEmbossFront ? "Emboss" : null,
    ].filter(Boolean);

    const backProcesses = [
        digitalPrintingBack ? "Digital" : null,
        inkColorsBack > 0 ? `${inkColorsBack} Ink` : null,
        foilColorsBack > 0 ? `${foilColorsBack} Foil` : null,
        blindDebossBack ? "Deboss" : null,
        blindEmbossBack ? "Emboss" : null,
    ].filter(Boolean);

    return (
        <div className="sticky top-4 flex flex-col items-center justify-center p-1">
            <div
                className="w-full max-w-[240px] transition-all duration-300"
                style={{ aspectRatio: previewData.aspectRatio }}
            >
                <div
                    className={`relative w-full h-full bg-white/80 backdrop-blur-sm rounded-md shadow-md border border-stone-200/50 transition-all duration-300 group
                        ${edgePaint ? 'ring-2 ring-offset-2 ring-offset-stone-100 ring-green-800' : ''}`}
                >
                    {previewData.isFolding && (
                        <div className="absolute inset-y-0 left-1/2 w-px bg-stone-300/70"></div>
                    )}

                    <div className="absolute inset-0 p-2 flex flex-col justify-between text-xs font-medium text-stone-400">
                        <div className="text-left">
                            {frontProcesses.length > 0 && <span className="bg-stone-100/50 rounded-full px-1.5 py-0.5 text-[10px]">Front: {frontProcesses.join(' + ')}</span>}
                        </div>
                        <div className="text-right">
                           {backProcesses.length > 0 && <span className="bg-stone-100/50 rounded-full px-1.5 py-0.5 text-[10px]">Back: {backProcesses.join(' + ')}</span>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center mt-2">
                <p className="font-medium text-xs text-stone-700">{SIZES[size].name}</p>
                <p className="text-[10px] text-stone-500">{SIZES[size].dimensions}</p>
            </div>
        </div>
    );
};

export const CardPreview = React.memo(CardPreviewComponent);