"use client"

import { useState } from "react"
import { EnvelopeConfiguration } from "@/types/order"
import { ENVELOPE_SIZES } from "@/lib/pricing-config"
import { calculateEnvelopePrice } from "@/lib/pricing-engine"
import { useCart } from "@/contexts/cart-context"
import { QuantitySelector } from "@/components/order/quantity-selector"
import { OrderTypeNav } from "@/components/order/order-type-nav"
import { MobileEnvelopeBar } from "@/components/order/mobile-envelope-bar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ShoppingCart, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EnvelopeSizeKey, ReturnAddressPrinting, EnvelopeType } from "@/types/order"

export default function EnvelopesPage() {
    const { addEnvelopeItem } = useCart()
    const [itemName, setItemName] = useState("")
    const [justAdded, setJustAdded] = useState(false)

    const [config, setConfig] = useState<EnvelopeConfiguration>({
        quantity: 100,
        size: 'a7' as EnvelopeSizeKey,
        type: 'single',
        returnAddressPrinting: 'none',
        returnAddressLocation: 'back',
        guestAddressing: false,
        innerGuestAddressing: false,
        liner: false,
        linerAssembly: false,
    })

    const updateConfig = (updates: Partial<EnvelopeConfiguration>) => {
        setConfig((prev) => ({ ...prev, ...updates }))
    }

    const price = calculateEnvelopePrice(config)
    const pricePerUnit = config.quantity > 0 ? price / config.quantity : 0

    const handleAddToCart = () => {
        const name = itemName.trim() || `${ENVELOPE_SIZES[config.size]} Envelopes (${config.quantity})`
        addEnvelopeItem(name, config)
        setJustAdded(true)
        setItemName("")
        setTimeout(() => setJustAdded(false), 2000)
    }

    return (
        <div className="min-h-screen bg-paper-grain pb-32 lg:pb-16">
            <OrderTypeNav />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column - Builder */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6">
                                Order Envelopes
                            </h1>
                            <p className="text-lg text-charcoal/80">
                                Premium envelopes with custom printing and finishing options.
                            </p>
                        </div>

                        {/* Envelope Size */}
                        <div className="bg-off-white/50 rounded-lg p-6 border border-charcoal/5">
                            <label className="text-sm font-bold text-charcoal uppercase tracking-wider block mb-4">
                                Envelope Size
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {(Object.keys(ENVELOPE_SIZES) as EnvelopeSizeKey[]).map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => updateConfig({ size })}
                                        className={cn(
                                            "p-4 rounded-lg border-2 text-left transition-all duration-200",
                                            config.size === size
                                                ? "border-gold bg-gold/5 shadow-md"
                                                : "border-charcoal/10 bg-white hover:border-charcoal/30"
                                        )}
                                    >
                                        <div className="font-medium text-charcoal">
                                            {ENVELOPE_SIZES[size]}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="bg-off-white/50 rounded-lg p-6 border border-charcoal/5">
                            <QuantitySelector
                                value={config.quantity}
                                onChange={(quantity) => updateConfig({ quantity })}
                            />
                        </div>

                        {/* Envelope Type */}
                        <div className="bg-off-white/50 rounded-lg p-6 border border-charcoal/5">
                            <label className="text-sm font-bold text-charcoal uppercase tracking-wider block mb-4">
                                Envelope Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {(['single', 'double'] as EnvelopeType[]).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => updateConfig({ type })}
                                        className={cn(
                                            "p-4 rounded-lg border-2 transition-all duration-200",
                                            config.type === type
                                                ? "border-charcoal bg-charcoal text-off-white"
                                                : "border-charcoal/20 bg-white text-charcoal hover:border-charcoal/40"
                                        )}
                                    >
                                        <div className="font-medium capitalize">{type}</div>
                                        <div className="text-xs mt-1 opacity-70">
                                            {type === 'single' ? 'Outer envelope only' : 'Outer + inner envelope'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Return Address Printing */}
                        <div className="bg-off-white/50 rounded-lg p-6 border border-charcoal/5">
                            <label className="text-sm font-bold text-charcoal uppercase tracking-wider block mb-4">
                                Return Address Printing
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {(['none', 'letterpress', 'foil', 'digital'] as ReturnAddressPrinting[]).map((method) => (
                                    <button
                                        key={method}
                                        onClick={() => updateConfig({ returnAddressPrinting: method })}
                                        className={cn(
                                            "p-3 rounded-lg border-2 transition-all duration-200",
                                            config.returnAddressPrinting === method
                                                ? "border-charcoal bg-charcoal text-off-white"
                                                : "border-charcoal/20 bg-white text-charcoal hover:border-charcoal/40"
                                        )}
                                    >
                                        <div className="font-medium capitalize text-sm">{method === 'none' ? 'No Printing' : method}</div>
                                    </button>
                                ))}
                            </div>

                            {config.returnAddressPrinting !== 'none' && (
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => updateConfig({ returnAddressLocation: 'front' })}
                                        className={cn(
                                            "p-3 rounded-lg border-2 transition-all duration-200 text-sm",
                                            config.returnAddressLocation === 'front'
                                                ? "border-gold bg-gold/5"
                                                : "border-charcoal/20 bg-white hover:border-charcoal/30"
                                        )}
                                    >
                                        Front Flap
                                    </button>
                                    <button
                                        onClick={() => updateConfig({ returnAddressLocation: 'back' })}
                                        className={cn(
                                            "p-3 rounded-lg border-2 transition-all duration-200 text-sm",
                                            config.returnAddressLocation === 'back'
                                                ? "border-gold bg-gold/5"
                                                : "border-charcoal/20 bg-white hover:border-charcoal/30"
                                        )}
                                    >
                                        Back Flap
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Addressing Options */}
                        <div className="bg-off-white/50 rounded-lg p-6 border border-charcoal/5">
                            <label className="text-sm font-bold text-charcoal uppercase tracking-wider block mb-4">
                                Guest Addressing
                            </label>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-charcoal/10">
                                    <div>
                                        <div className="font-medium text-charcoal">Outer Envelope Addressing</div>
                                        <div className="text-xs text-charcoal/60 mt-1">Digital printing</div>
                                    </div>
                                    <Switch
                                        checked={config.guestAddressing}
                                        onCheckedChange={(checked) => updateConfig({ guestAddressing: checked })}
                                    />
                                </div>

                                {config.type === 'double' && (
                                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-charcoal/10">
                                        <div>
                                            <div className="font-medium text-charcoal">Inner Envelope Addressing</div>
                                            <div className="text-xs text-charcoal/60 mt-1">Digital printing</div>
                                        </div>
                                        <Switch
                                            checked={config.innerGuestAddressing}
                                            onCheckedChange={(checked) => updateConfig({ innerGuestAddressing: checked })}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Liner Options */}
                        <div className="bg-off-white/50 rounded-lg p-6 border border-charcoal/5">
                            <label className="text-sm font-bold text-charcoal uppercase tracking-wider block mb-4">
                                Envelope Liner
                            </label>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-charcoal/10">
                                    <div>
                                        <div className="font-medium text-charcoal">Add Envelope Liner</div>
                                        <div className="text-xs text-charcoal/60 mt-1">Custom printed liner</div>
                                    </div>
                                    <Switch
                                        checked={config.liner}
                                        onCheckedChange={(checked) => updateConfig({ liner: checked, linerAssembly: checked ? config.linerAssembly : false })}
                                    />
                                </div>

                                {config.liner && (
                                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-charcoal/10">
                                        <div>
                                            <div className="font-medium text-charcoal">Liner Assembly</div>
                                            <div className="text-xs text-charcoal/60 mt-1">We'll insert liners for you</div>
                                        </div>
                                        <Switch
                                            checked={config.linerAssembly}
                                            onCheckedChange={(checked) => updateConfig({ linerAssembly: checked })}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 bg-white border-4 border-double border-charcoal/10 rounded-lg shadow-xl overflow-hidden">
                            <div className="bg-charcoal text-off-white p-4 text-center">
                                <h2 className="font-serif font-bold text-xl tracking-wide">
                                    Envelope Summary
                                </h2>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-start pb-3 border-b border-dashed border-charcoal/20">
                                        <span className="font-bold text-charcoal">Quantity</span>
                                        <span className="text-right text-charcoal/80">
                                            {config.quantity}x {ENVELOPE_SIZES[config.size]}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-start pb-3 border-b border-dashed border-charcoal/20">
                                        <span className="font-bold text-charcoal">Type</span>
                                        <span className="text-right text-charcoal/80 capitalize">
                                            {config.type}
                                        </span>
                                    </div>

                                    {config.returnAddressPrinting !== 'none' && (
                                        <div className="flex justify-between items-start pb-3 border-b border-dashed border-charcoal/20">
                                            <span className="font-bold text-charcoal">Return Address</span>
                                            <span className="text-right text-charcoal/80 capitalize">
                                                {config.returnAddressPrinting}
                                            </span>
                                        </div>
                                    )}

                                    {(config.guestAddressing || config.innerGuestAddressing) && (
                                        <div className="flex justify-between items-start pb-3 border-b border-dashed border-charcoal/20">
                                            <span className="font-bold text-charcoal">Addressing</span>
                                            <div className="text-right text-charcoal/80 text-xs">
                                                {config.guestAddressing && <div>Outer</div>}
                                                {config.innerGuestAddressing && <div>Inner</div>}
                                            </div>
                                        </div>
                                    )}

                                    {config.liner && (
                                        <div className="flex justify-between items-start pb-3 border-b border-dashed border-charcoal/20">
                                            <span className="font-bold text-charcoal">Liner</span>
                                            <span className="text-right text-charcoal/80">
                                                {config.linerAssembly ? 'With Assembly' : 'Unassembled'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-charcoal/60 text-sm">Price per unit</span>
                                        <span className="text-charcoal/60 font-mono text-sm">
                                            ${pricePerUnit.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xl font-bold text-charcoal">Total</span>
                                        <span className="text-4xl font-serif font-bold text-charcoal">
                                            ${price.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-charcoal/60 uppercase tracking-wider block mb-2">
                                        Item Name (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={itemName}
                                        onChange={(e) => setItemName(e.target.value)}
                                        placeholder={`e.g., "Wedding Envelopes"`}
                                        className="w-full px-3 py-2 text-sm border-2 border-charcoal/20 rounded-lg focus:outline-none focus:border-gold transition-colors"
                                    />
                                </div>

                                <Button
                                    onClick={handleAddToCart}
                                    className="w-full bg-gold hover:bg-gold/90 text-white h-12 text-lg shadow-md"
                                >
                                    {justAdded ? (
                                        <>
                                            <Check className="w-5 h-5 mr-2" />
                                            Added to Cart!
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5 mr-2" />
                                            Add to Cart
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Summary Bar */}
            <MobileEnvelopeBar config={config} />
        </div>
    )
}
