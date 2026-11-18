document.addEventListener('DOMContentLoaded', () => {
	const modalRegister = document.getElementById('form-modal')
	const btnAbrirRegister = document.getElementById('btn-open-register')
	const btnCerrarRegister = document.getElementById('btn-close-register')
	const formRegister = document.getElementById('crear_cuenta_form')

	if (btnAbrirRegister && modalRegister) {
		btnAbrirRegister.addEventListener('click', () => {
			modalRegister.style.display = 'block'
		})
	}

	if (btnCerrarRegister && modalRegister) {
		btnCerrarRegister.addEventListener('click', () => {
			modalRegister.style.display = 'none'
		})
	}
})
