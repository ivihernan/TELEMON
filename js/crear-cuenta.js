const modalRegister = document.getElementById('form-modal')
const btnAbrirRegister = document.getElementById('btn-open-register')
const btnCerrarRegister = document.getElementById('btn-close-register')

if (btnAbrirRegister && modalRegister) {
	btnAbrirRegister.addEventListener('click', () => {
		console.log('Botón de abrir registro clicado, mostrando modal...')
		modalRegister.style.display = 'block'
	})
}

if (btnCerrarRegister && modalRegister) {
	btnCerrarRegister.addEventListener('click', () => {
		modalRegister.style.display = 'none'
	})
}

document.getElementById('crear_cuenta_form').addEventListener('submit', async function (e) {
	e.preventDefault() // Detiene el recargo de la página

	console.log('Paso 1: Evento submit capturado')

	// Capturamos los campos
	const email = document.getElementById('email').value.trim()
	const password = document.getElementById('password').value.trim()
	const username = document.getElementById('username').value.trim()
	const ciudad = document.getElementById('ciudad').value
	const fechaInput = document.getElementById('fecha_nacimiento')
	const fechaNacimiento = fechaInput ? fechaInput.value : ''

	console.log('Paso 2: Datos capturados de los inputs:', {email, password, username, ciudad, fechaNacimiento})

	// Comprobación previa en JS
	if (!email || !password || !username || !ciudad || !fechaNacimiento) {
		alert('⚠️ Por favor, rellena todos los campos del formulario.')
		return
	}

	const fechaNacimientoDate = new Date(fechaNacimiento)
	const hoy = new Date()
	let edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear()
	const mes = hoy.getMonth() - fechaNacimientoDate.getMonth()

	if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimientoDate.getDate())) {
		edad--
	}
	if (edad < 18) {
		alert('⚠️ Debes ser mayor de 18 años para registrarte.')
		return
	}

	try {
		console.log('Paso 3: Enviando petición fetch a registrar_usuario.php...')

		const respuesta = await fetch('registrar_usuario.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({email, password, username, ciudad, fecha_nacimiento: fechaNacimiento}),
		})

		console.log('Paso 4: Código de estado HTTP devuelto:', respuesta.status)

		// Leemos la respuesta como texto crudo primero para detectar cualquier error de PHP
		const textoRespuesta = await respuesta.text()
		console.log('Paso 5: Respuesta exacta devuelta por PHP:', textoRespuesta)

		// Convertimos a JSON
		const resultado = JSON.parse(textoRespuesta)

		if (respuesta.ok && resultado.status === 'ok') {
			alert('✅ ' + resultado.mensaje)
			document.getElementById('crear_cuenta_form').reset()
		} else {
			alert('❌ Error devuelto por el servidor: ' + resultado.mensaje)
		}
	} catch (error) {
		console.error('Fallo durante el proceso:', error)
		alert('Hubo un fallo en la llamada. Abre la consola F12 para ver los detalles.')
	}
})
