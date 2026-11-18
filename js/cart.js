const modalCarrito = document.getElementById('cart-modal')
const btnAbrirCarrito = document.getElementById('btn-open-cart')
const btnCerrarCarrito = document.getElementById('btn-close-cart')

if (btnAbrirCarrito && modalCarrito) {
	btnAbrirCarrito.addEventListener('click', () => {
		console.log('Botón de abrir carrito clicado, mostrando modal...')
		modalCarrito.style.display = 'block'
	})
}

if (btnCerrarCarrito && modalCarrito) {
	btnCerrarCarrito.addEventListener('click', () => {
		modalCarrito.style.display = 'none'
	})
}
