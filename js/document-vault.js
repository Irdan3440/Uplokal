/**
 * @license
 * Uplokal - From Local Up To Global
 * Copyright (c) 2026 Uplokal Team. All rights reserved.
 * 
 * Document Vault JavaScript
 * =========================================== */

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
    document.addEventListener('click', function (e) {
        const previewBtn = e.target.closest('.action-btn[title="Preview"]');
        if (previewBtn) {
            e.stopPropagation();
            const row = previewBtn.closest('tr');
            const item = previewBtn.closest('.mobile-document-item');
            const fileName = row ? row.querySelector('.document-name span').textContent :
                item.querySelector('.item-name').textContent;
            alert(`Preview: ${fileName}`);
        }
    });

    // Action buttons - Download
    document.addEventListener('click', function (e) {
        const downloadBtn = e.target.closest('.action-btn[title="Download"]');
        if (downloadBtn) {
            e.stopPropagation();
            const row = downloadBtn.closest('tr');
            const item = downloadBtn.closest('.mobile-document-item');
            const fileName = row ? row.querySelector('.document-name span').textContent :
                item.querySelector('.item-name').textContent;
            alert(`Downloading: ${fileName}`);
        }
    });

    // Action buttons - Delete
    document.addEventListener('click', function (e) {
        const deleteBtn = e.target.closest('.action-btn[title="Hapus"]');
        if (deleteBtn) {
            e.stopPropagation();
            const row = deleteBtn.closest('tr');
            const item = deleteBtn.closest('.mobile-document-item');
            const target = row || item;
            const fileName = row ? row.querySelector('.document-name span').textContent :
                item.querySelector('.item-name').textContent;

            if (confirm(`Hapus dokumen "${fileName}"?`)) {
                target.remove();
            }
        }
    });

    // Mobile "More" menu simulation
    document.addEventListener('click', function (e) {
        const moreBtn = e.target.closest('.item-more');
        if (moreBtn) {
            e.stopPropagation();
            const item = moreBtn.closest('.mobile-document-item');
            const fileName = item.querySelector('.item-name').textContent;

            // Simple action sheet simulation
            const action = prompt(`Aksi untuk "${fileName}":\n1. Preview\n2. Download\n3. Hapus\n(Ketik angka)`);

            if (action === '1') alert(`Preview: ${fileName}`);
            else if (action === '2') alert(`Downloading: ${fileName}`);
            else if (action === '3') {
                if (confirm(`Hapus dokumen "${fileName}"?`)) item.remove();
            }
        }
    });
});
