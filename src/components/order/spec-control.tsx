import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { OrderConfiguration } from "@/types/order"
import { Counter } from "@/components/ui/counter"
import { Switch } from "@/components/ui/switch"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { QuantitySelector } from "./quantity-selector"
import { SizeSelector } from "./size-selector"
import { PaperTypeSelector } from "./paper-type-selector"
import { PrintingOptionsSelector } from "./printing-options-selector"

interface SpecControlProps {
    config: OrderConfiguration
    onChange: (updates: Partial<OrderConfiguration>) => void
}

export function SpecControl({ config, onChange }: SpecControlProps) {
    const isEdgePaintingDisabled = config.paperWeight === 110

    return (
        <div className="space-y-8">
            {/* Size Selection */}
            <div className="bg-off-white/50 rounded-lg p-6 border border-charcoal/5">
                <SizeSelector
                    value={config.size}
                    onChange={(size) => onChange({ size })}
                />
            </div>

            {/* Quantity Selection */}
            <div className="bg-off-white/50 rounded-lg p-6 border border-charcoal/5">
                <QuantitySelector
                    value={config.quantity}
                    onChange={(quantity) => onChange({ quantity })}
                />
            </div>

            {/* Paper Type */}
            <div className="bg-off-white/50 rounded-lg p-6 border border-charcoal/5">
                <PaperTypeSelector
                    value={config.paper}
                    onChange={(paper) => onChange({ paper })}
                />
            </div>

            {/* Color Counters */}
            <div className="bg-off-white/50 rounded-lg p-6 border border-charcoal/5">
                <label className="text-sm font-bold text-charcoal uppercase tracking-wider block mb-4">
                    Letterpress Colors
                </label>

                <div className="space-y-2">
                    <Counter
                        label="Ink Colors (Front)"
                        value={config.inkColorsFront}
                        onChange={(val) => onChange({ inkColorsFront: val })}
                        max={3}
                    />

                    <Counter
                        label="Foil Colors (Front)"
                        value={config.foilColorsFront}
                        onChange={(val) => onChange({ foilColorsFront: val })}
                        max={2}
                    />

                    <Counter
                        label="Ink Colors (Back)"
                        value={config.inkColorsBack}
                        onChange={(val) => onChange({ inkColorsBack: val })}
                        max={3}
                    />

                    <Counter
                        label="Foil Colors (Back)"
                        value={config.foilColorsBack}
                        onChange={(val) => onChange({ foilColorsBack: val })}
                        max={2}
                    />
                </div>
            </div>

            {/* Printing Options */}
            <div className="bg-off-white/50 rounded-lg p-6 border border-charcoal/5">
                <PrintingOptionsSelector
                    config={config}
                    onChange={onChange}
                />
            </div>

            {/* Edge Painting */}
            <div className="bg-off-white/50 rounded-lg p-6 border border-charcoal/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "font-medium transition-colors",
                            isEdgePaintingDisabled ? "text-charcoal/40" : "text-charcoal"
                        )}>
                            Edge Painting
                        </span>
                        {isEdgePaintingDisabled && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="w-4 h-4 text-charcoal/40" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Edge painting is only available on Double Thick paper.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>

                    <Switch
                        checked={config.edgePaint}
                        onCheckedChange={(checked) => onChange({ edgePaint: checked })}
                        disabled={isEdgePaintingDisabled}
                    />
                </div>
            </div>
        </div>
    )
}
