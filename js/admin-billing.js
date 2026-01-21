/* ===========================================
   Admin Billing JavaScript
   =========================================== */

const invoicesData = [
    {
        id: 'INV-2024-001',
        client: 'Kopi Gayo Premium',
        amount: 15000000,
        status: 'Paid',
        date: '20 Jan 2024'
    },
    {
        id: 'INV-2024-002',
        client: 'Batik Sekar Arum',
        amount: 12500000,
        status: 'Paid',
        date: '19 Jan 2024'
    },
    {
        id: 'INV-2024-003',
        client: 'PT Kulit Nusantara',
        amount: 8750000,
        status: 'Pending',
        date: '18 Jan 2024'
    },
    {
        id: 'INV-2024-004',
        client: 'CV Tenun Lombok',
        amount: 5000000,
        status: 'Overdue',
        date: '15 Jan 2024'
    },
    {
        id: 'INV-2024-005',
        client: 'Keramik Kasongan',
        amount: 3200000,
        status: 'Paid',
        date: '14 Jan 2024'
    },
    {
        id: 'INV-2024-006',
        client: 'Anyaman Pandan',
        amount: 2100000,
        status: 'Pending',
        date: '12 Jan 2024'
    },
    {
        id: 'INV-2024-007',
        client: 'Sutra Mandar',
        amount: 4500000,
        status: 'Paid',
        date: '10 Jan 2024'
    },
    {
        id: 'INV-2024-008',
        client: 'Ukiran Jepara',
        amount: 35000000,
        status: 'Paid',
        date: '08 Jan 2024'
    },
    {
        id: 'INV-2024-009',
        client: 'Mebel Solo',
        amount: 12000000,
        status: 'Pending',
        date: '05 Jan 2024'
    },
    {
        id: 'INV-2024-010',
        client: 'Kain Ulos',
        amount: 3200000,
        status: 'Paid',
        date: '02 Jan 2024'
    }
];

const subscriptionsData = [
    { name: 'Free Plan', price: 'Basic features', count: 159, color: 'gray' },
    { name: 'Pro Plan', price: 'Rp 500K/month', count: 72, color: 'primary' },
    { name: 'Enterprise', price: 'Custom pricing', count: 17, color: 'accent' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    renderInvoices();
    renderSubscriptions();
    updateStats();
    setupEventListeners();
});

function setupEventListeners() {
    const exportBtn = document.getElementById('exportReportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            alert('Exporting billing report as PDF...');
        });
    }

    const viewAllBtn = document.getElementById('viewAllInvoices');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Loading all invoices...');
        });
    }
}

