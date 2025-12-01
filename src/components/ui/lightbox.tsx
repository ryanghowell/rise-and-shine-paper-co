"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"

interface LightboxProps {
    isOpen: boolean
    onClose: () => void
    imageSrc: string
    imageAlt: string
    onPrevious?: () => void
    onNext?: () => void
}

export function Lightbox({ isOpen, onClose, imageSrc, imageAlt, onPrevious, onNext }: LightboxProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowLeft" && onPrevious) onPrevious()
            if (e.key === "ArrowRight" && onNext) onNext()
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, onClose, onPrevious, onNext])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/95 backdrop-blur-sm"
                    onClick={onClose}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-off-white hover:text-gold transition-colors z-10"
                        aria-label="Close lightbox"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Previous Button */}
                    {onPrevious && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onPrevious()
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-off-white hover:text-gold transition-colors z-10"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                    )}

                    {/* Next Button */}
                    {onNext && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onNext()
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-off-white hover:text-gold transition-colors z-10"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    )}

                    {/* Image */}
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className="relative max-w-7xl max-h-[90vh] w-full h-full p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* Image Caption */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-off-white text-center px-4">
                        <p className="text-sm md:text-base">{imageAlt}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
