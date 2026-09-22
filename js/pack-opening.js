document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('open-pack-btn')?.addEventListener('click', startCardByCardReveal)
})

function animationPackOpening() {
    console.log('He llegado hasta la animacion')
    setTimeout(() => {
        startCardByCardReveal()
    }, 600)
}

function startCardByCardReveal() {
    console.log("He llegado hasta la primera carta")
    const revealArea = document.getElementById('deck-reveal-area')
    revealArea.style.display = 'flex'
    showNextCardInSlot()
}

function showNextCardInSlot() {
    const slot = document.getElementById('single-card-slot')
    const leftCountSpan = document.getElementById('cards-left-count')
    
    if (currentCardIndex >= currentPackCards.length) {
        document.getElementById('deck-reveal-area').style.display = 'none'
        showSummarySection()
        return
    }

    const card = currentPackCards[currentCardIndex]
    leftCountSpan.textContent = currentPackCards.length - currentCardIndex
    slot.innerHTML = ''

    const cardPrice = card.basePrice || 0
    const isValuable = cardPrice >= 40.0
    const isHolo = isValuable || (card.rarity && (card.rarity.includes('Ultra') || card.rarity.includes('Hyper') || card.rarity.includes('Ilustration') || card.rarity.includes('Secret')))

    const cardElement = document.createElement('div')
    cardElement.className = 'card-flip'
    cardElement.innerHTML = `
    <div class="card-inner">
      <div class="card-front real-card-back">
        <img src="https://images.pokemontcg.io/cardback.png" alt="Dorso Pokémon TCG">
      </div>
      <div class="card-back ${isValuable ? 'valuable-card' : isHolo ? 'rare-holo-card' : ''}">
        <div class="atropos single-atropos">
          <div class="atropos-scale">
            <div class="atropos-rotate">
              <div class="atropos-inner">
                <img src="${card.image}" alt="${card.name}">
               
                <div class="reveal-price-badge ${isValuable ? 'valuable' : ''}">
                  $${cardPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `

    let isFlipped = false
    
    cardElement.addEventListener('click', () => {
        if (!isFlipped) {
            //Esto primero tengo que  ver que hago con el primer click
            cardElement.classList.add('flipped')
            isFlipped = true

            player.invetory.push(card)
            updateUI()

            Atropos({
				el: '.single-atropos',
				activeOffset: isValuable ? 60 : 40,
				shadow: false,
				glare: true,
				maxGlare: isValuable ? 1.0 : isHolo ? 0.7 : 0.4,
			})
        } else{
            //El segundo click lo hago aqui
            cardElement.style.transition = 'transform 0.4 ease-in, opacity 0.35s ease-in'
            cardElement.style.transform = 'translateX(450px) rotate(25deg)'
            cardElement.style.opacity = '0'

            setTimeout(() => {
                currentCardIndex++
                showNextCardInSlot()
            },250)
        }
    })

    slot.appendChild(cardElement)
}


function closePackModal() {
    const modal = document.getElementById('opening-modal')
    if (modal) {
        modal.classList.remove('active')
        modal.style.display = '' 
        document.body.style.overflow = 'auto'
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('opening-modal')
    const closeBtn = document.getElementById('close-modal-btn')

    // Cierre con el botón 'X'
    closeBtn?.addEventListener('click', closePackModal)

    // Cierre cuando le das fuera
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePackModal()
        }
    })
})