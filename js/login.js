// 1. Control del Modal de Login (Abrir y Cerrar)
const modalLogin = document.getElementById('login-modal')
const btnAbrirLogin = document.getElementById('btn-open-login')
const btnCerrarLogin = document.getElementById('btn-cerrar-login')
const formLogin = document.getElementById('iniciar_sesion_form')

if (btnAbrirLogin && modalLogin) {
	btnAbrirLogin.addEventListener('click', () => {
		console.log('Botón de abrir login clicado, mostrando modal...')
		modalLogin.style.display = 'block'
	})
}

if (btnCerrarLogin && modalLogin) {
	btnCerrarLogin.addEventListener('click', () => {
		modalLogin.style.display = 'none'
	})
}
