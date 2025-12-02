import { OrderConfiguration, EnvelopeConfiguration } from "@/types/order"

export interface CartItem {
    id: string
    name: string
    type: 'card' | 'envelope'
    config: OrderConfiguration | EnvelopeConfiguration
    price: number
}

export interface Cart {
    items: CartItem[]
    total: number
}
