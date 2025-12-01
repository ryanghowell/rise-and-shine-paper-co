export default function AboutPage() {
    return (
        <div className="min-h-screen bg-paper-grain py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-charcoal mb-6">
                    About Us
                </h1>
                <p className="text-lg text-charcoal/80 mb-12 max-w-2xl">
                    Learn about Rise and Shine Paper Co. and our commitment to quality letterpress printing.
                </p>

                <div className="bg-off-white/80 backdrop-blur-sm border-2 border-charcoal/20 rounded-lg p-12">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">Our Story</h2>
                        <p className="text-charcoal/80 mb-6">
                            Located at 2401 Lee St in Alexandria, Louisiana, Rise and Shine Paper Co.
                            has been crafting premium letterpress products with care and precision.
                        </p>

                        <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">Contact</h2>
                        <p className="text-charcoal/80">
                            Phone: <a href="tel:+13184427474" className="text-gold hover:underline">(318) 442-7474</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
