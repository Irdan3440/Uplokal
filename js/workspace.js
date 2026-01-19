/* ===========================================
   Workspace JavaScript
   =========================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize view tabs
    initViewTabs();

    // Initialize project tabs
    initProjectTabs();

    // Initialize drag and drop
    initDragDrop();
});

// View Tab Switching
function initViewTabs() {
    const tabs = document.querySelectorAll('.view-tab');
    const contents = document.querySelectorAll('.view-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const view = this.getAttribute('data-view');

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Update content
            contents.forEach(c => c.classList.remove('active'));
            const targetContent = document.getElementById(view + '-view');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Project Tab Switching
function initProjectTabs() {
    const tabs = document.querySelectorAll('.project-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // In production, would load different project data
            showNotification('Beralih ke project: ' + this.textContent.trim(), 'info');
        });
    });
}

// Drag and Drop for Kanban
function initDragDrop() {
    const cards = document.querySelectorAll('.task-card');
    const columns = document.querySelectorAll('.task-list');

    cards.forEach(card => {
        card.addEventListener('dragstart', function (e) {
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', function () {
            this.classList.remove('dragging');
            updateTaskCounts();
        });
    });

    columns.forEach(column => {
        column.addEventListener('dragover', function (e) {
            e.preventDefault();
            const dragging = document.querySelector('.dragging');
            const afterElement = getDragAfterElement(column, e.clientY);

            if (afterElement == null) {
                column.appendChild(dragging);
            } else {
                column.insertBefore(dragging, afterElement);
            }
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateTaskCounts() {
    document.querySelectorAll('.kanban-column').forEach(column => {
        const count = column.querySelectorAll('.task-card').length;
        const countEl = column.querySelector('.task-count');
        if (countEl) {
            countEl.textContent = count;
        }
    });
}

// Task Modal
let currentStatus = 'todo';

function addTask(status) {
    currentStatus = status;
    openTaskModal();
}

function openTaskModal() {
    const modal = document.getElementById('taskModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeTaskModal() {
    const modal = document.getElementById('taskModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        resetTaskForm();
    }
}

function openNewProjectModal() {
    showNotification('Fitur membuat project baru segera hadir!', 'info');
}

function resetTaskForm() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDesc').value = '';
    document.getElementById('taskDue').value = '';
    document.getElementById('taskLabel').value = 'design';
    document.querySelectorAll('.assignee-option input').forEach(c => c.checked = false);
}

function saveTask() {
    const title = document.getElementById('taskTitle').value;
    const desc = document.getElementById('taskDesc').value;
    const due = document.getElementById('taskDue').value;
    const label = document.getElementById('taskLabel').value;

    if (!title) {
        alert('Masukkan judul task');
        return;
    }

    // Create new task card
    const column = document.querySelector(`[data-status="${currentStatus}"] .task-list`);
    if (column) {
        const card = createTaskCard({
            title,
            desc,
            due,
            label
        });
        column.appendChild(card);
        updateTaskCounts();

        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    closeTaskModal();
    showNotification('Task berhasil ditambahkan', 'success');
}

function createTaskCard({ title, desc, due, label }) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;

    const labelClass = label || 'design';
    const labelText = getLabelText(labelClass);

    const dueText = due ? formatDate(due) : '';

    card.innerHTML = `
        <div class="task-labels">
            <span class="label ${labelClass}">${labelText}</span>
        </div>
        <h4>${escapeHtml(title)}</h4>
        ${desc ? `<p>${escapeHtml(desc)}</p>` : ''}
        <div class="task-meta">
            <div class="task-assignees">
                <img src="https://ui-avatars.com/api/?name=Rina&background=3B82F6&color=fff&size=28" alt="Rina">
            </div>
            ${dueText ? `
            <div class="task-due">
                <i data-lucide="calendar"></i>
                <span>${dueText}</span>
            </div>` : ''}
        </div>
    `;

    // Add drag events
    card.addEventListener('dragstart', function () {
        this.classList.add('dragging');
    });

    card.addEventListener('dragend', function () {
        this.classList.remove('dragging');
        updateTaskCounts();
    });

    return card;
}

function getLabelText(label) {
    const labels = {
        design: 'Design',
        marketing: 'Marketing',
        production: 'Produksi',
        legal: 'Legal'
    };
    return labels[label] || 'Design';
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('id-ID', options);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
            .task-card.dragging { opacity: 0.5; }
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

// Modal click outside to close
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
});
