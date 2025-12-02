import { useState } from "react"
import { cn } from "@/lib/utils"

interface QuantitySelectorProps {
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
}

export function QuantitySelector({ value, onChange, min = 50, max = 2500 }: QuantitySelectorProps) {
    const [inputValue, setInputValue] = useState(value.toString())

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value)
        onChange(newValue)
        setInputValue(newValue.toString())
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleInputBlur = () => {
        const numValue = parseInt(inputValue)
        if (!isNaN(numValue)) {
            const clampedValue = Math.max(min, Math.min(max, numValue))
            onChange(clampedValue)
            setInputValue(clampedValue.toString())
        } else {
            setInputValue(value.toString())
        }
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleInputBlur()
        }
    }

    // Calculate percentage for slider gradient
    const percentage = ((value - min) / (max - min)) * 100

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-charcoal uppercase tracking-wider">
                    Quantity
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                        className="w-24 px-3 py-2 text-right font-mono font-bold text-lg text-charcoal bg-white border-2 border-charcoal/20 rounded-lg focus:outline-none focus:border-gold transition-colors"
                    />
                    <span className="text-sm text-charcoal/60">units</span>
                </div>
            </div>

            {/* Slider */}
            <div className="relative pt-2 pb-1">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step="50"
                    value={value}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-charcoal/10 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                        background: `linear-gradient(to right, #C9A961 0%, #C9A961 ${percentage}%, #E5E5E5 ${percentage}%, #E5E5E5 100%)`
                    }}
                />

                {/* Tick marks */}
                <div className="flex justify-between mt-2 px-1">
                    {[50, 100, 250, 500, 1000, 2500].map((tick) => (
                        <button
                            key={tick}
                            onClick={() => {
                                onChange(tick)
                                setInputValue(tick.toString())
                            }}
                            className={cn(
                                "text-xs transition-colors hover:text-charcoal",
                                value === tick ? "text-charcoal font-bold" : "text-charcoal/40"
                            )}
                        >
                            {tick}
                        </button>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2C2C2C;
          cursor: pointer;
          border: 3px solid #C9A961;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2C2C2C;
          cursor: pointer;
          border: 3px solid #C9A961;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
        </div>
    )
}
