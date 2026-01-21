/* ===========================================
   Admin Moderation JavaScript
   =========================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initial data
    const flaggedData = [
        {
            id: 1,
            type: 'profile',
            typeName: 'Profil Bisnis',
            reports: 3,
            time: '2 jam lalu',
            businessName: 'Toko XYZ Fashion',
            businessCategory: 'Fashion & Aksesoris',
            avatar: 'https://ui-avatars.com/api/?name=Toko+XYZ&background=DC2626&color=fff',
            reasons: [
                'Konten tidak sesuai dengan deskripsi',
                'Gambar produk berpotensi melanggar hak cipta'
            ],
            urgent: false
        },
        {
            id: 2,
            type: 'product',
            typeName: 'Produk',
            reports: 5,
            time: '5 jam lalu',
            businessName: 'Elektronik Murah 88',
            businessCategory: 'Elektronik',
            avatar: 'https://ui-avatars.com/api/?name=Elektronik+Murah&background=F59E0B&color=fff',
            reasons: [
                'Produk palsu / imitasi',
                'Harga tidak wajar (terlalu murah)',
                'Deskripsi menyesatkan'
            ],
            urgent: false
        },
        {
            id: 3,
            type: 'review',
            typeName: 'Review',
            reports: 10,
            time: '1 jam lalu',
            businessName: 'Review oleh UserABC',
            businessCategory: 'Pada: Toko Sinar Jaya',
            avatar: 'https://ui-avatars.com/api/?name=Anonymous&background=6B7280&color=fff',
            reasons: [
                'Bahasa kasar / tidak sopan',
                'Konten tidak relevan (spam)',
                'Fitnah / informasi palsu'
            ],
            urgent: true
        }
    ];

    let currentFlagged = [...flaggedData];

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // DOM Elements
    const modTabs = document.querySelectorAll('.mod-tab');
    const flaggedList = document.getElementById('flaggedList');
    const modSearch = document.getElementById('modSearch');

    // Tab switching
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
            const targetContent = document.getElementById(tabId + '-content');
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // Search input
    if (modSearch) {
        modSearch.addEventListener('input', function () {
            const term = this.value.toLowerCase();
            currentFlagged = flaggedData.filter(item =>
                item.businessName.toLowerCase().includes(term) ||
                item.businessCategory.toLowerCase().includes(term) ||
                item.reasons.some(r => r.toLowerCase().includes(term))
            );
            renderFlaggedItems();
        });
    }

    // Render flagged items
    function renderFlaggedItems() {
        if (!flaggedList) return;

        if (currentFlagged.length === 0) {
            flaggedList.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="shield-check"></i>
                    <p>Tidak ada konten yang mencurigakan saat ini.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        flaggedList.innerHTML = currentFlagged.map(item => `
            <div class="flagged-item ${item.urgent ? 'urgent' : ''}" data-id="${item.id}">
                <div class="flagged-header">
                    <div class="content-type">
                        <span class="type-badge ${item.type}">
                            <i data-lucide="${getTypeIcon(item.type)}"></i> ${item.typeName}
                        </span>
                        <span class="report-count ${item.urgent ? 'urgent' : ''}">
                            <i data-lucide="${item.urgent ? 'alert-octagon' : 'flag'}"></i> ${item.reports} reports
                        </span>
                    </div>
                    <div class="flagged-time">${item.time}</div>
                </div>
                <div class="flagged-content">
                    <div class="business-preview">
                        <img src="${item.avatar}" alt="${item.businessName}">
                        <div class="business-info">
                            <h4>${item.businessName}</h4>
                            <p>${item.businessCategory}</p>
                        </div>
                    </div>
                    <div class="report-reason">
                        <strong>Alasan Report:</strong>
                        <ul>
                            ${item.reasons.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="flagged-actions">
                    <button class="btn btn-success btn-sm" onclick="dismissFlag(${item.id})">
                        <i data-lucide="check"></i> Abaikan
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="warnUser(${item.id})">
                        <i data-lucide="alert-triangle"></i> Peringatan
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="suspendUser(${item.id})">
                        <i data-lucide="user-x"></i> Suspend
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="viewContent(${item.id})">
                        <i data-lucide="external-link"></i> Lihat
                    </button>
                </div>
            </div>
        `).join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();
        updateStats();
    }

    function getTypeIcon(type) {
        switch (type) {
            case 'profile': return 'user';
            case 'product': return 'package';
            case 'review': return 'message-circle';
            default: return 'file-text';
        }
    }

    // Dismiss flag
    window.dismissFlag = function (id) {
        if (confirm('Abaikan report ini?')) {
            const el = document.querySelector(`.flagged-item[data-id="${id}"]`);
            if (el) {
                el.classList.add('fade-out-right');
                setTimeout(() => {
                    const idx = flaggedData.findIndex(item => item.id === id);
                    if (idx !== -1) flaggedData.splice(idx, 1);
                    removeAndRefresh(id);
                    showNotification('Report diabaikan', 'success');
                }, 400);
            }
        }
    };

    // Warn user
    window.warnUser = function (id) {
        const message = prompt('Pesan peringatan untuk user:');
        if (message) {
            const el = document.querySelector(`.flagged-item[data-id="${id}"]`);
            if (el) {
                el.classList.add('fade-out');
                setTimeout(() => {
                    const idx = flaggedData.findIndex(item => item.id === id);
                    if (idx !== -1) flaggedData.splice(idx, 1);
                    removeAndRefresh(id);
                    showNotification('Peringatan terkirim ke user', 'warning');
                }, 400);
            }
        }
    };

    // Suspend user
    let currentSuspendId = null;

    window.suspendUser = function (id) {
        currentSuspendId = id;
        openSuspendModal();
    };

    window.openSuspendModal = function () {
        const modal = document.getElementById('suspendModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeSuspendModal = function () {
        const modal = document.getElementById('suspendModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            currentSuspendId = null;
            document.getElementById('suspendDuration').value = '';
            document.getElementById('suspendReason').value = '';
            document.getElementById('suspendNote').value = '';
        }
    };

    window.confirmSuspend = function () {
        const duration = document.getElementById('suspendDuration').value;
        const reason = document.getElementById('suspendReason').value;

        if (!duration || !reason) {
            alert('Durasi dan alasan wajib diisi');
            return;
        }

        const el = document.querySelector(`.flagged-item[data-id="${currentSuspendId}"]`);
        if (el) {
            el.classList.add('fade-out-left');
            setTimeout(() => {
                const idx = flaggedData.findIndex(item => item.id === currentSuspendId);
                if (idx !== -1) flaggedData.splice(idx, 1);
                removeAndRefresh(currentSuspendId);
                closeSuspendModal();
                showNotification('User berhasil disuspend', 'error');
            }, 400);
        }
    };

    function removeAndRefresh(id) {
        const idx = currentFlagged.findIndex(item => item.id === id);
        if (idx !== -1) currentFlagged.splice(idx, 1);
        renderFlaggedItems();
    }

    // Update stats
    function updateStats() {
        const count = flaggedData.length;

        // Update tab badge
        const flaggedBadge = document.getElementById('flaggedBadge');
        if (flaggedBadge) flaggedBadge.textContent = count;

        // Update stat card
        const statCard = document.querySelector('.stat-card.flagged .stat-value');
        if (statCard) statCard.textContent = count;
    }

    window.viewContent = function (id) {
        alert(`Viewing content for ID: ${id}`);
    };

    // Initial render
    renderFlaggedItems();
});

// Original notification and unsuspend functions
function unsuspendUser(userId) {
    if (confirm(`Cabut suspend untuk user ${userId}?`)) {
        showNotification('Suspend dicabut', 'success');
    }
}

function extendSuspension(userId) {
    const days = prompt('Perpanjang berapa hari?');
    if (days && !isNaN(days)) {
        showNotification(`Suspend diperpanjang ${days} hari`, 'warning');
    }
}

function banUser(userId) {
    if (confirm(`BAN PERMANEN user ${userId}?`)) {
        showNotification('User telah di-ban permanen', 'error');
    }
}

function addCategory() {
    const name = prompt('Nama kategori baru:');
    if (name) {
        showNotification(`Kategori "${name}" ditambahkan`, 'success');
    }
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

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
