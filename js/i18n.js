/* ===========================================
   Uplokal - Multi-language Support
   =========================================== */

// Language translations
const translations = {
    id: {
        // Navigation
        'nav.directory': 'Direktori',
        'nav.about': 'Tentang',
        'nav.contact': 'Kontak',
        'nav.login': 'Masuk',
        'nav.register': 'Daftar',

        // Hero Section
        'hero.title.1': 'Jembatan UMKM Indonesia',
        'hero.title.2': 'ke Pasar Global',
        'hero.subtitle': 'Platform one-stop solution yang mengintegrasikan pemasaran, keuangan, dan pajak untuk membawa bisnis lokal Anda dari Indonesia ke dunia internasional.',
        'hero.search.placeholder': 'Cari supplier, produk, atau jasa...',
        'hero.btn.search': 'Cari',
        'hero.btn.consult': 'Konsultasi Gratis',

        // Stats
        'stats.partners': 'Mitra Bisnis',
        'stats.countries': 'Negara Tujuan',
        'stats.transactions': 'Transaksi Difasilitasi',

        // Categories
        'section.categories': 'Jelajahi Kategori',
        'section.categories.subtitle': 'Temukan supplier terpercaya di berbagai industri',
        'category.manufacturing': 'Manufaktur',
        'category.crafts': 'Kerajinan',
        'category.fnb': 'Food & Beverage',
        'category.fashion': 'Fashion & Tekstil',
        'category.agriculture': 'Agrikultur',
        'category.furniture': 'Furniture',

        // Services
        'section.services': 'One-Stop Solution',
        'section.services.subtitle': 'Layanan terintegrasi untuk kesuksesan bisnis Anda',
        'service.diagnostic': 'Business Diagnostic',
        'service.diagnostic.desc': 'Analisis kesehatan bisnis komprehensif dengan rekomendasi actionable untuk pertumbuhan',
        'service.finance': 'Tax & Finance',
        'service.finance.desc': 'Pencatatan keuangan, estimasi pajak, dan konsultasi untuk meningkatkan bankability',
        'service.marketing': 'Digital Marketing',
        'service.marketing.desc': 'Strategi pemasaran digital end-to-end untuk menjangkau pasar domestik dan internasional',
        'service.export': 'Export Readiness',
        'service.export.desc': 'Persiapan dokumen dan sertifikasi untuk memenuhi standar ekspor internasional',

        // Featured Suppliers
        'section.suppliers': 'Supplier Terverifikasi',
        'section.suppliers.subtitle': 'Pilihan mitra bisnis terpercaya',
        'btn.view.all': 'Lihat Semua',
        'btn.view.profile': 'Lihat Profil',
        'label.verified': 'Verified',
        'label.export.ready': 'Export Ready',

        // How It Works
        'section.howitworks': 'Cara Kerja',
        'section.howitworks.subtitle': 'Mulai perjalanan bisnis global Anda dalam 4 langkah',
        'step.1.title': 'Daftar & Diagnosa',
        'step.1.desc': 'Daftarkan bisnis Anda dan dapatkan analisis kesehatan bisnis gratis',
        'step.2.title': 'Konsultasi',
        'step.2.desc': 'Tim ahli kami menyusun strategi sesuai kebutuhan bisnis Anda',
        'step.3.title': 'Eksekusi',
        'step.3.desc': 'Implementasi solusi bersama monitoring dan support berkelanjutan',
        'step.4.title': 'Go Global',
        'step.4.desc': 'Bisnis Anda tampil di marketplace dan siap menjangkau pasar internasional',

        // Testimonials
        'section.testimonials': 'Kata Mereka',
        'section.testimonials.subtitle': 'Pengalaman mitra bisnis yang sudah bergabung',

        // CTA
        'cta.title': 'Siap Mengembangkan Bisnis Anda?',
        'cta.subtitle': 'Bergabung dengan 500+ mitra bisnis yang sudah berkembang bersama Uplokal',
        'cta.btn.register': 'Daftar Sekarang',
        'cta.btn.contact': 'Hubungi Kami',

        // Footer
        'footer.tagline': 'Jembatan UMKM Indonesia ke pasar global.',
        'footer.services': 'Layanan',
        'footer.company': 'Perusahaan',
        'footer.contact': 'Kontak',
        'footer.aboutus': 'Tentang Kami',
        'footer.careers': 'Karir',
        'footer.copyright': '© 2026 Uplokal. All rights reserved.',

        // Directory
        'directory.title': 'Direktori Supplier Terverifikasi',
        'directory.subtitle': 'Temukan 500+ mitra bisnis lokal yang siap melayani kebutuhan Anda',
        'directory.search.placeholder': 'Cari supplier, produk, atau jasa...',
        'directory.filter': 'Filter',
        'directory.category': 'Kategori',
        'directory.location': 'Lokasi',
        'directory.certification': 'Sertifikasi',
        'directory.capacity': 'Kapasitas Produksi',
        'directory.showing': 'Menampilkan',
        'directory.suppliers': 'supplier terverifikasi',
        'directory.sort.relevance': 'Relevansi',
        'directory.sort.rating': 'Rating Tertinggi',
        'directory.sort.newest': 'Terbaru',
        'directory.sort.name': 'Nama A-Z',

        // Auth
        'auth.login': 'Masuk ke Akun',
        'auth.register': 'Daftar',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.remember': 'Ingat saya',
        'auth.forgot': 'Lupa password?',
        'auth.noaccount': 'Belum punya akun?',
        'auth.hasaccount': 'Sudah punya akun?',
        'auth.signup.free': 'Daftar gratis',
        'auth.signin.here': 'Masuk di sini',
        'auth.terms': 'Dengan masuk, Anda menyetujui',
        'auth.terms.link': 'Syarat & Ketentuan',
        'auth.privacy.link': 'Kebijakan Privasi',

        // Dashboard
        'dashboard.welcome': 'Selamat Pagi',
        'dashboard.summary': 'Berikut adalah ringkasan performa bisnis Anda',
        'dashboard.views': 'Profile Views Bulan Ini',
        'dashboard.inquiries': 'Inquiry Baru',
        'dashboard.growth': 'Pertumbuhan Bulan Ini',
        'dashboard.rating': 'Rating Rata-rata',
        'dashboard.health': 'Business Health Score',
        'dashboard.activity': 'Aktivitas Terbaru',
        'dashboard.quick': 'Aksi Cepat',
        'dashboard.recommendations': 'Rekomendasi',

        // Common
        'btn.submit': 'Kirim',
        'btn.cancel': 'Batal',
        'btn.save': 'Simpan',
        'btn.apply': 'Terapkan',
        'btn.reset': 'Reset',
        'btn.close': 'Tutup',
        'btn.continue': 'Lanjutkan',
        'btn.back': 'Kembali',
        'label.loading': 'Memuat...',
        'label.success': 'Berhasil',
        'label.error': 'Error',
        'label.min': 'Min',
        'label.max': 'Max'
    },

    en: {
        // Navigation
        'nav.directory': 'Directory',
        'nav.about': 'About',
        'nav.contact': 'Contact',
        'nav.login': 'Login',
        'nav.register': 'Register',

        // Hero Section
        'hero.title.1': 'The Bridge for Indonesian SMEs',
        'hero.title.2': 'to Global Markets',
        'hero.subtitle': 'A one-stop solution platform integrating marketing, finance, and tax to bring your local business from Indonesia to the international world.',
        'hero.search.placeholder': 'Search suppliers, products, or services...',
        'hero.btn.search': 'Search',
        'hero.btn.consult': 'Free Consultation',

        // Stats
        'stats.partners': 'Business Partners',
        'stats.countries': 'Destination Countries',
        'stats.transactions': 'Transactions Facilitated',

        // Categories
        'section.categories': 'Explore Categories',
        'section.categories.subtitle': 'Find trusted suppliers across various industries',
        'category.manufacturing': 'Manufacturing',
        'category.crafts': 'Handicrafts',
        'category.fnb': 'Food & Beverage',
        'category.fashion': 'Fashion & Textiles',
        'category.agriculture': 'Agriculture',
        'category.furniture': 'Furniture',

        // Services
        'section.services': 'One-Stop Solution',
        'section.services.subtitle': 'Integrated services for your business success',
        'service.diagnostic': 'Business Diagnostic',
        'service.diagnostic.desc': 'Comprehensive business health analysis with actionable recommendations for growth',
        'service.finance': 'Tax & Finance',
        'service.finance.desc': 'Financial recording, tax estimation, and consultation to improve bankability',
        'service.marketing': 'Digital Marketing',
        'service.marketing.desc': 'End-to-end digital marketing strategy to reach domestic and international markets',
        'service.export': 'Export Readiness',
        'service.export.desc': 'Document preparation and certification to meet international export standards',

        // Featured Suppliers
        'section.suppliers': 'Verified Suppliers',
        'section.suppliers.subtitle': 'Trusted business partner selection',
        'btn.view.all': 'View All',
        'btn.view.profile': 'View Profile',
        'label.verified': 'Verified',
        'label.export.ready': 'Export Ready',

        // How It Works
        'section.howitworks': 'How It Works',
        'section.howitworks.subtitle': 'Start your global business journey in 4 steps',
        'step.1.title': 'Register & Diagnose',
        'step.1.desc': 'Register your business and get a free business health analysis',
        'step.2.title': 'Consultation',
        'step.2.desc': 'Our expert team develops strategies tailored to your business needs',
        'step.3.title': 'Execution',
        'step.3.desc': 'Solution implementation with ongoing monitoring and support',
        'step.4.title': 'Go Global',
        'step.4.desc': 'Your business appears on the marketplace and is ready to reach international markets',

        // Testimonials
        'section.testimonials': 'What They Say',
        'section.testimonials.subtitle': 'Experiences from our business partners',

        // CTA
        'cta.title': 'Ready to Grow Your Business?',
        'cta.subtitle': 'Join 500+ business partners who have grown with Uplokal',
        'cta.btn.register': 'Register Now',
        'cta.btn.contact': 'Contact Us',

        // Footer
        'footer.tagline': 'The bridge for Indonesian SMEs to global markets.',
        'footer.services': 'Services',
        'footer.company': 'Company',
        'footer.contact': 'Contact',
        'footer.aboutus': 'About Us',
        'footer.careers': 'Careers',
        'footer.copyright': '© 2026 Uplokal. All rights reserved.',

        // Directory
        'directory.title': 'Verified Supplier Directory',
        'directory.subtitle': 'Find 500+ local business partners ready to serve your needs',
        'directory.search.placeholder': 'Search suppliers, products, or services...',
        'directory.filter': 'Filter',
        'directory.category': 'Category',
        'directory.location': 'Location',
        'directory.certification': 'Certification',
        'directory.capacity': 'Production Capacity',
        'directory.showing': 'Showing',
        'directory.suppliers': 'verified suppliers',
        'directory.sort.relevance': 'Relevance',
        'directory.sort.rating': 'Highest Rating',
        'directory.sort.newest': 'Newest',
        'directory.sort.name': 'Name A-Z',

        // Auth
        'auth.login': 'Login to Account',
        'auth.register': 'Register',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.remember': 'Remember me',
        'auth.forgot': 'Forgot password?',
        'auth.noaccount': 'Don\'t have an account?',
        'auth.hasaccount': 'Already have an account?',
        'auth.signup.free': 'Sign up free',
        'auth.signin.here': 'Sign in here',
        'auth.terms': 'By signing in, you agree to',
        'auth.terms.link': 'Terms & Conditions',
        'auth.privacy.link': 'Privacy Policy',

        // Dashboard
        'dashboard.welcome': 'Good Morning',
        'dashboard.summary': 'Here is a summary of your business performance',
        'dashboard.views': 'Profile Views This Month',
        'dashboard.inquiries': 'New Inquiries',
        'dashboard.growth': 'Growth This Month',
        'dashboard.rating': 'Average Rating',
        'dashboard.health': 'Business Health Score',
        'dashboard.activity': 'Recent Activity',
        'dashboard.quick': 'Quick Actions',
        'dashboard.recommendations': 'Recommendations',

        // Common
        'btn.submit': 'Submit',
        'btn.cancel': 'Cancel',
        'btn.save': 'Save',
        'btn.apply': 'Apply',
        'btn.reset': 'Reset',
        'btn.close': 'Close',
        'btn.continue': 'Continue',
        'btn.back': 'Back',
        'label.loading': 'Loading...',
        'label.success': 'Success',
        'label.error': 'Error',
        'label.min': 'Min',
        'label.max': 'Max'
    }
};

