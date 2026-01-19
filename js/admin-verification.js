/* ===========================================
   Admin Verification JavaScript
   =========================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            filterQueue(filter);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase();
            searchQueue(query);
        });
    }

    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            sortQueue(this.value);
        });
    }
});

// Filter queue items
function filterQueue(filter) {
    const items = document.querySelectorAll('.queue-item');
    items.forEach(item => {
        const status = item.querySelector('.status-badge');
        if (!status) return;

        const statusClass = status.classList;
        let show = true;

        if (filter !== 'all') {
            show = statusClass.contains(filter);
        }

        item.style.display = show ? 'block' : 'none';
    });
}

// Search queue items
function searchQueue(query) {
    const items = document.querySelectorAll('.queue-item');
    items.forEach(item => {
        const businessName = item.querySelector('.business-details h3').textContent.toLowerCase();
        const show = businessName.includes(query);
        item.style.display = show ? 'block' : 'none';
    });
}

// Sort queue items
function sortQueue(sortBy) {
    const queue = document.querySelector('.verification-queue');
    const items = Array.from(queue.querySelectorAll('.queue-item'));

    items.sort((a, b) => {
        const dateA = a.querySelector('.business-meta span:last-child').textContent;
        const dateB = b.querySelector('.business-meta span:last-child').textContent;

        if (sortBy === 'newest') {
            return new Date(dateB) - new Date(dateA);
        } else if (sortBy === 'oldest') {
            return new Date(dateA) - new Date(dateB);
        } else if (sortBy === 'priority') {
            const priorityA = a.querySelector('.priority-badge.high') ? 1 : 0;
            const priorityB = b.querySelector('.priority-badge.high') ? 1 : 0;
            return priorityB - priorityA;
        }
        return 0;
    });

    items.forEach(item => queue.appendChild(item));
}

// Approve verification
function approveVerification(id) {
    if (confirm('Approve verifikasi bisnis ini?')) {
        const item = document.querySelector(`.queue-item[data-id="${id}"]`);
        if (item) {
            // Show success animation
            item.style.transition = 'all 0.3s ease';
            item.style.backgroundColor = '#D1FAE5';

            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(100px)';

                setTimeout(() => {
                    item.remove();
                    updateStats();
                    showNotification('Bisnis berhasil diverifikasi!', 'success');
                }, 300);
            }, 500);
        }
    }
}

// Reject verification
let currentRejectId = null;

function rejectVerification(id) {
    currentRejectId = id;
    openRejectModal();
}

function openRejectModal() {
    const modal = document.getElementById('rejectModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeRejectModal() {
    const modal = document.getElementById('rejectModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        currentRejectId = null;

        // Reset form
        document.getElementById('rejectReason').value = '';
        document.getElementById('rejectNote').value = '';
        document.getElementById('allowResubmit').checked = false;
    }
}

function confirmReject() {
    const reason = document.getElementById('rejectReason').value;
    const note = document.getElementById('rejectNote').value;
    const allowResubmit = document.getElementById('allowResubmit').checked;

    if (!reason) {
        alert('Pilih alasan penolakan');
        return;
    }

    console.log('Rejecting:', { id: currentRejectId, reason, note, allowResubmit });

    const item = document.querySelector(`.queue-item[data-id="${currentRejectId}"]`);
    if (item) {
        item.style.transition = 'all 0.3s ease';
        item.style.backgroundColor = '#FEE2E2';

        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-100px)';

            setTimeout(() => {
                item.remove();
                updateStats();
                closeRejectModal();
                showNotification('Verifikasi ditolak', 'error');
            }, 300);
        }, 500);
    }
}

// Request revision
let currentRevisionId = null;

function requestRevision(id) {
    currentRevisionId = id;
    openRevisionModal();
}

function openRevisionModal() {
    const modal = document.getElementById('revisionModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeRevisionModal() {
    const modal = document.getElementById('revisionModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        currentRevisionId = null;

        // Reset form
        document.querySelectorAll('input[name="revisionDocs"]').forEach(cb => cb.checked = false);
        document.getElementById('revisionNote').value = '';
    }
}

function confirmRevision() {
    const checkedDocs = Array.from(document.querySelectorAll('input[name="revisionDocs"]:checked'))
        .map(cb => cb.value);
    const note = document.getElementById('revisionNote').value;

    if (checkedDocs.length === 0) {
        alert('Pilih dokumen yang perlu direvisi');
        return;
    }

    if (!note) {
        alert('Tulis instruksi revisi');
        return;
    }

    console.log('Requesting revision:', { id: currentRevisionId, docs: checkedDocs, note });

    const item = document.querySelector(`.queue-item[data-id="${currentRevisionId}"]`);
    if (item) {
        // Update status badge
        const statusBadge = item.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.className = 'status-badge resubmit';
            statusBadge.textContent = 'Waiting Revision';
        }

        closeRevisionModal();
        showNotification('Request revisi terkirim ke user', 'warning');
    }
}

// Detail modal
function openDetailModal(id) {
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('detailModalBody');

    // Mock data - in production, fetch from API
    const businessData = {
        1: {
            name: 'Batik Nusantara',
            email: 'contact@batiknusantara.com',
            phone: '+62 812 3456 7890',
            address: 'Jl. Pasar Baru No. 45, Jakarta Selatan',
            industry: 'Fashion & Tekstil',
            employees: '11-50',
            yearFounded: 2018,
            description: 'Produsen batik premium dengan desain modern dan tradisional.',
            website: 'https://batiknusantara.com',
            submittedAt: '18 Jan 2024, 14:30',
            documents: [
                { name: 'NIB', status: 'verified', file: 'NIB_BatikNusantara.pdf' },
                { name: 'NPWP', status: 'verified', file: 'NPWP_BatikNusantara.pdf' },
                { name: 'SIUP', status: 'pending', file: 'SIUP_BatikNusantara.pdf' }
            ]
        }
    };

    const data = businessData[id] || businessData[1];

    modalBody.innerHTML = `
        <div class="detail-grid">
            <div class="detail-section">
                <h3>Informasi Bisnis</h3>
                <div class="detail-row">
                    <span class="label">Nama Bisnis</span>
                    <span class="value">${data.name}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Email</span>
                    <span class="value">${data.email}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Telepon</span>
                    <span class="value">${data.phone}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Alamat</span>
                    <span class="value">${data.address}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Industri</span>
                    <span class="value">${data.industry}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Jumlah Karyawan</span>
                    <span class="value">${data.employees}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Tahun Berdiri</span>
                    <span class="value">${data.yearFounded}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Website</span>
                    <span class="value"><a href="${data.website}" target="_blank">${data.website}</a></span>
                </div>
            </div>
            <div class="detail-section">
                <h3>Dokumen</h3>
                <div class="document-preview-list">
                    ${data.documents.map(doc => `
                        <div class="document-preview-item ${doc.status}">
                            <div class="doc-info">
                                <i data-lucide="${doc.status === 'verified' ? 'file-check' : 'file-clock'}"></i>
                                <span>${doc.name}</span>
                            </div>
                            <div class="doc-actions">
                                <button class="btn btn-sm btn-outline" onclick="previewDocument('${doc.file}')">
                                    <i data-lucide="eye"></i> Preview
                                </button>
                                <button class="btn btn-sm btn-outline" onclick="downloadDocument('${doc.file}')">
                                    <i data-lucide="download"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        <div class="detail-section">
            <h3>Deskripsi Bisnis</h3>
            <p>${data.description}</p>
        </div>
        <div class="detail-meta">
            <span>Submitted: ${data.submittedAt}</span>
        </div>
    `;

    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Preview document
function previewDocument(file) {
    alert(`Preview: ${file}`);
    // In production, open document viewer
}

// Download document
function downloadDocument(file) {
    alert(`Downloading: ${file}`);
    // In production, trigger download
}

// Update stats
function updateStats() {
    const pendingCount = document.querySelectorAll('.queue-item').length;
    const pendingStat = document.querySelector('.stat-card.pending .stat-value');
    if (pendingStat) {
        pendingStat.textContent = pendingCount;
    }

    // Update filter tab count
    const allTab = document.querySelector('.filter-tab[data-filter="all"]');
    if (allTab) {
        allTab.textContent = `Semua (${pendingCount})`;
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
