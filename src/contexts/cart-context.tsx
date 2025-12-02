"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { CartItem } from '@/types/cart'
import { OrderConfiguration, EnvelopeConfiguration } from '@/types/order'
import { calculateCardPrice, calculateEnvelopePrice } from '@/lib/pricing-engine'

interface CartContextType {
    items: CartItem[]
    addCardItem: (name: string, config: OrderConfiguration) => void
    addEnvelopeItem: (name: string, config: EnvelopeConfiguration) => void
    removeItem: (id: string) => void
    updateItem: (id: string, name: string, config: OrderConfiguration | EnvelopeConfiguration, type: 'card' | 'envelope') => void
    clearCart: () => void
    total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    const addCardItem = useCallback((name: string, config: OrderConfiguration) => {
        const price = calculateCardPrice(config).total
        const newItem: CartItem = {
            id: `${Date.now()}-${Math.random()}`,
            name,
            type: 'card',
            config,
            price,
        }
        setItems((prev) => [...prev, newItem])
    }, [])

    const addEnvelopeItem = useCallback((name: string, config: EnvelopeConfiguration) => {
        const price = calculateEnvelopePrice(config)
        const newItem: CartItem = {
            id: `${Date.now()}-${Math.random()}`,
            name,
            type: 'envelope',
            config,
            price,
        }
        setItems((prev) => [...prev, newItem])
    }, [])

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id))
    }, [])

    const updateItem = useCallback((id: string, name: string, config: OrderConfiguration | EnvelopeConfiguration, type: 'card' | 'envelope') => {
        const price = type === 'card'
            ? calculateCardPrice(config as OrderConfiguration).total
            : calculateEnvelopePrice(config as EnvelopeConfiguration)
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, name, config, price, type } : item
            )
        )
    }, [])

    const clearCart = useCallback(() => {
        setItems([])
    }, [])

    const total = items.reduce((sum, item) => sum + item.price, 0)

    return (
        <CartContext.Provider value={{ items, addCardItem, addEnvelopeItem, removeItem, updateItem, clearCart, total }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
