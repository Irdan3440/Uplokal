/* ===========================================
   Document Vault JavaScript
   =========================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Modal elements
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const closeModal = document.getElementById('closeModal');
    const cancelUpload = document.getElementById('cancelUpload');
    const confirmUpload = document.getElementById('confirmUpload');
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const filesList = document.getElementById('filesList');
    const docCategory = document.getElementById('docCategory');

    let selectedFiles = [];

    // Open modal
    if (uploadBtn && uploadModal) {
        uploadBtn.addEventListener('click', function () {
            uploadModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal function
    function closeUploadModal() {
        if (uploadModal) {
            uploadModal.classList.remove('show');
            document.body.style.overflow = '';
            resetUploadForm();
        }
    }

    // Close button (X)
    if (closeModal) {
        closeModal.addEventListener('click', closeUploadModal);
    }

    // Cancel button
    if (cancelUpload) {
        cancelUpload.addEventListener('click', closeUploadModal);
    }

    // Close on backdrop click
    if (uploadModal) {
        uploadModal.addEventListener('click', function (e) {
            if (e.target === uploadModal) {
                closeUploadModal();
            }
        });
    }

    // Browse button
    if (browseBtn && fileInput) {
        browseBtn.addEventListener('click', function () {
            fileInput.click();
        });
    }

    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', function (e) {
            handleFiles(Array.from(e.target.files));
        });
    }

    // Drag and drop
    if (uploadZone) {
        uploadZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');
            handleFiles(Array.from(e.dataTransfer.files));
        });
    }

    // Handle files
    function handleFiles(files) {
        const validExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        files.forEach(file => {
            const ext = '.' + file.name.split('.').pop().toLowerCase();

            if (!validExtensions.includes(ext)) {
                alert(`Format file ${file.name} tidak didukung`);
                return;
            }

            if (file.size > maxSize) {
                alert(`File ${file.name} terlalu besar (maks 10MB)`);
                return;
            }

            // Check if already added
            if (selectedFiles.find(f => f.name === file.name)) {
                return;
            }

            selectedFiles.push(file);
        });

        renderFilesList();
        updateConfirmButton();
    }

    // Render files list
    function renderFilesList() {
        if (!filesList) return;

        if (selectedFiles.length === 0) {
            filesList.innerHTML = '';
            return;
        }

        filesList.innerHTML = selectedFiles.map((file, index) => `
            <div class="file-item">
                <div class="file-icon pdf">
                    <i data-lucide="file-text"></i>
                </div>
                <div class="file-item-info">
                    <div class="file-item-name">${file.name}</div>
                    <div class="file-item-size">${formatFileSize(file.size)}</div>
                </div>
                <button type="button" class="file-item-remove" data-index="${index}">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `).join('');

        // Add remove listeners
        filesList.querySelectorAll('.file-item-remove').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                selectedFiles.splice(index, 1);
                renderFilesList();
                updateConfirmButton();
            });
        });

        // Reinit lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Update confirm button state
    function updateConfirmButton() {
        if (!confirmUpload || !docCategory) return;
        const category = docCategory.value;
        confirmUpload.disabled = selectedFiles.length === 0 || !category;
    }

    // Category change
    if (docCategory) {
        docCategory.addEventListener('change', updateConfirmButton);
    }

    // Reset form
    function resetUploadForm() {
        selectedFiles = [];
        renderFilesList();

        if (docCategory) docCategory.value = '';
        const docName = document.getElementById('docName');
        if (docName) docName.value = '';
        const docExpiry = document.getElementById('docExpiry');
        if (docExpiry) docExpiry.value = '';
        if (fileInput) fileInput.value = '';

        updateConfirmButton();
    }

    // Confirm upload
    if (confirmUpload) {
        confirmUpload.addEventListener('click', function () {
            if (!docCategory) return;

            const category = docCategory.value;
            const docName = document.getElementById('docName');
            const docExpiry = document.getElementById('docExpiry');
            const name = docName ? docName.value : '';
            const expiry = docExpiry ? docExpiry.value : '';

            // Simulate upload
            console.log('Uploading files:', {
                files: selectedFiles.map(f => f.name),
                category,
                name,
                expiry
            });

            // Show success message
            alert('Dokumen berhasil diupload!');
            closeUploadModal();
        });
    }

    // Category card click
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            console.log('View category:', category);
        });
    });

    // Action buttons - Preview
    document.querySelectorAll('.action-btn[title="Preview"]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const fileName = row.querySelector('.document-name span').textContent;
            alert(`Preview: ${fileName}`);
        });
    });

    // Action buttons - Download
    document.querySelectorAll('.action-btn[title="Download"]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const fileName = row.querySelector('.document-name span').textContent;
            alert(`Downloading: ${fileName}`);
        });
    });

    // Action buttons - Delete
    document.querySelectorAll('.action-btn[title="Hapus"]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const fileName = row.querySelector('.document-name span').textContent;
            if (confirm(`Hapus dokumen "${fileName}"?`)) {
                row.remove();
            }
        });
    });
});
