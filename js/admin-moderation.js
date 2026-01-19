/* ===========================================
   Admin Moderation JavaScript
   =========================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Tab switching
    const modTabs = document.querySelectorAll('.mod-tab');
    modTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Update active tab
            modTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId + '-content').classList.add('active');
        });
    });
});

// Dismiss flag
function dismissFlag(id) {
    if (confirm('Abaikan report ini?')) {
        const item = document.querySelector(`.flagged-item[data-id="${id}"]`);
        if (item) {
            item.style.transition = 'all 0.3s ease';
            item.style.backgroundColor = '#D1FAE5';

            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(100px)';

                setTimeout(() => {
                    item.remove();
                    updateFlaggedCount();
                    showNotification('Report diabaikan', 'success');
                }, 300);
            }, 300);
        }
    }
}

// Warn user
function warnUser(id) {
    const message = prompt('Pesan peringatan untuk user:');
    if (message) {
        const item = document.querySelector(`.flagged-item[data-id="${id}"]`);
        if (item) {
            item.style.transition = 'all 0.3s ease';
            item.style.backgroundColor = '#FEF3C7';

            setTimeout(() => {
                item.style.opacity = '0';

                setTimeout(() => {
                    item.remove();
                    updateFlaggedCount();
                    showNotification('Peringatan terkirim ke user', 'warning');
                }, 300);
            }, 300);
        }
    }
}

// Suspend user
let currentSuspendId = null;

function suspendUser(id) {
    currentSuspendId = id;
    openSuspendModal();
}

function openSuspendModal() {
    const modal = document.getElementById('suspendModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeSuspendModal() {
    const modal = document.getElementById('suspendModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        currentSuspendId = null;

        // Reset form
        document.getElementById('suspendDuration').value = '';
        document.getElementById('suspendReason').value = '';
        document.getElementById('suspendNote').value = '';
        document.getElementById('notifyUser').checked = true;
    }
}

function confirmSuspend() {
    const duration = document.getElementById('suspendDuration').value;
    const reason = document.getElementById('suspendReason').value;
    const note = document.getElementById('suspendNote').value;
    const notify = document.getElementById('notifyUser').checked;

    if (!duration) {
        alert('Pilih durasi suspend');
        return;
    }

    if (!reason) {
        alert('Pilih alasan suspend');
        return;
    }

    console.log('Suspending user:', { id: currentSuspendId, duration, reason, note, notify });

    const item = document.querySelector(`.flagged-item[data-id="${currentSuspendId}"]`);
    if (item) {
        item.style.transition = 'all 0.3s ease';
        item.style.backgroundColor = '#FEE2E2';

        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-100px)';

            setTimeout(() => {
                item.remove();
                updateFlaggedCount();
                closeSuspendModal();
                showNotification('User berhasil disuspend', 'error');
            }, 300);
        }, 300);
    }
}

// View content
function viewContent(id) {
    alert(`Viewing content for ID: ${id}`);
    // In production, open in new tab or modal
}

// Unsuspend user
function unsuspendUser(userId) {
    if (confirm(`Cabut suspend untuk user ${userId}?`)) {
        showNotification('Suspend dicabut', 'success');
        // In production, update table
    }
}

// Extend suspension
function extendSuspension(userId) {
    const days = prompt('Perpanjang berapa hari?');
    if (days && !isNaN(days)) {
        showNotification(`Suspend diperpanjang ${days} hari`, 'warning');
        // In production, update table
    }
}

// Ban user permanently
function banUser(userId) {
    if (confirm(`BAN PERMANEN user ${userId}? Aksi ini tidak dapat dibatalkan!`)) {
        showNotification('User telah di-ban permanen', 'error');
        // In production, update table
    }
}

// Add category
function addCategory() {
    const name = prompt('Nama kategori baru:');
    if (name) {
        showNotification(`Kategori "${name}" ditambahkan`, 'success');
        // In production, add to grid
    }
}

// Update flagged count
function updateFlaggedCount() {
    const count = document.querySelectorAll('.flagged-item').length;

    // Update stat card
    const statCard = document.querySelector('.stat-card.flagged .stat-value');
    if (statCard) {
        statCard.textContent = count;
    }

    // Update tab badge
    const tabBadge = document.querySelector('.mod-tab[data-tab="flagged"] .tab-badge');
    if (tabBadge) {
        tabBadge.textContent = count;
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'alert-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Modal backdrop click to close
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
});
