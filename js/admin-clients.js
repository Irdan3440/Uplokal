/**
 * @license
 * Uplokal - From Local Up To Global
 * Copyright (c) 2026 Uplokal Team. All rights reserved.
 * 
 * Admin Clients Management
 * Provides search, filter, pagination, view/edit/add client functionality
 */

document.addEventListener('DOMContentLoaded', function () {
    // Sample client data (in production, this would come from an API)
    const clientsData = [
        { id: 1, name: 'PT Kulit Nusantara', initials: 'KN', subcategory: 'Manufaktur Tas & Sepatu', category: 'Manufaktur', location: 'Bandung', healthScore: 78, status: 'Active', joined: '15 Nov 2025', email: 'contact@kulitnusantara.com', phone: '+62 812-3456-7890' },
        { id: 2, name: 'CV Jepara Furniture', initials: 'JF', subcategory: 'Furniture Kayu Jati', category: 'Furniture', location: 'Jepara', healthScore: 85, status: 'Active', joined: '10 Nov 2025', email: 'info@jeparafurniture.com', phone: '+62 813-4567-8901' },
        { id: 3, name: 'Kopi Gayo Premium', initials: 'KG', subcategory: 'Specialty Coffee', category: 'Food & Beverage', location: 'Aceh Tengah', healthScore: 92, status: 'Active', joined: '8 Nov 2025', email: 'hello@kopigayo.com', phone: '+62 814-5678-9012' },
        { id: 4, name: 'CV Tenun Kalimantan', initials: 'TK', subcategory: 'Tenun Tradisional', category: 'Fashion & Tekstil', location: 'Samarinda', healthScore: 45, status: 'Pending', joined: '5 Jan 2026', email: 'cs@tenunkalimantan.id', phone: '+62 815-6789-0123' },
        { id: 5, name: 'Batik Sekar Arum', initials: 'SA', subcategory: 'Batik Tulis & Cap', category: 'Fashion & Tekstil', location: 'Solo', healthScore: 88, status: 'Active', joined: '1 Oct 2025', email: 'order@batiksekararum.com', phone: '+62 816-7890-1234' },
        { id: 6, name: 'PT Kelapa Makmur', initials: 'KM', subcategory: 'Virgin Coconut Oil', category: 'Agrikultur', location: 'Sulawesi Utara', healthScore: 68, status: 'Active', joined: '20 Sep 2025', email: 'export@kelapamakmur.co.id', phone: '+62 817-8901-2345' },
        { id: 7, name: 'Keramik Kasongan', initials: 'KK', subcategory: 'Keramik & Gerabah', category: 'Kerajinan', location: 'Yogyakarta', healthScore: 75, status: 'Active', joined: '15 Aug 2025', email: 'gallery@kasongan.com', phone: '+62 818-9012-3456' },
        { id: 8, name: 'CV Laut Nusantara', initials: 'LN', subcategory: 'Seafood Frozen', category: 'Food & Beverage', location: 'Surabaya', healthScore: 58, status: 'Inactive', joined: '10 Jul 2025', email: 'sales@lautnusantara.id', phone: '+62 819-0123-4567' },
        { id: 9, name: 'PT Rattan Indonesia', initials: 'RI', subcategory: 'Furniture Rotan', category: 'Furniture', location: 'Cirebon', healthScore: 82, status: 'Active', joined: '5 Jun 2025', email: 'info@rattanindonesia.com', phone: '+62 820-1234-5678' },
        { id: 10, name: 'Songket Palembang', initials: 'SP', subcategory: 'Kain Songket', category: 'Fashion & Tekstil', location: 'Palembang', healthScore: 71, status: 'Active', joined: '1 May 2025', email: 'order@songketpalembang.id', phone: '+62 821-2345-6789' },
        { id: 11, name: 'CV Madu Hutan', initials: 'MH', subcategory: 'Madu Organik', category: 'Food & Beverage', location: 'Riau', healthScore: 65, status: 'Pending', joined: '10 Jan 2026', email: 'info@maduhutan.com', phone: '+62 822-3456-7890' },
        { id: 12, name: 'PT Kayu Jaya', initials: 'KJ', subcategory: 'Plywood Export', category: 'Manufaktur', location: 'Kalimantan Timur', healthScore: 90, status: 'Active', joined: '15 Apr 2025', email: 'export@kayujaya.co.id', phone: '+62 823-4567-8901' }
    ];

    let filteredClients = [...clientsData];
    let currentPage = 1;
    const itemsPerPage = 8;

    // DOM Elements
    const searchInput = document.querySelector('.admin-filters input[type="text"]');
    const categoryFilter = document.querySelectorAll('.admin-filters select')[0];
    const statusFilter = document.querySelectorAll('.admin-filters select')[1];
    const locationFilter = document.querySelectorAll('.admin-filters select')[2];
    const tableBody = document.querySelector('.data-table tbody');
    const paginationInfo = document.querySelector('.dashboard-card > div:last-child span');
    const paginationContainer = document.querySelector('.pagination');
    const addClientBtn = document.querySelector('.topbar-right .btn-primary');

    // Create modals container
    createModals();

    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }

    if (locationFilter) {
        locationFilter.addEventListener('change', applyFilters);
    }

    if (addClientBtn) {
        addClientBtn.addEventListener('click', () => openAddClientModal());
    }

    // Attach action button listeners
    attachActionListeners();

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
        const categoryValue = categoryFilter ? categoryFilter.value : '';
        const statusValue = statusFilter ? statusFilter.value : '';
        const locationValue = locationFilter ? locationFilter.value : '';

        filteredClients = clientsData.filter(client => {
            const matchesSearch = client.name.toLowerCase().includes(searchTerm) ||
                client.subcategory.toLowerCase().includes(searchTerm) ||
                client.category.toLowerCase().includes(searchTerm);

            const matchesCategory = !categoryValue || client.category === categoryValue;
            const matchesStatus = !statusValue || client.status === statusValue;
            const matchesLocation = !locationValue || client.location.includes(locationValue);

            return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
        });

        currentPage = 1;
        renderTable();
        renderPagination();
    }

    // Render table
    function renderTable() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageClients = filteredClients.slice(start, end);

        tableBody.innerHTML = pageClients.map(client => `
            <tr data-id="${client.id}">
                <td>
                    <div class="client-info">
                        <div class="client-avatar">${client.initials}</div>
                        <div>
                            <div class="client-name">${client.name}</div>
                            <div class="client-category">${client.subcategory}</div>
                        </div>
                    </div>
                </td>
                <td>${client.category}</td>
                <td>${client.location}</td>
                <td><span class="badge ${getScoreBadgeClass(client.healthScore)}">${client.healthScore}</span></td>
                <td><span class="status-badge ${client.status.toLowerCase()}">${client.status}</span></td>
                <td>${client.joined}</td>
                <td>
                    <div class="table-actions">
                        <button class="table-action btn-view" title="View" data-id="${client.id}"><i data-lucide="eye"></i></button>
                        <button class="table-action btn-edit" title="Edit" data-id="${client.id}"><i data-lucide="pencil"></i></button>
                        <button class="table-action btn-delete" title="Delete" data-id="${client.id}"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Attach action listeners to new buttons
        attachActionListeners();
    }

    // Get score badge class
    function getScoreBadgeClass(score) {
        if (score >= 75) return 'badge-success';
        if (score >= 50) return 'badge-warning';
        return 'badge-danger';
    }

    // Render pagination
    function renderPagination() {
        const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, filteredClients.length);

        if (paginationInfo) {
            paginationInfo.textContent = `Showing ${start}-${end} of ${filteredClients.length} clients`;
        }

        if (paginationContainer) {
            let paginationHTML = `
                <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="prev">
                    <i data-lucide="chevron-left"></i>
                </button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                if (i <= 3 || i === totalPages || Math.abs(i - currentPage) <= 1) {
                    paginationHTML += `
                        <button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>
                    `;
                } else if (i === 4 && currentPage > 4) {
                    paginationHTML += `<span style="padding: 0 8px;">...</span>`;
                }
            }

            paginationHTML += `
                <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="next">
                    <i data-lucide="chevron-right"></i>
                </button>
            `;

            paginationContainer.innerHTML = paginationHTML;

            // Attach pagination listeners
            paginationContainer.querySelectorAll('.pagination-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const page = this.dataset.page;
                    if (page === 'prev' && currentPage > 1) {
                        currentPage--;
                    } else if (page === 'next' && currentPage < totalPages) {
                        currentPage++;
                    } else if (page !== 'prev' && page !== 'next') {
                        currentPage = parseInt(page);
                    }
                    renderTable();
                    renderPagination();
                });
            });

            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    // Attach action listeners
    function attachActionListeners() {
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const client = clientsData.find(c => c.id === id);
                if (client) openViewModal(client);
            });
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const client = clientsData.find(c => c.id === id);
                if (client) openEditModal(client);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                openDeleteConfirmModal(id);
            });
        });
    }

    // Create modals
    function createModals() {
        const modalsHTML = `
            <!-- View Client Modal -->
            <div class="modal-overlay" id="viewClientModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Client Details</h3>
                        <button class="modal-close" onclick="closeModal('viewClientModal')"><i data-lucide="x"></i></button>
                    </div>
                    <div class="modal-body" id="viewClientBody">
                        <!-- Content populated by JS -->
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="closeModal('viewClientModal')">Close</button>
                        <button class="btn btn-primary" id="editFromView">Edit Client</button>
                    </div>
                </div>
            </div>

            <!-- Edit/Add Client Modal -->
            <div class="modal-overlay" id="editClientModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="editModalTitle">Edit Client</h3>
                        <button class="modal-close" onclick="closeModal('editClientModal')"><i data-lucide="x"></i></button>
                    </div>
                    <div class="modal-body">
                        <form id="clientForm">
                            <input type="hidden" id="clientId">
                            <div class="form-group">
                                <label class="form-label">Business Name</label>
                                <input type="text" class="form-input" id="clientName" required>
                            </div>
                            <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                <div class="form-group">
                                    <label class="form-label">Category</label>
                                    <select class="form-input" id="clientCategory" required>
                                        <option value="">Select Category</option>
                                        <option value="Manufaktur">Manufaktur</option>
                                        <option value="Kerajinan">Kerajinan</option>
                                        <option value="Food & Beverage">Food & Beverage</option>
                                        <option value="Fashion & Tekstil">Fashion & Tekstil</option>
                                        <option value="Agrikultur">Agrikultur</option>
                                        <option value="Furniture">Furniture</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Subcategory</label>
                                    <input type="text" class="form-input" id="clientSubcategory" required>
                                </div>
                            </div>
                            <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                <div class="form-group">
                                    <label class="form-label">Location</label>
                                    <input type="text" class="form-input" id="clientLocation" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Status</label>
                                    <select class="form-input" id="clientStatus" required>
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                <div class="form-group">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-input" id="clientEmail" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Phone</label>
                                    <input type="tel" class="form-input" id="clientPhone" required>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="closeModal('editClientModal')">Cancel</button>
                        <button class="btn btn-primary" id="saveClientBtn">Save Changes</button>
                    </div>
                </div>
            </div>

            <!-- Delete Confirm Modal -->
            <div class="modal-overlay" id="deleteConfirmModal">
                <div class="modal-content" style="max-width: 400px;">
                    <div class="modal-header">
                        <h3>Confirm Delete</h3>
                        <button class="modal-close" onclick="closeModal('deleteConfirmModal')"><i data-lucide="x"></i></button>
                    </div>
                    <div class="modal-body" style="text-align: center;">
                        <i data-lucide="alert-triangle" style="width: 48px; height: 48px; color: var(--color-warning); margin-bottom: 16px;"></i>
                        <p>Are you sure you want to delete this client? This action cannot be undone.</p>
                        <input type="hidden" id="deleteClientId">
                    </div>
                    <div class="modal-footer" style="justify-content: center;">
                        <button class="btn btn-outline" onclick="closeModal('deleteConfirmModal')">Cancel</button>
                        <button class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalsHTML);

        // Attach modal button listeners

        // Attach modal button listeners
        document.getElementById('saveClientBtn').addEventListener('click', saveClient);
        document.getElementById('confirmDeleteBtn').addEventListener('click', deleteClient);
    }

    // Open View Modal
    function openViewModal(client) {
        const modal = document.getElementById('viewClientModal');
        const body = document.getElementById('viewClientBody');

        body.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                <div class="client-avatar" style="width: 64px; height: 64px; font-size: 24px;">${client.initials}</div>
                <div>
                    <h4 style="margin: 0;">${client.name}</h4>
                    <p style="margin: 4px 0 0; color: var(--color-gray-500);">${client.subcategory}</p>
                </div>
            </div>
            <div class="client-detail-row">
                <span class="detail-label">Category</span>
                <span class="detail-value">${client.category}</span>
            </div>
            <div class="client-detail-row">
                <span class="detail-label">Location</span>
                <span class="detail-value">${client.location}</span>
            </div>
            <div class="client-detail-row">
                <span class="detail-label">Health Score</span>
                <span class="detail-value"><span class="badge ${getScoreBadgeClass(client.healthScore)}">${client.healthScore}</span></span>
            </div>
            <div class="client-detail-row">
                <span class="detail-label">Status</span>
                <span class="detail-value"><span class="status-badge ${client.status.toLowerCase()}">${client.status}</span></span>
            </div>
            <div class="client-detail-row">
                <span class="detail-label">Joined</span>
                <span class="detail-value">${client.joined}</span>
            </div>
            <div class="client-detail-row">
                <span class="detail-label">Email</span>
                <span class="detail-value">${client.email}</span>
            </div>
            <div class="client-detail-row">
                <span class="detail-label">Phone</span>
                <span class="detail-value">${client.phone}</span>
            </div>
        `;

        document.getElementById('editFromView').onclick = () => {
            closeModal('viewClientModal');
            openEditModal(client);
        };

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Open Edit Modal
    function openEditModal(client) {
        const modal = document.getElementById('editClientModal');
        document.getElementById('editModalTitle').textContent = 'Edit Client';
        document.getElementById('saveClientBtn').textContent = 'Save Changes';

        document.getElementById('clientId').value = client.id;
        document.getElementById('clientName').value = client.name;
        document.getElementById('clientCategory').value = client.category;
        document.getElementById('clientSubcategory').value = client.subcategory;
        document.getElementById('clientLocation').value = client.location;
        document.getElementById('clientStatus').value = client.status;
        document.getElementById('clientEmail').value = client.email;
        document.getElementById('clientPhone').value = client.phone;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Open Add Client Modal
    function openAddClientModal() {
        const modal = document.getElementById('editClientModal');
        document.getElementById('editModalTitle').textContent = 'Add New Client';
        document.getElementById('saveClientBtn').textContent = 'Add Client';

        document.getElementById('clientForm').reset();
        document.getElementById('clientId').value = '';

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Open Delete Confirm Modal
    function openDeleteConfirmModal(id) {
        document.getElementById('deleteClientId').value = id;
        document.getElementById('deleteConfirmModal').classList.add('show');
        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Save Client
    function saveClient() {
        const id = document.getElementById('clientId').value;
        const name = document.getElementById('clientName').value;
        const category = document.getElementById('clientCategory').value;
        const subcategory = document.getElementById('clientSubcategory').value;
        const location = document.getElementById('clientLocation').value;
        const status = document.getElementById('clientStatus').value;
        const email = document.getElementById('clientEmail').value;
        const phone = document.getElementById('clientPhone').value;

        if (!name || !category || !subcategory || !location || !email || !phone) {
            alert('Please fill all required fields');
            return;
        }

        // Generate initials
        const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

        if (id) {
            // Update existing
            const index = clientsData.findIndex(c => c.id === parseInt(id));
            if (index !== -1) {
                clientsData[index] = {
                    ...clientsData[index],
                    name, initials, category, subcategory, location, status, email, phone
                };
            }
        } else {
            // Add new
            const newClient = {
                id: Math.max(...clientsData.map(c => c.id)) + 1,
                name, initials, subcategory, category, location,
                healthScore: 50, status, joined: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                email, phone
            };
            clientsData.unshift(newClient);
        }

        closeModal('editClientModal');
        applyFilters();
    }

    // Delete Client
    function deleteClient() {
        const id = parseInt(document.getElementById('deleteClientId').value);
        const index = clientsData.findIndex(c => c.id === id);
        if (index !== -1) {
            clientsData.splice(index, 1);
        }
        closeModal('deleteConfirmModal');
        applyFilters();
    }

    // Close modal function (global)
    window.closeModal = function (modalId) {
        document.getElementById(modalId).classList.remove('show');
        document.body.style.overflow = '';
    };

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });

    // Initial render
    renderTable();
    renderPagination();
});
