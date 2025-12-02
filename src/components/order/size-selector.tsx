import { cn } from "@/lib/utils"
import { SizeKey, SIZES } from "@/lib/pricing-config"

interface SizeSelectorProps {
    value: SizeKey
    onChange: (size: SizeKey) => void
}

const SIZE_CATEGORIES = {
    "Business Cards": ['business_card', 'small_f'] as SizeKey[],
    "Standard Cards": ['four_bar', 'a2', 'a6', 'a7'] as SizeKey[],
    "Folded Cards": ['four_bar_f', 'a2f', 'a6f', 'a7f'] as SizeKey[],
    "Large Cards": ['a8', 'a9', 'square_5_25'] as SizeKey[],
}

export function SizeSelector({ value, onChange }: SizeSelectorProps) {
    return (
        <div className="space-y-4">
            <label className="text-sm font-bold text-charcoal uppercase tracking-wider">
                Card Size
            </label>

            <div className="space-y-6">
                {Object.entries(SIZE_CATEGORIES).map(([category, sizes]) => (
                    <div key={category}>
                        <h4 className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">
                            {category}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => onChange(size)}
                                    className={cn(
                                        "p-3 rounded-lg border-2 text-left transition-all duration-200",
                                        value === size
                                            ? "border-gold bg-gold/5 shadow-md"
                                            : "border-charcoal/10 bg-white hover:border-charcoal/30"
                                    )}
                                >
                                    <div className="font-medium text-sm text-charcoal">
                                        {SIZES[size].name}
                                    </div>
                                    <div className="text-xs text-charcoal/60 mt-1">
                                        {SIZES[size].dimensions}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
