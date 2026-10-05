function openAlbumModal(setId){
    const modal = document.getElementById('view-set-modal')
    if(!modal) return
    const titleElement = document.getElementById('album-modal-title') 
    
    if(titleElement) titleElement.textContent = `Expansion ${setId.setName|| 'Unknown'}`
    currentInspectedCards = setId.cards || []

    resetAlbumFilters()

    modal.classList.add('active')
    modal.style.display = 'flex'
    document.body.style.overflow = 'hidden'

    applyAlbumFilters()
}


function applyAlbumFilters() {
    if (!currentInspectedCards) return

    const selectedType = document.getElementById('filter-type')?.value || 'all'
    
    const minInput = document.getElementById('filter-min-price')?.value
    const maxInput = document.getElementById('filter-max-price')?.value
    
    const minPrice = minInput !== '' ? parseFloat(minInput) : 0
    const maxPrice = maxInput !== '' ? parseFloat(maxInput) : Infinity

    const filteredCards = currentInspectedCards.filter(card => {
        const cardPrice = card.basePrice || 0
        const cardType = card.type || 'Incoloro'

        const matchesType = selectedType === 'all' || cardType.toLowerCase() === selectedType.toLowerCase()
        const matchesPrice = cardPrice >= minPrice && cardPrice <= maxPrice
        
        return matchesType && matchesPrice
    })

    filterAlbumCards(filteredCards)
}


function filterAlbumCards(cardsList) {
    const grid = document.getElementById('set-cards-grid')
    if(!grid || !cardsList) return

    grid.innerHTML = ''

    if (!cardsList || cardsList.length === 0) {
        grid.innerHTML = '<p class="no-cards-msg" style="grid-column: 1/-1; text-align: center; color: #9da4bd; padding: 2rem;">No se encontraron cartas con esos filtros.</p>'
        return
    }
    //console.log(cardsList[0].basePrice)

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


function resetAlbumFilters() {
    const typeSelect = document.getElementById('filter-type')
    const minInput = document.getElementById('filter-min-price')
    const maxInput = document.getElementById('filter-max-price')

    if (typeSelect) typeSelect.value = 'all'
    if (minInput) minInput.value = ''
    if (maxInput) maxInput.value = ''
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

document.getElementById('filter-type')?.addEventListener('change', applyAlbumFilters)
document.getElementById('filter-min-price')?.addEventListener('input', applyAlbumFilters)
document.getElementById('filter-max-price')?.addEventListener('input', applyAlbumFilters)