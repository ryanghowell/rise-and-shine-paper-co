"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderConfiguration } from "@/types/order"
import { useOrderPrice } from "@/hooks/use-order-price"
import { SIZES } from "@/lib/pricing-config"
import { useCart } from "@/contexts/cart-context"

interface MobileOrderBarProps {
    config: OrderConfiguration
}

export function MobileOrderBar({ config }: MobileOrderBarProps) {
    const { subtotal } = useOrderPrice(config)
    const { addCardItem } = useCart()
    const [itemName] = useState("")
    const [justAdded, setJustAdded] = useState(false)

    const productName = SIZES[config.size]?.name || config.size

    const handleAddToCart = () => {
        const name = itemName.trim() || `${productName} (${config.quantity})`
        addCardItem(name, config)
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
                        ${subtotal.toFixed(2)}
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
