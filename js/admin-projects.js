/**
 * Admin Projects Management
 * Provides search, filter, and project management functionality
 */

document.addEventListener('DOMContentLoaded', function () {
    // Sample project data
    const projectsData = [
        {
            id: 1,
            title: 'Instagram Ads Campaign',
            client: 'PT Kulit Nusantara',
            type: 'Marketing Campaign',
            status: 'In Progress',
            progress: 75,
            team: ['SN', 'AB', '+2'],
            deadline: 'Jan 25',
            isUrgent: false
        },
        {
            id: 2,
            title: 'Export Documentation',
            client: 'Kopi Gayo Premium',
            type: 'Export Consultation',
            status: 'In Progress',
            progress: 45,
            team: ['DW', 'RS'],
            deadline: 'Jan 20',
            isUrgent: true
        },
        {
            id: 3,
            title: 'Financial Restructuring',
            client: 'Batik Sekar Arum',
            type: 'Financial Advisory',
            status: 'In Progress',
            progress: 90,
            team: ['BP'],
            deadline: 'Jan 22',
            isUrgent: false
        },
        {
            id: 4,
            title: 'Website Development',
            client: 'CV Jepara Furniture',
            type: 'Digital',
            status: 'On Hold',
            progress: 30,
            team: ['TK', 'MN'],
            deadline: 'Feb 15',
            isUrgent: false
        },
        {
            id: 5,
            title: 'Product Photography',
            client: 'Keramik Kasongan',
            type: 'Marketing Campaign',
            status: 'In Progress',
            progress: 60,
            team: ['SN'],
            deadline: 'Jan 28',
            isUrgent: false
        },
        {
            id: 6,
            title: 'Tax Planning 2026',
            client: 'Tenun Lombok Indah',
            type: 'Financial Advisory',
            status: 'In Progress',
            progress: 25,
            team: ['BP', 'AS'],
            deadline: 'Mar 31',
            isUrgent: false
        },
        {
            id: 7,
            title: 'Brand Refresh',
            client: 'CV Tenun Kalimantan',
            type: 'Marketing Campaign',
            status: 'Completed',
            progress: 100,
            team: ['AB', 'RS'],
            deadline: 'Dec 15',
            isUrgent: false
        },
        {
            id: 8,
            title: 'Supply Chain Audit',
            client: 'PT Kelapa Makmur',
            type: 'Business Diagnostic',
            status: 'In Progress',
            progress: 15,
            team: ['MN', 'DW'],
            deadline: 'Feb 10',
            isUrgent: false
        }
    ];

    let filteredProjects = [...projectsData];

    // DOM Elements
    const searchInput = document.getElementById('projectSearch');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const teamFilter = document.getElementById('teamFilter');
    const projectsGrid = document.getElementById('projectsGrid');
    const addProjectBtn = document.querySelector('.topbar-right .btn-primary');

    // Create modals
    createModals();

    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }

    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }

    if (teamFilter) {
        teamFilter.addEventListener('change', applyFilters);
    }

    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => openProjectModal());
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply filters
    function applyFilters() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const typeValue = typeFilter ? typeFilter.value : '';
        const statusValue = statusFilter ? statusFilter.value : '';
        const teamValue = teamFilter ? teamFilter.value : '';

        filteredProjects = projectsData.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||
                project.client.toLowerCase().includes(searchTerm);

            const matchesType = !typeValue || project.type === typeValue;
            const matchesStatus = !statusValue || project.status === statusValue;

            // Simulating team filter (in real app, this would be more complex)
            const matchesTeam = !teamValue || true;

            return matchesSearch && matchesType && matchesStatus && matchesTeam;
        });

        renderProjects();
        updateStats();
    }

    // Render projects
    function renderProjects() {
        if (!projectsGrid) return;

        if (filteredProjects.length === 0) {
            projectsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: white; border-radius: var(--radius-xl); border: 1px dashed var(--color-gray-300);">
                    <i data-lucide="folder-search" style="width: 48px; height: 48px; color: var(--color-gray-400); margin-bottom: 16px;"></i>
                    <p style="color: var(--color-gray-500);">No projects found matching your criteria.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        projectsGrid.innerHTML = filteredProjects.map(project => `
            <div class="project-card" data-id="${project.id}">
                <div class="project-header">
                    <div>
                        <div class="project-title">${project.title}</div>
                        <div class="project-client">${project.client} • ${project.type}</div>
                    </div>
                    <span class="status-badge ${getStatusBadgeClass(project.status)}">${project.status}</span>
                </div>
                <div class="project-progress">
                    <div class="progress-header">
                        <span class="progress-label">Progress</span>
                        <span class="progress-value">${project.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress}%; ${project.status === 'On Hold' ? 'background: var(--color-warning);' : ''}"></div>
                    </div>
                </div>
                <div class="project-meta">
                    <div class="project-team">
                        ${project.team.map(member => `<div class="team-member">${member}</div>`).join('')}
                    </div>
                    <div class="project-deadline ${project.isUrgent ? 'urgent' : ''}">
                        <i data-lucide="${project.isUrgent ? 'alert-triangle' : 'calendar'}"></i>
                        Due: ${project.deadline}
                    </div>
                </div>
            </div>
        `).join('');

        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Add click listeners to cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                const project = projectsData.find(p => p.id === id);
                if (project) openProjectDetailModal(project);
            });
        });
    }

    function getStatusBadgeClass(status) {
        switch (status) {
            case 'In Progress': return 'active';
            case 'On Hold': return 'pending';
            case 'Completed': return 'success';
            default: return '';
        }
    }

    function updateStats() {
        const stats = {
            active: projectsData.filter(p => p.status === 'In Progress').length,
            completed: projectsData.filter(p => p.status === 'Completed').length,
            urgent: projectsData.filter(p => p.isUrgent).length
        };

        const statValues = document.querySelectorAll('.stat-card-value');
        if (statValues.length >= 3) {
            statValues[0].textContent = stats.active;
            statValues[1].textContent = stats.completed;
            statValues[2].textContent = stats.urgent;
        }
    }

    function createModals() {

        const modalsHTML = `
            <div class="modal-overlay" id="projectModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">New Project</h3>
                        <button class="modal-close" onclick="closeModal('projectModal')"><i data-lucide="x"></i></button>
                    </div>
                    <div class="modal-body">
                        <form id="projectForm">
                            <div class="form-group">
                                <label class="form-label">Project Title</label>
                                <input type="text" class="form-input" id="projTitle" required placeholder="e.g. Marketing Campaign">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Client</label>
                                <input type="text" class="form-input" id="projClient" required placeholder="Select client...">
                            </div>
                            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                                <div class="form-group">
                                    <label class="form-label">Project Type</label>
                                    <select class="form-input" id="projType">
                                        <option>Marketing Campaign</option>
                                        <option>Business Diagnostic</option>
                                        <option>Export Consultation</option>
                                        <option>Financial Advisory</option>
                                        <option>Digital</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Status</label>
                                    <select class="form-input" id="projStatus">
                                        <option>In Progress</option>
                                        <option>On Hold</option>
                                        <option>Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                                <div class="form-group">
                                    <label class="form-label">Deadline</label>
                                    <input type="text" class="form-input" id="projDeadline" placeholder="e.g. Jan 30">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Initial Progress (%)</label>
                                    <input type="number" class="form-input" id="projProgress" value="0" min="0" max="100">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="closeModal('projectModal')">Cancel</button>
                        <button class="btn btn-primary" id="saveProjBtn">Create Project</button>
                    </div>
                </div>
            </div>

            <div class="modal-overlay" id="projectDetailModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Project Details</h3>
                        <button class="modal-close" onclick="closeModal('projectDetailModal')"><i data-lucide="x"></i></button>
                    </div>
                    <div class="modal-body" id="projectDetailBody">
                        <!-- Populated by JS -->
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="closeModal('projectDetailModal')">Close</button>
                        <button class="btn btn-primary" id="editProjBtn">Edit Project</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalsHTML);

        document.getElementById('saveProjBtn').addEventListener('click', saveProject);
    }

    function openProjectModal(project = null) {
        const modal = document.getElementById('projectModal');
        const title = document.getElementById('modalTitle');
        const btn = document.getElementById('saveProjBtn');
        const form = document.getElementById('projectForm');

        if (project) {
            title.textContent = 'Edit Project';
            btn.textContent = 'Save Changes';
            document.getElementById('projTitle').value = project.title;
            document.getElementById('projClient').value = project.client;
            document.getElementById('projType').value = project.type;
            document.getElementById('projStatus').value = project.status;
            document.getElementById('projDeadline').value = project.deadline;
            document.getElementById('projProgress').value = project.progress;
            form.dataset.id = project.id;
        } else {
            title.textContent = 'New Project';
            btn.textContent = 'Create Project';
            form.reset();
            delete form.dataset.id;
        }

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function openProjectDetailModal(project) {
        const body = document.getElementById('projectDetailBody');
        body.innerHTML = `
            <div style="margin-bottom: 24px;">
                <h2 style="margin: 0 0 8px 0; font-size: var(--text-2xl); color: var(--color-gray-900);">${project.title}</h2>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span class="status-badge ${getStatusBadgeClass(project.status)}">${project.status}</span>
                    <span style="color: var(--color-gray-500); font-size: var(--text-sm);">${project.client} • ${project.type}</span>
                </div>
            </div>

            <div class="project-progress" style="margin-bottom: 32px;">
                <div class="progress-header">
                    <span class="progress-label">Completion Status</span>
                    <span class="progress-value">${project.progress}%</span>
                </div>
                <div class="progress-bar" style="height: 12px;">
                    <div class="progress-fill" style="width: ${project.progress}%; height: 12px; border-radius: 6px;"></div>
                </div>
            </div>

            <div class="project-detail-grid">
                <div class="detail-item">
                    <label>Deadline</label>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="calendar" style="width: 16px; height: 16px; color: var(--color-primary-500);"></i>
                        <span>${project.deadline}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label>Assigned Team</label>
                    <div style="display: flex; gap: 4px;">
                        ${project.team.map(m => `<div class="team-member" style="margin: 0;">${m}</div>`).join('')}
                    </div>
                </div>
                <div class="detail-item">
                    <label>Priority</label>
                    <span>${project.isUrgent ? 'High (Urgent)' : 'Normal'}</span>
                </div>
                <div class="detail-item">
                    <label>Last Updated</label>
                    <span>2 hours ago</span>
                </div>
            </div>
        `;

        document.getElementById('editProjBtn').onclick = () => {
            closeModal('projectDetailModal');
            openProjectModal(project);
        };

        document.getElementById('projectDetailModal').classList.add('show');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    }

    function saveProject() {
        const form = document.getElementById('projectForm');
        const id = form.dataset.id;
        const title = document.getElementById('projTitle').value;
        const client = document.getElementById('projClient').value;
        const type = document.getElementById('projType').value;
        const status = document.getElementById('projStatus').value;
        const deadline = document.getElementById('projDeadline').value;
        const progress = parseInt(document.getElementById('projProgress').value);

        if (!title || !client) {
            alert('Title and Client are required');
            return;
        }

        if (id) {
            const index = projectsData.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                projectsData[index] = { ...projectsData[index], title, client, type, status, deadline, progress };
            }
        } else {
            const newProject = {
                id: Date.now(),
                title, client, type, status, deadline: deadline || 'TBD',
                progress: progress || 0,
                team: ['AD'],
                isUrgent: false
            };
            projectsData.unshift(newProject);
        }

        closeModal('projectModal');
        applyFilters();
    }

    window.closeModal = function (id) {
        document.getElementById(id).classList.remove('show');
        document.body.style.overflow = '';
    };

    // Close on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });

    // Initial render
    renderProjects();
    updateStats();
});
