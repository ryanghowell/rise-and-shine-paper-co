export type GalleryTag = "All" | "Wedding" | "Business" | "Foil" | "Packaging"

export interface GalleryImage {
    id: number
    src: string
    alt: string
    tags: GalleryTag[]
    aspectRatio: "portrait" | "landscape" | "square"
}

export const galleryImages: GalleryImage[] = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
        alt: "Elegant wedding invitation with gold foil details",
        tags: ["Wedding", "Foil"],
        aspectRatio: "portrait"
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
        alt: "Minimalist business card design",
        tags: ["Business"],
        aspectRatio: "landscape"
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1606041011872-596597976b25?w=800&q=80",
        alt: "Luxury packaging with embossed logo",
        tags: ["Packaging", "Foil"],
        aspectRatio: "square"
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
        alt: "Wedding suite with calligraphy details",
        tags: ["Wedding"],
        aspectRatio: "portrait"
    },
    {
        id: 5,
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        alt: "Textured business cards with letterpress",
        tags: ["Business"],
        aspectRatio: "landscape"
    },
    {
        id: 6,
        src: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
        alt: "Gold foil wedding invitation",
        tags: ["Wedding", "Foil"],
        aspectRatio: "square"
    },
    {
        id: 7,
        src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
        alt: "Premium product packaging",
        tags: ["Packaging"],
        aspectRatio: "portrait"
    },
    {
        id: 8,
        src: "https://images.unsplash.com/photo-1606041011872-596597976b25?w=800&q=80",
        alt: "Business card with gold accents",
        tags: ["Business", "Foil"],
        aspectRatio: "landscape"
    },
    {
        id: 9,
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
        alt: "Elegant wedding stationery set",
        tags: ["Wedding"],
        aspectRatio: "portrait"
    },
    {
        id: 10,
        src: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
        alt: "Custom packaging with letterpress details",
        tags: ["Packaging", "Foil"],
        aspectRatio: "square"
    },
    {
        id: 11,
        src: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
        alt: "Minimalist wedding invitation",
        tags: ["Wedding"],
        aspectRatio: "landscape"
    },
    {
        id: 12,
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        alt: "Luxury business cards",
        tags: ["Business"],
        aspectRatio: "portrait"
    }
]

export const filterTags: GalleryTag[] = ["All", "Wedding", "Business", "Foil", "Packaging"]
