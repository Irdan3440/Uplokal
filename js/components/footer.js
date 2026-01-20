/**
 * Uplokal - Footer Component
 * Modular footer component for all public pages
 */

class UplokalFooter {
    constructor(options = {}) {
        this.year = options.year || new Date().getFullYear();
    }

    getServiceLinks() {
        return [
            { href: '#', text: 'Business Diagnostic' },
            { href: '#', text: 'Tax & Finance' },
            { href: '#', text: 'Digital Marketing' },
            { href: '#', text: 'Export Readiness' }
        ];
    }

    getCompanyLinks() {
        return [
            { href: 'about.html', text: 'Tentang Kami' },
            { href: '#', text: 'Karir' },
            { href: '#', text: 'Blog' },
            { href: 'contact.html', text: 'Kontak' }
        ];
    }

    getLegalLinks() {
        return [
            { href: '#', text: 'Syarat & Ketentuan' },
            { href: '#', text: 'Kebijakan Privasi' },
            { href: '#', text: 'FAQ' }
        ];
    }

    getSocialLinks() {
        return [
            { href: '#', icon: 'instagram', label: 'Instagram' },
            { href: '#', icon: 'linkedin', label: 'LinkedIn' },
            { href: '#', icon: 'twitter', label: 'Twitter' },
            { href: '#', icon: 'youtube', label: 'YouTube' }
        ];
    }

    getContactInfo() {
        return [
            { icon: 'mail', text: 'hello@uplokal.com' },
            { icon: 'phone', text: '+62 21 1234 5678' },
            { icon: 'map-pin', text: 'Jakarta, Indonesia' }
        ];
    }

    renderLinkList(links) {
        return links.map(link => `<li><a href="${link.href}">${link.text}</a></li>`).join('\n                        ');
    }

    renderSocialLinks() {
        return this.getSocialLinks()
            .map(link => `<a href="${link.href}" aria-label="${link.label}"><i data-lucide="${link.icon}"></i></a>`)
            .join('\n                        ');
    }

    renderContactList() {
        return this.getContactInfo()
            .map(item => `<li><i data-lucide="${item.icon}"></i> ${item.text}</li>`)
            .join('\n                        ');
    }

    render() {
        return `
    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <img src="assets/logo.jpg" alt="Uplokal" class="logo-image">
                    </div>
                    <p>Jembatan UMKM Indonesia ke pasar global. Dari konsultasi bisnis hingga digital marketing dalam satu platform.</p>
                    <div class="footer-social-section">
                        <h4>Ikuti Kami</h4>
                        <div class="social-links">
                            ${this.renderSocialLinks()}
                        </div>
                    </div>
                </div>
                <div class="footer-links">
                    <h4>Layanan</h4>
                    <ul>
                        ${this.renderLinkList(this.getServiceLinks())}
                    </ul>
                </div>
                <div class="footer-links">
                    <h4>Perusahaan</h4>
                    <ul>
                        ${this.renderLinkList(this.getCompanyLinks())}
                    </ul>
                </div>
                <div class="footer-links">
                    <h4>Legal</h4>
                    <ul>
                        ${this.renderLinkList(this.getLegalLinks())}
                    </ul>
                </div>
                <div class="footer-contact">
                    <h4>Kontak</h4>
                    <ul>
                        ${this.renderContactList()}
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${this.year} Uplokal. All rights reserved.</p>
                <p>Made with ❤️ for Indonesian SMEs</p>
            </div>
        </div>
    </footer>`;
    }
}

// Function to inject footer into page
function injectFooter(containerId = 'footer-container', options = {}) {
    const container = document.getElementById(containerId);
    if (container) {
        const footer = new UplokalFooter(options);
        container.innerHTML = footer.render();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UplokalFooter, injectFooter };
}
