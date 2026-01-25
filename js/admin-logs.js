/* ===========================================
   Admin Logs JavaScript
   =========================================== */

const activitiesData = [
    { id: 1, timestamp: '20 Jan 2024, 14:32:15', user: 'Admin User', userCode: 'AD', color: '#2563EB', action: 'Approved verification for <strong>CV Tenun Kalimantan</strong>', type: 'action', ip: '103.121.xx.xx' },
    { id: 2, timestamp: '20 Jan 2024, 14:28:42', user: 'Sarah Rahman', userCode: 'SR', color: '#10B981', action: 'Created new campaign for <strong>Batik Sekar Arum</strong>', type: 'create', ip: '180.252.xx.xx' },
    { id: 3, timestamp: '20 Jan 2024, 14:15:08', user: 'Budi Wicaksono', userCode: 'BW', color: '#F59E0B', action: 'Matched RFQ #1890 with <strong>3 suppliers</strong>', type: 'action', ip: '114.124.xx.xx' },
    { id: 4, timestamp: '20 Jan 2024, 14:02:33', user: 'Admin User', userCode: 'AD', color: '#2563EB', action: 'Logged in from new device', type: 'auth', ip: '103.121.xx.xx' },
    { id: 5, timestamp: '20 Jan 2024, 13:45:21', user: 'System', userCode: 'SY', color: '#6B7280', action: 'Automated backup completed successfully', type: 'system', ip: '127.0.0.1' },
    { id: 6, timestamp: '20 Jan 2024, 13:22:05', user: 'Sarah Rahman', userCode: 'SR', color: '#10B981', action: 'Updated client profile: <strong>PT Kulit Nusantara</strong>', type: 'update', ip: '180.252.xx.xx' },
    { id: 7, timestamp: '20 Jan 2024, 12:58:47', user: 'Unknown', userCode: '!', color: '#EF4444', action: 'Failed login attempt (3 attempts)', type: 'error', ip: '45.33.xx.xx' },
    { id: 8, timestamp: '20 Jan 2024, 12:45:10', user: 'Admin User', userCode: 'AD', color: '#2563EB', action: 'Updated <strong>Billing Policy</strong>', type: 'update', ip: '103.121.xx.xx' },
    { id: 9, timestamp: '20 Jan 2024, 12:30:00', user: 'Sarah Rahman', userCode: 'SR', color: '#10B981', action: 'Invited new team member: <strong>Rian Hidayat</strong>', type: 'action', ip: '180.252.xx.xx' },
    { id: 10, timestamp: '20 Jan 2024, 12:15:22', user: 'System', userCode: 'SY', color: '#6B7280', action: 'SSL Certificate renewed', type: 'system', ip: 'localhost' },
    { id: 11, timestamp: '20 Jan 2024, 12:00:15', user: 'Admin User', userCode: 'AD', color: '#2563EB', action: 'Exported client data', type: 'action', ip: '192.168.1.1' },
    { id: 12, timestamp: '19 Jan 2024, 23:45:00', user: 'Budi Wicaksono', userCode: 'BW', color: '#F59E0B', action: 'Resolved support ticket <strong>#9901</strong>', type: 'action', ip: '192.168.1.33' },
    { id: 13, timestamp: '19 Jan 2024, 22:15:33', user: 'Sarah Rahman', userCode: 'SR', color: '#10B981', action: 'Changed password', type: 'auth', ip: '180.252.xx.xx' },
    { id: 14, timestamp: '19 Jan 2024, 20:40:12', user: 'System', userCode: 'SY', color: '#6B7280', action: 'Memory usage spike detected', type: 'error', ip: 'localhost' },
    { id: 15, timestamp: '19 Jan 2024, 18:02:33', user: 'Admin User', userCode: 'AD', color: '#2563EB', action: 'Updated privacy policy', type: 'system', ip: '103.121.xx.xx' },
    { id: 16, timestamp: '19 Jan 2024, 16:58:47', user: 'Unknown', userCode: '!', color: '#EF4444', action: 'API Error: Rate limit exceeded', type: 'error', ip: '45.33.xx.xx' },
    { id: 17, timestamp: '19 Jan 2024, 15:45:22', user: 'Sarah Rahman', userCode: 'SR', color: '#10B981', action: 'Archived old campaigns', type: 'action', ip: '180.252.xx.xx' },
    { id: 18, timestamp: '19 Jan 2024, 14:12:05', user: 'Budi Wicaksono', userCode: 'BW', color: '#F59E0B', action: 'Uploaded new assets', type: 'action', ip: '192.168.1.33' },
    { id: 19, timestamp: '19 Jan 2024, 12:30:11', user: 'System', userCode: 'SY', color: '#6B7280', action: 'Daily cron job started', type: 'system', ip: 'localhost' },
    { id: 20, timestamp: '19 Jan 2024, 10:05:48', user: 'Admin User', userCode: 'AD', color: '#2563EB', action: 'Updated footer layout', type: 'action', ip: '114.124.xx.xx' }
];

