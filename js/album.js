function openAlbumModal(setId){
    const modal = document.getElementById('view-set-modal')
    if(!modal) return
    const titleElement = document.getElementById('set-modal-title')
    
    if(titleElement) titleElement.textContent = setId.setName 
    currentInspectedCards = setId.cards || []

    modal.classList.add('active')
    modal.style.display = 'flex'
    document.body.style.overflow = 'hidden'

    filterAlbumCards(currentInspectedCards)
}

function filterAlbumCards(cardsList) {
    const grid = document.getElementById('set-cards-grid')
    if(!grid || !cardsList) return

    //console.log(cardsList[0].basePrice)

    
    const isValuable = cardsList.basePrice >= 40.0

    grid.innerHTML = ''

    cardsList.forEach((card, index) => {
        const cardItem = document.createElement('div')
        cardItem.className = 'set-card-item'
        cardItem.innerHTML = `
        <div class="atropos album-atropos-${index}">
            <div class="atropos-scale">
                <div class="atropos-rotate">
                    <div class="atropos-inner">
                    <img src="${card.image}" alt="${card.name}">
                    <div class="reveal-price-badge ${card.basePrice >= 40.0 ? 'valuable' : ''}">$${(card.basePrice || 0).toFixed(2)}</div>
                    </div>
                </div>
            </div>
         </div>
        `

        cardItem.addEventListener('click', () => openCardZoomModal(card))
        grid.appendChild(cardItem)

        Atropos({
            el: `.album-atropos-${index}`,
			activeOffset: 20,
			shadow: false,
			glare: true,
			maxGlare: 0.4,
        })
    })
}

function closeAlbumModal() {
    const modal = document.getElementById('view-set-modal')
    if (modal) {
        modal.classList.remove('active')
        modal.style.display = 'none' 
        document.body.style.overflow = 'auto'
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('view-set-modal')
    const closeBtn = document.getElementById('close-set-modal-btn')

    closeBtn?.addEventListener('click', closeAlbumModal)

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAlbumModal()
        }
    })
})