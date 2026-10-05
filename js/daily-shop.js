let dailyShopCards = []

document.addEventListener("DOMContentLoaded",  () => {
    //Primero quiero que carguen las expansiones y luego ya las cartas
    setTimeout(() => {
        generateDailyShop()
        startDailyTimer()
    }, 1000)

    document.getElementById('reroll-shop-btn')?.addEventListener('click', rerollDailyShop)
})

function generateDailyShop() {
    let allCards = []
    allSetsData.forEach(s => {
        if(s.cards) allCards = allCards.concat(s.cards)
    })

    if (allCards.length === 0) return

    //Quiero que las cartas salgan de un rango medio 
    const priorityCards = allCards.filter(c => (c.basePrice || 0) >= 12 && (c.basePrice || 0) <= 45)
    const pool = priorityCards.length >= 12 ? priorityCards : allCards

    dailyShopCards = []
    const usedIndexes = new Set()

    //Genero 24 cartas
    while (dailyShopCards.length < 24 && usedIndexes.size < pool.length) {
        const index = Math.floor(Math.random() * pool.length)
        if(!usedIndexes.has(index)){
            usedIndexes.add(index)

            const cards = pool[index]
            const hasDiscount = Math.random() < 0.64 // El valor de que hay descuentos
            const discountPercent = hasDiscount ? [10, 15, 20, 25, 30, 40][Math.floor(Math.random() * 6)] : 0

            const originalPrice = cards.basePrice || 0
            const finalPrice = hasDiscount ? originalPrice * (1- discountPercent / 100) : originalPrice

            dailyShopCards.push({
                cardData: cards,
                originalPrice: originalPrice,
                finalPrice: finalPrice,
                discountPercent: discountPercent,
                purchased: false,
            })
        }
    }

    renderDailyShop()
}

function renderDailyShop() {
    const container = document.getElementById('daily-cards-grid')
    if(!container) return

    container.innerHTML = ''

    dailyShopCards.forEach((item, index) => {
        const card = item.cardData
        const cardItem = document.createElement('div')
        cardItem.className = 'set-card-item'

        const discountBadge = item.discountPercent > 0 ? `<div class="discount-badge">- ${item.discountPercent}%</div>` : ''


        const priceInsideHTML =
			item.discountPercent > 0
				? `<div class="card-price-overlay">
                        <span class="old-price-inside">$${item.originalPrice.toFixed(2)}</span>
                        <span class="offer-price-red">$${item.finalPrice.toFixed(2)}</span>
                        </div>`
				: `<div class="card-price-overlay">
                        <span class="normal-price-inside">$${item.originalPrice.toFixed(2)}</span>
                    </div>`

		cardItem.innerHTML = `
        
        <div class="atropos daily-shop-atropos-${index}">
            <div class="atropos-scale">
            <div class="atropos-rotate">
                <div class="atropos-inner">
                <img src="${card.image}" alt="${card.name}">
                ${discountBadge}
                ${priceInsideHTML}
                </div>
            </div>
            </div>
        </div>
        <button class="buy-card-btn" ${item.purchased ? 'disabled' : ''}>
            ${item.purchased ? 'COMPRADO' : 'COMPRAR'}
        </button>
        `

        const buyButton = cardItem.querySelector('.buy-card-btn')
        buyButton.addEventListener('click', e => {
            e.stopPropagation()
            buyDailyCard(item)
        })

        cardItem.addEventListener('click', () => openCardZoomModal(card))

        container.appendChild(cardItem)

        Atropos({
			el: `.daily-shop-atropos-${index}`,
			activeOffset: 20,
			shadow: false,
			glare: true,
			maxGlare: 0.4,
		})
    })
}

function buyDailyCard(item) {
    if(player.money < item.finalPrice) {
        alert("No puedes comprar esta carta, no tienes suficiente dinero.")
        return
    }

    player.money -= item.finalPrice
    player.inventory.push(item.cardData)
    item.purchased = true

    updateUI()
    renderDailyShop()
}

function rerollDailyShop(){
    const REROLL_COST = 5.0
    if(player.money < REROLL_COST){
        alert("No puedes rerollear la tienda, no tienes suficiente dinero.")
        return
    }

    if(confirm('Quieres pagar $5.00 para rerollear las ofertas?')){
        player.money -= REROLL_COST
        updateUI()
        generateDailyShop()
    }
}

function startDailyTimer() {
    const timerElement = document.getElementById('daily-timer')
    if(!timerElement) return

    let secondsLeft = 24 * 60 * 60

    setInterval(() => {
        secondsLeft--
        if(secondsLeft <= 0) {
            secondsLeft = 24 * 60 * 60
            generateDailyShop()
        }

        const hours = Math.floor(secondsLeft / 3600).toString().padStart(2, '0')
        const minutes = Math.floor((secondsLeft % 3600) / 60).toString().padStart(2, '0')
        const seconds = (secondsLeft % 60).toString().padStart(2, '0')

        timerElement.textContent = `${hours}:${minutes}:${seconds}`
        
    },1000)
}