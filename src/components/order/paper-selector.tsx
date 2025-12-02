import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { PaperType } from "@/types/order"

interface PaperSelectorProps {
    selected: PaperType
    onChange: (value: PaperType) => void
}

export function PaperSelector({ selected, onChange }: PaperSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Cotton (110lb) */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange("Cotton 110lb")}
                className={cn(
                    "relative p-8 rounded-lg text-left transition-all duration-200 outline-none group",
                    "bg-[#FDFBF7] bg-paper-grain", // Color & Texture
                    "border-2",
                    selected === "Cotton 110lb"
                        ? "border-gold ring-2 ring-gold ring-offset-2"
                        : "border-charcoal/10 hover:border-gold/50"
                )}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-serif font-bold text-charcoal">
                        Standard Cotton
                    </h3>
                    {selected === "Cotton 110lb" && (
                        <div className="bg-gold rounded-full p-1 text-off-white">
                            <Check className="w-4 h-4" />
                        </div>
                    )}
                </div>

                <p className="text-charcoal/70 font-sans text-sm leading-relaxed mb-4">
                    Soft and pliable. Perfect for standard cards.
                </p>

                <div className="text-xs font-mono text-charcoal/50 uppercase tracking-wider">
                    110lb / 300gsm
                </div>
            </motion.button>

            {/* Double Thick (220lb) */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange("Cotton 220lb (Double Thick)")}
                className={cn(
                    "relative p-8 rounded-lg text-left transition-all duration-200 outline-none group",
                    "bg-[#FDFBF7] bg-paper-grain", // Color & Texture
                    "border-2",
                    // Physical thickness simulation
                    "border-b-4 border-r-4 border-gray-200",
                    selected === "Cotton 220lb (Double Thick)"
                        ? "border-gold ring-2 ring-gold ring-offset-2 border-b-gold/50 border-r-gold/50"
                        : "border-charcoal/10 hover:border-gold/50 hover:border-b-gray-300 hover:border-r-gray-300"
                )}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-serif font-bold text-charcoal">
                        Double Thick
                    </h3>
                    {selected === "Cotton 220lb (Double Thick)" && (
                        <div className="bg-gold rounded-full p-1 text-off-white">
                            <Check className="w-4 h-4" />
                        </div>
                    )}
                </div>

                <p className="text-charcoal/70 font-sans text-sm leading-relaxed mb-4">
                    The heavyweight champion. Rigid, substantial, and luxurious.
                </p>

                <div className="text-xs font-mono text-charcoal/50 uppercase tracking-wider">
                    220lb / 600gsm
                </div>
            </motion.button>
        </div>
    )
}
