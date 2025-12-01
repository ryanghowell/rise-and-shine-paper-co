import { InkColor } from "@/lib/ink-library"

interface ColorChipProps {
    color: InkColor
}

export function ColorChip({ color }: ColorChipProps) {
    return (
        <div className="group relative bg-off-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden aspect-[3/4]">
            {/* Color Block (Top 70%) */}
            <div
                className="h-[70%] relative"
                style={{ backgroundColor: color.hex }}
            >
                {/* Paper grain texture overlay */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, ${color.hex} 0.5px, transparent 0.5px), radial-gradient(circle at 75% 75%, ${color.hex} 0.5px, transparent 0.5px)`,
                        backgroundSize: '4px 4px',
                        backgroundPosition: '0 0, 2px 2px',
                        filter: 'brightness(0.9)',
                    }}
                />

                {/* Hover overlay to show hex */}
                <div className="absolute inset-0 bg-charcoal/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-off-white font-mono text-sm">{color.hex}</span>
                </div>
            </div>

            {/* Info Block (Bottom 30%) */}
            <div className="h-[30%] bg-off-white p-3 flex flex-col justify-center">
                <h3 className="font-bold text-charcoal text-sm mb-1 leading-tight">
                    {color.name}
                </h3>
                <p className="font-mono text-xs text-charcoal/70 leading-tight">
                    {color.pms}
                </p>
            </div>
        </div>
    )
}
