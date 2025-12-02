"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function OrderTypeNav() {
    const pathname = usePathname()

    const isCards = pathname === '/order' || pathname === '/order/'
    const isEnvelopes = pathname === '/order/envelopes'

    return (
        <div className="bg-off-white/50 border-b border-charcoal/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex gap-1">
                    <Link
                        href="/order"
                        className={cn(
                            "px-6 py-4 font-medium text-sm uppercase tracking-wider transition-all duration-200 border-b-2",
                            isCards
                                ? "text-charcoal border-gold bg-white"
                                : "text-charcoal/60 border-transparent hover:text-charcoal hover:bg-white/50"
                        )}
                    >
                        Cards
                    </Link>
                    <Link
                        href="/order/envelopes"
                        className={cn(
                            "px-6 py-4 font-medium text-sm uppercase tracking-wider transition-all duration-200 border-b-2",
                            isEnvelopes
                                ? "text-charcoal border-gold bg-white"
                                : "text-charcoal/60 border-transparent hover:text-charcoal hover:bg-white/50"
                        )}
                    >
                        Envelopes
                    </Link>
                </div>
            </div>
        </div>
    )
}
