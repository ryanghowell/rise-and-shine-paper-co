import { motion } from "framer-motion"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderConfiguration } from "@/types/order"
import { useOrderPrice } from "@/hooks/use-order-price"

interface OrderSummaryProps {
    config: OrderConfiguration
}

export function OrderSummary({ config }: OrderSummaryProps) {
    const { subtotal, pricePerUnit, turnaroundTime } = useOrderPrice(config)

    // Calculate estimated ship date (simple business day approximation)
    const getEstimatedDate = () => {
        const date = new Date()
        // Add business days (approximate by adding 1.4 * days to account for weekends)
        const daysToAdd = parseInt(turnaroundTime)
        date.setDate(date.getDate() + Math.ceil(daysToAdd * 1.4))
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div className="sticky top-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-4 border-double border-charcoal/10 rounded-lg shadow-xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-charcoal text-off-white p-4 text-center">
                    <h2 className="font-serif font-bold text-xl tracking-wide">
                        Job Ticket
                    </h2>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Specs List */}
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-start pb-3 border-b border-dashed border-charcoal/20">
                            <span className="font-bold text-charcoal">Product</span>
                            <span className="text-right text-charcoal/80">
                                {config.quantity}x {config.productType}
                            </span>
                        </div>

                        <div className="flex justify-between items-start pb-3 border-b border-dashed border-charcoal/20">
                            <span className="font-bold text-charcoal">Paper</span>
                            <span className="text-right text-charcoal/80 max-w-[60%]">
                                {config.paperType}
                            </span>
                        </div>

                        {(config.inkColors > 0 || config.foilColors > 0) && (
                            <div className="flex justify-between items-start pb-3 border-b border-dashed border-charcoal/20">
                                <span className="font-bold text-charcoal">Colors</span>
                                <div className="text-right text-charcoal/80">
                                    {config.inkColors > 0 && <div>{config.inkColors} Ink Color{config.inkColors > 1 ? 's' : ''}</div>}
                                    {config.foilColors > 0 && <div>{config.foilColors} Foil Color{config.foilColors > 1 ? 's' : ''}</div>}
                                </div>
                            </div>
                        )}

                        {config.edgePainting && (
                            <div className="flex justify-between items-start pb-3 border-b border-dashed border-charcoal/20">
                                <span className="font-bold text-charcoal">Finishing</span>
                                <span className="text-right text-charcoal/80">
                                    Edge Painting
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Pricing */}
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
                                ${subtotal.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Turnaround */}
                    <div className="bg-off-white/50 p-3 rounded border border-charcoal/5 text-center">
                        <p className="text-xs text-charcoal/60 uppercase tracking-wider mb-1">
                            Estimated Ship Date
                        </p>
                        <p className="font-medium text-charcoal">
                            {getEstimatedDate()}
                        </p>
                        <p className="text-xs text-charcoal/40 mt-1">
                            ({turnaroundTime})
                        </p>
                    </div>

                    {/* Action Button */}
                    <Button
                        className="w-full bg-gold hover:bg-gold/90 text-white h-12 text-lg shadow-md"
                    >
                        <Upload className="w-5 h-5 mr-2" />
                        Upload & Checkout
                    </Button>
                </div>

                {/* Decorative Bottom Edge */}
                <div className="h-2 bg-[url('/images/ticket-edge.png')] bg-repeat-x opacity-10" />
            </motion.div>
        </div>
    )
}
