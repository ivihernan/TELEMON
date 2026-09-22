//Expansiones de las cartas

async function loadPacksCatalog() {
	const loadingElement = document.getElementById('loading')

	try {
		const response = await fetch('/data/packs.json')
		if (!response.ok) {
			throw new Error(`Error al cargar el catalogo de expansiones, ${response.status}`)
		}
		const data = await response.json()

		allSetsData = data.map(set => ({
			setId: set.setId || set.id,
			setName: set.setName || set.name,
			packPrice: parseFloat(set.price || set.packPrice || 0),
			logo: set.logo,
			symbol: set.symbol,
			cards: (set.cards || []).map(card => ({
				id: card.id,
				name: card.name,
				image: card.image,
				basePrice: parseFloat(card.basePrice || card.price || 0),
				rarity: card.rarity || 'Common',
				type: card.type || (Array.isArray(card.types) ? card.types[0] : 'Incoloro'),
			})),
		}))

		if (loadingElement) loadingElement.style.display = 'none'
		renderPacksGrid(allSetsData)
	} catch (error) {
		console.error('Error al cargar el catalogo de expansiones:', error)
		if (loadingElement) loadingElement.textContent = 'Error al cargar el catalogo de expansiones.'
	}
}

function renderPacksGrid(packs) {
	const container = document.getElementById('packs-container')
	if (!container) return

	container.innerHTML = '' //Limpio el contener antes de rendreizar

	packs.forEach(set => {
		const packCard = document.createElement('div')
		packCard.className = 'pack-card'

		const packImgSrc = set.logo || set.cards[0]?.image || ''

		packCard.innerHTML = `
    <div class="container-price">
      <p class="pack-price">$${set.packPrice.toFixed(2)}</p>
    </div>
    <img src="${packImgSrc}" alt="${set.setName}" class="pack-logo-img">
    <div class="container-name">
    <p class="pack-name">${set.setName}</p>
    </div>
    <div class="pack-actions">
      <button class="buy-btn">COMPRAR</button>
      <button class="view-btn">ALBUM</button>
    </div>
    `

		packCard.querySelector('.buy-btn').addEventListener('click', () => {
			buyPack(set.setId)
		})

		packCard.querySelector('.view-btn').addEventListener('click', () => {
			openAlbumModal(set)
		})

		container.appendChild(packCard)
	})
}

function buyPack(setId) {
	const setObject = allSetsData.find(set => set.setId === setId)
	if (!setObject || !setObject.cards || setObject.cards.length === 0) {
		alert('No hay cartas disponbles en este set, prueba con otro set. Lo sentimos!!')
		return
	}

	const cost = setObject.packPrice || 10.0
	if (player.money < cost) {
		alert('No tienes suficiente dinero para comprar este pack. Prueba a vender las cartas en el mercado!!')
		return
	}

	player.money -= cost
	updateUI()

	currentPackCards = generatePackWithRarity(setObject.cards, 5)
	currentCardIndex = 0

	document.getElementById('modal-title').textContent = `Sobre de ${setObject.setName}`
	document.getElementById('modal-pack-img').src = setObject.logo || setObject.cards[0]?.image

	/*
	const maxIndex = Math.min(40, setObject.cards.length)
	const randomIndex = Math.floor(Math.random() * maxIndex)
	const randomCardImage = setObject.cards[randomIndex]?.image || setObject.cards[0]?.image || setObject.logo
    document.getElementById('modal-pack-img').src = randomCardImage
	*/

	document.getElementById('deck-reveal-area').style.display = 'none'
	document.getElementById('summary-area').style.display = 'none'
	

	const modal = document.getElementById('opening-modal')
	modal.classList.add('active')

	document.body.style.overflow = 'hidden'
}

function generatePackWithRarity(cards, packSize) {
	if (!cards || cards.length === 0) return []

	//Voy a separar en tres rangos las cartas
	//Primero por valor < 5.00 luego por 5 < x < 30.00 y luego > 30.00

	const budgetCards = cards.filter(card => (card.basePrice || 0) < 5.0)

	const midValueCards = cards.filter(card => (card.basePrice || 0) >= 5.0 && (card.basePrice || 0) < 30.0)

	const topValueCards = cards.filter(card => (card.basePrice || 0) > 30.0 || (card.rarity || '').toLowerCase().includes('ultra') || (card.rarity || '').toLowerCase().includes('secret') || (card.rarity || '').toLowerCase().includes('illustration'))

	const selectedCards = []

	for (let i = 0; i < packSize; i++) {
		const roll = Math.random() * 100
		let pool = budgetCards

		if (roll < 10 && topValueCards.length > 0) {
			pool = topValueCards
		} else if (roll < 40 && midValueCards.length > 0) {
			pool = midValueCards
		}

		if (!pool || pool.length === 0) pool = cards

		const randomIndex = Math.floor(Math.random() * pool.length)

		selectedCards.push(pool[randomIndex])
	}

	selectedCards.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0))
	return selectedCards
}

document.addEventListener('DOMContentLoaded', loadPacksCatalog)
