import { cn } from "@/lib/utils"
import { OrderConfiguration } from "@/types/order"
import { Switch } from "@/components/ui/switch"

interface PrintingOptionsSelectorProps {
    config: OrderConfiguration
    onChange: (updates: Partial<OrderConfiguration>) => void
}

export function PrintingOptionsSelector({ config, onChange }: PrintingOptionsSelectorProps) {
    return (
        <div className="space-y-4">
            <label className="text-sm font-bold text-charcoal uppercase tracking-wider">
                Additional Options
            </label>

            <div className="bg-off-white/50 rounded-lg border border-charcoal/5 divide-y divide-charcoal/10">
                {/* Digital Printing Front */}
                <div className="flex items-center justify-between p-4">
                    <div>
                        <div className="font-medium text-charcoal">Digital Printing (Front)</div>
                        <div className="text-xs text-charcoal/60 mt-1">
                            Full-color CMYK printing
                        </div>
                    </div>
                    <Switch
                        checked={config.digitalPrintingFront}
                        onCheckedChange={(checked) => onChange({ digitalPrintingFront: checked })}
                    />
                </div>

                {/* Digital Printing Back */}
                <div className="flex items-center justify-between p-4">
                    <div>
                        <div className="font-medium text-charcoal">Digital Printing (Back)</div>
                        <div className="text-xs text-charcoal/60 mt-1">
                            Full-color CMYK printing
                        </div>
                    </div>
                    <Switch
                        checked={config.digitalPrintingBack}
                        onCheckedChange={(checked) => onChange({ digitalPrintingBack: checked })}
                    />
                </div>

                {/* Blind Deboss Front */}
                <div className="flex items-center justify-between p-4">
                    <div>
                        <div className="font-medium text-charcoal">Blind Deboss (Front)</div>
                        <div className="text-xs text-charcoal/60 mt-1">
                            Impression without ink
                        </div>
                    </div>
                    <Switch
                        checked={config.blindDebossFront}
                        onCheckedChange={(checked) => onChange({ blindDebossFront: checked })}
                    />
                </div>

                {/* Blind Emboss Front */}
                <div className="flex items-center justify-between p-4">
                    <div>
                        <div className="font-medium text-charcoal">Blind Emboss (Front)</div>
                        <div className="text-xs text-charcoal/60 mt-1">
                            Raised impression without ink
                        </div>
                    </div>
                    <Switch
                        checked={config.blindEmbossFront}
                        onCheckedChange={(checked) => onChange({ blindEmbossFront: checked })}
                    />
                </div>

                {/* Die Cut */}
                <div className="p-4">
                    <div className="font-medium text-charcoal mb-3">Die Cutting</div>
                    <div className="flex gap-2">
                        {(['none', 'stock', 'custom'] as const).map((option) => (
                            <button
                                key={option}
                                onClick={() => onChange({ dieCut: option })}
                                className={cn(
                                    "flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200",
                                    config.dieCut === option
                                        ? "border-charcoal bg-charcoal text-off-white"
                                        : "border-charcoal/20 bg-white text-charcoal hover:border-charcoal/40"
                                )}
                            >
                                {option === 'none' && 'None'}
                                {option === 'stock' && 'Stock Shape'}
                                {option === 'custom' && 'Custom Die'}
                            </button>
                        ))}
                    </div>
                    {config.dieCut === 'custom' && (
                        <div className="mt-2 text-xs text-charcoal/60 bg-gold/10 p-2 rounded">
                            Custom die adds $95 one-time fee
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
