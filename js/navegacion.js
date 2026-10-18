document.addEventListener('DOMContentLoaded', () => {
 
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    const hamburgerBtn = document.getElementById('hamburger-btn')
    const navMenu = document.getElementById('nav-menu')

    if(hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open')
        })
    }

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

            if (navMenu) navMenu.classList.remove('open');


            if (targetTabId === 'collection-section' && typeof showCollection === 'function') {
                showCollection();
            }

            if(targetTabId === 'market-section' && typeof initMarket === 'function'){
                initMarket()
            }

            
            if (typeof updateUI === 'function') {
                updateUI();
            }
        });
    });
});