function renderInvoices() {
    const tableBody = document.getElementById('billingTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = invoicesData.map(inv => `
        <tr style="border-bottom: 1px solid var(--color-gray-100);">
            <td style="padding: var(--space-4); font-size: var(--text-sm); font-weight: 600;">#${inv.id}</td>
            <td style="padding: var(--space-4); font-size: var(--text-sm);">${inv.client}</td>
            <td style="padding: var(--space-4); text-align: right; font-weight: 600;">${formatCurrency(inv.amount)}</td>
            <td style="padding: var(--space-4); text-align: center;">
                <span class="badge ${getStatusBadgeClass(inv.status)}">${inv.status}</span>
            </td>
            <td style="padding: var(--space-4); text-align: right; font-size: var(--text-sm); color: var(--color-gray-500);">${inv.date}</td>
            <td style="padding: var(--space-4); text-align: right;">
                <button class="btn btn-ghost btn-sm" onclick="openInvoiceModal('${inv.id}')" style="color: var(--color-primary-500);">
                    <i data-lucide="eye" style="width: 14px; height: 14px; margin-right: 4px;"></i>
                    View
                </button>
            </td>
        </tr>
    `).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function openInvoiceModal(id) {
    const inv = invoicesData.find(i => i.id === id);
    if (!inv) return;

    const modal = document.getElementById('invoiceModal');
    const body = document.getElementById('invoiceModalBody');
    if (!modal || !body) return;

    body.innerHTML = `
        <div style="border-bottom: 2px solid var(--color-gray-100); padding-bottom: 24px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: start;">
            <div>
                <img src="assets/logo.png" alt="Uplokal" style="height: 32px; margin-bottom: 12px;">
                <div style="font-size: 14px; color: var(--color-gray-500);">
                    Solusi UMKM Indonesia Maju<br>
                    Jl. Gatot Subroto No. 123, Jakarta
                </div>
            </div>
            <div style="text-align: right;">
                <h2 style="margin: 0; color: var(--color-primary-600);">INVOICE</h2>
                <div style="font-weight: 700; font-size: 18px;">#${inv.id}</div>
                <div style="color: var(--color-gray-500);">${inv.date}</div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 32px;">
            <div>
                <div style="font-size: 12px; color: var(--color-gray-500); text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Bill To:</div>
                <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">${inv.client}</div>
                <div style="font-size: 14px; color: var(--color-gray-600);">
                    Jakarta, Indonesia<br>
                    contact@${inv.client.toLowerCase().replace(/\s+/g, '')}.com
                </div>
            </div>
            <div>
                <div style="font-size: 12px; color: var(--color-gray-500); text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Payment Details:</div>
                <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
                    <span>Status:</span>
                    <span class="badge ${getStatusBadgeClass(inv.status)}">${inv.status}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px;">
                    <span>Due Date:</span>
                    <span style="font-weight: 600;">30 Days from Issue</span>
                </div>
            </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
            <thead>
                <tr style="background: var(--color-gray-50); border-bottom: 2px solid var(--color-gray-200);">
                    <th style="padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: var(--color-gray-600);">Description</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: var(--color-gray-600);">Qty</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: var(--color-gray-600);">Price</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: var(--color-gray-600);">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid var(--color-gray-100);">
                    <td style="padding: 12px; font-size: 14px;">Premium Subscription - Monthly Plan (Jan 2024)</td>
                    <td style="padding: 12px; text-align: right; font-size: 14px;">1</td>
                    <td style="padding: 12px; text-align: right; font-size: 14px;">${formatCurrency(inv.amount)}</td>
                    <td style="padding: 12px; text-align: right; font-size: 14px; font-weight: 600;">${formatCurrency(inv.amount)}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" style="padding: 12px; text-align: right; font-weight: 600; font-size: 14px;">Subtotal</td>
                    <td style="padding: 12px; text-align: right; font-weight: 600; font-size: 14px;">${formatCurrency(inv.amount)}</td>
                </tr>
                <tr>
                    <td colspan="3" style="padding: 12px; text-align: right; font-weight: 600; font-size: 14px;">Tax (0%)</td>
                    <td style="padding: 12px; text-align: right; font-weight: 600; font-size: 14px;">Rp 0</td>
                </tr>
                <tr style="border-top: 2px solid var(--color-primary-100);">
                    <td colspan="3" style="padding: 12px; text-align: right; font-weight: 700; font-size: 18px; color: var(--color-primary-600);">Total Amount</td>
                    <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 18px; color: var(--color-primary-600);">${formatCurrency(inv.amount)}</td>
                </tr>
            </tfoot>
        </table>

        <div style="background: var(--color-gray-50); padding: 16px; border-radius: 8px; font-size: 13px; color: var(--color-gray-600);">
            <div style="font-weight: 700; margin-bottom: 4px;">Notes:</div>
            Terima kasih telah menggunakan Uplokal. Pembayaran ini dikonfirmasi secara otomatis oleh sistem kami. Jika ada pertanyaan, hubungi support@uplokal.com.
        </div>
    `;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function renderSubscriptions() {
    const container = document.getElementById('subscriptionContainer');
    if (!container) return;

    container.innerHTML = subscriptionsData.map(sub => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-4); 
             background: ${sub.color === 'gray' ? 'var(--color-gray-50)' : `linear-gradient(135deg, var(--color-${sub.color}-50) 0%, var(--color-${sub.color}-100) 100%)`}; 
             border-radius: var(--radius-lg); 
             border: 1px solid ${sub.color === 'gray' ? 'var(--color-gray-200)' : `var(--color-${sub.color}-200)`};">
            <div>
                <div style="font-weight: 600; ${sub.color !== 'gray' ? `color: var(--color-${sub.color}-700);` : ''}">${sub.name}</div>
                <div style="font-size: var(--text-sm); ${sub.color !== 'gray' ? `color: var(--color-${sub.color}-600);` : 'color: var(--color-gray-500);'}">${sub.price}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: 700; font-size: var(--text-xl); ${sub.color !== 'gray' ? `color: var(--color-${sub.color}-700);` : ''}">${sub.count}</div>
                <div style="font-size: var(--text-xs); ${sub.color !== 'gray' ? `color: var(--color-${sub.color}-600);` : 'color: var(--color-gray-500);'}">clients</div>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const revenueValue = document.getElementById('revenueValue');
    const paidCount = document.getElementById('paidInvoicesCount');
    const pendingCount = document.getElementById('pendingInvoicesCount');
    const premiumCount = document.getElementById('premiumSubscribersCount');

    // Revenue from paid invoices
    const totalRevenue = invoicesData
        .filter(inv => inv.status === 'Paid')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const paidInvoices = invoicesData.filter(inv => inv.status === 'Paid').length;
    const pendingInvoices = invoicesData.filter(inv => inv.status === 'Pending').length;
    const premiumSubscribers = subscriptionsData
        .filter(sub => sub.name !== 'Free Plan')
        .reduce((sum, sub) => sum + sub.count, 0);

    if (revenueValue) revenueValue.textContent = formatToShortCurrency(totalRevenue);
    if (paidCount) paidCount.textContent = paidInvoices;
    if (pendingCount) pendingCount.textContent = pendingInvoices;
    if (premiumCount) premiumCount.textContent = premiumSubscribers;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatToShortCurrency(amount) {
    if (amount >= 1000000000) return 'Rp ' + (amount / 1000000000).toFixed(1) + 'M';
    if (amount >= 1000000) return 'Rp ' + (amount / 1000000).toFixed(0) + 'jt';
    return formatCurrency(amount);
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'Paid': return 'badge-success';
        case 'Pending': return 'badge-warning';
        case 'Overdue': return 'badge-danger';
        default: return '';
    }
}
