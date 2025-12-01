import { Info } from "lucide-react"
import { inkFamilies } from "@/lib/ink-library"
import { ColorChip } from "@/components/ui/color-chip"

export default function InkColorsPage() {
    return (
        <div className="min-h-screen bg-paper-grain py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-charcoal mb-4">
                        Ink Colors
                    </h1>
                    <p className="text-lg text-charcoal/80 max-w-3xl">
                        Browse our extensive palette of letterpress ink colors. Each color is carefully
                        selected to provide rich, vibrant results on our premium paper stocks.
                    </p>
                </div>

                {/* Disclaimer Banner */}
                <div className="mb-12 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg shadow-sm">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                        <div>
                            <h2 className="font-bold text-yellow-900 mb-1">Color Accuracy Notice</h2>
                            <p className="text-sm text-yellow-800 leading-relaxed">
                                <strong>Screen colors vary.</strong> These are digital approximations of Uncoated (U) Pantone inks.
                                Actual printed colors will differ based on paper stock, ink opacity, and impression depth.
                                For critical color matching, we recommend requesting physical samples or consulting the
                                official Pantone Formula Guide.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Ink Families */}
                <div className="space-y-16">
                    {inkFamilies.map((family) => (
                        <section key={family.name}>
                            {/* Family Header */}
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-6 pb-3 border-b-2 border-charcoal/20">
                                {family.name}
                            </h2>

                            {/* Color Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {family.colors.map((color) => (
                                    <ColorChip key={color.pms} color={color} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Additional Information */}
                <div className="mt-16 bg-off-white/80 backdrop-blur-sm border-2 border-charcoal/20 rounded-lg p-8">
                    <h3 className="text-2xl font-serif font-bold text-charcoal mb-4">
                        Custom Color Matching
                    </h3>
                    <p className="text-charcoal/80 mb-4">
                        Don't see the exact color you need? We can custom mix inks to match your specific
                        Pantone color or create a unique blend for your project. Custom color matching is
                        available for orders of 500+ pieces.
                    </p>
                    <p className="text-charcoal/80">
                        <strong>Note:</strong> Metallic inks (Gold, Silver, Copper, Rose Gold) require special
                        handling and may have different pricing. Contact us for details on metallic ink applications.
                    </p>
                </div>
            </div>
        </div>
    )
}
