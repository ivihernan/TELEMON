//Variables globales para el juego de cartas

let player = {
	money: 100.0,
	inventory: [],
}

let allSetsData = []
let currentPackCards = []
let currentCardIndex = 0
let currentInspectedCards = []

function updateUI() {
	//Primero actualizo el dinero del jugador cuando compra
  //Con el metodo toFixed(2) se asegura que siempre tenga dos decimales
	const moneyElement = document.getElementById('player-money')
	if (moneyElement) moneyElement.textContent = `${player.money.toFixed(2)}`

	//Valor del inventario del jugador
	const totalCollectionValue = player.inventory.reduce((sum, card) => sum + (card.basePrice || 0), 0)
	const collectionElement = document.getElementById('collection-value')
	if (collectionElement) collectionElement.textContent = `${totalCollectionValue.toFixed(2)}`

	//Grilla de cartas inspeccionadas
	const inventoryTab = document.getElementById('inventory-section')
	if (inventoryTab && inventoryTab.classList.contains('active')) {
		if (typeof renderPlayerCollection === 'function') {
			renderPlayerCollection()
		}
	}
}
