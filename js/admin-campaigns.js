/**
 * Admin Campaigns Management
 * Handles campaign data, filtering, and interactive modals
 */

document.addEventListener('DOMContentLoaded', function () {
    // Sample Campaign Data
    const campaignsData = [
        {
            id: 1,
            title: 'Batik Sekar Arum - Instagram',
            client: 'Batik Sekar Arum',
            category: 'Fashion Campaign',
            platform: 'Instagram',
            status: 'Active',
            impressions: '245K',
            clicks: '8.9K',
            ctr: '3.6%',
            budget: 'Rp 15jt',
            timeLeft: '12 days left',
            isPaused: false
        },
        {
            id: 2,
            title: 'Kopi Gayo Premium - Google Ads',
            client: 'Kopi Gayo Premium',
            category: 'Food & Beverage',
            platform: 'Google',
            status: 'Active',
            impressions: '189K',
            clicks: '7.2K',
            ctr: '3.8%',
            budget: 'Rp 20jt',
            timeLeft: '18 days left',
            isPaused: false
        },
        {
            id: 3,
            title: 'Kulit Nusantara - Facebook',
            client: 'PT Kulit Nusantara',
            category: 'Fashion',
            platform: 'Facebook',
            status: 'Paused',
            impressions: '98K',
            clicks: '2.8K',
            ctr: '2.9%',
            budget: 'Rp 10jt',
            timeLeft: 'Paused',
            isPaused: true
        },
        {
            id: 4,
            title: 'Tenun Lombok - Instagram',
            client: 'Tenun Lombok Indah',
            category: 'Textile',
            platform: 'Instagram',
            status: 'Active',
            impressions: '112K',
            clicks: '4.1K',
            ctr: '3.7%',
            budget: 'Rp 8jt',
            timeLeft: '5 days left',
            isPaused: false
        },
        {
            id: 5,
            title: 'Keramik Kasongan - Google Shopping',
            client: 'Keramik Kasongan',
            category: 'Crafts',
            platform: 'Google',
            status: 'Paused',
            impressions: '56K',
            clicks: '1.2K',
            ctr: '2.1%',
            budget: 'Rp 5jt',
            timeLeft: 'Paused',
            isPaused: true
        }
    ];

    let currentFilter = 'All';

    // DOM Elements
    const campaignContainer = document.getElementById('campaignContainer');
    const filterButtons = document.querySelectorAll('.card-header .btn-ghost');
    const newCampaignBtn = document.querySelector('.topbar-right .btn-primary');

    // Stats Elements
    const activeCampaignsStat = document.querySelector('.stat-card:nth-child(1) .stat-card-value');
    const totalImpressionsStat = document.querySelector('.stat-card:nth-child(2) .stat-card-value');
    const totalClicksStat = document.querySelector('.stat-card:nth-child(3) .stat-card-value');
    const avgCtrStat = document.querySelector('.stat-card:nth-child(4) .stat-card-value');

    // Create Modals
    createModals();

    // Event Listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.textContent;
            renderCampaigns();
        });
    });

    if (newCampaignBtn) {
        newCampaignBtn.addEventListener('click', () => openNewCampaignModal());
    }

    // Functions
    function renderCampaigns() {
        if (!campaignContainer) return;

        const filtered = campaignsData.filter(c =>
            currentFilter === 'All' || c.platform === currentFilter
        );

        if (filtered.length === 0) {
            campaignContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: white; border-radius: var(--radius-xl); border: 1px dashed var(--color-gray-300);">
                    <i data-lucide="megaphone-off" style="width: 48px; height: 48px; color: var(--color-gray-400); margin-bottom: 16px;"></i>
                    <p style="color: var(--color-gray-500);">No ${currentFilter} campaigns found.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        campaignContainer.innerHTML = filtered.map(c => `
            <div class="campaign-card" 
                 style="background: var(--color-gray-50); border-radius: var(--radius-xl); padding: var(--space-5); border: 1px solid var(--color-gray-200); position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-3);">
                    <div>
                        <div style="font-weight: 700; margin-bottom: 4px;">${c.title}</div>
                        <div style="font-size: var(--text-sm); color: var(--color-gray-500);">${c.category}</div>
                    </div>
                    <span class="badge ${c.isPaused ? 'badge-warning' : 'badge-success'}">${c.status}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); margin-bottom: var(--space-4);">
                    <div style="text-align: center;">
                        <div style="font-size: var(--text-xs); color: var(--color-gray-500);">Impressions</div>
                        <div style="font-weight: 700;">${c.impressions}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: var(--text-xs); color: var(--color-gray-500);">Clicks</div>
                        <div style="font-weight: 700;">${c.clicks}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: var(--text-xs); color: var(--color-gray-500);">CTR</div>
                        <div style="font-weight: 700; color: ${parseFloat(c.ctr) > 3 ? 'var(--color-success)' : 'var(--color-warning)'};">${c.ctr}</div>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: var(--text-xs); color: var(--color-gray-500);">Budget: ${c.budget} • ${c.timeLeft}</div>
                    <button class="btn btn-ghost btn-sm" onclick="openCampaignDetail(${c.id})">Details</button>
                </div>
            </div>
        `).join('');

        updateStats();
    }

    function updateStats() {
        const activeCount = campaignsData.filter(c => !c.isPaused).length;
        if (activeCampaignsStat) activeCampaignsStat.textContent = activeCount;

        // In a real app, these averages would be calculated from raw data
        if (totalImpressionsStat) totalImpressionsStat.textContent = '1.2M';
        if (totalClicksStat) totalClicksStat.textContent = '45K';
        if (avgCtrStat) avgCtrStat.textContent = '3.8%';
    }

    function createModals() {
        const modalStyles = `
            <style>
                .modal-overlay {
                    display: none;
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    align-items: center; justify-content: center;
                    padding: 20px;
                }
                .modal-overlay.active { display: flex; }
                .modal-content {
                    background: white;
                    border-radius: var(--radius-xl);
                    max-width: 600px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                .modal-header {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: var(--space-5) var(--space-6);
                    border-bottom: 1px solid var(--color-gray-200);
                }
                .modal-body { padding: var(--space-6); }
                .modal-footer {
                    display: flex; gap: var(--space-3); justify-content: flex-end;
                    padding: var(--space-4) var(--space-6);
                    border-top: 1px solid var(--color-gray-200);
                }
                .performance-grid {
                    display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
                    margin-top: 20px;
                }
                .perf-item {
                    padding: 16px; background: var(--color-gray-50);
                    border-radius: var(--radius-lg);
                }
                .perf-item label { display: block; font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px; }
                .perf-item span { font-size: 18px; font-weight: 700; color: var(--color-gray-900); }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', modalStyles);

        const modalsHTML = `
            <div class="modal-overlay" id="campaignDetailModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Campaign Performance</h3>
                        <button onclick="closeModal('campaignDetailModal')" style="background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
                    </div>
                    <div class="modal-body" id="campaignDetailBody"></div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="closeModal('campaignDetailModal')">Close</button>
                        <button class="btn btn-primary" onclick="alert('Optimization logic would go here')">Optimize Ads</button>
                    </div>
                </div>
            </div>

            <div class="modal-overlay" id="newCampaignModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Create New Campaign</h3>
                        <button onclick="closeModal('newCampaignModal')" style="background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="newCampaignForm">
                            <div class="form-group">
                                <label class="form-label">Campaign Name</label>
                                <input type="text" class="form-input" placeholder="e.g. Ramadan Sale 2026" required>
                            </div>
                            <div class="form-row" style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                                <div class="form-group">
                                    <label class="form-label">Platform</label>
                                    <select class="form-input">
                                        <option>Instagram</option>
                                        <option>Facebook</option>
                                        <option>Google</option>
                                        <option>TikTok</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Daily Budget (Rp)</label>
                                    <input type="number" class="form-input" placeholder="500000">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Objective</label>
                                <select class="form-input">
                                    <option>Brand Awareness</option>
                                    <option>Website Traffic</option>
                                    <option>Sales / Conversion</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="closeModal('newCampaignModal')">Cancel</button>
                        <button class="btn btn-primary" onclick="saveNewCampaign()">Launch Campaign</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalsHTML);
    }

    window.openCampaignDetail = function (id) {
        const campaign = campaignsData.find(c => c.id === id);
        if (!campaign) return;

        const body = document.getElementById('campaignDetailBody');
        body.innerHTML = `
            <div style="margin-bottom: 24px;">
                <h4 style="margin:0 0 4px 0;">${campaign.title}</h4>
                <div style="display:flex; gap:8px; align-items:center;">
                    <span class="badge ${campaign.isPaused ? 'badge-warning' : 'badge-success'}">${campaign.status}</span>
                    <span style="color:var(--color-gray-500); font-size:14px;">${campaign.platform} • ${campaign.client}</span>
                </div>
            </div>
            
            <div class="performance-grid">
                <div class="perf-item">
                    <label>Impressions</label>
                    <span>${campaign.impressions}</span>
                </div>
                <div class="perf-item">
                    <label>Clicks</label>
                    <span>${campaign.clicks}</span>
                </div>
                <div class="perf-item">
                    <label>CTR</label>
                    <span style="color:var(--color-success);">${campaign.ctr}</span>
                </div>
                <div class="perf-item">
                    <label>Spend</label>
                    <span>Rp 4.250.000</span>
                </div>
            </div>
            
            <div style="margin-top: 24px;">
                <label style="display:block; font-size:12px; color:var(--color-gray-500); margin-bottom:8px;">AUDIENCE REACH</label>
                <div style="height:8px; background:var(--color-gray-100); border-radius:4px; overflow:hidden;">
                    <div style="width:65%; height:100%; background:var(--color-primary-500);"></div>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:4px; font-size:12px; color:var(--color-gray-500);">
                    <span>650K reached</span>
                    <span>Goal: 1M</span>
                </div>
            </div>
        `;
        document.getElementById('campaignDetailModal').classList.add('active');
    };

    window.openNewCampaignModal = function () {
        document.getElementById('newCampaignModal').classList.add('active');
    };

    window.saveNewCampaign = function () {
        alert('Campaign launch request sent to marketing team!');
        closeModal('newCampaignModal');
    };

    window.closeModal = function (id) {
        document.getElementById(id).classList.remove('active');
    };

    // Close on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) closeModal(this.id);
        });
    });

    // Initial Render
    renderCampaigns();
});
