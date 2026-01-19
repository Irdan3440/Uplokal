/**
 * Settings Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Settings Navigation
    const navItems = document.querySelectorAll('.settings-nav-item');
    const sections = document.querySelectorAll('.settings-section');

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all nav items and sections
            navItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked nav item and its section
            this.classList.add('active');
            const sectionId = this.dataset.section;
            document.getElementById(sectionId).classList.add('active');

            // On mobile, scroll the active item into view
            if (window.innerWidth <= 1024) {
                this.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }

            // Update page title optionally or just scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Theme Selector
    const themeOptions = document.querySelectorAll('.theme-option input');
    themeOptions.forEach(option => {
        option.addEventListener('change', function () {
            const theme = this.value;
            // Handle theme change here
            showNotification(`Tema telah diubah ke ${theme}`, 'success');
        });
    });

    // Save Settings Button
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            this.classList.add('loading');
            this.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> <span>Menyimpan...</span>';
            lucide.createIcons();

            setTimeout(() => {
                this.classList.remove('loading');
                this.innerHTML = '<i data-lucide="save"></i> <span class="btn-label">Simpan</span>';
                lucide.createIcons();
                showNotification('Semua pengaturan telah berhasil disimpan!', 'success');
            }, 1000);
        });
    }

    // Toggle items interaction simulation
    const toggles = document.querySelectorAll('.toggle input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function () {
            const label = this.closest('.toggle-item').querySelector('.toggle-label').textContent;
            const state = this.checked ? 'diaktifkan' : 'dinonaktifkan';
            showNotification(`${label} telah ${state}`, 'success');
        });
    });

    function showNotification(message, type = 'success') {
        // Shared notification logic
        const existingNotif = document.querySelector('.notification');
        if (existingNotif) existingNotif.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});
