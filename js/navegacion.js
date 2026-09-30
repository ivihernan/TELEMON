document.addEventListener('DOMContentLoaded', () => {
    // 1. GESTIÓN DE PESTAÑAS (Navegación)
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.getAttribute('data-tab');
            if (!targetTabId) return;

            
            navButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

           
            button.classList.add('active');
            const activeTabSection = document.getElementById(targetTabId);
            if (activeTabSection) {
                activeTabSection.classList.add('active');
            }

          
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) navMenu.classList.remove('open');

            
            if (typeof updateUI === 'function') {
                updateUI();
            }
        });
    });
});