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

	if (formRegister) {
		formRegister.addEventListener('submit', async function (e) {
			e.preventDefault()

			// Captura de valores de los inputs
			const email = document.getElementById('email')?.value.trim() || ''
			const password = document.getElementById('password')?.value.trim() || ''
			const username = document.getElementById('username')?.value.trim() || ''
			const ciudad = document.getElementById('ciudad')?.value || ''
			const fecha_nacimiento = document.getElementById('fecha_nacimiento')?.value || ''

			// 1. Validar que no haya campos vacíos
			if (!email || !password || !username || !ciudad || !fecha_nacimiento) {
				alert('⚠️ Por favor, rellena todos los campos del formulario.')
				return
			}

			// 2. Validar edad (mínimo 18 años)
			const fechaNacDate = new Date(fecha_nacimiento + 'T00:00:00')
			const hoy = new Date()
			let edad = hoy.getFullYear() - fechaNacDate.getFullYear()
			const mes = hoy.getMonth() - fechaNacDate.getMonth()

			if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacDate.getDate())) {
				edad--
			}

			if (isNaN(edad) || edad < 18) {
				alert('❌ Debes ser mayor de 18 años para registrarte en TELEMON.')
				return
			}

			// 3. Envío seguro a PHP
			try {
				const respuesta = await fetch('registrar_usuario.php', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email,
						password,
						username,
						ciudad,
						fecha_nacimiento,
					}),
				})

				const resultado = await respuesta.json()

				if (respuesta.ok && resultado.status === 'ok') {
					alert('✅ ' + resultado.mensaje)

					if (resultado.usuario) {
						localStorage.setItem('usuario_telemon', JSON.stringify(resultado.usuario))
					}

					if (typeof window.actualizarInterfazUsuario === 'function') {
						window.actualizarInterfazUsuario()
					}

					formRegister.reset()
					if (modalRegister) {
						modalRegister.style.display = 'none'
					}
				} else {
					alert('❌ ' + resultado.mensaje)
				}
			} catch (error) {
				console.error('Error en la llamada:', error)
				alert('Hubo un error al conectar con el servidor.')
			}
		})
	}
})
