import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { OrderConfiguration, Quantity } from "@/types/order"
import { Counter } from "@/components/ui/counter"
import { Switch } from "@/components/ui/switch"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface SpecControlProps {
    config: OrderConfiguration
    onChange: (updates: Partial<OrderConfiguration>) => void
}

const QUANTITIES: Quantity[] = [50, 100, 250, 500, 1000, 2500]

export function SpecControl({ config, onChange }: SpecControlProps) {
    const isEdgePaintingDisabled = config.paperType === "Cotton 110lb"

    return (
        <div className="space-y-8 bg-off-white/50 rounded-lg p-6 border border-charcoal/5">
            {/* Quantity Selection */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-charcoal uppercase tracking-wider">
                    Quantity
                </label>
                <div className="flex flex-wrap gap-2">
                    {QUANTITIES.map((qty) => (
                        <button
                            key={qty}
                            onClick={() => onChange({ quantity: qty })}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                                config.quantity === qty
                                    ? "bg-charcoal text-off-white border-charcoal shadow-md"
                                    : "bg-off-white text-charcoal border-charcoal/20 hover:border-charcoal/50"
                            )}
                        >
                            {qty}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Counters */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-charcoal uppercase tracking-wider block mb-2">
                    Colors & Finishes
                </label>

                <Counter
                    label="Ink Colors"
                    value={config.inkColors}
                    onChange={(val) => onChange({ inkColors: val })}
                    max={3}
                />

                <Counter
                    label="Foil Colors"
                    value={config.foilColors}
                    onChange={(val) => onChange({ foilColors: val })}
                    max={2}
                />

                {/* Edge Painting Toggle */}
                <div className="flex items-center justify-between py-4 border-b border-charcoal/10 last:border-0">
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
                        checked={config.edgePainting}
                        onCheckedChange={(checked) => onChange({ edgePainting: checked })}
                        disabled={isEdgePaintingDisabled}
                    />
                </div>
            </div>
        </div>
    )
}
