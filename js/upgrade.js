let upgContext = '';
let modalUpgAtroposInstances = [];
let swipeInputCard = null;
let contratoCards = [null, null, null, null, null]; 

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.upg-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.upg-nav-btn').forEach(b => b.classList.remove('active'));
            
 
            document.querySelectorAll('.upgrade-minigame').forEach(g => {
                g.classList.add('hidden');
                g.classList.remove('active');
            });
            
        
            e.target.classList.add('active');
            const targetId = e.target.getAttribute('data-game');
            const targetEl = document.getElementById(targetId);
            
            targetEl.classList.remove('hidden');
            targetEl.classList.add('active');
        });
    });

    initContratoSlots();

    document.getElementById('close-upg-modal').addEventListener('click', () => {
        document.getElementById('upg-selector-modal').classList.add('hidden');
    });

    document.getElementById('swipe-risk-slider').addEventListener('input', updateSwipeValues);
    document.getElementById('btn-play-swipe').addEventListener('click', playSwipe);
    document.getElementById('btn-play-contrato').addEventListener('click', playContrato);
});


function openUpgInventory(context, slotIndex = null) {
    upgContext = context; 
    const grid = document.getElementById('upg-modal-grid');
    grid.innerHTML = '';

    modalUpgAtroposInstances.forEach(instance => instance.destroy());
    modalUpgAtroposInstances = [];

  
    const inUseCards = [...contratoCards, swipeInputCard].filter(c => c !== null);
    
    
    let availableInventory = [...player.inventory];
    inUseCards.forEach(usedCard => {
        const index = availableInventory.findIndex(c => c === usedCard);
        if (index > -1) availableInventory.splice(index, 1);
    });

   
    const cardGroups = {};
    availableInventory.forEach(card => {
        const identifier = card.id || card.name;
        if (!cardGroups[identifier]) {
            cardGroups[identifier] = { baseCard: card, count: 0, instances: [] };
        }
        cardGroups[identifier].count++;
        cardGroups[identifier].instances.push(card);
    });

    let i = 0;
    Object.values(cardGroups).forEach(group => {
        const card = group.baseCard;
        const count = group.count;

        const cardItem = document.createElement('div');
        cardItem.className = 'collection-card-item upg-modal-card';

        const quantityBadgeHTML = count > 1 ? `<div class="quantity-badge" data-atropos-offset="5">x${count}</div>` : '';
        const cardPrice = card.basePrice || 0;

        
        cardItem.innerHTML = `
           <div class="atropos upg-atropos-${i}">
                <div class="atropos-scale">
                    <div class="atropos-rotate">
                        <div class="atropos-inner">
                            ${quantityBadgeHTML}
                            <img src="${card.image}" alt="${card.name}">
                            <div class="reveal-price-badge ${cardPrice >= 40.0 ? 'valuable' : ''}">
                                $${cardPrice.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        cardItem.addEventListener('click', () => {
        
            selectCardForGame(group.instances[0], context, slotIndex);
        });

        grid.appendChild(cardItem);

        const instance = Atropos({
            el: `.upg-atropos-${i}`,
            activeOffset: 20,
            shadow: false,
            glare: true,
            maxGlare: 0.4,
        });
        modalUpgAtroposInstances.push(instance);
        i++;
    });

    document.getElementById('upg-selector-modal').classList.remove('hidden');
}

function selectCardForGame(card, context, index = null) {
    document.getElementById('upg-selector-modal').classList.add('hidden');

    if (context === 'swipe-input') {
        swipeInputCard = card;
        renderSlot('swipe-input-slot', card);
        updateSwipeValues();
    } else if (context.startsWith('contrato')) {
        contratoCards[index] = card;
        renderSlot(`contrato-slot-${index}`, card);
        checkContratoStatus();
    }
}

function renderSlot(slotId, card) {
    const slot = document.getElementById(slotId);
    slot.innerHTML = `
        <img src="${card.image || card.images?.small}" onerror="this.src='img/cards.png'">
    `;
    slot.style.borderStyle = 'solid';
    slot.style.borderColor = '#54b26e';
}



//Primer minijuego el swipe
function updateSwipeValues() {
    const btn = document.getElementById('btn-play-swipe');
    if (!swipeInputCard) {
        btn.disabled = true;
        return;
    }
    btn.disabled = false;

    const riskLevel = parseInt(document.getElementById('swipe-risk-slider').value);
    const val = swipeInputCard.basePrice || 0;

    
    let loseMultiplier = 1 - (riskLevel * 0.09); 
    let winMultiplier = 1 + (riskLevel * 0.3);  

    if (loseMultiplier < 0.05) loseMultiplier = 0.05;

    document.getElementById('swipe-lose-val').textContent = (val * loseMultiplier).toFixed(2);
    document.getElementById('swipe-win-val').textContent = (val * winMultiplier).toFixed(2);

    const labels = ["Bajo", "Moderado", "Medio", "Peligroso", "Alto", "Muy Alto", "Locura", "Kamikaze", "Suicida", "Extremo"];
    document.getElementById('risk-level-text').textContent = labels[riskLevel - 1];
}

function playSwipe() {
    const btn = document.getElementById('btn-play-swipe');
    btn.disabled = true;
    const slot = document.getElementById('swipe-input-slot');

    
    const idx = player.inventory.findIndex(c => c === swipeInputCard);
    if(idx > -1) player.inventory.splice(idx, 1);

    const roll = Math.random();
    const win = roll > 0.5; // Siempre 50/50 exacto

    slot.style.transition = 'all 0.8s ease-in-out';
    if (win) slot.classList.add('swipe-anim-right');
    else slot.classList.add('swipe-anim-left');

    setTimeout(() => {
        if (win) {
            const winVal = parseFloat(document.getElementById('swipe-win-val').textContent);
            alert(`¡SWIPE EXITOSO! Ganaste el equivalente a $${winVal.toFixed(2)}.`);
            player.money += winVal; 
        } else {
            const loseVal = parseFloat(document.getElementById('swipe-lose-val').textContent);
            alert(`Swipe Fallido... Lograste rescatar $${loseVal.toFixed(2)}.`);
            player.money += loseVal;
        }

        
        swipeInputCard = null;
        slot.classList.remove('swipe-anim-left', 'swipe-anim-right');
        slot.innerHTML = '<span class="plus-icon">+</span><p>Añade tu carta</p>';
        slot.style.borderStyle = 'dashed';
        if(typeof updateUI === 'function') updateUI();
        updateSwipeValues();

    }, 800);
}


//Segundo minijuego, que es un contrato
function initContratoSlots() {
    const container = document.getElementById('contrato-slots-container');
    container.innerHTML = '';
    for(let i=0; i<5; i++) {
        const div = document.createElement('div');
        div.className = 'upg-card-slot';
        div.id = `contrato-slot-${i}`;
        div.innerHTML = `<span class="plus-icon">+</span><p>Carta ${i+1}</p>`;
        div.onclick = () => openUpgInventory(`contrato-slot-${i}`, i);
        container.appendChild(div);
    }
}

function checkContratoStatus() {
    const btn = document.getElementById('btn-play-contrato');
    const ready = contratoCards.every(card => card !== null);
    
    let total = 0;
    contratoCards.forEach(c => { if(c) total += (c.basePrice || 0); });
    document.getElementById('contrato-total-val').textContent = total.toFixed(2);

    btn.disabled = !ready;
}

function playContrato() {
    const btn = document.getElementById('btn-play-contrato');
    btn.disabled = true;

    
    contratoCards.forEach(card => {
        const idx = player.inventory.findIndex(c => c === card);
        if(idx > -1) player.inventory.splice(idx, 1);
    });

    const totalValue = parseFloat(document.getElementById('contrato-total-val').textContent);

    let multiplier = 0.8;
    const roll = Math.random();
    if(roll > 0.95) multiplier = 5.0; // 5% Jackpot
    else if(roll > 0.70) multiplier = 1.5; // 25% Victoria estándar

    const rewardValue = totalValue * multiplier;

    
    let allCards = [];
    allSetsData.forEach(set => { 
        if(set.cards) allCards = allCards.concat(set.cards); 
    });
    
    if(allCards.length === 0) {
        alert(`Fusión Completa. Obtuviste $${rewardValue.toFixed(2)}`);
        player.money += rewardValue;
    } else {
        
        const randomReward = allCards[Math.floor(Math.random() * allCards.length)];
        let clonedReward = JSON.parse(JSON.stringify(randomReward));
        clonedReward.basePrice = rewardValue;
        clonedReward.id = 'fusion_' + Math.random().toString(36).substr(2, 9);
        
        player.inventory.push(clonedReward);
        
        let msg = multiplier === 5.0 ? "¡JACKPOT EXTREMO! " : (multiplier === 1.5 ? "¡Mejora Exitosa! " : "Fusión completada. ");
        alert(`${msg}Has obtenido a ${clonedReward.name} valorada en $${rewardValue.toFixed(2)}.`);
    }

    if(typeof updateUI === 'function') updateUI();

    
    contratoCards = [null, null, null, null, null];
    initContratoSlots();
    checkContratoStatus();
}