import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { PaperWeight } from "@/lib/pricing-config"

interface PaperSelectorProps {
    selectedWeight: PaperWeight
    onChange: (weight: PaperWeight) => void
}

export function PaperSelector({ selectedWeight, onChange }: PaperSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Cotton (110lb) */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange(110)}
                className={cn(
                    "relative group p-8 rounded-xl border-2 text-left transition-all duration-300",
                    selectedWeight === 110
                        ? "border-charcoal bg-off-white shadow-xl"
                        : "border-charcoal/10 bg-white hover:border-charcoal/30 hover:shadow-lg"
                )}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <h3 className="font-serif font-bold text-xl text-charcoal">
                            Standard Cotton
                        </h3>
                        <p className="text-sm text-charcoal/60 font-medium">
                            110lb / 300gsm
                        </p>
                    </div>
                    <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                        selectedWeight === 110
                            ? "border-gold bg-gold text-white"
                            : "border-charcoal/20 group-hover:border-charcoal/40"
                    )}>
                        {selectedWeight === 110 && <Check className="w-3.5 h-3.5" />}
                    </div>
                </div>

                <p className="text-charcoal/70 text-sm leading-relaxed mb-6">
                    Our house standard. A beautiful, soft cotton paper that takes a deep impression. Perfect for most business cards and invitations.
                </p>

                {/* Visual Thickness Indicator */}
                <div className="h-12 flex items-end">
                    <div className="w-full h-2 bg-[#F5F5F0] border border-charcoal/10 rounded-sm shadow-sm relative">
                        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-charcoal/5 rounded-b-sm" />
                    </div>
                </div>
            </motion.button>

            {/* Double Thick (220lb) */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange(220)}
                className={cn(
                    "relative group p-8 rounded-xl border-2 text-left transition-all duration-300",
                    selectedWeight === 220
                        ? "border-charcoal bg-off-white shadow-xl"
                        : "border-charcoal/10 bg-white hover:border-charcoal/30 hover:shadow-lg"
                )}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <h3 className="font-serif font-bold text-xl text-charcoal">
                            Double Thick
                        </h3>
                        <p className="text-sm text-charcoal/60 font-medium">
                            220lb / 600gsm
                        </p>
                    </div>
                    <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                        selectedWeight === 220
                            ? "border-gold bg-gold text-white"
                            : "border-charcoal/20 group-hover:border-charcoal/40"
                    )}>
                        {selectedWeight === 220 && <Check className="w-3.5 h-3.5" />}
                    </div>
                </div>

                <p className="text-charcoal/70 text-sm leading-relaxed mb-6">
                    For a truly luxurious feel. Two sheets duplexed together for substantial weight and rigidity. Allows for edge painting.
                </p>

                {/* Visual Thickness Indicator */}
                <div className="h-12 flex items-end">
                    <div className="w-full h-4 bg-[#F5F5F0] border border-charcoal/10 rounded-sm shadow-sm relative">
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-charcoal/5" />
                        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-charcoal/5 rounded-b-sm" />
                    </div>
                </div>
            </motion.button>
        </div>
    )
}
