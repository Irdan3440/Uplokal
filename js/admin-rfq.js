/**
 * Admin RFQ Management
 * Provides search, filter, and supplier matching functionality
 */

document.addEventListener('DOMContentLoaded', function () {
    // Sample RFQ data
    const rfqData = [
        {
            id: 1892,
            client: 'Tokyo Imports Co.',
            country: 'Japan',
            received: '2 hours ago',
            title: 'Leather Bags - Premium Quality',
            description: 'Looking for 500 pcs of premium leather bags. MOQ flexible. Target delivery: March 2024.',
            category: 'Fashion & Tekstil',
            budget: '$25K-50K',
            status: 'Urgent',
            priority: 'High'
        },
        {
            id: 1891,
            client: 'SG Trade Pte Ltd',
            country: 'Singapore',
            received: '5 hours ago',
            title: 'Batik Fabric - Traditional Patterns',
            description: 'Need 1000 meters of traditional Javanese batik fabric for fashion collection. Prefer Solo or Yogya suppliers.',
            category: 'Fashion & Tekstil',
            budget: '$10K-25K',
            status: 'New',
            priority: 'Medium'
        },
        {
            id: 1890,
            client: 'AusCraft Imports',
            country: 'Australia',
            received: '1 day ago',
            title: 'Wooden Furniture - Teak Material',
            description: 'Looking for teak wood furniture manufacturer. Need dining tables and chairs set, 50 sets minimum.',
            category: 'Kerajinan',
            budget: '$50K+',
            status: 'In Review',
            priority: 'Normal'
        },
        {
            id: 1889,
            client: 'KL Global Trading',
            country: 'Malaysia',
            received: '2 days ago',
            title: 'Organic Coffee Beans',
            description: 'Sourcing 2 tons of Arabica coffee beans, organic certified. Monthly recurring order.',
            category: 'Food & Beverage',
            budget: '$15K-30K',
            status: 'New',
            priority: 'Normal'
        },
        {
            id: 1888,
            client: 'EuroRussia Trade',
            country: 'Russia',
            received: '3 days ago',
            title: 'Traditional Spices Bulk',
            description: 'Bulk purchase of nutmeg, cloves, and white pepper. Shipping to St. Petersburg.',
            category: 'Food & Beverage',
            budget: '$40K+',
            status: 'In Review',
            priority: 'Medium'
        }
    ];

    let filteredRFQs = [...rfqData];

    // DOM Elements
    const categoryFilter = document.getElementById('categoryFilter');
    const rfqContainer = document.getElementById('rfqListContainer');
    const pendingCount = document.getElementById('pendingRFQCount');

    // Create modals
    createModals();

    // Event Listeners
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }

    // Apply filters
    function applyFilters() {
        const categoryValue = categoryFilter ? categoryFilter.value : '';

        filteredRFQs = rfqData.filter(rfq => {
            return !categoryValue || categoryValue === 'All Categories' || rfq.category === categoryValue;
        });

        renderRFQs();
    }

    // Render RFQs
    function renderRFQs() {
        if (!rfqContainer) return;

        if (filteredRFQs.length === 0) {
            rfqContainer.innerHTML = `
                <div style="text-align: center; padding: 48px; background: white; border-radius: var(--radius-xl); border: 1px dashed var(--color-gray-300);">
                    <i data-lucide="inbox" style="width: 48px; height: 48px; color: var(--color-gray-400); margin-bottom: 16px;"></i>
                    <p style="color: var(--color-gray-500);">No RFQs found in this category.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        rfqContainer.innerHTML = filteredRFQs.map(rfq => `
            <div class="rfq-card" 
                 style="background: var(--color-gray-50); border-radius: var(--radius-xl); padding: var(--space-5); border-left: 4px solid ${getPriorityColor(rfq.status)};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-3);">
                    <div>
                        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-1);">
                            <span style="font-weight: 700; color: var(--color-gray-900);">RFQ #1892</span>
                            <span class="badge" style="background: ${getPriorityColor(rfq.status)}; color: white;">${rfq.status}</span>
                        </div>
                        <div style="font-size: var(--text-sm); color: var(--color-gray-600);">${rfq.client} • ${rfq.country}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: var(--text-xs); color: var(--color-gray-500);">Received</div>
                        <div style="font-size: var(--text-sm); font-weight: 600;">${rfq.received}</div>
                    </div>
                </div>
                <div style="margin-bottom: var(--space-3);">
                    <div style="font-weight: 600; margin-bottom: var(--space-1);">${rfq.title}</div>
                    <div style="font-size: var(--text-sm); color: var(--color-gray-600);">${rfq.description}</div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; gap: var(--space-2);">
                        <span class="badge badge-primary">${rfq.category}</span>
                        <span class="badge" style="background: var(--color-gray-200);">${rfq.budget}</span>
                    </div>
                    <div style="display: flex; gap: var(--space-2);">
                        <button class="btn btn-secondary btn-sm" onclick="openRFQDetail(${rfq.id})">View Details</button>
                        <button class="btn btn-primary btn-sm" onclick="openSupplierMatcher(${rfq.id})">Match Suppliers</button>
                    </div>
                </div>
            </div>
        `).join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();

        if (pendingCount) {
            pendingCount.textContent = rfqData.length;
        }
    }

    function getPriorityColor(status) {
        switch (status) {
            case 'Urgent': return 'var(--color-error)';
            case 'New': return 'var(--color-warning)';
            case 'In Review': return 'var(--color-primary-500)';
            default: return 'var(--color-gray-400)';
        }
    }

    function createModals() {

        const modalsHTML = `
            <div class="modal-overlay" id="rfqDetailModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>RFQ Details</h3>
                        <button class="modal-close" onclick="closeModal('rfqDetailModal')"><i data-lucide="x"></i></button>
                    </div>
                    <div class="modal-body" id="rfqDetailBody"></div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="closeModal('rfqDetailModal')">Close</button>
                    </div>
                </div>
            </div>

            <div class="modal-overlay" id="supplierMatcherModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Supplier Matcher</h3>
                        <button class="modal-close" onclick="closeModal('supplierMatcherModal')"><i data-lucide="x"></i></button>
                    </div>
                    <div class="modal-body">
                        <p style="margin-bottom: 20px; color: var(--color-gray-600);">AI has found the best suppliers for this request:</p>
                        <div id="supplierListBody"></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="closeModal('supplierMatcherModal')">Cancel</button>
                        <button class="btn btn-primary" onclick="alert('Proposal sent to selected suppliers!')">Send Proposals</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalsHTML);
    }

    window.openRFQDetail = function (id) {
        const rfq = rfqData.find(r => r.id === id);
        if (!rfq) return;

        const body = document.getElementById('rfqDetailBody');
        body.innerHTML = `
            <div style="margin-bottom: 24px;">
                <h4 style="margin: 0 0 8px 0; font-size: 1.25rem;">${rfq.title}</h4>
                <div style="display: flex; gap: 8px;">
                    <span class="badge" style="background: ${getPriorityColor(rfq.status)}; color: white;">${rfq.status}</span>
                    <span style="color: var(--color-gray-500);">${rfq.client} • ${rfq.country}</span>
                </div>
            </div>
            <div style="background: var(--color-gray-50); padding: 20px; border-radius: var(--radius-lg); margin-bottom: 24px;">
                <p style="margin: 0; color: var(--color-gray-700); line-height: 1.6;">${rfq.description}</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <label style="display: block; font-size: 12px; color: var(--color-gray-500); text-transform: uppercase;">Category</label>
                    <span style="font-weight: 600;">${rfq.category}</span>
                </div>
                <div>
                    <label style="display: block; font-size: 12px; color: var(--color-gray-500); text-transform: uppercase;">Budget Estimate</label>
                    <span style="font-weight: 600;">${rfq.budget}</span>
                </div>
            </div>
        `;
        document.getElementById('rfqDetailModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    window.openSupplierMatcher = function (id) {
        const rfq = rfqData.find(r => r.id === id);
        if (!rfq) return;

        const suppliers = [
            { name: 'PT Batik Jaya', match: '98%', experience: '15 years' },
            { name: 'CV Solo Indah', match: '92%', experience: '8 years' },
            { name: 'Textile Nusantara', match: '85%', experience: '10 years' }
        ];

        const body = document.getElementById('supplierListBody');
        body.innerHTML = suppliers.map(s => `
            <div class="supplier-match-item">
                <div>
                    <div style="font-weight: 700;">${s.name}</div>
                    <div style="font-size: 12px; color: var(--color-gray-500);">Exp: ${s.experience}</div>
                </div>
                <div style="text-align: right;">
                    <div style="color: var(--color-success); font-weight: 700;">${s.match} Match</div>
                    <input type="checkbox" checked>
                </div>
            </div>
        `).join('');

        document.getElementById('supplierMatcherModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function (id) {
        document.getElementById(id).classList.remove('show');
        document.body.style.overflow = '';
    };

    // Initial render
    renderRFQs();
});
