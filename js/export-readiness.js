/* ===========================================
   Export Readiness JavaScript
   =========================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize checkboxes
    initCheckboxes();

    // Calculate initial progress
    updateOverallProgress();
});

// Toggle category collapse
function toggleCategory(categoryId) {
    const section = document.querySelector(`[data-category="${categoryId}"]`);
    const items = section.querySelector('.category-items');

    if (items.classList.contains('collapsed')) {
        items.classList.remove('collapsed');
        section.classList.remove('collapsed');
    } else {
        items.classList.add('collapsed');
        section.classList.add('collapsed');
    }
}

// Initialize checkbox listeners
function initCheckboxes() {
    const checkboxes = document.querySelectorAll('.checkbox-wrapper input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const item = this.closest('.checklist-item');

            if (this.checked) {
                item.classList.add('completed');
                // Add status icon
                let statusEl = item.querySelector('.item-status');
                if (!statusEl) {
                    statusEl = document.createElement('span');
                    statusEl.className = 'item-status done';
                    statusEl.innerHTML = '<i data-lucide="check"></i>';
                    item.appendChild(statusEl);
                    lucide.createIcons();
                }
                // Remove action link
                const actionLink = item.querySelector('.item-action');
                if (actionLink) actionLink.remove();
            } else {
                item.classList.remove('completed');
                const statusEl = item.querySelector('.item-status');
                if (statusEl) statusEl.remove();
            }

            updateCategoryProgress(item.closest('.category-section'));
            updateOverallProgress();
        });
    });
}

// Update category progress
function updateCategoryProgress(section) {
    const items = section.querySelectorAll('.checklist-item');
    const completed = section.querySelectorAll('.checklist-item.completed').length;
    const total = items.length;
    const percentage = (completed / total) * 100;

    const progressText = section.querySelector('.progress-text');
    const miniFill = section.querySelector('.mini-fill');

    if (progressText) {
        progressText.textContent = `${completed}/${total} selesai`;
    }

    if (miniFill) {
        miniFill.style.width = percentage + '%';
    }
}

// Update overall progress
function updateOverallProgress() {
    const allItems = document.querySelectorAll('.checklist-item');
    const completedItems = document.querySelectorAll('.checklist-item.completed');
    const pendingItems = allItems.length - completedItems.length;

    const percentage = Math.round((completedItems.length / allItems.length) * 100);

    // Update percentage display
    const percentageEl = document.querySelector('.progress-percentage');
    if (percentageEl) {
        percentageEl.textContent = percentage + '%';
    }

    // Update progress bar
    const progressFill = document.querySelector('.overall-progress-bar .progress-fill');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }

    // Update stats
    const completedStat = document.querySelector('.stat-item.completed span');
    const pendingStat = document.querySelector('.stat-item.pending span');

    if (completedStat) {
        completedStat.textContent = completedItems.length + ' Selesai';
    }

    if (pendingStat) {
        pendingStat.textContent = pendingItems + ' Pending';
    }
}

// Download guide
function downloadGuide() {
    showNotification('Mengunduh panduan ekspor...', 'info');

    setTimeout(() => {
        showNotification('Panduan Ekspor UMKM.pdf berhasil diunduh', 'success');
    }, 1500);
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
        <span>${message}</span>
    `;

    // Add notification styles if not exists
    if (!document.querySelector('.notification-styles')) {
        const style = document.createElement('style');
        style.className = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 1rem;
                right: 1rem;
                padding: 1rem 1.5rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 1100;
                transform: translateX(calc(100% + 1rem));
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification i {
                width: 24px;
                height: 24px;
            }
            .notification-success { border-left: 4px solid #10B981; }
            .notification-success i { color: #10B981; }
            .notification-error { border-left: 4px solid #EF4444; }
            .notification-error i { color: #EF4444; }
            .notification-info { border-left: 4px solid #3B82F6; }
            .notification-info i { color: #3B82F6; }
        `;
        document.head.appendChild(style);
    }

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
