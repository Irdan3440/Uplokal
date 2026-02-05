/**
 * @license
 * Uplokal - From Local Up To Global
 * Copyright (c) 2026 Uplokal Team. All rights reserved.
 */

/* ===========================================
   Financial Assistant JavaScript
   =========================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize charts
    initCashFlowChart();
    initExpenseChart();

    // Set today's date for transaction modal
    const dateInput = document.getElementById('transactionDate');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportFinancialReport);
    }
});

// Cash Flow Chart
function initCashFlowChart() {
    const ctx = document.getElementById('cashFlowChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
            datasets: [
                {
                    label: 'Pemasukan',
                    data: [12500000, 9800000, 14200000, 9250000],
                    backgroundColor: '#10B981',
                    borderRadius: 8,
                    barPercentage: 0.6
                },
                {
                    label: 'Pengeluaran',
                    data: [8200000, 6500000, 7800000, 5840000],
                    backgroundColor: '#EF4444',
                    borderRadius: 8,
                    barPercentage: 0.6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': Rp ' + context.parsed.y.toLocaleString('id-ID');
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return 'Rp ' + (value / 1000000) + ' jt';
                        }
                    }
                }
            }
        }
    });
}

// Expense Chart
function initExpenseChart() {
    const ctx = document.getElementById('expenseChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Bahan Baku', 'Operasional', 'Marketing', 'Lainnya'],
            datasets: [{
                data: [44, 29, 16, 11],
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Transaction Modal
let currentTransactionType = 'income';

function openTransactionModal(type) {
    currentTransactionType = type;
    setTransactionType(type);

    const modal = document.getElementById('transactionModal');
    const title = document.getElementById('transactionModalTitle');

    if (title) {
        title.textContent = type === 'income' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran';
    }

    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeTransactionModal() {
    const modal = document.getElementById('transactionModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        resetTransactionForm();
    }
}

function setTransactionType(type) {
    currentTransactionType = type;
    const buttons = document.querySelectorAll('.toggle-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('active');
        }
    });
}

function resetTransactionForm() {
    document.getElementById('transactionAmount').value = '';
    document.getElementById('transactionCategory').value = '';
    document.getElementById('transactionDesc').value = '';
    document.getElementById('transactionDate').valueAsDate = new Date();
}

function saveTransaction() {
    const amount = document.getElementById('transactionAmount').value;
    const category = document.getElementById('transactionCategory').value;
    const desc = document.getElementById('transactionDesc').value;
    const date = document.getElementById('transactionDate').value;

    if (!amount || !category) {
        alert('Lengkapi jumlah dan kategori');
        return;
    }

    console.log('Saving transaction:', {
        type: currentTransactionType,
        amount,
        category,
        desc,
        date
    });

    closeTransactionModal();
    showNotification('Transaksi berhasil ditambahkan', 'success');
}

// Generate Report
function generateReport() {
    showNotification('Memproses laporan...', 'info');

    setTimeout(() => {
        showNotification('Laporan keuangan berhasil di-generate', 'success');
        // In production, download PDF
    }, 1500);
}

// Calculate Tax
function calculateTax() {
    alert('Kalkulator pajak akan segera tersedia!');
}

// Pay Tax
function payTax() {
    window.open('https://djponline.pajak.go.id', '_blank');
}

// Export Financial Report
function exportFinancialReport() {
    showNotification('Mengexport laporan...', 'info');

    setTimeout(() => {
        showNotification('Laporan berhasil di-export ke Excel', 'success');
    }, 1000);
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

// Modal backdrop click to close
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
});
