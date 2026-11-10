document.addEventListener('DOMContentLoaded', () => {
	const btn_si = document.getElementById('btn-si')
	const btn_no = document.getElementById('btn-no')
	const modal = document.getElementById('modal_18')

	const DIAS_VALIDEZ = 30
	const TIEMPO_MILISEGUNDOS = 1000 * 60 * 60 * 24 * DIAS_VALIDEZ

	const fechaVerificacion = localStorage.getItem('age_verified_timestamp')
	const ahora = Date.now()

	if (fechaVerificacion && ahora - Number(fechaVerificacion) < TIEMPO_MILISEGUNDOS) {
		modal.style.display = 'none'
	} else {
		modal.style.display = 'block'
	}

	btn_si.addEventListener('click', () => {
		localStorage.setItem('age_verified_timestamp', Date.now().toString())
		modal.style.display = 'none'
	})

	btn_no.addEventListener('click', () => {
		alert('No cumple la mayoría de edad, lo sentimos xd')
	})
})
