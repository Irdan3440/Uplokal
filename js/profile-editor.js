/* ===========================================
   Profile Editor JavaScript
   =========================================== */

// Load existing profile data (simulated)
const mockProfileData = {
    companyName: "Kulit Nusantara",
    industry: "fashion",
    yearFounded: 2018,
    employees: "11-50",
    description: "<p>Produsen tas kulit premium handmade dengan desain modern dan kualitas internasional.</p>",
    email: "info@kulitnusantara.com",
    phone: "+62 812 3456 7890",
    website: "https://kulitnusantara.com",
    whatsapp: "+62 812 3456 7890",
    address: "Jl. Raya Cisarua No. 45",
    province: "Jawa Barat",
    city: "Bogor",
    postalCode: "16750",
    instagram: "kulitnusantara",
    facebook: "kulitnusantara",
    tiktok: "",
    youtube: ""
};

// Logo upload handling
const logoInput = document.getElementById('logoInput');
const logoPreview = document.getElementById('logoPreview');

if (logoInput) {
    logoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran file terlalu besar. Maksimal 2MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                logoPreview.innerHTML = `<img src="${e.target.result}" alt="Logo Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Product gallery upload handling
const productInput = document.getElementById('productInput');
const productGallery = document.getElementById('productGallery');
let productImages = [];

if (productInput) {
    productInput.addEventListener('change', function (e) {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            if (productImages.length >= 6) {
                alert('Maksimal 6 foto produk.');
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                alert('File ' + file.name + ' terlalu besar. Maksimal 2MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                productImages.push(e.target.result);
                renderProductGallery();
            };
            reader.readAsDataURL(file);
        });

        // Reset input
        productInput.value = '';
    });
}

function renderProductGallery() {
    const uploadPlaceholder = `
        <div class="gallery-item upload-placeholder" onclick="document.getElementById('productInput').click()">
            <i data-lucide="plus"></i>
            <span>Upload Foto</span>
        </div>
    `;

    const items = productImages.map((src, index) => `
        <div class="gallery-item">
            <img src="${src}" alt="Product ${index + 1}">
            <button type="button" class="gallery-item-remove" onclick="removeProductImage(${index})">
                <i data-lucide="x"></i>
            </button>
        </div>
    `).join('');

    productGallery.innerHTML = items + (productImages.length < 6 ? uploadPlaceholder : '');

    // Reinitialize lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function removeProductImage(index) {
    productImages.splice(index, 1);
    renderProductGallery();
}

// Rich text editor toolbar
document.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const command = this.getAttribute('data-command');
        document.execCommand(command, false, null);
        this.classList.toggle('active');
    });
});

// Load profile data into form
function loadProfileData(data) {
    document.getElementById('companyName').value = data.companyName || '';
    document.getElementById('industry').value = data.industry || '';
    document.getElementById('yearFounded').value = data.yearFounded || '';
    document.getElementById('employees').value = data.employees || '';
    document.getElementById('description').innerHTML = data.description || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('website').value = data.website || '';
    document.getElementById('whatsapp').value = data.whatsapp || '';
    document.getElementById('address').value = data.address || '';

    // Set province first
    const provinceSelect = document.getElementById('province');
    if (provinceSelect && data.province) {
        provinceSelect.value = data.province;
        // Trigger change to populate cities
        provinceSelect.dispatchEvent(new Event('change'));

        // Set city after cities are populated
        setTimeout(() => {
            const citySelect = document.getElementById('city');
            if (citySelect && data.city) {
                citySelect.value = data.city;
            }
        }, 100);
    }

    const postalCode = document.getElementById('postalCode');
    if (postalCode) postalCode.value = data.postalCode || '';

    // Social media
    document.getElementById('instagram').value = data.instagram || '';
    document.getElementById('facebook').value = data.facebook || '';

    const tiktok = document.getElementById('tiktok');
    if (tiktok) tiktok.value = data.tiktok || '';

    const youtube = document.getElementById('youtube');
    if (youtube) youtube.value = data.youtube || '';
}

// Form submission
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate form
        if (!this.checkValidity()) {
            this.reportValidity();
            return;
        }

        // Get form data
        const formData = {
            companyName: document.getElementById('companyName').value,
            industry: document.getElementById('industry').value,
            yearFounded: document.getElementById('yearFounded').value,
            employees: document.getElementById('employees').value,
            description: document.getElementById('description').innerHTML,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            website: document.getElementById('website').value,
            whatsapp: document.getElementById('whatsapp').value,
            address: document.getElementById('address').value,
            province: document.getElementById('province').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode')?.value || '',
            instagram: document.getElementById('instagram').value,
            facebook: document.getElementById('facebook').value,
            tiktok: document.getElementById('tiktok')?.value || '',
            youtube: document.getElementById('youtube')?.value || '',
            productImages: productImages
        };

        // Simulate save (in production, send to backend)
        console.log('Saving profile data:', formData);

        // Show success message
        showSuccessBanner('Profil berhasil disimpan!');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Save button (top)
document.getElementById('saveBtn')?.addEventListener('click', function () {
    profileForm.requestSubmit();
});

// Cancel buttons
function handleCancel() {
    if (confirm('Batalkan perubahan? Data yang belum disimpan akan hilang.')) {
        loadProfileData(mockProfileData);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

document.getElementById('cancelBtn')?.addEventListener('click', handleCancel);
document.getElementById('cancelBtnBottom')?.addEventListener('click', handleCancel);

// Show success banner
function showSuccessBanner(message) {
    const banner = document.createElement('div');
    banner.className = 'save-success-banner';
    banner.innerHTML = `
        <i data-lucide="check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(banner);

    // Reinit lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Remove after 3 seconds
    setTimeout(() => {
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 300);
    }, 3000);
}

// Initialize with mock data
document.addEventListener('DOMContentLoaded', function () {
    // Small delay to ensure province-city-data.js is loaded first
    setTimeout(() => {
        loadProfileData(mockProfileData);
    }, 150);
});
