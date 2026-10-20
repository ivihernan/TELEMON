document.addEventListener('DOMContentLoaded', () => {
	const paymentButtons = document.querySelectorAll('.payment-btn')
	const paymentSections = document.querySelectorAll('.payment-section')
	const confirmButtons = document.querySelectorAll('.btn-confirm-payment')

	const openModalPocketImg = document.getElementById('open-modal-pocket')
	const modalBuyMoney = document.getElementById('buy-money')
	const btnCloseModal = document.getElementById('close-buy-money')

	if (openModalPocketImg) {
		openModalPocketImg.addEventListener('click', () => {
			modalBuyMoney.classList.remove('hidden')
		})
	}

	if (btnCloseModal) {
		btnCloseModal.addEventListener('click', () => {
			modalBuyMoney.classList.add('hidden')
		})
	}

	if (modalBuyMoney) {
		modalBuyMoney.addEventListener('click', event => {
			if (event.target === modalBuyMoney) {
				modalBuyMoney.classList.add('hidden')
			}
		})
	}

	// Lógica para cambiar entre metodos de pago
	paymentButtons.forEach(button => {
		button.addEventListener('click', () => {
			paymentButtons.forEach(btn => btn.classList.remove('active'))

			paymentSections.forEach(section => section.classList.add('hidden'))

			button.classList.add('active')
			const targetId = button.getAttribute('data-target')
			document.getElementById(targetId).classList.remove('hidden')
		})
	})

	//Confirmo la transferencia de dinero hacia la cuenta
	confirmButtons.forEach(button => {
		button.addEventListener('click', e => {
			const section = e.target.closest('.payment-section')
			const amountInput = section.querySelector('.amount-input')
			const amount = parseFloat(amountInput.value)

			// Validaciones
			if (isNaN(amount) || amount <= 0) {
				alert('Por favor, ingresa una cantidad válida mayor a $0.')
				return
			}

			if (amount > 100) {
				alert('El máximo permitido por transacción es de $100.')
				amountInput.value = 100 // Autocorrección opcional
				return
			}

			player.money += amount
			updateUI()

			alert(`¡Has ingresado $${amount} exitosamente!`)
			amountInput.value = '' // Limpiar el input

			modalBuyMoney.classList.add('hidden')
		})
	})
})
