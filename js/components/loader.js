/**
 * Uplokal - Component Loader
 * Loads modular HTML components (header, footer, mobile-nav)
 */

(function () {
    'use strict';

    // Component paths
    const COMPONENTS = {
        header: 'components/header.html',
        footer: 'components/footer.html',
        mobileNav: 'components/mobile-nav.html'
    };

    /**
     * Load HTML component from file
     * @param {string} url - Path to the HTML file
     * @returns {Promise<string>} - HTML content
     */
    async function loadComponent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error loading component: ${error.message}`);
            return '';
        }
    }

    /**
     * Set active navigation link based on current page
     * @param {Element} container - Container with nav links
     * @param {string} activePage - Current page identifier
     */
    function setActiveNavLink(container, activePage) {
        if (!container || !activePage) return;

        // Set active link in navbar
        container.querySelectorAll('[data-page]').forEach(link => {
            if (link.dataset.page === activePage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Apply scrolled state to navbar if needed
     * @param {Element} navbar - Navbar element
     * @param {boolean} isScrolled - Whether navbar should have scrolled state
     */
    function applyScrolledState(navbar, isScrolled) {
        if (navbar && isScrolled) {
            navbar.classList.add('scrolled');
        }
    }

    /**
     * Initialize all components
     */
    async function initComponents() {
        const body = document.body;
        const activePage = body.dataset.activePage || '';
        const isScrolledNav = body.dataset.scrolledNav === 'true';

        // Load header
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            const headerHtml = await loadComponent(COMPONENTS.header);
            headerContainer.innerHTML = headerHtml;
            setActiveNavLink(headerContainer, activePage);

            const navbar = headerContainer.querySelector('.navbar');
            applyScrolledState(navbar, isScrolledNav);
        }

        // Load footer
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            const footerHtml = await loadComponent(COMPONENTS.footer);
            footerContainer.innerHTML = footerHtml;
        }

        // Load mobile nav
        const mobileNavContainer = document.getElementById('mobile-nav-container');
        if (mobileNavContainer) {
            const mobileNavHtml = await loadComponent(COMPONENTS.mobileNav);
            mobileNavContainer.innerHTML = mobileNavHtml;
            setActiveNavLink(mobileNavContainer, activePage);
        }

        // Re-initialize Lucide icons after components are loaded
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComponents);
    } else {
        initComponents();
    }
})();
