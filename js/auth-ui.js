window.actualizarInterfazUsuario = function () {
	const guestActions = document.getElementById('guest-actions')
	const userStats = document.getElementById('user-stats')
	const playerMoney = document.getElementById('player-money')

	// Leemos el usuario guardado en localStorage
	const usuarioGuardado = localStorage.getItem('usuario_telemon')

	if (usuarioGuardado) {
		const usuario = JSON.parse(usuarioGuardado)

		// Ocultar botones y mostrar estadísticas
		if (guestActions) guestActions.style.display = 'none'
		if (userStats) userStats.style.display = 'flex' // Usamos flex para que mantenga el diseño horizontal

		// Pintar el saldo del usuario
		if (playerMoney) {
			playerMoney.textContent = `${usuario.saldo} €`
		}
	} else {
		// Si no hay sesión, volver al estado inicial
		if (guestActions) guestActions.style.display = 'flex'
		if (userStats) userStats.style.display = 'none'
	}
}

// Se ejecuta al cargar la página (F5)
document.addEventListener('DOMContentLoaded', window.actualizarInterfazUsuario)

// 2. Lógica para el botón de Cerrar Sesión
document.addEventListener('DOMContentLoaded', () => {
	const btnLogout = document.getElementById('btn-logout')
	if (btnLogout) {
		btnLogout.addEventListener('click', () => {
			localStorage.removeItem('usuario_telemon') // Borramos la sesión
			actualizarInterfazUsuario() // Actualizamos la vista al instante
			alert('Has cerrado sesión correctamente.')
		})
	}
})
