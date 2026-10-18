document.addEventListener('DOMContentLoaded', () => {
    const paymentButtons = document.querySelectorAll('.payment-btn');
    const paymentSections = document.querySelectorAll('.payment-section');
    const confirmButtons = document.querySelectorAll('.btn-confirm-payment');
    
    // Referencias a los elementos principales del modal
    const openModalPocketImg = document.getElementById('open-modal-pocket');
    const modalBuyMoney = document.getElementById('buy-money');
    const btnCloseModal = document.getElementById('close-buy-money');

    // 1. Abrir el modal al hacer clic en la imagen de pocket.png
    if (openModalPocketImg) {
        openModalPocketImg.addEventListener('click', () => {
            modalBuyMoney.classList.remove('hidden');
        });
    }

    // 2. Cerrar el modal al hacer clic en la X
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            modalBuyMoney.classList.add('hidden');
        });
    }

    // 3. Cerrar el modal al hacer clic fuera del contenido (en el fondo oscuro)
    if (modalBuyMoney) {
        modalBuyMoney.addEventListener('click', (event) => {
            // Comprobamos si el clic fue exactamente en el contenedor oscuro y no dentro de la caja blanca
            if (event.target === modalBuyMoney) {
                modalBuyMoney.classList.add('hidden');
            }
        });
    }

    // Lógica para cambiar entre métodos de pago
    paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Quitar la clase 'active' de todos los botones
            paymentButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ocultar todas las secciones de pago
            paymentSections.forEach(section => section.classList.add('hidden'));

            // Activar el botón clicado y mostrar su sección correspondiente
            button.classList.add('active');
            const targetId = button.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // Lógica para validar y procesar el pago ficticio
    confirmButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Encontrar el input de cantidad dentro de la sección actual
            const section = e.target.closest('.payment-section');
            const amountInput = section.querySelector('.amount-input');
            const amount = parseFloat(amountInput.value);

            // Validaciones
            if (isNaN(amount) || amount <= 0) {
                alert('Por favor, ingresa una cantidad válida mayor a $0.');
                return;
            }

            if (amount > 100) {
                alert('El máximo permitido por transacción es de $100.');
                amountInput.value = 100; // Autocorrección opcional
                return;
            }

            player.money += amount
            updateUI()

            // Aquí sumas el dinero a la variable global de tu juego
            // playerMoney += amount;
            // updateMainUI();

            alert(`¡Has ingresado $${amount} exitosamente!`);
            amountInput.value = ''; // Limpiar el input
            
            // Opcional: Cerrar el modal automáticamente tras el pago exitoso
            modalBuyMoney.classList.add('hidden');
        });
    });
});