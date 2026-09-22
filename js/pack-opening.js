document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('open-pack-btn')?.addEventListener('click', startCardByCardReveal)
})

function animationPackOpening() {
    console.log('He llado hasta la animacion')
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

    
}