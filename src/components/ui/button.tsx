"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
    variant?: "primary" | "secondary" | "outline" | "ghost"
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", asChild = false, children, ...props }, ref) => {
        const variants = {
            primary: "bg-charcoal text-off-white border-2 border-charcoal hover:bg-charcoal/90",
            secondary: "bg-gold text-charcoal border-2 border-gold hover:bg-gold/90",
            outline: "bg-transparent text-charcoal border-2 border-charcoal hover:bg-charcoal/5",
            ghost: "bg-transparent text-charcoal border-2 border-transparent hover:bg-charcoal/5 shadow-none active:shadow-none",
        }

        const classes = cn(
            "inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-md active:shadow-inner",
            variants[variant],
            className
        )

        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(children as React.ReactElement<any>, {
                className: cn((children as React.ReactElement<any>).props.className, classes),
            })
        }

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.98, translateY: 2 }}
                className={classes}
                {...props}
            >
                {children}
            </motion.button>
        )
    }
)
Button.displayName = "Button"

export { Button }
