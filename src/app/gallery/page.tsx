"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { galleryImages, filterTags, type GalleryTag } from "@/lib/gallery-data"
import { Lightbox } from "@/components/ui/lightbox"

export default function GalleryPage() {
    const [activeFilter, setActiveFilter] = useState<GalleryTag>("All")
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    const filteredImages = useMemo(() => {
        if (activeFilter === "All") return galleryImages
        return galleryImages.filter(image => image.tags.includes(activeFilter))
    }, [activeFilter])

    const openLightbox = (index: number) => {
        setSelectedImageIndex(index)
        setLightboxOpen(true)
    }

    const goToPrevious = () => {
        setSelectedImageIndex((prev) =>
            prev === 0 ? filteredImages.length - 1 : prev - 1
        )
    }

    const goToNext = () => {
        setSelectedImageIndex((prev) =>
            prev === filteredImages.length - 1 ? 0 : prev + 1
        )
    }

    return (
        <div className="min-h-screen bg-paper-grain py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-charcoal mb-4">
                        Gallery
                    </h1>
                    <p className="text-lg text-charcoal/80 max-w-3xl">
                        Browse our portfolio of letterpress work. Each piece showcases the unique
                        tactile quality and craftsmanship that defines our approach to printing.
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="mb-12">
                    <div className="flex flex-wrap gap-3">
                        {filterTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setActiveFilter(tag)}
                                className={`px-6 py-2 rounded-full border-2 transition-all ${activeFilter === tag
                                        ? "bg-gold border-gold text-charcoal font-medium shadow-md"
                                        : "bg-off-white/80 border-charcoal/20 text-charcoal hover:border-gold/50"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Masonry Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeFilter}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
                    >
                        {filteredImages.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="break-inside-avoid mb-6"
                            >
                                <div
                                    className="group relative overflow-hidden rounded-lg border-2 border-charcoal/10 bg-off-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                                    onClick={() => openLightbox(index)}
                                >
                                    <div className={`relative ${image.aspectRatio === "portrait" ? "aspect-[3/4]" :
                                            image.aspectRatio === "landscape" ? "aspect-[4/3]" :
                                                "aspect-square"
                                        }`}>
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <p className="text-off-white text-sm font-medium">
                                                    {image.alt}
                                                </p>
                                                <div className="flex gap-2 mt-2">
                                                    {image.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-xs px-2 py-1 bg-gold/80 text-charcoal rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Empty State */}
                {filteredImages.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-charcoal/60 text-lg">
                            No images found for this filter.
                        </p>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {filteredImages[selectedImageIndex] && (
                <Lightbox
                    isOpen={lightboxOpen}
                    onClose={() => setLightboxOpen(false)}
                    imageSrc={filteredImages[selectedImageIndex].src}
                    imageAlt={filteredImages[selectedImageIndex].alt}
                    onPrevious={goToPrevious}
                    onNext={goToNext}
                />
            )}
        </div>
    )
}
