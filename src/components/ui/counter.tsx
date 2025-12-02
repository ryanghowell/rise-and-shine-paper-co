import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface CounterProps {
    label: string
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
}

export function Counter({ label, value, onChange, min = 0, max = 3 }: CounterProps) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-charcoal/10 last:border-0">
            <span className="font-medium text-charcoal">{label}</span>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onChange(Math.max(min, value - 1))}
                    disabled={value <= min}
                    className="p-1 rounded-full hover:bg-charcoal/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <Minus className="w-4 h-4 text-charcoal" />
                </button>
                <span className="w-8 text-center font-mono font-medium text-charcoal">
                    {value}
                </span>
                <button
                    onClick={() => onChange(Math.min(max, value + 1))}
                    disabled={value >= max}
                    className="p-1 rounded-full hover:bg-charcoal/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <Plus className="w-4 h-4 text-charcoal" />
                </button>
            </div>
        </div>
    )
}
