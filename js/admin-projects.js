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
        const modalStyles = `
            <style>
                .modal-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    align-items: center;
                    justify-content: center;
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
                    animation: modalSlideIn 0.3s ease;
                    position: relative;
                }
                .modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--space-5) var(--space-6);
                    border-bottom: 1px solid var(--color-gray-200);
                }
                .modal-body { padding: var(--space-6); }
                .modal-footer {
                    display: flex;
                    gap: var(--space-3);
                    justify-content: flex-end;
                    padding: var(--space-4) var(--space-6);
                    border-top: 1px solid var(--color-gray-200);
                }
                .project-detail-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                    margin-top: 24px;
                }
                .detail-item label {
                    display: block;
                    font-size: var(--text-xs);
                    color: var(--color-gray-500);
                    margin-bottom: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .detail-item span {
                    font-weight: 600;
                    color: var(--color-gray-900);
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', modalStyles);

        const modalsHTML = `
            <div class="modal-overlay" id="projectModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">New Project</h3>
                        <button onclick="closeModal('projectModal')" style="background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
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
                        <button onclick="closeModal('projectDetailModal')" style="background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
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

        modal.classList.add('active');
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

        document.getElementById('projectDetailModal').classList.add('active');
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
        document.getElementById(id).classList.remove('active');
    };

    // Close on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) closeModal(this.id);
        });
    });

    // Initial render
    renderProjects();
    updateStats();
});
