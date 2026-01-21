const teamMembers = [
    {
        id: 1,
        name: 'Admin User',
        role: 'Super Admin',
        status: 'Online',
        email: 'admin@uplokal.com',
        avatar: 'AD',
        lastActive: 'Now',
        color: 'var(--color-primary-500)'
    },
    {
        id: 2,
        name: 'Sarah Rahman',
        role: 'Admin',
        status: 'Online',
        email: 'sarah@uplokal.com',
        avatar: 'SR',
        lastActive: 'Now',
        color: 'var(--color-secondary-500)'
    },
    {
        id: 3,
        name: 'Budi Wicaksono',
        role: 'Admin',
        status: 'Online',
        email: 'budi@uplokal.com',
        avatar: 'BW',
        lastActive: 'Now',
        color: 'var(--color-accent-500)'
    },
    {
        id: 4,
        name: 'Dewi Pratiwi',
        role: 'Moderator',
        status: 'Offline',
        email: 'dewi@uplokal.com',
        avatar: 'DP',
        lastActive: '5 hours ago',
        color: 'var(--color-gray-400)'
    },
    {
        id: 5,
        name: 'Ahmad Saputra',
        role: 'Moderator',
        status: 'Online',
        email: 'ahmad@uplokal.com',
        avatar: 'AS',
        lastActive: 'Now',
        color: '#8B5CF6'
    },
    {
        id: 6,
        name: 'Rina Novita',
        role: 'Moderator',
        status: 'Online',
        email: 'rina@uplokal.com',
        avatar: 'RN',
        lastActive: 'Now',
        color: '#EC4899'
    }
];

let filteredMembers = [...teamMembers];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    renderTeam();
    updateStats();

    // Search functionality
    const searchInput = document.getElementById('memberSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            applyFilters(term, document.getElementById('roleFilter').value);
        });
    }

    // Role filter functionality
    const roleFilter = document.getElementById('roleFilter');
    if (roleFilter) {
        roleFilter.addEventListener('change', (e) => {
            const role = e.target.value;
            applyFilters(document.getElementById('memberSearch').value.toLowerCase(), role);
        });
    }
});

function applyFilters(searchTerm, role) {
    filteredMembers = teamMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm) ||
            member.email.toLowerCase().includes(searchTerm);
        const matchesRole = role === 'all' || member.role.includes(role);
        return matchesSearch && matchesRole;
    });

    renderTeam();
}

function renderTeam() {
    const grid = document.getElementById('teamGrid');
    if (!grid) return;

    if (filteredMembers.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-12); background: white; border-radius: var(--radius-xl); border: 1px dashed var(--color-gray-300);">
                <i data-lucide="users" style="width: 48px; height: 48px; color: var(--color-gray-400); margin-bottom: var(--space-4);"></i>
                <p style="color: var(--color-gray-500);">No team members found.</p>
            </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    grid.innerHTML = filteredMembers.map(member => `
        <div class="team-card">
            <div class="team-card-header">
                <div class="member-avatar">
                    <div class="avatar-placeholder" style="background-color: ${member.color || 'var(--color-primary-500)'}">${member.avatar}</div>
                    <span class="status-indicator ${member.status.toLowerCase()}"></span>
                </div>
                <div class="member-actions">
                    <button class="icon-btn sm" onclick="editMember(${member.id})"><i data-lucide="more-vertical"></i></button>
                </div>
            </div>
            <div class="member-info">
                <div class="member-role">${member.role}</div>
                <h3>${member.name}</h3>
                <p class="member-email">${member.email}</p>
            </div>
            <div class="member-footer">
                <span class="last-active">Active: ${member.lastActive}</span>
                <button class="btn btn-ghost btn-sm" onclick="viewPermissions(${member.id})">Permissions</button>
            </div>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function updateStats() {
    const totalCount = teamMembers.length;
    const activeCount = teamMembers.filter(m => m.status === 'Online').length;
    const adminCount = teamMembers.filter(m => m.role.includes('Admin')).length;
    const pendingCount = 2; // Mock value for pending invites

    const totalStat = document.getElementById('totalMembersStat');
    if (totalStat) totalStat.textContent = totalCount;

    const activeStat = document.getElementById('activeMembersStat');
    if (activeStat) activeStat.textContent = activeCount;

    const adminStat = document.getElementById('adminMembersStat');
    if (adminStat) adminStat.textContent = adminCount;

    const pendingStat = document.getElementById('pendingInvitesStat');
    if (pendingStat) pendingStat.textContent = pendingCount;
}

function inviteMember() {
    alert('Buka modal untuk mengirim undangan email kepada anggota tim baru.');
}

function editMember(id) {
    alert('Edit detail dan role untuk anggota tim ID: ' + id);
}

function viewPermissions(id) {
    alert('Lihat dan atur hak akses untuk anggota tim ID: ' + id);
}
