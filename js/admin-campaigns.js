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
            spend: 'Rp 4.250.000',
            reach: '650K',
            reachGoal: '1M',
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
            spend: 'Rp 12.800.000',
            reach: '450K',
            reachGoal: '800K',
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
            spend: 'Rp 2.500.000',
            reach: '120K',
            reachGoal: '500K',
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
            spend: 'Rp 3.100.000',
            reach: '280K',
            reachGoal: '400K',
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
            spend: 'Rp 1.200.000',
            reach: '85K',
            reachGoal: '200K',
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
                    <button class="btn btn-outline btn-sm" style="color: var(--color-primary-600); border-color: var(--color-primary-200); font-weight: 700;" onclick="openCampaignDetail(${c.id})">Details</button>
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

        const modalsHTML = `
            <div class="modal-overlay" id="campaignDetailModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Campaign Performance</h3>
                        <button class="modal-close" onclick="closeModal('campaignDetailModal')"><i data-lucide="x"></i></button>
                    </div>
                    <div class="modal-body" id="campaignDetailBody"></div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="closeModal('campaignDetailModal')">Close</button>
                        <button class="btn btn-primary" id="optimizeBtn" onclick="optimizeAds()">
                            <i data-lucide="zap"></i> Optimize Ads
                        </button>
                    </div>
                </div>
            </div>

            <div class="modal-overlay" id="newCampaignModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Create New Campaign</h3>
                        <button class="modal-close" onclick="closeModal('newCampaignModal')"><i data-lucide="x"></i></button>
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
                    <span>${campaign.spend}</span>
                </div>
            </div>
            
            <div style="margin-top: 24px;">
                <label style="display:block; font-size:12px; color:var(--color-gray-500); margin-bottom:8px;">AUDIENCE REACH</label>
                <div style="height:8px; background:var(--color-gray-100); border-radius:4px; overflow:hidden;">
                    <div style="width: ${calculateReachPercent(campaign.reach, campaign.reachGoal)}%; height:100%; background:var(--color-primary-500);"></div>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:4px; font-size:12px; color:var(--color-gray-500);">
                    <span>${campaign.reach} reached</span>
                    <span>Goal: ${campaign.reachGoal}</span>
                </div>
            </div>
        `;
        document.getElementById('campaignDetailModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    window.openNewCampaignModal = function () {
        document.getElementById('newCampaignModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    window.saveNewCampaign = function () {
        alert('Campaign launch request sent to marketing team!');
        closeModal('newCampaignModal');
    };

    window.closeModal = function (id) {
        document.getElementById(id).classList.remove('show');
        document.body.style.overflow = '';
    };

    window.optimizeAds = function () {
        const btn = document.getElementById('optimizeBtn');
        const originalContent = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader" class="spin"></i> Optimizing...';
        lucide.createIcons();

        // Simulate AI optimization process
        setTimeout(() => {
            btn.innerHTML = '<i data-lucide="check"></i> Optimized!';
            lucide.createIcons();

            showNotification('Campaign has been optimized using AI recommendation! Budget efficiency increased by 12%.', 'success');

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalContent;
                lucide.createIcons();
            }, 2000);
        }, 1500);
    };

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 16px 24px;
            background: white;
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-xl);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 2000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            border-left: 4px solid ${type === 'success' ? 'var(--color-secondary-500)' : 'var(--color-primary-500)'};
        `;

        notification.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" style="color: ${type === 'success' ? 'var(--color-secondary-500)' : 'var(--color-primary-500)'}"></i>
            <span style="font-weight: 600; font-size: 14px;">${message}</span>
        `;

        document.body.appendChild(notification);
        lucide.createIcons();

        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Close on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });

    function calculateReachPercent(reach, goal) {
        const r = parseFloat(reach.replace(/[KM]/g, (m) => m === 'K' ? '1000' : '1000000'));
        const g = parseFloat(goal.replace(/[KM]/g, (m) => m === 'K' ? '1000' : '1000000'));
        return Math.min(100, Math.round((r / g) * 100));
    }

    // Initial Render
    renderCampaigns();
});
