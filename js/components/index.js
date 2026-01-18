/**
 * Uplokal - Components Loader
 * Main entry point for loading modular components
 */

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Get page configuration from data attributes
    const pageConfig = document.body.dataset;
    const activePage = pageConfig.activePage || '';
    const hasScrolledNav = pageConfig.scrolledNav === 'true';

    // Inject header if container exists
    if (document.getElementById('header-container')) {
        injectHeader('header-container', {
            activePage: activePage,
            scrolled: hasScrolledNav
        });
    }

    // Inject footer if container exists
    if (document.getElementById('footer-container')) {
        injectFooter('footer-container', {
            year: 2026
        });
    }

    // Inject mobile nav if container exists
    if (document.getElementById('mobile-nav-container')) {
        injectMobileNav('mobile-nav-container', {
            activePage: activePage
        });
    }

    // Re-initialize Lucide icons after components are injected
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
