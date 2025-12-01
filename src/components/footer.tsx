import Link from "next/link"
import { Instagram, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
    return (
        <footer className="bg-charcoal text-off-white border-t-4 border-gold">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1: Logo & Contact */}
                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-4">Rise and Shine</h3>
                        <div className="space-y-2 text-off-white/80">
                            <p>2401 Lee St</p>
                            <p>Alexandria, LA 71301</p>
                            <p className="mt-4">
                                <a href="tel:+13184427474" className="hover:text-gold transition-colors">
                                    (318) 442-7474
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Column 2: Resources */}
                    <div>
                        <h4 className="text-lg font-serif font-bold mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/faq" className="text-off-white/80 hover:text-gold transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/learn/file-preparation" className="text-off-white/80 hover:text-gold transition-colors">
                                    File Prep
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-off-white/80 hover:text-gold transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Social & Newsletter */}
                    <div>
                        <h4 className="text-lg font-serif font-bold mb-4">Stay Connected</h4>
                        <div className="space-y-4">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-off-white/80 hover:text-gold transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                                <span>Follow us on Instagram</span>
                            </a>

                            <div className="mt-4">
                                <p className="text-sm text-off-white/80 mb-2">Subscribe to our newsletter</p>
                                <form className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        className="flex-1 px-4 py-2 rounded-md bg-off-white/10 border border-off-white/20 text-off-white placeholder:text-off-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
                                    />
                                    <Button variant="secondary" type="submit" className="flex-shrink-0">
                                        <Mail className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-off-white/20 text-center text-sm text-off-white/60">
                    <p>&copy; {new Date().getFullYear()} Rise and Shine Paper Co. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
