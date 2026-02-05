/**
 * @license
 * Uplokal - From Local Up To Global
 * Copyright (c) 2026 Uplokal Team. All rights reserved.
 * 
 * Uplokal - Dashboard Common JavaScript
 * Shared functionality for all dashboard pages
 * =========================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize Dashboard Sidebar
    initDashboardSidebar();

    // Initialize Global Animations
    initGlobalAnimations();

    // Initialize Keyboard Shortcuts
    initKeyboardShortcuts();

    // Initialize Mobile Bottom Nav
    initMobileBottomNav();

    // Initialize Search Functionality
    initGlobalSearch();
});

/**
 * Handles the sidebar toggle for mobile views
 */
function initDashboardSidebar() {
    if (window.sidebarInitialized) return;

    const sidebar = document.querySelector('.dashboard-sidebar');
    if (!sidebar) return;

    // Ensure backdrop exists
    let backdrop = document.querySelector('.sidebar-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        backdrop.id = 'sidebarBackdrop';
        document.body.appendChild(backdrop);
    }

    const toggleSidebar = (show) => {
        sidebar.classList.toggle('open', show);
        backdrop.classList.toggle('show', show);
        document.body.style.overflow = show ? 'hidden' : '';
    };

    // Use event delegation for the toggle button
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.sidebar-toggle');
        if (toggleBtn) {
            e.preventDefault();
            const isOpen = sidebar.classList.contains('open');
            toggleSidebar(!isOpen);
        }

        // Close when clicking backdrop
        if (e.target.classList.contains('sidebar-backdrop')) {
            toggleSidebar(false);
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            toggleSidebar(false);
        }
    });

    window.sidebarInitialized = true;
}

/**
 * Common micro-animations for interactive elements
 */
function initGlobalAnimations() {
    const cards = document.querySelectorAll('.settings-card, .help-card, .stat-card, .profile-card, .account-card, .conversation-item, .category-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = 'var(--shadow-xl)';
            card.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        });
    });
}

/**
 * Common keyboard shortcuts across all pages
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        // Escape key - close modals, sidebars
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show, .modal.active');
            modals.forEach(modal => modal.classList.remove('show', 'active'));
        }

        // Ctrl+S - Trigger save button
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const saveBtn = document.querySelector('#saveSettingsBtn, #saveAccountBtn, .btn-save');
            if (saveBtn) saveBtn.click();
        }

        // Ctrl+K - Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input, .help-search input, input[type="search"]');
            if (searchInput) searchInput.focus();
        }
    });
}

/**
 * Mobile bottom navigation active state handler
 */
function initMobileBottomNav() {
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

    mobileNavItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Global search functionality
 */
function initGlobalSearch() {
    const searchInputs = document.querySelectorAll('.search-input, .help-search input');

    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(function () {
            const query = this.value.trim().toLowerCase();
            if (query.length >= 2) {
                // Emit custom event for page-specific handling
                document.dispatchEvent(new CustomEvent('globalSearch', { detail: { query } }));
            }
        }, 300));
    });
}

/**
 * Debounce utility function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Global notification system (toast)
 * @param {string} message - The message to display
 * @param {string} type - Type: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
function showNotification(message, type = 'success', duration = 4000) {
    // Remove any existing notification
    const existingNotif = document.querySelector('.toast-notification');
    if (existingNotif) existingNotif.remove();

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 9999;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        animation: slideInUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border-left: 4px solid var(--color-${type === 'success' ? 'primary' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'primary'}-500, #3b82f6);
    `;

    // Icon based on type
    const icons = {
        success: 'check-circle',
        error: 'alert-circle',
        info: 'info',
        warning: 'alert-triangle'
    };

    const iconColors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };

    toast.innerHTML = `
        <i data-lucide="${icons[type] || 'info'}" style="color: ${iconColors[type] || iconColors.info}; width: 20px; height: 20px; flex-shrink: 0;"></i>
        <span style="font-weight: 500; font-size: 0.875rem; color: #334155;">${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; padding: 4px; margin-left: auto;">
            <i data-lucide="x" style="width: 16px; height: 16px; color: #94a3b8;"></i>
        </button>
    `;

    document.body.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Add slide-in animation style if not present
    if (!document.getElementById('toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideOutDown {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(20px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Auto-dismiss
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

/**
 * Set button loading state
 * @param {HTMLElement} button - The button element
 * @param {boolean} loading - Whether to show loading state
 * @param {string} originalHtml - Original button HTML (required when loading=false)
 */
