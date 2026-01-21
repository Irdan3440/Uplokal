/* ===========================================
   Admin Logs JavaScript
   =========================================== */

const activitiesData = [
    {
        timestamp: '2024-01-21 15:45:22',
        user: 'admin_super',
        action: 'Updated billing settings',
        type: 'Settings',
        ip: '192.168.1.1'
    },
    {
        timestamp: '2024-01-21 14:12:05',
        user: 'mod_siti',
        action: 'Approved verification for "Batik Nusantara"',
        type: 'Verification',
        ip: '192.168.1.45'
    },
    {
        timestamp: '2024-01-21 12:30:11',
        user: 'admin_rian',
        action: 'Suspended user USR-8821',
        type: 'Moderation',
        ip: '192.168.1.12'
    },
    {
        timestamp: '2024-01-21 10:05:48',
        user: 'system',
        action: 'Database backup completed',
        type: 'System',
        ip: 'localhost'
    },
    {
        timestamp: '2024-01-20 22:15:33',
        user: 'mod_budi',
        action: 'Deleted flagged review #5542',
        type: 'Moderation',
        ip: '192.168.1.33'
    },
    {
        timestamp: '2024-01-20 18:40:12',
        user: 'admin_super',
        action: 'Added new team member: Rian Hidayat',
        type: 'Team',
        ip: '192.168.1.1'
    }
];

let filteredLogs = [...activitiesData];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    renderLogs();

    // Search functionality
    const searchInput = document.getElementById('logSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            applyFilters();
        });
    }

    // Type filter functionality
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', () => applyFilters());
    }

    // Time filter functionality
    const timeFilter = document.getElementById('timeFilter');
    if (timeFilter) {
        timeFilter.addEventListener('change', () => applyFilters());
    }

    // Reset button
    const resetBtn = document.querySelector('.btn-ghost[onclick*="reset"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('logSearch').value = '';
            document.getElementById('typeFilter').value = 'all';
            document.getElementById('timeFilter').value = 'today';
            applyFilters();
        });
    }
});

function applyFilters() {
    const searchTerm = document.getElementById('logSearch').value.toLowerCase();
    const typeValue = document.getElementById('typeFilter').value;

    filteredLogs = activitiesData.filter(log => {
        const matchesSearch = log.user.toLowerCase().includes(searchTerm) ||
            log.action.toLowerCase().includes(searchTerm) ||
            log.ip.toLowerCase().includes(searchTerm);
        const matchesType = typeValue === 'all' || log.type === typeValue;

        // Time filter is mock for now since we only have small dataset
        return matchesSearch && matchesType;
    });

    renderLogs();
}

function renderLogs() {
    const tableBody = document.getElementById('logsTableBody');
    if (!tableBody) return;

    if (filteredLogs.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: var(--space-12);">
                    <i data-lucide="info" style="width: 32px; height: 32px; color: var(--color-gray-400); margin-bottom: var(--space-2);"></i>
                    <p style="color: var(--color-gray-500);">No activity logs found for the current filters.</p>
                </td>
            </tr>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    tableBody.innerHTML = filteredLogs.map(log => `
        <tr>
            <td style="font-family: monospace; font-size: var(--text-xs); color: var(--color-gray-500);">${log.timestamp}</td>
            <td style="font-weight: 600;">${log.user}</td>
            <td>${log.action}</td>
            <td><span class="log-type-tag ${log.type.toLowerCase()}">${log.type}</span></td>
            <td style="color: var(--color-gray-500);">${log.ip}</td>
        </tr>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function exportLogs() {
    alert('Exporting activity logs as CSV file...');
}
