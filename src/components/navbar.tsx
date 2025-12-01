"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const shopItems = [
    { name: "Business Cards", href: "/shop/business-cards" },
    { name: "Weddings", href: "/shop/weddings" },
    { name: "Note Cards", href: "/shop/note-cards" },
    { name: "Packaging", href: "/shop/packaging" },
    { name: "Hang Tags", href: "/shop/hang-tags" },
]

const learnItems = [
    { name: "Process", href: "/learn/process" },
    { name: "Paper Textures", href: "/learn/paper-textures" },
    { name: "Ink Colors", href: "/learn/ink-colors" },
    { name: "Foil Colors", href: "/learn/foil-colors" },
    { name: "File Prep", href: "/learn/file-preparation" },
]

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)

    return (
        <nav className="sticky top-0 z-50 bg-off-white/95 backdrop-blur-sm border-b-2 border-charcoal/10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <span className="text-2xl md:text-3xl font-serif font-bold text-charcoal tracking-tight">
                            Rise and Shine
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {/* Shop Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown("shop")}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="flex items-center gap-1 text-charcoal hover:text-gold transition-colors font-medium">
                                Shop
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                                {activeDropdown === "shop" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 mt-2 w-48 bg-off-white border-2 border-charcoal/20 rounded-md shadow-lg overflow-hidden"
                                    >
                                        {shopItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="block px-4 py-3 text-sm text-charcoal hover:bg-gold/10 transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Learn Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown("learn")}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="flex items-center gap-1 text-charcoal hover:text-gold transition-colors font-medium">
                                Learn
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                                {activeDropdown === "learn" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 mt-2 w-48 bg-off-white border-2 border-charcoal/20 rounded-md shadow-lg overflow-hidden"
                                    >
                                        {learnItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="block px-4 py-3 text-sm text-charcoal hover:bg-gold/10 transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Gallery */}
                        <Link
                            href="/gallery"
                            className="text-charcoal hover:text-gold transition-colors font-medium"
                        >
                            Gallery
                        </Link>

                        {/* About */}
                        <Link
                            href="/about"
                            className="text-charcoal hover:text-gold transition-colors font-medium"
                        >
                            About
                        </Link>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden lg:block">
                        <Button variant="secondary" asChild>
                            <Link href="/order">Order Now</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-charcoal"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden border-t-2 border-charcoal/10 bg-off-white"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {/* Shop Section */}
                            <div>
                                <p className="font-serif font-bold text-charcoal mb-2">Shop</p>
                                <div className="pl-4 space-y-2">
                                    {shopItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="block text-charcoal/80 hover:text-gold transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Learn Section */}
                            <div>
                                <p className="font-serif font-bold text-charcoal mb-2">Learn</p>
                                <div className="pl-4 space-y-2">
                                    {learnItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="block text-charcoal/80 hover:text-gold transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Gallery */}
                            <Link
                                href="/gallery"
                                className="block font-serif font-bold text-charcoal hover:text-gold transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Gallery
                            </Link>

                            {/* About */}
                            <Link
                                href="/about"
                                className="block font-serif font-bold text-charcoal hover:text-gold transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About
                            </Link>

                            {/* Order CTA */}
                            <div className="pt-4">
                                <Button variant="secondary" className="w-full" asChild>
                                    <Link href="/order" onClick={() => setMobileMenuOpen(false)}>
                                        Order Now
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
