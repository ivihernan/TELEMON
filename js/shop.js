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
			//buyPack(set.setId)
			console.log('comprado')
		})

		packCard.querySelector('.view-btn').addEventListener('click', () => {
			openAlbumModal(set)
		})

		container.appendChild(packCard)
	})
}

document.addEventListener('DOMContentLoaded', loadPacksCatalog)
