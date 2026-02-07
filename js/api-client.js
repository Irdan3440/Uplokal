/**
 * @license
 * Uplokal - From Local Up To Global
 * Copyright (c) 2026 Uplokal Team. All rights reserved.
 * 
 * Uplokal - API Client Module
 * ===========================================================
 * Frontend JavaScript module for communicating with the FastAPI backend.
 * Uses HttpOnly cookies for JWT token management (XSS-safe).
 */

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000/api'
    : '/api';

/**
 * Uplokal API Client
 * Handles all backend communication with proper error handling.
 */
const api = {
    // =========================================================================
    // HTTP Methods
    // =========================================================================

    /**
     * Make a GET request
     * @param {string} endpoint - API endpoint (e.g., '/auth/me')
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Response data
     */
    async get(endpoint, params = {}) {
        const url = new URL(`${API_BASE}${endpoint}`, window.location.origin);
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });

        const response = await fetch(url.toString(), {
            method: 'GET',
            credentials: 'include', // Include HttpOnly cookies
            headers: {
                'Accept': 'application/json'
            }
        });

        return this._handleResponse(response);
    },

    /**
     * Make a POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body
     * @returns {Promise<Object>} Response data
     */
    async post(endpoint, data = {}) {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return this._handleResponse(response);
    },

    /**
     * Make a PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body
     * @returns {Promise<Object>} Response data
     */
    async put(endpoint, data = {}) {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return this._handleResponse(response);
    },

    /**
     * Make a PATCH request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body
     * @returns {Promise<Object>} Response data
     */
    async patch(endpoint, data = {}) {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return this._handleResponse(response);
    },

    /**
     * Make a DELETE request
     * @param {string} endpoint - API endpoint
     * @returns {Promise<Object>} Response data
     */
    async delete(endpoint) {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });

        return this._handleResponse(response);
    },

    /**
     * Upload a file (multipart/form-data)
     * @param {string} endpoint - API endpoint
     * @param {FormData} formData - Form data with file
     * @returns {Promise<Object>} Response data
     */
    async upload(endpoint, formData) {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            // Don't set Content-Type - browser will set it with boundary
            body: formData
        });

        return this._handleResponse(response);
    },

    /**
     * Handle API response
     * @private
     */
    async _handleResponse(response) {
        const contentType = response.headers.get('content-type');

        // Handle file downloads
        if (contentType && contentType.includes('application/octet-stream')) {
            return response.blob();
        }

        // Parse JSON response
        let data;
        try {
            data = await response.json();
        } catch (e) {
            data = null;
        }

        if (!response.ok) {
            const error = new Error(data?.detail || 'Request failed');
            error.status = response.status;
            error.data = data;

            // Handle authentication errors
            if (response.status === 401) {
                this._handleAuthError();
            }

            throw error;
        }

        return data;
    },

    /**
     * Handle authentication errors (redirect to login)
     * @private
     */
    _handleAuthError() {
        // Store current page for redirect after login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        // Redirect to login
        window.location.href = '/login.html';
    },

    // =========================================================================
    // Authentication
    // =========================================================================

    auth: {
        /**
         * Register a new user
         * @param {Object} userData - { email, password, full_name, phone? }
         */
        async register(userData) {
            return api.post('/auth/register', userData);
        },

        /**
         * Login user (sets HttpOnly cookie)
         * @param {string} email 
         * @param {string} password 
         */
        async login(email, password) {
            return api.post('/auth/login', { email, password });
        },

        /**
         * Admin login
         * @param {string} email 
         * @param {string} password 
         */
        async adminLogin(email, password) {
            return api.post('/auth/admin-login', { email, password });
        },

        /**
         * Logout user (clears cookies)
         */
        async logout() {
            return api.post('/auth/logout');
        },

        /**
         * Get current user profile
         */
        async me() {
            return api.get('/auth/me');
        },

        /**
         * Check if user is authenticated
         * @returns {Promise<boolean>}
         */
        async isAuthenticated() {
            try {
                await this.me();
                return true;
            } catch (e) {
                return false;
            }
        }
    },

    // =========================================================================
    // Business Profile
    // =========================================================================

    business: {
        /**
         * Create business profile
         * @param {Object} data - Business data
         */
        async create(data) {
            return api.post('/business', data);
        },

        /**
         * Get current user's business
         */
        async getMy() {
            return api.get('/business/me');
        },

        /**
         * Update current user's business
         * @param {Object} data - Updated fields
         */
        async update(data) {
            return api.put('/business/me', data);
        },

        /**
         * Get public business directory
         * @param {Object} filters - { category?, province?, search?, export_ready?, limit?, offset? }
         */
        async directory(filters = {}) {
            return api.get('/business/directory', filters);
        },

        /**
         * Get business by ID (hash)
         * @param {string} businessHash - Obfuscated business ID
         */
        async getById(businessHash) {
            return api.get(`/business/${businessHash}`);
        }
    },

    // =========================================================================
    // Diagnostic (AI-Powered Business Analysis)
    // =========================================================================

    diagnostic: {
        /**
         * Submit diagnostic questionnaire
         * @param {Object} answers - Questionnaire answers
         */
        async submit(answers) {
            return api.post('/diagnostic/submit', { answers });
        },

        /**
         * Get latest diagnostic result
         */
        async getResult() {
            return api.get('/diagnostic/result');
        }
    },

    // =========================================================================
    // Document Vault
    // =========================================================================

    documents: {
        /**
         * Upload a document
         * @param {File} file - File to upload
         * @param {string} category - Document category
         * @param {string} description - Optional description
         */
        async upload(file, category = 'other', description = '') {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', category);
            formData.append('description', description);

            return api.upload('/documents/upload', formData);
        },

        /**
         * List user's documents
         * @param {Object} params - { category?, limit?, offset? }
         */
        async list(params = {}) {
            return api.get('/documents', params);
        },

        /**
         * Get signed download URL (valid for 30 minutes)
         * @param {string} documentHash - Obfuscated document ID
         * @returns {Promise<{download_url: string, expires_in_seconds: number}>}
         */
        async getSignedUrl(documentHash) {
            return api.get(`/documents/${documentHash}/signed-url`);
        },

        /**
         * Download document using signed URL
         * @param {string} downloadUrl - Full signed URL from getSignedUrl
         */
        async download(downloadUrl) {
            const response = await fetch(downloadUrl, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Download failed');
            }

            return response.blob();
        },

        /**
         * Delete a document
         * @param {string} documentHash - Obfuscated document ID
         */
        async delete(documentHash) {
            return api.delete(`/documents/${documentHash}`);
        }
    },

    // =========================================================================
    // RFQ & B2B Matchmaking
    // =========================================================================

    rfq: {
        /**
         * Create a new RFQ
         * @param {Object} data - RFQ data
         */
        async create(data) {
            return api.post('/rfq', data);
        },

        /**
         * List open RFQs (public)
         * @param {Object} params - { category?, limit?, offset? }
         */
        async list(params = {}) {
            return api.get('/rfq', params);
        },

        /**
         * List current user's RFQs
         */
        async myRfqs() {
            return api.get('/rfq/my-rfqs');
        },

        /**
         * Get AI-powered B2B matches
         */
        async getMatches() {
            return api.get('/rfq/matches');
        },

        /**
         * Get RFQ suggestions for current business
         */
        async getSuggestions() {
            return api.get('/rfq/suggestions');
        }
    },

    // =========================================================================
    // Messages
    // =========================================================================

    messages: {
        /**
         * Send a message to another business
         * @param {string} recipientId - Obfuscated business ID
         * @param {string} content - Message content
         * @param {string} subject - Optional subject
         */
        async send(recipientId, content, subject = null) {
            return api.post('/messages/send', {
                recipient_id: recipientId,
                content,
                subject
            });
        },

        /**
         * List conversations
         */
        async conversations() {
            return api.get('/messages/conversations');
        },

        /**
         * Get messages in a conversation
         * @param {string} conversationHash - Obfuscated conversation ID
         * @param {number} limit - Max messages to return
         */
        async getConversation(conversationHash, limit = 50) {
            return api.get(`/messages/${conversationHash}`, { limit });
        }
    },

    // =========================================================================
    // Admin (Requires admin role)
    // =========================================================================

    admin: {
        /**
         * Get admin dashboard stats
         */
        async stats() {
            return api.get('/admin/stats');
        },

        /**
         * List all users
         * @param {Object} params - { role?, is_active?, limit?, offset? }
         */
        async users(params = {}) {
            return api.get('/admin/users', params);
        },

        /**
         * Deactivate a user
         * @param {string} userHash - Obfuscated user ID
         */
        async deactivateUser(userHash) {
            return api.patch(`/admin/users/${userHash}/deactivate`);
        },

        /**
         * Verify or unverify a business
         * @param {string} businessHash - Obfuscated business ID
         * @param {boolean} verified - Verification status
         */
        async verifyBusiness(businessHash, verified) {
            return api.patch(`/admin/businesses/${businessHash}/verify`, { verified });
        },

        /**
         * Promote user to admin (super_admin only)
         * @param {string} userHash - Obfuscated user ID
         */
        async promoteUser(userHash) {
            return api.post(`/admin/users/${userHash}/promote`);
        },

        /**
         * Get system logs (super_admin only)
         * @param {number} limit - Max logs to return
         */
        async logs(limit = 100) {
            return api.get('/admin/logs', { limit });
        }
    },

    // =========================================================================
    // Subscription
    // =========================================================================

    subscription: {
        /**
         * Get all available subscription plans
         * @returns {Promise<Array>} List of plans
         */
        async getPlans() {
            return api.get('/subscription/plans');
        },

        /**
         * Get current user's subscription
         * @returns {Promise<Object|null>} Subscription details or null
         */
        async getMy() {
            return api.get('/subscription/my-subscription');
        },

        /**
         * Subscribe to a plan (initiates Midtrans payment)
         * @param {string} planTier - "free", "starter", "pro", "enterprise"
         * @param {string} billingCycle - "monthly" or "yearly"
         * @returns {Promise<Object>} Snap token and redirect URL
         */
        async subscribe(planTier, billingCycle = 'monthly') {
            return api.post('/subscription/subscribe', {
                plan_tier: planTier,
                billing_cycle: billingCycle
            });
        },

        /**
         * Cancel current subscription
         */
        async cancel() {
            return api.post('/subscription/cancel');
        }
    },

    // =========================================================================
    // Payment
    // =========================================================================

    payment: {
        /**
         * Get Midtrans configuration for Snap popup
         */
        async getConfig() {
            return api.get('/payment/config');
        },

        /**
         * Get payment history
         */
        async history() {
            return api.get('/payment/history');
        },

        /**
         * Open Midtrans Snap popup for payment
         * @param {string} snapToken - Token from subscribe endpoint
         * @returns {Promise<Object>} Payment result
         */
        async openSnapPopup(snapToken) {
            return new Promise((resolve, reject) => {
                if (typeof window.snap === 'undefined') {
                    reject(new Error('Midtrans Snap not loaded'));
                    return;
                }

                window.snap.pay(snapToken, {
                    onSuccess: (result) => resolve({ status: 'success', ...result }),
                    onPending: (result) => resolve({ status: 'pending', ...result }),
                    onError: (result) => reject({ status: 'error', ...result }),
                    onClose: () => resolve({ status: 'closed' })
                });
            });
        },

        /**
         * Load Midtrans Snap library
         * @param {boolean} isProduction - Use production or sandbox
         */
        loadSnapLibrary(isProduction = false) {
            return new Promise((resolve, reject) => {
                if (window.snap) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = isProduction
                    ? 'https://app.midtrans.com/snap/snap.js'
                    : 'https://app.sandbox.midtrans.com/snap/snap.js';
                script.setAttribute('data-client-key', ''); // Will be set by config
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
    }
};

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}

// Make available globally
window.UplokalAPI = api;
