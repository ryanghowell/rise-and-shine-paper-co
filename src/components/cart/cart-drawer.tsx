"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X, Trash2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { SIZES, ENVELOPE_SIZES } from "@/lib/pricing-config"
import { OrderConfiguration, EnvelopeConfiguration } from "@/types/order"

export function CartDrawer() {
    const [isOpen, setIsOpen] = useState(false)
    const { items, removeItem, total } = useCart()

    return (
        <>
            {/* Cart Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-gold text-white p-4 rounded-full shadow-xl hover:bg-gold/90 transition-all duration-200 z-40 group"
            >
                <ShoppingCart className="w-6 h-6" />
                {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-charcoal text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        {items.length}
                    </span>
                )}
            </button>

            {/* Drawer Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-charcoal/10">
                                <h2 className="text-2xl font-serif font-bold text-charcoal">
                                    Your Cart
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-charcoal" />
                                </button>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {items.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ShoppingCart className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
                                        <p className="text-charcoal/60">Your cart is empty</p>
                                        <p className="text-sm text-charcoal/40 mt-2">
                                            Add items to get started
                                        </p>
                                    </div>
                                ) : (
                                    items.map((item) => {
                                        const isCard = item.type === 'card'
                                        const cardConfig = isCard ? item.config as OrderConfiguration : null
                                        const envelopeConfig = !isCard ? item.config as EnvelopeConfiguration : null

                                        return (
                                            <div
                                                key={item.id}
                                                className="bg-off-white/50 rounded-lg p-4 border border-charcoal/5"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/40">
                                                                {item.type}
                                                            </span>
                                                        </div>
                                                        <h3 className="font-medium text-charcoal">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-sm text-charcoal/60 mt-1">
                                                            {isCard && cardConfig && (
                                                                <>{cardConfig.quantity}x {SIZES[cardConfig.size]?.name || cardConfig.size}</>
                                                            )}
                                                            {!isCard && envelopeConfig && (
                                                                <>{envelopeConfig.quantity}x {ENVELOPE_SIZES[envelopeConfig.size]}</>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-charcoal">
                                                            ${item.price.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Item Details */}
                                                <div className="text-xs text-charcoal/60 space-y-1 mb-3">
                                                    {isCard && cardConfig && (
                                                        <>
                                                            <p>
                                                                Paper: {cardConfig.paperWeight === 110 ? "Standard" : "Double Thick"}
                                                            </p>
                                                            {(cardConfig.inkColorsFront > 0 || cardConfig.foilColorsFront > 0) && (
                                                                <p>
                                                                    Colors: {cardConfig.inkColorsFront > 0 && `${cardConfig.inkColorsFront} Ink`}
                                                                    {cardConfig.inkColorsFront > 0 && cardConfig.foilColorsFront > 0 && ", "}
                                                                    {cardConfig.foilColorsFront > 0 && `${cardConfig.foilColorsFront} Foil`}
                                                                </p>
                                                            )}
                                                            {cardConfig.edgePaint && <p>Edge Painting</p>}
                                                            {cardConfig.dieCut !== 'none' && (
                                                                <p>Die Cut: {cardConfig.dieCut === 'custom' ? 'Custom' : 'Stock'}</p>
                                                            )}
                                                        </>
                                                    )}
                                                    {!isCard && envelopeConfig && (
                                                        <>
                                                            <p className="capitalize">Type: {envelopeConfig.type}</p>
                                                            {envelopeConfig.returnAddressPrinting !== 'none' && (
                                                                <p className="capitalize">Return Address: {envelopeConfig.returnAddressPrinting}</p>
                                                            )}
                                                            {envelopeConfig.guestAddressing && <p>Guest Addressing</p>}
                                                            {envelopeConfig.liner && <p>Liner {envelopeConfig.linerAssembly && '(Assembled)'}</p>}
                                                        </>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                            {/* Footer */}
                            {items.length > 0 && (
                                <div className="border-t border-charcoal/10 p-6 space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-lg font-medium text-charcoal">Total</span>
                                        <span className="text-3xl font-serif font-bold text-charcoal">
                                            ${total.toFixed(2)}
                                        </span>
                                    </div>

                                    <Button
                                        className="w-full bg-gold hover:bg-gold/90 text-white h-12 text-lg shadow-md"
                                        onClick={() => {
                                            // TODO: Navigate to checkout
                                            console.log('Proceed to checkout')
                                        }}
                                    >
                                        Proceed to Checkout
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
