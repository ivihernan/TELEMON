//Variables globales para el juego de cartas

let player = {
	money: 100.0,
	inventory: [],
}

let allSetsData = []
let currentPackCards = []
let currentCardIndex = 0
let currentInspectedCards = []

let zoomAtroposInstance = null;


function updateUI() {
	//Primero actualizo el dinero del jugador cuando compra
  //Con el metodo toFixed(2) se asegura que siempre tenga dos decimales
	const moneyElement = document.getElementById('player-money')
	if (moneyElement) moneyElement.textContent = `$${player.money.toFixed(2)}`

	//Valor del inventario del jugador
	const totalCollectionValue = player.inventory.reduce((sum, card) => sum + (card.basePrice || 0), 0)
	const collectionElement = document.getElementById('collection-value')
	if (collectionElement) collectionElement.textContent = `$${totalCollectionValue.toFixed(2)}`

	//Grilla de cartas inspeccionadas
	const inventoryTab = document.getElementById('inventory-section')
	if (inventoryTab && inventoryTab.classList.contains('active')) {
		if (typeof renderPlayerCollection === 'function') {
			renderPlayerCollection()
		}
	}
}


function openCardZoomModal(card) {
    if (!card) return;

    const modal = document.getElementById('card-zoom-modal');
    const cardImg = document.getElementById('zoom-card-img');

    if (cardImg) cardImg.src = card.image;


    // Limpiar instancia previa si existe
    if (zoomAtroposInstance) {
        zoomAtroposInstance.destroy();
        zoomAtroposInstance = null;
    }

    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Inicializar Atropos con iluminación glare
    zoomAtroposInstance = Atropos({
        el: '.card-zoom-atropos',
        activeOffset: 50, //CUnato sale la carta
        shadow: true,
        shadowOffset: 40, //Distanci de la sombra
        shadowScale: 1.05,

        glare: true,
        maxGlare: 2,
    });
}

function closeCardZoomModal() {
    const modal = document.getElementById('card-zoom-modal');
    if (modal) {
        modal.classList.remove('active');
        
        // Si no hay otro modal activo, restaurar scroll del body
        const activeModals = document.querySelectorAll('.modal.active');
        if (activeModals.length === 0) {
            document.body.style.overflow = 'auto';
        }
    }

    if (zoomAtroposInstance) {
        zoomAtroposInstance.destroy();
        zoomAtroposInstance = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateUI();

    const modal = document.getElementById('card-zoom-modal');

    modal?.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('card-zoom-backdrop')) {
            closeCardZoomModal();
        }
    });
});
