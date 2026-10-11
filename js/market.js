let activeBuyer = []
let selectedBuyer = null
let selectedCardLot = []
let currentSellingPrice = 0

const PERSONALITIES = [
    { name: 'Rata', img: 'img/p1.png', multiplier: 0.75, desc: 'Solo busca gangas tiradas de precio.' },
    { name: 'Negociador Equilibrado', img: 'img/p2.png', multiplier: 1.0, desc: 'Paga el precio justo de mercado.' },
    { name: 'Coleccionista Generoso', img: 'img/p3.png', multiplier: 1.25, desc: 'Dispuesto a pagar de más si le gusta.' },
    { name: 'Inversor Impulsivo', img: 'img/p4.png', multiplier: 1.1, desc: 'Acepta pequeños sobreprecios fácilmente.' },
    { name: 'Revendedor Exigente', img: 'img/p5.png', multiplier: 0.85, desc: 'Busca margen de beneficio amplio.' },
    { name: 'Cazador de Raras', img: 'img/p6.png', multiplier: 1.3, desc: 'Busca cartas exclusivas sin importar el precio.' },
    { name: 'Tacaño Negociante', img: 'img/p7.png', multiplier: 0.7, desc: 'Intentará regatearte hasta el último centavo.' },
    { name: 'Fanático Entusiasta', img: 'img/p8.png', multiplier: 1.15, desc: 'Compra por impulso si la carta le llama la atención.' },
    { name: 'Especulador', img: 'img/p9.png', multiplier: 0.9, desc: 'Analiza el mercado buscando sacarle rentabilidad rápida.' },
    { name: 'Mecenas', img: 'img/p10.png', multiplier: 1.35, desc: 'Suele tener presupuestos altos y no escatima en gastos.' }
]

const BUYER_NAMES = ['Rodrigo', 'Amelia', 'Carolina', 'Abril', 'Ivan', 'Sr. Presidente', 'Carlos Alcaraz', 'Verstappen', 'Fernando Alonso', 'Carlos Sainz', 'Aqui Jordi', 'Llados']

function initMarket() {
    if (activeBuyer.length === 0) {
        generateBuyers()
    }
    renderBuyers()
}

document.addEventListener('DOMContentLoaded', () => {
    const marketSection = document.getElementById('market-section')
    if (marketSection && marketSection.classList.contains('active')) {
        initMarket()
    }
})

function generateBuyers() {
    activeBuyer = []
    const usedNames = new Set()
    const usedPersonalities = new Set()

    for (let i = 0; i < 6; i++) {
        let name = BUYER_NAMES[Math.floor(Math.random() * BUYER_NAMES.length)]
        while (usedNames.has(name)) {
            name = BUYER_NAMES[Math.floor(Math.random() * BUYER_NAMES.length)]
        }
        usedNames.add(name)

        let personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)]
        while (usedPersonalities.has(personality.name)) {
            personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)]
        }
        usedPersonalities.add(personality.name)

        activeBuyer.push({
            id: i,
            name: name,
            personality: personality,
            budget: Math.floor(Math.random() * 250) + 60,
        })
    }
}

function renderBuyers() {
    const container = document.getElementById('buyers-container')
    if (!container) return

    container.innerHTML = ''

    activeBuyer.forEach(buyer => {
        const card = document.createElement('div')
        card.className = 'buyer-card'
        card.innerHTML = `
            <div class="buyer-avatar">
                <img src="${buyer.personality.img}" alt="${buyer.personality.name}" class="buyer-avatar-img" />
            </div>
            <h3>${buyer.name}</h3>
            <span class="buyer-personality-tag">${buyer.personality.name}</span>
            <p class="buyer-personality-desc">${buyer.personality.desc}</p>
            <p class="buyer-budget">Presupuesto: $${buyer.budget.toFixed(2)}</p>
        `

        card.addEventListener('click', () => openNegotiateModal(buyer))
        container.appendChild(card)
    })
}
