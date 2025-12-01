"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

const sections = [
    { id: "cotton-paper", title: "Cotton Paper" },
    { id: "handmade-paper", title: "Handmade Paper" },
    { id: "double-thick", title: "Double Thick" },
]

export default function PaperTexturesPage() {
    const [activeSection, setActiveSection] = useState("")

    useEffect(() => {
        const handleScroll = () => {
            const sectionElements = sections.map(section => ({
                id: section.id,
                element: document.getElementById(section.id)
            }))

            const currentSection = sectionElements.find(({ element }) => {
                if (element) {
                    const rect = element.getBoundingClientRect()
                    return rect.top <= 150 && rect.bottom >= 150
                }
                return false
            })

            if (currentSection) {
                setActiveSection(currentSection.id)
            }
        }

        window.addEventListener("scroll", handleScroll)
        handleScroll()
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const offset = 100
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
            window.scrollTo({
                top: elementPosition - offset,
                behavior: "smooth"
            })
        }
    }

    return (
        <div className="min-h-screen bg-paper-grain">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-charcoal mb-4">
                        Paper Textures
                    </h1>
                    <p className="text-lg text-charcoal/80 max-w-3xl">
                        The foundation of exceptional letterpress work begins with the right paper.
                        Discover how different textures and weights create unique tactile experiences.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Table of Contents */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 bg-off-white/80 backdrop-blur-sm border-2 border-charcoal/20 rounded-lg p-6">
                            <h2 className="text-lg font-serif font-bold text-charcoal mb-4">
                                On This Page
                            </h2>
                            <nav className="space-y-2">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`block w-full text-left px-3 py-2 rounded transition-colors ${activeSection === section.id
                                                ? "bg-gold/20 text-charcoal font-medium"
                                                : "text-charcoal/70 hover:bg-charcoal/5"
                                            }`}
                                    >
                                        {section.title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Article Content */}
                    <article className="lg:col-span-3 space-y-16">
                        {/* Cotton Paper Section */}
                        <section id="cotton-paper" className="scroll-mt-24">
                            <div className="bg-off-white/80 backdrop-blur-sm border-2 border-charcoal/20 rounded-lg p-8 md:p-12">
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-6">
                                    Cotton Paper
                                </h2>

                                {/* Image Placeholder */}
                                <div className="aspect-video bg-charcoal/10 rounded-lg mb-8 flex items-center justify-center">
                                    <span className="text-charcoal/40 font-serif text-lg">Cotton Paper Sample</span>
                                </div>

                                <div className="prose prose-lg max-w-none space-y-6">
                                    <p className="text-charcoal/90 leading-relaxed">
                                        Cotton paper is the gold standard for letterpress printing, prized for its luxurious feel
                                        and exceptional ability to showcase the deep impression that defines quality letterpress work.
                                        Made from 100% cotton fibers, this premium paper stock offers unparalleled durability and a
                                        soft, velvety texture that immediately communicates quality to anyone who holds it. The natural
                                        cotton fibers create a subtle texture that catches light beautifully and provides the perfect
                                        canvas for letterpress impression.
                                    </p>

                                    <div className="bg-gold/10 border-l-4 border-gold p-6 rounded-r-lg my-8">
                                        <h3 className="text-xl font-serif font-bold text-charcoal mb-3">
                                            Understanding Paper Weight
                                        </h3>
                                        <p className="text-charcoal/80 mb-4">
                                            <strong className="text-charcoal">110lb Cotton Paper:</strong> Our standard weight cotton
                                            paper strikes the perfect balance between substance and flexibility. At approximately 0.015"
                                            thick, it provides enough body to showcase a beautiful letterpress impression while remaining
                                            practical for mailing and everyday use. This weight is ideal for business cards, invitations,
                                            and note cards where you want that distinctive tactile quality without excessive bulk.
                                        </p>
                                        <p className="text-charcoal/80">
                                            <strong className="text-charcoal">220lb Cotton Paper:</strong> For those seeking the ultimate
                                            in luxury and presence, our double-thick 220lb cotton paper delivers an unforgettable tactile
                                            experience. At approximately 0.030" thick, this substantial stock creates a dramatic impression—both
                                            literally and figuratively. The extra thickness allows for deeper debossing, creating shadows and
                                            dimension that make your design truly three-dimensional. This weight is perfect for premium business
                                            cards, wedding invitations, and any project where making a lasting impression is paramount.
                                        </p>
                                    </div>

                                    <p className="text-charcoal/90 leading-relaxed">
                                        The beauty of cotton paper in letterpress printing lies in how the fibers compress under pressure,
                                        creating that signature debossed impression. Unlike coated papers that resist impression, cotton
                                        fibers yield gracefully to the press, capturing every detail of your design while maintaining their
                                        structural integrity. This compression creates subtle shadows within the impression, adding depth and
                                        dimension that simply cannot be replicated with digital printing. When you run your fingers across
                                        letterpress on cotton paper, you're experiencing the marriage of traditional craftsmanship and premium
                                        materials—a tactile reminder that quality matters.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Handmade Paper Section */}
                        <section id="handmade-paper" className="scroll-mt-24">
                            <div className="bg-off-white/80 backdrop-blur-sm border-2 border-charcoal/20 rounded-lg p-8 md:p-12">
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-6">
                                    Handmade Paper
                                </h2>

                                {/* Image Placeholder */}
                                <div className="aspect-video bg-charcoal/10 rounded-lg mb-8 flex items-center justify-center">
                                    <span className="text-charcoal/40 font-serif text-lg">Handmade Paper Sample</span>
                                </div>

                                <div className="prose prose-lg max-w-none space-y-6">
                                    <p className="text-charcoal/90 leading-relaxed">
                                        Handmade paper represents the pinnacle of artisanal papermaking, where each sheet is a unique work
                                        of art. Crafted using traditional methods that date back centuries, handmade paper features organic
                                        deckled edges, subtle variations in thickness, and visible fiber inclusions that tell the story of
                                        its creation. When combined with letterpress printing, handmade paper creates pieces that are truly
                                        one-of-a-kind—no two impressions will be exactly alike due to the natural variations in the paper's
                                        surface and density.
                                    </p>

                                    <p className="text-charcoal/90 leading-relaxed">
                                        The irregular surface of handmade paper interacts with letterpress in fascinating ways. The natural
                                        texture and fiber distribution mean that impression depth can vary slightly across the sheet, creating
                                        an organic, authentic quality that machine-made papers cannot replicate. This variability is not a
                                        flaw—it's a feature that adds character and soul to your printed pieces. Handmade papers are available
                                        in various weights, typically ranging from a lighter 90lb to a substantial 200lb stock. The heavier
                                        weights provide more surface area for the letterpress to interact with, resulting in dramatic impressions
                                        that showcase both the papermaker's and printer's craftsmanship. These papers are perfect for wedding
                                        invitations, art prints, and any project where uniqueness and artisanal quality are valued above uniformity.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Double Thick Section */}
                        <section id="double-thick" className="scroll-mt-24">
                            <div className="bg-off-white/80 backdrop-blur-sm border-2 border-charcoal/20 rounded-lg p-8 md:p-12">
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-6">
                                    Double Thick
                                </h2>

                                {/* Image Placeholder */}
                                <div className="aspect-video bg-charcoal/10 rounded-lg mb-8 flex items-center justify-center">
                                    <span className="text-charcoal/40 font-serif text-lg">Double Thick Paper Sample</span>
                                </div>

                                <div className="prose prose-lg max-w-none space-y-6">
                                    <p className="text-charcoal/90 leading-relaxed">
                                        Double thick paper stocks—whether cotton, handmade, or specialty papers—represent the ultimate
                                        statement in luxury printing. At approximately 0.030" or thicker, these substantial sheets have
                                        a commanding physical presence that demands attention. When someone receives a piece printed on
                                        double thick stock, they immediately understand they're holding something special. The weight in
                                        their hand, the resistance when they bend it slightly, the satisfying thickness between their
                                        fingers—all of these tactile cues communicate quality, importance, and attention to detail before
                                        they've even read a single word.
                                    </p>

                                    <p className="text-charcoal/90 leading-relaxed">
                                        From a letterpress perspective, double thick papers are a dream to work with. The substantial
                                        thickness allows for deeper impression without risk of breakthrough, meaning we can create more
                                        dramatic debossing that catches light and shadow beautifully. The extra material also provides
                                        better dimensional stability—your cards and invitations will maintain their crisp, flat appearance
                                        over time rather than curling or warping. This makes double thick stocks ideal for business cards
                                        that need to maintain their appearance through repeated handling, wedding invitations that will be
                                        kept as keepsakes, and any premium application where longevity matters. The combination of letterpress
                                        impression and double thick stock creates a multi-sensory experience: visual beauty, tactile luxury,
                                        and the subtle sound of quality paper—all working together to create an unforgettable impression.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Call to Action */}
                        <section className="mt-16">
                            <div className="bg-gradient-to-br from-gold/20 to-gold/5 border-4 border-double border-gold/40 rounded-lg p-12 text-center">
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
                                    Ready to Feel It?
                                </h2>
                                <p className="text-lg text-charcoal/80 mb-8 max-w-2xl mx-auto">
                                    There's no substitute for experiencing these papers in person. The tactile quality of letterpress
                                    on premium paper stock is something you need to feel to truly appreciate. Let's create something
                                    beautiful together.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button variant="secondary" asChild>
                                        <Link href="/order">Start Your Order</Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/gallery">View Our Gallery</Link>
                                    </Button>
                                </div>
                            </div>
                        </section>
                    </article>
                </div>
            </div>
        </div>
    )
}
