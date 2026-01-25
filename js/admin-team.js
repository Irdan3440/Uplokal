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

// --- Modal Helpers ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// --- Action Functions ---

// Invite
function inviteMember() {
    document.getElementById('inviteName').value = '';
    document.getElementById('inviteEmail').value = '';
    document.getElementById('inviteRole').value = 'Admin';
    openModal('inviteModal');
}

function confirmInvite() {
    const name = document.getElementById('inviteName').value;
    const email = document.getElementById('inviteEmail').value;
    const role = document.getElementById('inviteRole').value;

    if (!name || !email) {
        alert('Please fill in Name and Email');
        return;
    }

    // Add to list
    const newMember = {
        id: Date.now(),
        name: name,
        role: role,
        status: 'Offline',
        email: email,
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        lastActive: 'Never',
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };

    teamMembers.push(newMember);
    filteredMembers = [...teamMembers];
    renderTeam();
    updateStats();
    closeModal('inviteModal');
    showNotification(`Invitation sent to ${email}`, 'success');
}

// Edit
function editMember(id) {
    const member = teamMembers.find(m => m.id === id);
    if (!member) return;

    document.getElementById('editMemberId').value = member.id;
    document.getElementById('editMemberName').value = member.name;
    document.getElementById('editMemberRole').value = member.role;
    document.getElementById('editMemberStatus').value = member.status;

    openModal('editMemberModal');
}

function saveMemberChanges() {
    const id = parseInt(document.getElementById('editMemberId').value);
    const name = document.getElementById('editMemberName').value;
    const role = document.getElementById('editMemberRole').value;
    const status = document.getElementById('editMemberStatus').value;

    const idx = teamMembers.findIndex(m => m.id === id);
    if (idx !== -1) {
        teamMembers[idx].name = name;
        teamMembers[idx].role = role;
        teamMembers[idx].status = status;

        // Update avatar if name changed
        teamMembers[idx].avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

        filteredMembers = [...teamMembers];
        renderTeam();
        updateStats();
        closeModal('editMemberModal');
        showNotification('Member details updated', 'success');
    }
}

// Delete
let memberToDelete = null;

function deleteMemberConfirm() {
    const id = parseInt(document.getElementById('editMemberId').value);
    const member = teamMembers.find(m => m.id === id);
    if (!member) return;

    memberToDelete = id;
    document.getElementById('deleteTargetName').textContent = member.name;

    closeModal('editMemberModal');
    openModal('confirmDeleteModal');
}

function confirmDeleteMember() {
    const idx = teamMembers.findIndex(m => m.id === memberToDelete);
    if (idx !== -1) {
        const name = teamMembers[idx].name;
        teamMembers.splice(idx, 1);
        filteredMembers = [...teamMembers];
        renderTeam();
        updateStats();
        closeModal('confirmDeleteModal');
        showNotification(`${name} removed from team`, 'error');
    }
}

// Permissions
function viewPermissions(id) {
    const member = teamMembers.find(m => m.id === id);
    if (!member) return;

    // In a real app, we'd load permissions based on role
    openModal('permissionsModal');
}

// --- Global UI Helpers ---

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Ensure modals can be closed by clicking outside
window.onclick = function (event) {
    if (event.target.classList.contains('modal-overlay')) {
        closeModal(event.target.id);
    }
}