function setButtonLoading(button, loading, originalHtml) {
    if (!button) return;

    if (loading) {
        button._originalHtml = button.innerHTML;
        button.disabled = true;
        button.classList.add('loading');
        button.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> <span>Memproses...</span>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        button.innerHTML = originalHtml || button._originalHtml || button.innerHTML;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

/**
 * Validate form fields
 * @param {HTMLFormElement|HTMLElement} container - Form or container element
 * @returns {boolean} - Whether all required fields are valid
 */
function validateForm(container) {
    const requiredFields = container.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        const value = field.value.trim();
        const fieldContainer = field.closest('.form-group') || field.parentElement;

        // Remove previous error state
        field.classList.remove('error');
        const existingError = fieldContainer.querySelector('.error-message');
        if (existingError) existingError.remove();

        if (!value) {
            isValid = false;
            field.classList.add('error');

            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = 'color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: block;';
            errorMsg.textContent = 'Field ini wajib diisi';
            fieldContainer.appendChild(errorMsg);
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                field.classList.add('error');

                const errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.style.cssText = 'color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: block;';
                errorMsg.textContent = 'Format email tidak valid';
                fieldContainer.appendChild(errorMsg);
            }
        }
    });

    return isValid;
}

/**
 * Format number with thousand separators
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format date to Indonesian format
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Berhasil disalin!', 'success');
    } catch (err) {
        showNotification('Gagal menyalin teks', 'error');
    }
}

// Export functions globally
window.showNotification = showNotification;
window.setButtonLoading = setButtonLoading;
window.validateForm = validateForm;
window.formatNumber = formatNumber;
window.formatDate = formatDate;
window.copyToClipboard = copyToClipboard;
window.debounce = debounce;

/* ===========================================
   Phase 7: Enhanced UX Features
   =========================================== */



/**
 * Animated counter - animates a number from start to end
 * @param {HTMLElement} element - The element to update
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Animation duration in ms
 * @param {string} prefix - Prefix string (e.g., 'Rp ')
 * @param {string} suffix - Suffix string (e.g., '%')
 */
function animateCounter(element, start, end, duration = 1000, prefix = '', suffix = '') {
    if (!element) return;

    const startTime = performance.now();
    const diff = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out-cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(start + diff * easeProgress);

        element.textContent = prefix + formatNumber(currentValue) + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * Simulate real-time data updates
 * @param {string} selector - CSS selector for elements to update
 * @param {function} updateFn - Function that returns new value
 * @param {number} interval - Update interval in ms
 * @returns {number} Interval ID for cleanup
 */
function simulateRealTimeData(selector, updateFn, interval = 5000) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return null;

    return setInterval(() => {
        elements.forEach(el => {
            const currentValue = parseInt(el.textContent.replace(/[^\d]/g, '')) || 0;
            const newValue = updateFn(currentValue);
            animateCounter(el, currentValue, newValue, 500);
        });
    }, interval);
}

/**
 * Create skeleton loader placeholder
 * @param {string} type - Type of skeleton: 'text', 'circle', 'card', 'image'
 * @param {object} options - Size options { width, height }
 * @returns {HTMLElement} Skeleton element
 */
function createSkeleton(type = 'text', options = {}) {
    const skeleton = document.createElement('div');
    skeleton.className = `skeleton skeleton-${type}`;

    const styles = {
        text: { width: options.width || '100%', height: options.height || '1rem' },
        circle: { width: options.width || '48px', height: options.height || '48px', borderRadius: '50%' },
        card: { width: options.width || '100%', height: options.height || '120px' },
        image: { width: options.width || '100%', height: options.height || '200px' }
    };

    Object.assign(skeleton.style, {
        background: 'linear-gradient(90deg, var(--color-gray-200) 25%, var(--color-gray-100) 50%, var(--color-gray-200) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.5s infinite',
        borderRadius: type === 'circle' ? '50%' : 'var(--radius-lg)',
        ...styles[type]
    });

    return skeleton;
}

/**
 * Show skeleton loading state for an element
 * @param {HTMLElement} element - Element to show skeleton in
 * @param {boolean} loading - Whether to show loading state
 */
function setSkeletonLoading(element, loading) {
    if (!element) return;

    if (loading) {
        element._originalContent = element.innerHTML;
        element.innerHTML = '';
        element.appendChild(createSkeleton('card', { height: element.offsetHeight + 'px' }));
    } else if (element._originalContent) {
        element.innerHTML = element._originalContent;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

// Add skeleton animation styles
if (!document.getElementById('skeleton-styles')) {
    const style = document.createElement('style');
    style.id = 'skeleton-styles';
    style.textContent = `
        @keyframes skeleton-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        .skeleton {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// Export Phase 7 functions globally
window.animateCounter = animateCounter;
window.simulateRealTimeData = simulateRealTimeData;
window.createSkeleton = createSkeleton;
window.setSkeletonLoading = setSkeletonLoading;
