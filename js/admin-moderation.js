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

    // Modals State
    let activeAction = null;
    let activeId = null;
    let activeData = null;

    // --- Flagged Actions ---

    // Dismiss flag
    window.dismissFlag = function (id) {
        activeAction = 'dismiss';
        activeId = id;

        const confirmTitle = document.getElementById('confirmTitle');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmBtn = document.getElementById('confirmActionButton');

        if (confirmTitle) confirmTitle.textContent = 'Abaikan Report';
        if (confirmMessage) confirmMessage.textContent = 'Apakah Anda yakin ingin mengabaikan report ini? Konten akan tetap tersedia.';
        if (confirmBtn) {
            confirmBtn.className = 'btn btn-success';
            confirmBtn.textContent = 'Ya, Abaikan';
        }

        openModal('confirmActionModal');
    };

    // Warn user
    window.warnUser = function (id) {
        activeId = id;
        document.getElementById('warnMessageInput').value = '';
        openModal('warnModal');
    };

    // Handler for Warning Modal
    document.getElementById('submitWarnButton').addEventListener('click', function () {
        const message = document.getElementById('warnMessageInput').value;
        if (!message) {
            alert('Pesan peringatan wajib diisi');
            return;
        }

        const el = document.querySelector(`.flagged-item[data-id="${activeId}"]`);
        if (el) {
            el.classList.add('fade-out');
            setTimeout(() => {
                const idx = flaggedData.findIndex(item => item.id === activeId);
                if (idx !== -1) flaggedData.splice(idx, 1);
                removeAndRefresh(activeId);
                closeModal('warnModal');
                showNotification('Peringatan terkirim ke user', 'warning');
            }, 400);
        }
    });

    // Confirmation Handler (Shared for multiple actions)
    document.getElementById('confirmActionButton').addEventListener('click', function () {
        if (activeAction === 'dismiss') {
            const el = document.querySelector(`.flagged-item[data-id="${activeId}"]`);
            if (el) {
                el.classList.add('fade-out-right');
                setTimeout(() => {
                    const idx = flaggedData.findIndex(item => item.id === activeId);
                    if (idx !== -1) flaggedData.splice(idx, 1);
                    removeAndRefresh(activeId);
                    closeModal('confirmActionModal');
                    showNotification('Report diabaikan', 'success');
                }, 400);
            }
        } else if (activeAction === 'unsuspend') {
            const idx = suspendedData.findIndex(u => u.id === activeId);
            if (idx !== -1) suspendedData.splice(idx, 1);
            currentSuspended = [...suspendedData];
            renderSuspendedUsers();
            updateStats();
            closeModal('confirmActionModal');
            showNotification('Suspend dicabut', 'success');
        } else if (activeAction === 'ban') {
            const idx = suspendedData.findIndex(u => u.id === activeId);
            if (idx !== -1) suspendedData.splice(idx, 1);
            currentSuspended = [...suspendedData];
            renderSuspendedUsers();
            updateStats();
            closeModal('confirmActionModal');
            showNotification('User telah di-ban permanen', 'error');
        } else if (activeAction === 'deleteCategory') {
            closeModal('confirmActionModal');
            showNotification(`Kategori "${activeData}" telah dihapus`, 'success');
        }
    });

    // Suspend user
    let currentSuspendId = null;

    window.suspendUser = function (id) {
        currentSuspendId = id;
        openSuspendModal();
    };

    window.openSuspendModal = function () {
        openModal('suspendModal');
    };

    window.closeSuspendModal = function () {
        closeModal('suspendModal');
        currentSuspendId = null;
        document.getElementById('suspendDuration').value = '';
        document.getElementById('suspendReason').value = '';
        document.getElementById('suspendNote').value = '';
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
        const flaggedCount = flaggedData.length;
        const suspendedCount = suspendedData.length;

        // Update tab badges
        const flaggedBadge = document.getElementById('flaggedBadge');
        if (flaggedBadge) flaggedBadge.textContent = flaggedCount;

        const suspendedBadge = document.getElementById('suspendedBadge');
        if (suspendedBadge) suspendedBadge.textContent = suspendedCount;

        // Update stat cards
        const flaggedStat = document.querySelector('.stat-card.flagged .stat-value');
        if (flaggedStat) flaggedStat.textContent = flaggedCount;

        const suspendedStat = document.querySelector('.stat-card.suspended .stat-value');
        if (suspendedStat) suspendedStat.textContent = suspendedCount;
    }

    window.viewContent = function (id) {
        const item = flaggedData.find(i => i.id === id);
        if (!item) return;

        const modalBody = document.getElementById('viewModalBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="business-preview" style="margin-bottom: var(--space-6)">
                    <img src="${item.avatar}" alt="${item.businessName}" style="width: 64px; height: 64px; border-radius: var(--radius-lg)">
                    <div class="business-info">
                        <h4 style="font-size: var(--text-lg)">${item.businessName}</h4>
                        <p>${item.businessCategory}</p>
                    </div>
                </div>
                <div style="margin-bottom: var(--space-4)">
                    <strong style="display: block; margin-bottom: var(--space-2); font-size: var(--text-sm); text-transform: uppercase; color: var(--color-gray-500)">Alasan Report</strong>
                    <ul style="padding-left: var(--space-4); margin: 0">
                        ${item.reasons.map(r => `<li style="margin-bottom: var(--space-1)">${r}</li>`).join('')}
                    </ul>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-top: var(--space-6); padding-top: var(--space-6); border-top: 1px solid var(--color-gray-100)">
                    <div>
                        <span style="display: block; font-size: var(--text-xs); color: var(--color-gray-500)">Status Konten</span>
                        <span class="type-badge ${item.type}">${item.typeName}</span>
                    </div>
                    <div>
                        <span style="display: block; font-size: var(--text-xs); color: var(--color-gray-500)">Jumlah Laporan</span>
                        <span class="report-count ${item.urgent ? 'urgent' : ''}">${item.reports} Laporan</span>
                    </div>
                </div>
            `;
            openModal('viewModal');
        }
    };

    window.openModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    };

    // Initial render
    // Suspended Data
    const suspendedData = [
        {
            id: 'john',
            name: 'John Doe',
            business: 'Toko Elektronik JD',
            reason: 'Produk Palsu',
            date: '15 Jan 2024',
            duration: '7 hari',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=EF4444&color=fff'
        },
        {
            id: 'sarah',
            name: 'Sarah Lee',
            business: 'Fashion SL Store',
            reason: 'Spam',
            date: '12 Jan 2024',
            duration: '3 hari',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Lee&background=F59E0B&color=fff'
        }
    ];

    let currentSuspended = [...suspendedData];

    // Render suspended users
    function renderSuspendedUsers() {
        const tableBody = document.querySelector('.suspended-table tbody');
        if (!tableBody) return;

        if (currentSuspended.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-gray-500)">Tidak ada user dalam daftar suspend.</td></tr>`;
            return;
        }

        tableBody.innerHTML = currentSuspended.map(user => `
            <tr data-id="${user.id}">
                <td>
                    <div class="user-cell">
                        <img src="${user.avatar}" alt="${user.name}">
                        <span>${user.name}</span>
                    </div>
                </td>
                <td>${user.business}</td>
                <td><span class="reason-badge">${user.reason}</span></td>
                <td>${user.date}</td>
                <td>${user.duration}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn unsuspend" title="Cabut Suspend" onclick="unsuspendUser('${user.id}')">
                            <i data-lucide="user-check"></i>
                        </button>
                        <button class="action-btn extend" title="Perpanjang" onclick="extendSuspension('${user.id}')">
                            <i data-lucide="clock"></i>
                        </button>
                        <button class="action-btn ban" title="Ban Permanen" onclick="banUser('${user.id}')">
                            <i data-lucide="ban"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // --- Suspended User Actions ---

    // Unsuspend
    window.unsuspendUser = function (userId) {
        activeAction = 'unsuspend';
        activeId = userId;

        const confirmTitle = document.getElementById('confirmTitle');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmBtn = document.getElementById('confirmActionButton');

        if (confirmTitle) confirmTitle.textContent = 'Cabut Suspend';
        if (confirmMessage) confirmMessage.textContent = `Apakah Anda yakin ingin mencabut suspend untuk user ${userId}?`;
        if (confirmBtn) {
            confirmBtn.className = 'btn btn-success';
            confirmBtn.textContent = 'Ya, Cabut Suspend';
        }

        openModal('confirmActionModal');
    };

    // Extend
    window.extendSuspension = function (userId) {
        activeId = userId;
        document.getElementById('extendDaysInput').value = '';
        openModal('extendModal');
    };

    document.getElementById('confirmExtendButton').addEventListener('click', function () {
        const days = document.getElementById('extendDaysInput').value;
        if (days && !isNaN(days)) {
            const user = suspendedData.find(u => u.id === activeId);
            if (user) user.duration = `${days} hari`;
            currentSuspended = [...suspendedData];
            renderSuspendedUsers();
            updateStats();
            closeModal('extendModal');
            showNotification(`Suspend diperpanjang ${days} hari`, 'warning');
        } else {
            alert('Masukkan jumlah hari yang valid');
        }
    });

    // Ban
    window.banUser = function (userId) {
        activeAction = 'ban';
        activeId = userId;

        const confirmTitle = document.getElementById('confirmTitle');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmBtn = document.getElementById('confirmActionButton');

        if (confirmTitle) confirmTitle.textContent = 'Ban Permanen';
        if (confirmMessage) confirmMessage.textContent = `Apakah Anda yakin ingin BAN PERMANEN user ${userId}? Aksi ini tidak dapat dibatalkan.`;
        if (confirmBtn) {
            confirmBtn.className = 'btn btn-danger';
            confirmBtn.textContent = 'Ya, Ban Permanen';
        }

        openModal('confirmActionModal');
    };

    // --- Category Management ---

    window.addCategory = function () {
        activeAction = 'addCategory';
        document.getElementById('categoryModalTitle').textContent = 'Tambah Kategori';
        document.getElementById('categoryNameInput').value = '';
        openModal('categoryModal');
    };

    window.editCategory = function (name) {
        activeAction = 'editCategory';
        activeData = name;
        document.getElementById('categoryModalTitle').textContent = 'Edit Kategori';
        document.getElementById('categoryNameInput').value = name;
        openModal('categoryModal');
    };

    document.getElementById('saveCategoryButton').addEventListener('click', function () {
        const name = document.getElementById('categoryNameInput').value;
        if (name) {
            if (activeAction === 'addCategory') {
                showNotification(`Kategori "${name}" ditambahkan`, 'success');
            } else {
                showNotification(`Kategori "${activeData}" diperbarui menjadi "${name}"`, 'success');
            }
            closeModal('categoryModal');
        } else {
            alert('Nama kategori wajib diisi');
        }
    });

    window.deleteCategory = function (name) {
        activeAction = 'deleteCategory';
        activeData = name;

        const confirmTitle = document.getElementById('confirmTitle');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmBtn = document.getElementById('confirmActionButton');

        if (confirmTitle) confirmTitle.textContent = 'Hapus Kategori';
        if (confirmMessage) confirmMessage.textContent = `Apakah Anda yakin ingin menghapus kategori "${name}"? Semua bisnis di kategori ini akan dipindahkan ke kategori "Lainnya".`;
        if (confirmBtn) {
            confirmBtn.className = 'btn btn-danger';
            confirmBtn.textContent = 'Ya, Hapus';
        }

        openModal('confirmActionModal');
    };

    // Modal backdrop click to close
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });

    // Helper: Show Notification
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

    // Initial render
    renderFlaggedItems();
    renderSuspendedUsers();
});
