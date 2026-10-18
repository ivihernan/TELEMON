let activeBuyer = []
let selectedBuyer = null
let selectedCardLot = []
let currentSellingPrice = 0
let baseMarketValue = 0; 
let modalAtroposInstances = [];

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

document.addEventListener('DOMContentLoaded', () => {
    const marketSection = document.getElementById('market-section')
    if (marketSection && marketSection.classList.contains('active')) {
        initMarket()
    }
    setupModalEventListener()
})

function initMarket() {
    if (activeBuyer.length === 0) {
        generateBuyers()
    }
    renderBuyers()
}

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

//Todo esto es para a partir de elegir el buyer para abir el modal

function openNegotiateModal(buyer){
    selectedBuyer = buyer;
    selectedCardLot = [];
    currentSellingPrice = 0
    baseMarketValue = 0

    document.getElementById('negotiation-modal').classList.remove('hidden')


    document.getElementById('modal-buyer-img').src = buyer.personality.img
    document.getElementById('modal-buyer-name').textContent = buyer.name
    document.getElementById('modal-buyer-personality').textContent = buyer.personality.name
    document.getElementById('modal-buyer-budget').textContent = `Presupuesto: $${buyer.budget.toFixed(2)}`

    renderModalInventory()
    calculateBaseValue()
}



function renderModalInventory() {
    const grid = document.getElementById('modal-inventory-grid')
    if(!grid) return

    grid.innerHTML = ''

    modalAtroposInstances.forEach(instance => instance.destroy());
    modalAtroposInstances = [];

    player.inventory.forEach((card, index) => {
        const cardDiv = document.createElement('div')
        cardDiv.className = 'card-item'

        const cardPrice = card.basePrice || 0;

       cardDiv.innerHTML = `
            <div class="atropos modal-atropos-${index}">
                <div class="atropos-scale">
                    <div class="atropos-rotate">
                        <div class="atropos-inner">
                            <img src="${card.image}" alt="${card.name}" class="market-card-img" onerror="this.src='img/cards.png'">
                            <div class="reveal-price-badge ${cardPrice >= 40.0 ? 'valuable' : ''}">
                                $${cardPrice.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        cardDiv.addEventListener('click', () => {
            const index = selectedCardLot.findIndex(c => c.id === card.id)
            if(index > -1) {
                selectedCardLot.splice(index, 1)
                cardDiv.classList.remove('selected')
            }else {
                selectedCardLot.push(card)
                cardDiv.classList.add('selected')
            }
            calculateBaseValue()
        })

        grid.appendChild(cardDiv)

        const instance = Atropos({
            el: `.modal-atropos-${index}`,
            activeOffset: 20,
			shadow: false,
			glare: true,
			maxGlare: 0.4,
        });

        modalAtroposInstances.push(instance)
    })
}

function calculateBaseValue() {
    baseMarketValue = selectedCardLot.reduce((sum, card) => sum + (card.basePrice || 0), 0)

    currentSellingPrice = baseMarketValue

    document.getElementById('manual-offer-input').value = currentSellingPrice.toFixed(2)
    updateNegotiationUI()
}

function updateNegotiationUI() {
    document.getElementById('market-value-display').textContent = baseMarketValue.toFixed(2)

    const btnOffer = document.getElementById('btn-make-offer')
    let probability = 0

    if(selectedCardLot.length === 0) {
        probability = 0
        btnOffer.disabled = true
    }else if(currentSellingPrice > selectedBuyer.budget){
        probability = 0
        btnOffer.disabled = true
        document.getElementById('prob-text').textContent = '0% (Excede el presuspuesto del buyer escogido)'
    }else {
        btnOffer.disabled = false

        const perceivedValue = baseMarketValue * selectedBuyer.personality.multiplier
        const greedRatio = currentSellingPrice / perceivedValue

        if(greedRatio <= 0.8){
            probability = 100
        }else if( greedRatio >= 1.5){
            probability = 0
        }else{
            probability = 100 - ((greedRatio - 0.8) / 0.5) * 100
        }

        probability = Math.max(0, Math.min(100, Math.round(probability)))
        document.getElementById('prob-text').textContent = `${probability}%`
    }
 
    const barFill = document.getElementById('prob-bar-fill')
    barFill.style.width = `${probability}%`

    if (probability >= 90) barFill.style.backgroundColor = '#00ffaa';
    else if (probability >= 70) barFill.style.backgroundColor = '#53b26e';
    else if (probability >= 50) barFill.style.backgroundColor = '#a2d149';
    else if (probability >= 30) barFill.style.backgroundColor = '#f1c40f'; 
    else if (probability >= 15) barFill.style.backgroundColor = '#f39c12'; 
    else barFill.style.backgroundColor = '#e74c3c';


    btnOffer.setAttribute('data-prob', probability)
}


function closeAlbumModal() {
    const modal = document.getElementById('negotiation-modal')
    if (modal) {
        modal.classList.add('hidden')
    }

    modalAtroposInstances.forEach(instance => instance.destroy());
    modalAtroposInstances = [];
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('negotiation-modal')
    const closeBtn = document.getElementById('close-modal')

    closeBtn?.addEventListener('click', closeAlbumModal)

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAlbumModal()
        }
    })
})

function setupModalEventListener() {

document.getElementById('manual-offer-input').addEventListener('input', (e) => {
    currentSellingPrice = parseFloat(e.target.value) || 0;
    updateNegotiationUI();
});


document.querySelectorAll('.price-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if(selectedCardLot.length === 0) return
        const modifier = parseFloat(e.target.getAttribute('data-mod'))
        currentSellingPrice = baseMarketValue + (baseMarketValue * modifier)

        document.getElementById('manual-offer-input').value = currentSellingPrice.toFixed(2)
        updateNegotiationUI()
    })
})

document.getElementById('btn-make-offer').addEventListener('click', (e) => {
    const probability = parseInt(e.target.getAttribute('data-prob'))
    const roll = Math.floor(Math.random() * 100) + 1

    if(roll <= probability) {
        alert(`Venta completada.  ${selectedBuyer.name} compro tus cartas por valor de ${currentSellingPrice.toFixed(2)}.`)
        selectedBuyer.budget -= currentSellingPrice

        player.money += currentSellingPrice

        selectedCardLot.forEach(soldCard => {
            const index = player.inventory.findIndex(c => c.id === soldCard.id)
            if(index > -1) player.inventory.splice(index, 1)
        })

        if(typeof updateUI === 'function') updateUI()

        document.getElementById('negotiation-modal').classList.add('hidden')
        renderBuyers()
    }else{
        alert(`${selectedBuyer.name} no ha acpetado tu oferta, prueba bajando el precio`)
        document.getElementById('negotiation-modal').classList.add('hidden')
    }
})

}