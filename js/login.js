// 1. Control del Modal de Login (Abrir y Cerrar)
const modalLogin = document.getElementById('login-modal')
const btnAbrirLogin = document.getElementById('btn-open-login')
const btnCerrarLogin = document.getElementById('btn-cerrar-login')

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

// 2. Procesar el envío del Formulario de Login
document.getElementById('iniciar_sesion_form').addEventListener('submit', async function (e) {
	e.preventDefault()

	const credenciales = {
		email: document.getElementById('login_email').value.trim(),
		password: document.getElementById('login_password').value.trim(),
	}

	let resultado

	// 1. Petición al servidor PHP
	try {
		const respuesta = await fetch('login.php', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(credenciales),
		})

		resultado = await respuesta.json()

		if (!respuesta.ok || resultado.status !== 'ok') {
			alert('❌ ' + (resultado.mensaje || 'Error en las credenciales'))
			return // Detenemos aquí si los datos fueron erróneos
		}
	} catch (errorRed) {
		console.error('Fallo de red o PHP:', errorRed)
		alert('No se pudo conectar con el servidor backend.')
		return
	}

	// 2. Si el servidor respondió OK, guardamos la sesión y actualizamos la vista
	try {
		alert(resultado.mensaje) // ¡Bienvenido de nuevo!

		// Guardar sesión en el navegador
		localStorage.setItem('usuario_telemon', JSON.stringify(resultado.usuario))

		// Actualizar la barra superior (Saldo / Botones)
		if (typeof actualizarInterfazUsuario === 'function') {
			actualizarInterfazUsuario()
		}

		// Ocultar modal de login si existe (comprobamos ambos posibles IDs)
		const modalLogin = document.getElementById('login-modal') || document.getElementById('form-modal')
		if (modalLogin) {
			modalLogin.style.display = 'none'
		}

		// Limpiar el formulario
		document.getElementById('iniciar_sesion_form').reset()
	} catch (errorUI) {
		console.error('Error al actualizar la interfaz gráfica:', errorUI)
	}
})
