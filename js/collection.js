document.addEventListener("DOMContentLoaded", () => {
    showCollection();
});

function showCollection() {
    const gridCollection = document.getElementById('collection-container');
    if (!gridCollection) return;


    gridCollection.innerHTML = '';

    if (!player || !player.inventory || player.inventory.length === 0) {
        gridCollection.innerHTML = `<p class="empty-msg">NO TIENES CARTAS TODAVÍA, ¡VAMOS A ABRIR SOBRES!</p>`;
        return;
    }

    player.inventory.forEach((card, index) => {
        const cardItem = document.createElement('div');
        cardItem.className = 'collection-card-item';

        cardItem.innerHTML = `
           <div class="atropos collection-atropos-${index}">
                <div class="atropos-scale">
                    <div class="atropos-rotate">
                        <div class="atropos-inner">
                            <img src="${card.image}" alt="${card.name}">
                            <div class="reveal-price-badge ${(card.basePrice || 0) >= 40.0 ? 'valuable' : ''}">
                                $${(card.basePrice || 0).toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        cardItem.addEventListener('click', () => {
            if (typeof openCardZoomModal === 'function') {
                openCardZoomModal(card);
            }
        });

        gridCollection.appendChild(cardItem);

        setTimeout(() => {
            Atropos({
                el: `.collection-atropos-${index}`,
                activeOffset: 20,
                shadow: false,
                glare: true,
                maxGlare: 0.4,
            });
        }, 30);
    });
}