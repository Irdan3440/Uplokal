/* ===========================================
   Uplokal - Main JavaScript
   =========================================== */

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function () {
    lucide.createIcons();
    initNavbar();
    initMobileNav();
    initAnimations();
});

// ========== Navbar Scroll Effect ==========
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
}

// ========== Mobile Navigation Toggle ==========
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('active');
        });
    }
}

// ========== Scroll Animations ==========
function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.dataset.animate || 'fadeInUp';
                entry.target.classList.add(`animate-${animation}`);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

// ========== Language Toggle ==========
function toggleLanguage() {
    const html = document.documentElement;
    const currentLang = html.getAttribute('lang') || 'id';
    const newLang = currentLang === 'id' ? 'en' : 'id';
    html.setAttribute('lang', newLang);

    // Update button text
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        const spans = langBtn.querySelectorAll('span');
        spans.forEach(span => {
            if (span.textContent === newLang.toUpperCase()) {
                span.classList.remove('lang-inactive');
            } else {
                span.classList.add('lang-inactive');
            }
        });
    }

    // Store preference
    localStorage.setItem('uplokal-lang', newLang);
}

// ========== Sidebar Toggle (Dashboard) ==========
function toggleSidebar() {
    const sidebar = document.getElementById('dashboardSidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// ========== Filter Toggle (Directory) ==========
function toggleFilters() {
    const filtersSidebar = document.getElementById('filtersSidebar');
    if (filtersSidebar) {
        filtersSidebar.classList.toggle('mobile-open');
        document.body.classList.toggle('overflow-hidden');
    }
}

// ========== View Toggle (Directory) ==========
function setView(view) {
    const suppliersList = document.getElementById('suppliersListing');
    const viewBtns = document.querySelectorAll('.view-btn');

    if (suppliersList) {
        suppliersList.classList.remove('grid-view', 'list-view');
        suppliersList.classList.add(`${view}-view`);
    }

    viewBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });

    localStorage.setItem('uplokal-view', view);
}

// ========== Password Toggle ==========
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const btn = input.parentElement.querySelector('.password-toggle');

    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<i data-lucide="eye-off"></i>';
    } else {
        input.type = 'password';
        btn.innerHTML = '<i data-lucide="eye"></i>';
    }

    lucide.createIcons();
}

// ========== Form Validation ==========
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
        const group = input.closest('.form-group');
        const error = group ? group.querySelector('.form-error') : null;

        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            if (error) error.textContent = 'Field ini wajib diisi';
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            isValid = false;
            input.classList.add('error');
            if (error) error.textContent = 'Format email tidak valid';
        } else {
            input.classList.remove('error');
            if (error) error.textContent = '';
        }
    });

    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========== Quiz/Diagnostic Functions ==========
let currentQuizStep = 1;
const totalQuizSteps = 5;

function selectQuizOption(questionId, optionValue) {
    const options = document.querySelectorAll(`[data-question="${questionId}"] .quiz-option`);
    options.forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.value === optionValue) {
            opt.classList.add('selected');
        }
    });
}

function nextQuizStep() {
    if (currentQuizStep < totalQuizSteps) {
        document.getElementById(`quizStep${currentQuizStep}`).classList.add('hidden');
        currentQuizStep++;
        document.getElementById(`quizStep${currentQuizStep}`).classList.remove('hidden');
        updateQuizProgress();
    }
}

function prevQuizStep() {
    if (currentQuizStep > 1) {
        document.getElementById(`quizStep${currentQuizStep}`).classList.add('hidden');
        currentQuizStep--;
        document.getElementById(`quizStep${currentQuizStep}`).classList.remove('hidden');
        updateQuizProgress();
    }
}

function updateQuizProgress() {
    const progress = document.getElementById('quizProgress');
    if (progress) {
        const percentage = (currentQuizStep / totalQuizSteps) * 100;
        progress.style.width = `${percentage}%`;
    }

    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < currentQuizStep) {
            step.classList.add('completed');
        } else if (index + 1 === currentQuizStep) {
            step.classList.add('active');
        }
    });
}

// ========== Toast Notifications ==========
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i data-lucide="${getToastIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i data-lucide="x"></i>
        </button>
    `;

    document.body.appendChild(toast);
    lucide.createIcons();

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'alert-circle',
        warning: 'alert-triangle',
        info: 'info'
    };
    return icons[type] || icons.info;
}

// ========== Modal Functions ==========
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('open');
        document.body.classList.add('overflow-hidden');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('open');
        document.body.classList.remove('overflow-hidden');
    }
}

// Close modal on backdrop click
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-backdrop')) {
        e.target.closest('.modal').classList.remove('open');
        document.body.classList.remove('overflow-hidden');
    }
});

// Close modal on escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.open');
        openModals.forEach(modal => {
            modal.classList.remove('open');
        });
        document.body.classList.remove('overflow-hidden');
    }
});

// ========== Search Functionality ==========
function handleSearch(e) {
    e.preventDefault();
    const searchInput = document.getElementById('heroSearch') || document.getElementById('directorySearch');
    if (searchInput && searchInput.value.trim()) {
        window.location.href = `directory.html?q=${encodeURIComponent(searchInput.value.trim())}`;
    }
}

// ========== Number Formatting ==========
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ========== Currency Formatting ==========
function formatCurrency(amount, currency = 'IDR') {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// ========== Date Formatting ==========
function formatDate(dateString, locale = 'id-ID') {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 7) return `${days} hari lalu`;

    return formatDate(dateString);
}

// ========== Initialize on Load ==========
window.addEventListener('load', function () {
    // Restore language preference
    const savedLang = localStorage.getItem('uplokal-lang');
    if (savedLang && savedLang !== document.documentElement.lang) {
        document.documentElement.lang = savedLang;
    }

    // Restore view preference
    const savedView = localStorage.getItem('uplokal-view');
    if (savedView) {
        setView(savedView);
    }
});

// ========== Smooth Scroll for Anchor Links ==========
document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});