let filteredLogs = [...activitiesData];
let currentPage = 1;
const itemsPerPage = 7;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    renderLogs();

    // Event Listeners
    const logSearch = document.getElementById('logSearch');
    const typeFilter = document.getElementById('typeFilter');
    const timeFilter = document.getElementById('timeFilter');
    const userFilter = document.getElementById('userFilter');
    const exportBtn = document.getElementById('exportLogsBtn');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (logSearch) logSearch.addEventListener('input', () => { currentPage = 1; applyFilters(); });
    if (typeFilter) typeFilter.addEventListener('change', () => { currentPage = 1; applyFilters(); });
    if (timeFilter) timeFilter.addEventListener('change', () => { currentPage = 1; applyFilters(); });
    if (userFilter) userFilter.addEventListener('change', () => { currentPage = 1; applyFilters(); });
    if (exportBtn) exportBtn.addEventListener('click', () => exportLogs());

    if (prevBtn) prevBtn.addEventListener('click', () => changePage(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changePage(1));
});

function applyFilters() {
    const searchTerm = document.getElementById('logSearch').value.toLowerCase();
    const typeValue = document.getElementById('typeFilter').value;
    const userValue = document.getElementById('userFilter').value;

    filteredLogs = activitiesData.filter(log => {
        const matchesSearch = log.user.toLowerCase().includes(searchTerm) ||
            log.action.toLowerCase().includes(searchTerm) ||
            log.ip.toLowerCase().includes(searchTerm);

        const matchesType = typeValue === 'all' || log.type === typeValue;

        const matchesUser = userValue === 'all' ||
            (userValue === 'admin' && log.user === 'Admin User') ||
            (userValue === 'sarah' && log.user === 'Sarah Rahman') ||
            (userValue === 'budi' && log.user === 'Budi Wicaksono');

        return matchesSearch && matchesType && matchesUser;
    });

    renderLogs();
}

function renderLogs() {
    const tableBody = document.getElementById('logsTableBody');
    const logSummary = document.getElementById('logSummary');
    if (!tableBody) return;

    if (filteredLogs.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: var(--space-12);">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: var(--space-3);">
                        <i data-lucide="search-x" style="width: 48px; height: 48px; color: var(--color-gray-300);"></i>
                        <p style="color: var(--color-gray-500);">No results found for your filters.</p>
                        <button class="btn btn-ghost btn-sm" onclick="resetFilters()">Clear Filters</button>
                    </div>
                </td>
            </tr>
        `;
        if (logSummary) logSummary.textContent = 'Showing 0 of 0 logs';
        updatePagination(0);
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    // Pagination slice
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredLogs.length);
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    if (logSummary) {
        logSummary.textContent = `Showing ${paginatedLogs.length} of ${filteredLogs.length === 20 ? '1,456' : filteredLogs.length} logs`;
    }

    tableBody.innerHTML = paginatedLogs.map(log => `
        <tr style="border-bottom: 1px solid var(--color-gray-100);">
            <td style="padding: var(--space-4); font-size: var(--text-sm); color: var(--color-gray-500);">${log.timestamp}</td>
            <td style="padding: var(--space-4);">
                <div style="display: flex; align-items: center; gap: var(--space-3);">
                    <div style="width: 32px; height: 32px; background: ${log.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 700; flex-shrink: 0;">
                        ${log.userCode}
                    </div>
                    <span style="font-size: var(--text-sm); font-weight: 500; color: var(--color-gray-700);">${log.user}</span>
                </div>
            </td>
            <td style="padding: var(--space-4); font-size: var(--text-sm); color: var(--color-gray-700);">${log.action}</td>
            <td style="padding: var(--space-4); text-align: center;">
                <span class="badge ${getTypeBadgeClass(log.type)}">${capitalize(log.type)}</span>
            </td>
            <td style="padding: var(--space-4); font-size: var(--text-sm); color: var(--color-gray-500);">${log.ip}</td>
        </tr>
    `).join('');

    updatePagination(filteredLogs.length);
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const pageStatus = document.getElementById('pageStatus');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (pageStatus) {
        const displayTotal = filteredLogs.length === 20 ? 59 : totalPages;
        pageStatus.textContent = `Page ${currentPage} of ${displayTotal}`;
    }
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

function changePage(direction) {
    currentPage += direction;
    renderLogs();
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) tableContainer.scrollTop = 0;
}

function getTypeBadgeClass(type) {
    switch (type) {
        case 'auth': return 'badge-warning';
        case 'action': return 'badge-success';
        case 'error': return 'badge-error';
        case 'system': return 'badge-primary';
        case 'create': return 'badge-primary';
        case 'update': return 'badge-warning';
        default: return 'badge-secondary';
    }
}

function capitalize(s) {
    if (s === 'auth') return 'Auth';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function resetFilters() {
    document.getElementById('logSearch').value = '';
    document.getElementById('typeFilter').value = 'all';
    document.getElementById('userFilter').value = 'all';
    currentPage = 1;
    applyFilters();
}

function exportLogs() {
    alert('Preparing logs export (CSV)...');
    setTimeout(() => {
        showNotification('Logs exported successfully!', 'success');
    }, 1500);
}

function showNotification(message, type) {
    if (window.showNotification) {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}