// Current language
let currentLang = localStorage.getItem('uplokal-lang') || 'id';

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @param {string} lang - Language code (optional)
 * @returns {string} Translated text
 */
function t(key, lang = currentLang) {
    if (translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    // Fallback to Indonesian
    if (translations['id'] && translations['id'][key]) {
        return translations['id'][key];
    }
    return key;
}

/**
 * Set the active language
 * @param {string} lang - Language code ('id' or 'en')
 */
function setLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Language '${lang}' not supported`);
        return;
    }

    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('uplokal-lang', lang);

    // Update all translatable elements
    translatePage();

    // Update language toggle button
    updateLangToggle();
}

/**
 * Toggle between Indonesian and English
 */
function toggleLanguage() {
    const newLang = currentLang === 'id' ? 'en' : 'id';
    setLanguage(newLang);

    // Show notification
    const message = newLang === 'id' ? 'Bahasa diubah ke Indonesia' : 'Language changed to English';
    if (typeof showToast === 'function') {
        showToast(message, 'info');
    }
}

/**
 * Update language toggle button UI
 */
function updateLangToggle() {
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        const spans = langBtn.querySelectorAll('span');
        spans.forEach(span => {
            const langCode = span.textContent.toLowerCase();
            if (langCode === currentLang) {
                span.classList.remove('lang-inactive');
            } else {
                span.classList.add('lang-inactive');
            }
        });
    }
}

/**
 * Translate all elements with data-i18n attribute
 */
function translatePage() {
    // Translate text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });

    // Translate titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });

    // Translate aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        el.setAttribute('aria-label', t(key));
    });
}

/**
 * Initialize i18n on page load
 */
function initI18n() {
    // Restore saved language
    const savedLang = localStorage.getItem('uplokal-lang');
    if (savedLang && savedLang !== currentLang) {
        currentLang = savedLang;
        document.documentElement.setAttribute('lang', savedLang);
    }

    // Translate page
    translatePage();
    updateLangToggle();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.i18n = {
        t,
        setLanguage,
        toggleLanguage,
        getCurrentLang: () => currentLang,
        translatePage
    };
}
