export interface InkColor {
    name: string
    pms: string
    hex: string
}

export interface InkFamily {
    name: string
    colors: InkColor[]
}

export const inkFamilies: InkFamily[] = [
    {
        name: 'Neutrals & Dark',
        colors: [
            { name: 'Black', pms: 'Process Black U', hex: '#222222' },
            { name: 'Charcoal', pms: 'PMS 447 U', hex: '#373a36' },
            { name: 'Warm Grey', pms: 'PMS 9 U', hex: '#8c8279' },
            { name: 'Cool Grey', pms: 'PMS Cool Grey 8 U', hex: '#888b8d' },
            { name: 'Taupe', pms: 'PMS 7530 U', hex: '#b7a99a' },
        ]
    },
    {
        name: 'Blues',
        colors: [
            { name: 'Navy', pms: 'PMS 289 U', hex: '#0c2340' },
            { name: 'Slate', pms: 'PMS 5405 U', hex: '#5b7f95' },
            { name: 'Sky Blue', pms: 'PMS 2905 U', hex: '#8bb8e8' },
            { name: 'Teal', pms: 'PMS 3155 U', hex: '#0093b2' },
            { name: 'Powder Blue', pms: 'PMS 545 U', hex: '#b4cfd7' },
        ]
    },
    {
        name: 'Greens',
        colors: [
            { name: 'Forest Green', pms: 'PMS 350 U', hex: '#006f3c' },
            { name: 'Sage', pms: 'PMS 5635 U', hex: '#8a9a5b' },
            { name: 'Mint', pms: 'PMS 344 U', hex: '#00b388' },
            { name: 'Olive', pms: 'PMS 5743 U', hex: '#5a5f3a' },
        ]
    },
    {
        name: 'Reds & Pinks',
        colors: [
            { name: 'Burgundy', pms: 'PMS 505 U', hex: '#6d2077' },
            { name: 'Crimson', pms: 'PMS 186 U', hex: '#c8102e' },
            { name: 'Coral', pms: 'PMS 178 U', hex: '#ff6f61' },
            { name: 'Blush', pms: 'PMS 706 U', hex: '#f7c6c7' },
            { name: 'Rose', pms: 'PMS 197 U', hex: '#d62598' },
        ]
    },
    {
        name: 'Yellows & Oranges',
        colors: [
            { name: 'Mustard', pms: 'PMS 1245 U', hex: '#d69a2d' },
            { name: 'Goldenrod', pms: 'PMS 7550 U', hex: '#c9a86a' },
            { name: 'Peach', pms: 'PMS 162 U', hex: '#ff9e1b' },
            { name: 'Burnt Orange', pms: 'PMS 1595 U', hex: '#d86018' },
            { name: 'Cream', pms: 'PMS 7499 U', hex: '#f1e7b6' },
        ]
    },
    {
        name: 'Purples',
        colors: [
            { name: 'Plum', pms: 'PMS 519 U', hex: '#5c2751' },
            { name: 'Lavender', pms: 'PMS 2567 U', hex: '#9d90a0' },
            { name: 'Violet', pms: 'PMS 2685 U', hex: '#6e3fa3' },
            { name: 'Mauve', pms: 'PMS 5155 U', hex: '#a192b2' },
        ]
    },
    {
        name: 'Metallics',
        colors: [
            { name: 'Gold', pms: 'PMS 871 U', hex: '#c5a059' },
            { name: 'Silver', pms: 'PMS 877 U', hex: '#8a8d8f' },
            { name: 'Copper', pms: 'PMS 876 U', hex: '#9e6a47' },
            { name: 'Rose Gold', pms: 'PMS 7628 U', hex: '#b76e79' },
        ]
    },
]
