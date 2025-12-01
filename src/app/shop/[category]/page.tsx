import { notFound } from "next/navigation"

const categories = ["business-cards", "weddings", "note-cards", "packaging", "hang-tags"]

export function generateStaticParams() {
    return categories.map((category) => ({
        category: category,
    }))
}

export default function ShopCategoryPage({ params }: { params: { category: string } }) {
    if (!categories.includes(params.category)) {
        notFound()
    }

    const categoryName = params.category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

    return (
        <div className="min-h-screen bg-paper-grain py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-charcoal mb-6">
                    {categoryName}
                </h1>
                <p className="text-lg text-charcoal/80 mb-12 max-w-2xl">
                    Explore our premium letterpress {categoryName.toLowerCase()} collection.
                </p>

                <div className="bg-off-white/80 backdrop-blur-sm border-2 border-charcoal/20 rounded-lg p-12 text-center">
                    <p className="text-charcoal/60">Product catalog coming soon...</p>
                </div>
            </div>
        </div>
    )
}
