let cart = []

const modalCarrito = document.getElementById('cart-modal')
const btnAbrirCarrito = document.getElementById('btn-open-cart')
const btnCerrarCarrito = document.getElementById('btn-close-cart')

function abrirModalCarrito() {
	if (modalCarrito) {
		renderCart()
		modalCarrito.style.display = 'block'
	}
}

function cerrarModalCarrito() {
	if (modalCarrito) {
		modalCarrito.style.display = 'none'
	}
}

if (btnAbrirCarrito && modalCarrito) {
	btnAbrirCarrito.addEventListener('click', abrirModalCarrito)
}

if (btnCerrarCarrito && modalCarrito) {
	btnCerrarCarrito.addEventListener('click', cerrarModalCarrito)
}

// Cerrar si haces clic fuera de la caja del modal
modalCarrito?.addEventListener('click', e => {
	if (e.target === modalCarrito) {
		cerrarModalCarrito()
	}
})

// Función que se llama al pulsar "COMPRAR" en la tienda
function agregarAlCarrito(card, abrirModal = true) {
	if (!card) return

	const precioFinal = parseFloat(card.discountedPrice ?? card.price ?? card.basePrice ?? 0)
	const existente = cart.find(item => item.id === card.id)

	if (existente) {
		existente.cantidad += 1
	} else {
		cart.push({
			id: card.id,
			name: card.name,
			image: card.image,
			rarity: card.rarity || 'Common',
			type: card.type || 'Incoloro',
			basePrice: parseFloat(card.basePrice || precioFinal),
			price: precioFinal,
			cantidad: 1,
		})
	}

	actualizarContadorCarrito()
	if (abrirModal) {
		abrirModalCarrito()
	}
}

function cambiarCantidadCarrito(index, delta) {
	if (!cart[index]) return
	cart[index].cantidad += delta

	if (cart[index].cantidad <= 0) {
		cart.splice(index, 1)
	}

	actualizarContadorCarrito()
	renderCart()
}

function eliminarDelCarrito(index) {
	cart.splice(index, 1)
	actualizarContadorCarrito()
	renderCart()
}

function actualizarContadorCarrito() {
	const countEl = document.getElementById('cart-count')
	if (countEl) {
		const totalUnidades = cart.reduce((sum, item) => sum + item.cantidad, 0)
		countEl.textContent = totalUnidades
	}
}

function renderCart() {
	const container = document.getElementById('cart-items-container')
	const totalEl = document.getElementById('cart-total-price')
	if (!container || !totalEl) return

	container.innerHTML = ''

	if (cart.length === 0) {
		container.innerHTML = '<p style="text-align: center; color: #aaa;">Tu carrito está vacío.</p>'
		totalEl.textContent = '0.00'
		return
	}

	let total = 0

	cart.forEach((item, index) => {
		const subtotal = item.price * item.cantidad
		total += subtotal

		const row = document.createElement('div')
		row.style.cssText = 'display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.06); padding: 10px 12px; border-radius: 8px; gap: 10px;'

		row.innerHTML = `
			<div style="display: flex; align-items: center; gap: 10px; flex: 1;">
				<img src="${item.image}" alt="${item.name}" style="width: 42px; height: 58px; object-fit: contain; border-radius: 4px;" />
				<div>
					<p style="font-weight: bold; margin: 0; font-size: 0.95rem;">${item.name}</p>
					<p style="font-size: 0.85rem; color: #54b26e; margin: 2px 0 0 0;">$${item.price.toFixed(2)} c/u</p>
				</div>
			</div>

			<div style="display: flex; align-items: center; gap: 6px;">
				<button type="button" onclick="cambiarCantidadCarrito(${index}, -1)" style="width: 26px; height: 26px; border-radius: 6px; border: none; background: #333; color: white; cursor: pointer; font-weight: bold;">-</button>
				<span style="min-width: 20px; text-align: center; font-weight: bold;">${item.cantidad}</span>
				<button type="button" onclick="cambiarCantidadCarrito(${index}, 1)" style="width: 26px; height: 26px; border-radius: 6px; border: none; background: #333; color: white; cursor: pointer; font-weight: bold;">+</button>
			</div>

			<div style="min-width: 65px; text-align: right; font-weight: bold; color: #fff;">
				$${subtotal.toFixed(2)}
			</div>

			<button type="button" onclick="eliminarDelCarrito(${index})" style="background: none; border: none; color: #e74c3c; font-size: 1.2rem; cursor: pointer;" title="Quitar">&times;</button>
		`

		container.appendChild(row)
	})

	totalEl.textContent = total.toFixed(2)
}

async function comprarCarrito() {
	if (cart.length === 0) {
		alert('El carrito está vacío.')
		return
	}

	const total = cart.reduce((sum, item) => sum + item.price * item.cantidad, 0)

	if (player.money < total) {
		alert('No tienes suficiente saldo en la cartera.')
		return
	}

	try {
		const res = await fetch('comprar_carrito.php', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({items: cart}),
		})

		const data = await res.json()

		if (data.status === 'ok') {
			// 1. Actualizamos el dinero del jugador
			player.money = parseFloat(data.nuevoSaldo)

			// 2. Añadimos cada unidad al inventario del jugador (sube el valor de Inventario)
			cart.forEach(item => {
				for (let i = 0; i < item.cantidad; i++) {
					player.inventory.push({
						id: item.id,
						name: item.name,
						image: item.image,
						rarity: item.rarity,
						type: item.type,
						basePrice: item.basePrice,
					})
				}
			})

			// 3. Limpiamos carrito y actualizamos pantalla y colección
			cart = []
			actualizarContadorCarrito()
			renderCart()
			updateUI()
			if (typeof renderPlayerCollection === 'function') {
				renderPlayerCollection()
			}
			cerrarModalCarrito()

			alert(data.mensaje)
		} else {
			alert(data.mensaje)
		}
	} catch (error) {
		console.error('Error al comprar:', error)
		alert('Error de conexión al procesar la compra.')
	}
}

document.getElementById('btn-clear-cart')?.addEventListener('click', () => {
	cart = []
	actualizarContadorCarrito()
	renderCart()
})

document.getElementById('btn-checkout-cart')?.addEventListener('click', comprarCarrito)
