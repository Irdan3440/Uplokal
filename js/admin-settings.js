/* ===========================================
   Admin Settings JavaScript
   =========================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Tab Navigation
    const tabs = document.querySelectorAll('.settings-tab');
    const sections = document.querySelectorAll('.settings-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update sections
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(target).classList.add('active');
        });
    });

    // Handle profile photo upload simulation
    const photoUpload = document.getElementById('photoUpload');
    if (photoUpload) {
        photoUpload.addEventListener('change', function (e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('profilePreview').src = e.target.result;
                    showNotification('Foto profil diperbarui (preview sementara)', 'success');
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    // Handle form submissions
    setupFormSubmissions();
});

function setupFormSubmissions() {
    // Account Settings
    const accountForm = document.querySelector('#account section:nth-child(2) .btn-primary');
    if (accountForm) {
        accountForm.addEventListener('click', (e) => {
            e.preventDefault();
            simulateSave('Perubahan profil berhasil disimpan');
        });
    }

    // Password Change
    const passwordForm = document.querySelector('#account section:last-child .btn-primary');
    if (passwordForm) {
        passwordForm.addEventListener('click', (e) => {
            e.preventDefault();
            simulateSave('Kata sandi berhasil diperbarui');
        });
    }

    // Platform Settings
    const platformForm = document.querySelector('#platform .btn-primary');
    if (platformForm) {
        platformForm.addEventListener('click', (e) => {
            e.preventDefault();
            simulateSave('Konfigurasi platform berhasil disimpan');
        });
    }

    // Notification Settings
    const notifyChecks = document.querySelectorAll('#notifications input[type="checkbox"]');
    notifyChecks.forEach(check => {
        check.addEventListener('change', () => {
            showNotification('Pengaturan notifikasi diperbarui', 'success');
        });
    });

    // Security - 2FA Toggle
    const tfaToggle = document.querySelector('#security .toggle-input');
    if (tfaToggle) {
        tfaToggle.addEventListener('change', function () {
            const status = this.checked ? 'diaktifkan' : 'dinonaktifkan';
            showNotification(`Autentikasi Dua Faktor ${status}`, 'warning');
        });
    }

    // Integrations
    const integrationForm = document.querySelector('#integrations .btn-primary');
    if (integrationForm) {
        integrationForm.addEventListener('click', (e) => {
            e.preventDefault();
            simulateSave('Koneksi integrasi berhasil disimpan');
        });
    }
}

function simulateSave(message) {
    const btn = event.target;
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader" class="spin"></i> Menyimpan...';
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        showNotification(message, 'success');
    }, 1000);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'alert-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
