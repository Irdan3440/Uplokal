/**
 * Admin Customers Management
 * Provides search, filter, pagination, view/edit/add customer functionality
 */

document.addEventListener('DOMContentLoaded', function () {
    // Sample customer data
    const customersData = [
        { id: 1, name: 'John Tanaka', initials: 'JT', email: 'john@imports.jp', company: 'Tokyo Imports Co.', country: 'Japan', flag: '🇯🇵', orders: 24, totalSpent: '$45,890', status: 'Active', phone: '+81 3-1234-5678' },
        { id: 2, name: 'Sarah Lee', initials: 'SL', email: 'sarah@sgtrade.sg', company: 'SG Trade Pte Ltd', country: 'Singapore', flag: '🇸🇬', orders: 18, totalSpent: '$32,450', status: 'Active', phone: '+65 6789-0123' },
        { id: 3, name: 'Michael Anderson', initials: 'MA', email: 'm.anderson@auscraft.au', company: 'AusCraft Imports', country: 'Australia', flag: '🇦🇺', orders: 12, totalSpent: '$28,750', status: 'Active', phone: '+61 2-3456-7890' },
        { id: 4, name: 'Ahmad Faisal', initials: 'AF', email: 'ahmad@malaytrade.my', company: 'KL Global Trading', country: 'Malaysia', flag: '🇲🇾', orders: 35, totalSpent: '$62,120', status: 'Active', phone: '+60 3-4567-8901' },
        { id: 5, name: 'Elena Petrova', initials: 'EP', email: 'elena@euroru.com', company: 'EuroRussia Trade', country: 'Russia', flag: '🇷🇺', orders: 8, totalSpent: '$15,400', status: 'Inactive', phone: '+7 495-123-4567' },
        { id: 6, name: 'David Smith', initials: 'DS', email: 'david@smithinter.com', company: 'Smith International', country: 'USA', flag: '🇺🇸', orders: 42, totalSpent: '$89,200', status: 'Active', phone: '+1 212-345-6789' },
        { id: 7, name: 'Chen Wei', initials: 'CW', email: 'chen@bjimports.cn', company: 'Beijing Imports', country: 'China', flag: '🇨🇳', orders: 29, totalSpent: '$54,300', status: 'Active', phone: '+86 10-1234-5678' },
        { id: 8, name: 'Maria Garcia', initials: 'MG', email: 'maria@espmat.es', company: 'España Materials', country: 'Spain', flag: '🇪🇸', orders: 5, totalSpent: '$9,800', status: 'Pending', phone: '+34 91-234-5678' },
        { id: 9, name: 'Indra wijaya', initials: 'IW', email: 'indra@idnex.id', company: 'IndoExport Jaya', country: 'Indonesia', flag: '🇮🇩', orders: 56, totalSpent: 'Rp 1.2M', status: 'Active', phone: '+62 812-3456-7890' },
        { id: 10, name: 'Sophie Laurent', initials: 'SL', email: 'sophie@frdesign.fr', company: 'Paris Design Hub', country: 'France', flag: '🇫🇷', orders: 15, totalSpent: '€22,500', status: 'Active', phone: '+33 1-23-45-67-89' },
        { id: 11, name: 'Karl Müller', initials: 'KM', email: 'karl@deuchetrade.de', company: 'Berlin Trade Group', country: 'Germany', flag: '🇩🇪', orders: 21, totalSpent: '€41,000', status: 'Active', phone: '+49 30-123456' },
        { id: 12, name: 'Yuki Sato', initials: 'YS', email: 'sato@osakai.jp', company: 'Osaka Industry', country: 'Japan', flag: '🇯🇵', orders: 3, totalSpent: '$4,500', status: 'Inactive', phone: '+81 6-7890-1234' }
    ];

    let filteredCustomers = [...customersData];
    let currentPage = 1;
    const itemsPerPage = 8;

    // DOM Elements
    const searchInput = document.querySelector('.admin-filters input[type="text"]');
    const countryFilter = document.getElementById('countryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const tableBody = document.querySelector('.data-table tbody');
    const paginationInfo = document.querySelector('.card-footer span');
    const paginationContainer = document.querySelector('.pagination');
    const addCustomerBtn = document.querySelector('.topbar-right .btn-primary');

    // Create modals
    createModals();

    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }

    if (countryFilter) {
        countryFilter.addEventListener('change', applyFilters);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }

    if (addCustomerBtn) {
        addCustomerBtn.addEventListener('click', openAddCustomerModal);
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
        const countryValue = countryFilter ? countryFilter.value : '';
        const statusValue = statusFilter ? statusFilter.value : '';

        filteredCustomers = customersData.filter(customer => {
            const matchesSearch = customer.name.toLowerCase().includes(searchTerm) ||
                customer.email.toLowerCase().includes(searchTerm) ||
                customer.company.toLowerCase().includes(searchTerm);

            const countryMatches = countryValue === 'All Countries' || !countryValue || customer.country === countryValue;
            const statusMatches = statusFilterValueMatches(statusValue, customer.status);

            return matchesSearch && countryMatches && statusMatches;
        });

        currentPage = 1;
        renderTable();
        renderPagination();
    }

    function statusFilterValueMatches(filterValue, customerStatus) {
        if (filterValue === 'All Status' || !filterValue) return true;
        return customerStatus === filterValue;
    }

    // Render table
    function renderTable() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageCustomers = filteredCustomers.slice(start, end);

        tableBody.innerHTML = pageCustomers.map(customer => `
            <tr data-id="${customer.id}">
                <td>
                    <div class="client-info">
                        <div class="client-avatar">${customer.initials}</div>
                        <div>
                            <div class="client-name">${customer.name}</div>
                            <div class="client-category">${customer.email}</div>
                        </div>
                    </div>
                </td>
                <td>${customer.company}</td>
                <td>${customer.flag} ${customer.country}</td>
                <td style="text-align: center; font-weight: 600;">${customer.orders}</td>
                <td style="text-align: right; font-weight: 600;">${customer.totalSpent}</td>
                <td style="text-align: center;">
                    <span class="status-badge ${customer.status.toLowerCase()}">${customer.status}</span>
                </td>
                <td>
                    <div class="table-actions" style="justify-content: center;">
                        <button class="table-action btn-view" title="View" data-id="${customer.id}"><i data-lucide="eye"></i></button>
                        <button class="table-action btn-edit" title="Edit" data-id="${customer.id}"><i data-lucide="pencil"></i></button>
                        <button class="table-action btn-delete" title="Delete" data-id="${customer.id}"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        attachActionListeners();
    }

    // Render pagination
    function renderPagination() {
        const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, filteredCustomers.length);

        if (paginationInfo) {
            paginationInfo.textContent = `Showing ${filteredCustomers.length > 0 ? start : 0}-${end} of ${filteredCustomers.length} customers`;
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

            paginationContainer.querySelectorAll('.pagination-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const page = this.dataset.page;
                    if (page === 'prev' && currentPage > 1) currentPage--;
                    else if (page === 'next' && currentPage < totalPages) currentPage++;
                    else if (page !== 'prev' && page !== 'next') currentPage = parseInt(page);

                    renderTable();
                    renderPagination();
                    // Scroll container to top
                    document.querySelector('.table-container').scrollTop = 0;
                });
            });

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }

    // Attach action listeners
    function attachActionListeners() {
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const customer = customersData.find(c => c.id === id);
                if (customer) openViewModal(customer);
            });
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const customer = customersData.find(c => c.id === id);
                if (customer) openEditModal(customer);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                openDeleteConfirmModal(id);
            });
        });
    }

    // Modal functions
    function createModals() {

        const modalsHTML = `
            <div class="modal-overlay" id="viewCustomerModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Customer Details</h3>
                        <button class="modal-close" onclick="closeModal('viewCustomerModal')"><i data-lucide="x"></i></button>
                    </div>
                    <div class="modal-body" id="viewCustomerBody"></div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="closeModal('viewCustomerModal')">Close</button>
                    </div>
                </div>
            </div>

            <div class="modal-overlay" id="editCustomerModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">Edit Customer</h3>
                        <button class="modal-close" onclick="closeModal('editCustomerModal')"><i data-lucide="x"></i></button>
                    </div>
                    <div class="modal-body">
                        <form id="customerForm">
                            <input type="hidden" id="customerId">
                            <div class="form-group">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-input" id="custName" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-input" id="custEmail" required>
                            </div>
                            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                                <div class="form-group">
                                    <label class="form-label">Company</label>
                                    <input type="text" class="form-input" id="custCompany" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Country</label>
                                    <input type="text" class="form-input" id="custCountry" required>
                                </div>
                            </div>
                            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                                <div class="form-group">
                                    <label class="form-label">Status</label>
                                    <select class="form-input" id="custStatus">
                                        <option>Active</option>
                                        <option>Inactive</option>
                                        <option>Pending</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Phone</label>
                                    <input type="text" class="form-input" id="custPhone">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="closeModal('editCustomerModal')">Cancel</button>
                        <button class="btn btn-primary" id="saveCustBtn">Save</button>
                    </div>
                </div>
            </div>

            <div class="modal-overlay" id="deleteCustModal">
                <div class="modal-content" style="max-width:400px;">
                    <div class="modal-header"><h3>Confirm Delete</h3></div>
                    <div class="modal-body" style="text-align:center;">
                        <p>Are you sure you want to delete this customer?</p>
                        <input type="hidden" id="deleteCustId">
                    </div>
                    <div class="modal-footer" style="justify-content:center;">
                        <button class="btn btn-outline" onclick="closeModal('deleteCustModal')">Cancel</button>
                        <button class="btn btn-danger" id="confirmDeleteCustBtn">Delete</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalsHTML);

        document.getElementById('saveCustBtn').addEventListener('click', saveCustomer);
        document.getElementById('confirmDeleteCustBtn').addEventListener('click', deleteCustomer);
    }

    function openViewModal(customer) {
        const body = document.getElementById('viewCustomerBody');
        body.innerHTML = `
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
                <div style="width:64px; height:64px; background:var(--color-primary-500); border-radius:full; display:flex; align-items:center; justify-content:center; color:white; font-size:24px; font-weight:600;">${customer.initials}</div>
                <div>
                    <h4 style="margin:0;">${customer.name}</h4>
                    <p style="margin:4px 0 0; color:var(--color-gray-500);">${customer.email}</p>
                </div>
            </div>
            <div class="detail-row"><span class="detail-label">Company</span><span>${customer.company}</span></div>
            <div class="detail-row"><span class="detail-label">Country</span><span>${customer.flag} ${customer.country}</span></div>
            <div class="detail-row"><span class="detail-label">Orders</span><span>${customer.orders}</span></div>
            <div class="detail-row"><span class="detail-label">Total Spent</span><span>${customer.totalSpent}</span></div>
            <div class="detail-row"><span class="detail-label">Status</span><span class="status-badge ${customer.status.toLowerCase()}">${customer.status}</span></div>
            <div class="detail-row"><span class="detail-label">Phone</span><span>${customer.phone}</span></div>
        `;
        document.getElementById('viewCustomerModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function openEditModal(customer) {
        document.getElementById('modalTitle').textContent = 'Edit Customer';
        document.getElementById('customerId').value = customer.id;
        document.getElementById('custName').value = customer.name;
        document.getElementById('custEmail').value = customer.email;
        document.getElementById('custCompany').value = customer.company;
        document.getElementById('custCountry').value = customer.country;
        document.getElementById('custStatus').value = customer.status;
        document.getElementById('custPhone').value = customer.phone;
        const modal = document.getElementById('editCustomerModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function openAddCustomerModal() {
        document.getElementById('modalTitle').textContent = 'Add New Customer';
        document.getElementById('customerForm').reset();
        document.getElementById('customerId').value = '';
        const modal = document.getElementById('editCustomerModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function openDeleteConfirmModal(id) {
        document.getElementById('deleteCustId').value = id;
        document.getElementById('deleteCustModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function saveCustomer() {
        const id = document.getElementById('customerId').value;
        const name = document.getElementById('custName').value;
        const email = document.getElementById('custEmail').value;
        const company = document.getElementById('custCompany').value;
        const country = document.getElementById('custCountry').value;
        const status = document.getElementById('custStatus').value;
        const phone = document.getElementById('custPhone').value;

        if (!name || !email) { alert('Name and Email are required'); return; }

        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        if (id) {
            const index = customersData.findIndex(c => c.id === parseInt(id));
            if (index !== -1) {
                customersData[index] = { ...customersData[index], name, initials, email, company, country, status, phone };
            }
        } else {
            const newCust = {
                id: Date.now(), name, initials, email, company, country, status, phone,
                flag: '🌍', orders: 0, totalSpent: '$0'
            };
            customersData.unshift(newCust);
        }

        closeModal('editCustomerModal');
        applyFilters();
    }

    function deleteCustomer() {
        const id = parseInt(document.getElementById('deleteCustId').value);
        const index = customersData.findIndex(c => c.id === id);
        if (index !== -1) customersData.splice(index, 1);
        closeModal('deleteCustModal');
        applyFilters();
    }

    window.closeModal = function (id) {
        document.getElementById(id).classList.remove('show');
        document.body.style.overflow = '';
    };

    // Initial load
    renderTable();
    renderPagination();
});
