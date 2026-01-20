/**
 * Account Settings Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Save account button
    const saveBtn = document.getElementById('saveAccountBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            this.classList.add('loading');
            this.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> <span>Menyimpan...</span>';
            lucide.createIcons();

            setTimeout(() => {
                this.classList.remove('loading');
                this.innerHTML = '<i data-lucide="save"></i> <span class="btn-label">Simpan Perubahan</span>';
                lucide.createIcons();
                showNotification('Profil Anda telah berhasil diperbarui!', 'success');
            }, 1200);
        });
    }

    // Skills handling
    const removeSkillBtns = document.querySelectorAll('.skill-tag i');
    removeSkillBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            this.closest('.skill-tag').remove();
        });
    });

    const addSkillBtn = document.querySelector('.add-skill-btn');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', function () {
            const skillName = prompt('Masukkan keahlian baru:');
            if (skillName && skillName.trim()) {
                const tag = document.createElement('span');
                tag.className = 'skill-tag';
                tag.innerHTML = `${skillName.trim()} <i data-lucide="x"></i>`;
                this.before(tag);
                lucide.createIcons();

                // Add event listener to new tag's x icon
                tag.querySelector('i').addEventListener('click', function () {
                    tag.remove();
                });
            }
        });
    }

    // Handle profile image upload simulation
    const editImageBtn = document.querySelector('.edit-image-btn');
    if (editImageBtn) {
        editImageBtn.addEventListener('click', function () {
            showNotification('Fitur unggah foto segera hadir!', 'info');
        });
    }

    function showNotification(message, type = 'success') {
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
