"use client"

import { useState } from "react"
import { OrderConfiguration } from "@/types/order"
import { PaperSelector } from "@/components/order/paper-selector"
import { SpecControl } from "@/components/order/spec-control"
import { OrderSummary } from "@/components/order/order-summary"
import { FileUploader } from "@/components/order/file-uploader"
import { OrderTypeNav } from "@/components/order/order-type-nav"
import { MobileOrderBar } from "@/components/order/mobile-order-bar"
import { useOrderPrice } from "@/hooks/use-order-price"

export default function OrderPage() {
    const [config, setConfig] = useState<OrderConfiguration>({
        quantity: 250,
        size: 'a7', // Default to A7 (5x7)
        paper: 'lettra_pearl',
        paperWeight: 110,

        // Front Specs
        inkColorsFront: 1,
        foilColorsFront: 0,
        digitalPrintingFront: false,
        blindDebossFront: false,
        blindEmbossFront: false,

        // Back Specs
        inkColorsBack: 0,
        foilColorsBack: 0,
        digitalPrintingBack: false,
        blindDebossBack: false,
        blindEmbossBack: false,

        // Finishing
        edgePaint: false,
        dieCut: 'none',

        // File
        uploadedFile: null,
    })

    const updateConfig = (updates: Partial<OrderConfiguration>) => {
        setConfig((prev) => {
            const newConfig = { ...prev, ...updates }

            // Reset edge painting if paper is not double thick (220lb)
            if (updates.paperWeight === 110) {
                newConfig.edgePaint = false
            }

            return newConfig
        })
    }

    const { subtotal } = useOrderPrice(config)

    return (
        <div className="min-h-screen bg-paper-grain pb-32 lg:pb-16">
            <OrderTypeNav />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column - Builder */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6">
                                Build your Order
                            </h1>
                            <p className="text-lg text-charcoal/80">
                                Customize your letterpress stationery with our premium options.
                            </p>
                        </div>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-serif font-bold text-charcoal">
                                1. Select Paper
                            </h2>
                            <PaperSelector
                                selectedWeight={config.paperWeight}
                                onChange={(weight) => updateConfig({ paperWeight: weight })}
                            />
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-serif font-bold text-charcoal">
                                2. Specifications
                            </h2>
                            <SpecControl
                                config={config}
                                onChange={updateConfig}
                            />
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-serif font-bold text-charcoal">
                                3. Upload Artwork
                            </h2>
                            <FileUploader
                                selectedFile={config.uploadedFile}
                                onFileSelect={(file) => updateConfig({ uploadedFile: file })}
                            />
                        </section>
                    </div>

                    {/* Right Column - Summary (Desktop) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <OrderSummary config={config} />
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Summary Bar */}
            <MobileOrderBar config={config} />
        </div>
    )
}
