import { cn } from "@/lib/utils"
import { PaperKey, INITIAL_PAPER_COSTS } from "@/lib/pricing-config"

interface PaperTypeSelectorProps {
    value: PaperKey
    onChange: (paper: PaperKey) => void
}

export function PaperTypeSelector({ value, onChange }: PaperTypeSelectorProps) {
    const papers: PaperKey[] = ['lettra_pearl', 'lettra_fluorescent', 'handmade']

    return (
        <div className="space-y-3">
            <label className="text-sm font-bold text-charcoal uppercase tracking-wider">
                Paper Type
            </label>

            <div className="grid grid-cols-1 gap-3">
                {papers.map((paper) => (
                    <button
                        key={paper}
                        onClick={() => onChange(paper)}
                        className={cn(
                            "p-4 rounded-lg border-2 text-left transition-all duration-200",
                            value === paper
                                ? "border-gold bg-gold/5 shadow-md"
                                : "border-charcoal/10 bg-white hover:border-charcoal/30"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-charcoal">
                                    {INITIAL_PAPER_COSTS[paper].name}
                                </div>
                                {paper === 'handmade' && (
                                    <div className="text-xs text-charcoal/60 mt-1">
                                        Artisan deckle-edge paper
                                    </div>
                                )}
                            </div>
                            <div className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                value === paper
                                    ? "border-gold bg-gold"
                                    : "border-charcoal/20"
                            )}>
                                {value === paper && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
