/**
 * Uplokal - Header Component
 * Modular navbar component for all public pages
 */

class UplokalHeader {
    constructor(options = {}) {
        this.activePage = options.activePage || '';
        this.scrolled = options.scrolled || false;
    }

    getNavLinks() {
        return [
            { href: 'directory.html', text: 'Direktori', key: 'directory' },
            { href: 'about.html', text: 'Tentang', key: 'about' },
            { href: 'contact.html', text: 'Kontak', key: 'contact' }
        ];
    }

    render() {
        const navLinks = this.getNavLinks()
            .map(link => `<li><a href="${link.href}" class="nav-link${this.activePage === link.key ? ' active' : ''}">${link.text}</a></li>`)
            .join('\n                ');

        return `
    <!-- Navigation -->
    <nav class="navbar${this.scrolled ? ' scrolled' : ''}" id="navbar">
        <div class="container navbar-container">
            <a href="index.html" class="navbar-brand">
                <div class="logo">
                    <img src="assets/logo.jpg" alt="Uplokal" class="logo-image">
                </div>
            </a>

            <ul class="navbar-menu" id="navMenu">
                ${navLinks}
            </ul>

            <div class="navbar-actions">
                <button class="btn-lang" id="langToggle" title="Switch Language">
                    <span>ID</span> / <span class="lang-inactive">EN</span>
                </button>
                <a href="login.html" class="btn btn-ghost">Masuk</a>
                <a href="register.html" class="btn btn-primary">Daftar</a>
            </div>

            <button class="navbar-toggle" id="navToggle" aria-label="Toggle menu">
                <i data-lucide="menu"></i>
            </button>
        </div>
    </nav>`;
    }

    getMobileNav() {
        const mobileLinks = [
            { href: 'index.html', icon: 'home', text: 'Beranda', key: 'home' },
            { href: 'directory.html', icon: 'search', text: 'Direktori', key: 'directory' },
            { href: 'register.html', icon: 'plus-circle', text: 'Daftar', key: 'register', highlight: true },
            { href: 'login.html', icon: 'user', text: 'Masuk', key: 'login' }
        ];

        const links = mobileLinks.map(link => {
            let classes = 'mobile-nav-item';
            if (this.activePage === link.key) classes += ' active';
            if (link.highlight) classes += ' highlight';

            return `<a href="${link.href}" class="${classes}">
            <i data-lucide="${link.icon}"></i>
            <span>${link.text}</span>
        </a>`;
        }).join('\n        ');

        return `
    <!-- Mobile Navigation -->
    <nav class="mobile-nav" id="mobileNav">
        ${links}
    </nav>`;
    }
}

// Function to inject header into page
function injectHeader(containerId = 'header-container', options = {}) {
    const container = document.getElementById(containerId);
    if (container) {
        const header = new UplokalHeader(options);
        container.innerHTML = header.render();
    }
}

// Function to inject mobile nav into page
function injectMobileNav(containerId = 'mobile-nav-container', options = {}) {
    const container = document.getElementById(containerId);
    if (container) {
        const header = new UplokalHeader(options);
        container.innerHTML = header.getMobileNav();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UplokalHeader, injectHeader, injectMobileNav };
}
