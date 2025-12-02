"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnvelopeConfiguration } from "@/types/order"
import { calculateEnvelopePrice } from "@/lib/pricing-engine"
import { ENVELOPE_SIZES } from "@/lib/pricing-config"
import { useCart } from "@/contexts/cart-context"

interface MobileEnvelopeBarProps {
    config: EnvelopeConfiguration
}

export function MobileEnvelopeBar({ config }: MobileEnvelopeBarProps) {
    const price = calculateEnvelopePrice(config)
    const { addEnvelopeItem } = useCart()
    const [itemName] = useState("")
    const [justAdded, setJustAdded] = useState(false)

    const handleAddToCart = () => {
        const name = itemName.trim() || `${ENVELOPE_SIZES[config.size]} Envelopes (${config.quantity})`
        addEnvelopeItem(name, config)
        setJustAdded(true)
        setTimeout(() => setJustAdded(false), 2000)
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-charcoal/10 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:hidden z-50">
            <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
                <div className="flex-shrink-0">
                    <p className="text-xs text-charcoal/60 uppercase tracking-wider">
                        Total
                    </p>
                    <p className="text-2xl font-serif font-bold text-charcoal">
                        ${price.toFixed(2)}
                    </p>
                </div>
                <Button
                    onClick={handleAddToCart}
                    className="bg-gold hover:bg-gold/90 text-white shadow-md flex-shrink-0"
                >
                    {justAdded ? (
                        <>
                            <Check className="w-4 h-4 mr-2" />
                            Added!
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
