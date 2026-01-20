/**
 * Admin Messages Page JavaScript
 * Handles chat interactions for administrative staff
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Chat history storage
    const messagesData = {
        'rina': [
            { type: 'received', text: 'Halo Admin, saya ingin konsultasi mengenai prosedur ekspor ke pasar Eropa. Apakah ada panduan spesifik?', time: '10:15' },
            { type: 'sent', text: 'Halo Bu Rina! Tentu, kami memiliki modul panduan ekspor Eropa. Saya akan lampirkan dokumen ringkasannya di sini.', time: '10:25' },
            { type: 'received', text: 'Terima kasih Admin. Menunggu lampirannya ya.', time: '10:30' }
        ],
        'sarah': [
            { type: 'received', text: 'Admin, laporan verifikasi untuk PT Maju Mundur sudah siap di dashboard.', time: '09:00' },
            { type: 'sent', text: 'Oke Sarah, saya cek dulu ya. Apakah ada kendala di dokumen legalitasnya?', time: '09:15' },
            { type: 'received', text: 'Laporan verifikasi harian sudah saya update. Semuanya clean.', time: '09:45' }
        ],
        'budi': [
            { type: 'received', text: 'Selamat siang Admin, RFQ #9920 saya statusnya masih pending ya?', time: 'Yesterday' },
            { type: 'sent', text: 'Siang Pak Budi. Sedang dalam tahap review vendor. Mohon tunggu 1x24 jam lagi.', time: 'Yesterday' },
            { type: 'received', text: 'Bagaimana kelanjutan RFQ saya? Client saya sudah menanyakan.', time: 'Yesterday' }
        ],
        'strategy': [
            { type: 'received', text: 'Team, jangan lupa besok pagi ada kunjungan dari dinas perdagangan.', time: 'Yesterday' },
            { type: 'sent', text: 'Copy that. Materi presentasi sudah siap di Document Vault.', time: 'Yesterday' },
            { type: 'received', text: 'Jadwal meeting mingguan besok pukul 09:00.', time: '2 days' }
        ]
    };

    // DOM Elements
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.getElementById('chatInputField');
    const sendBtn = document.querySelector('.btn-send');
    const emoteBtn = document.getElementById('emoteBtn');
    const emotePicker = document.getElementById('emotePicker');
    const attachBtn = document.getElementById('attachBtn');
    const fileInput = document.getElementById('chatFileInput');
    const conversationItems = document.querySelectorAll('.conversation-item');
    const chatUserName = document.querySelector('.chat-user-name');
    const chatUserStatus = document.querySelector('.chat-user-status');
    const chatUserAvatar = document.querySelector('.chat-user img');
    const convTabs = document.querySelectorAll('.conv-tab');

    // WhatsApp-scroll function
    function scrollToBottom(smooth = true) {
        if (chatMessages) {
            // Use setTimeout to ensure the DOM has updated and scrollHeight is correct
            setTimeout(() => {
                chatMessages.scrollTo({
                    top: chatMessages.scrollHeight,
                    behavior: smooth ? 'smooth' : 'auto'
                });
                // Double check for cases where smooth scroll is interrupted
                if (!smooth) chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 50);
        }
    }

    // Tab filtering (All, Clients, Team)
    convTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            convTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterConversations(this.dataset.tab);
        });
    });

    // Conversation selection
    conversationItems.forEach(item => {
        item.addEventListener('click', function () {
            const convId = this.dataset.id;
            conversationItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const name = this.querySelector('.conversation-name').textContent;
            const avatarSrc = this.querySelector('img') ? this.querySelector('img').src : null;
            const type = this.dataset.type;

            chatUserName.textContent = name;

            if (avatarSrc) {
                chatUserAvatar.src = avatarSrc;
                chatUserAvatar.style.display = 'block';
                const groupAvatar = document.querySelector('.chat-user .group-avatar-header');
                if (groupAvatar) groupAvatar.remove();
            } else {
                chatUserAvatar.style.display = 'none';
                let groupAvatar = document.querySelector('.chat-user .group-avatar-header');
                if (!groupAvatar) {
                    groupAvatar = document.createElement('div');
                    groupAvatar.className = 'group-avatar-header';
                    groupAvatar.style.cssText = 'width: 40px; height: 40px; background: #6366F1; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;';
                    groupAvatar.innerHTML = '<i data-lucide="users" style="width: 20px; height: 20px;"></i>';
                    chatUserAvatar.parentNode.insertBefore(groupAvatar, chatUserAvatar);
                    lucide.createIcons();
                }
            }

            if (type === 'clients') {
                chatUserStatus.textContent = 'Online (Consultation)';
                chatUserStatus.style.color = 'var(--color-secondary-500)';
                chatInput.placeholder = `Type a message to ${name.split(' ')[0]}...`;
            } else {
                chatUserStatus.textContent = 'Active (Internal Team)';
                chatUserStatus.style.color = 'var(--color-primary-500)';
                chatInput.placeholder = `Message to team...`;
            }

            loadMessages(convId);
            const badge = this.querySelector('.unread-badge');
            if (badge) badge.remove();
        });
    });

    function loadMessages(id) {
        const messages = messagesData[id] || [];
        chatMessages.innerHTML = `<div class="message-date">${id === 'rina' || id === 'sarah' ? 'Today' : 'Yesterday'}</div>`;

        messages.forEach(msg => {
            appendMessage(msg.text, msg.type, msg.time);
        });

        setTimeout(() => scrollToBottom(false), 50);
    }

    function appendMessage(text, type, time = null) {
        if (!time) {
            const now = new Date();
            time = now.getHours().toString().padStart(2, '0') + ':' +
                now.getMinutes().toString().padStart(2, '0');
        }

        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.innerHTML = `
            <div class="message-bubble">
                <div class="message-content">
                    <p>${text}</p>
                    <span class="message-time">${time}</span>
                </div>
            </div>
        `;
        chatMessages.appendChild(messageEl);
        scrollToBottom(); // Ensure scroll happens after appending
    }

    // Emote Functionality
    if (emoteBtn) {
        emoteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            emotePicker.classList.toggle('hidden');
        });
    }

    document.querySelectorAll('.emote-item').forEach(item => {
        item.addEventListener('click', () => {
            chatInput.value += item.textContent;
            emotePicker.classList.add('hidden');
            chatInput.focus();
        });
    });

    // Close emote picker on outside click
    document.addEventListener('click', () => {
        if (emotePicker) emotePicker.classList.add('hidden');
    });

    if (emotePicker) {
        emotePicker.addEventListener('click', (e) => e.stopPropagation());
    }

    // Attachment Functionality
    if (attachBtn && fileInput) {
        attachBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                const fileName = this.files[0].name;
                appendMessage(`📎 File attached: <strong>${fileName}</strong>`, 'sent');

                // Simulate system response
                setTimeout(() => {
                    appendMessage(`System: File "${fileName}" received and scan result is clean.`, 'received');
                }, 1000);
            }
        });
    }

    // Send logic
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage(text, 'sent');
        chatInput.value = '';

        const activeConv = document.querySelector('.conversation-item.active');
        if (activeConv) {
            const convId = activeConv.dataset.id;
            if (!messagesData[convId]) messagesData[convId] = [];
            messagesData[convId].push({ type: 'sent', text: text, time: 'Just now' });

            const preview = activeConv.querySelector('.conversation-preview');
            preview.textContent = 'You: ' + text;
            activeConv.querySelector('.conversation-time').textContent = 'Just now';

            simulateResponse(convId);
        }
    }

    function simulateResponse(id) {
        setTimeout(() => {
            let responseText = "Terima kasih atas informasinya. Saya akan segera tindak lanjuti.";
            if (id === 'rina') responseText = "Baik Admin, saya sudah menerima lampirannya. Akan saya pelajari dulu.";
            else if (id === 'sarah') responseText = "Siap Admin, nanti saya share link laporannya jika ada yang perlu direvisi.";
            else if (id === 'strategy') responseText = "[System] Message acknowledged by 3 team members.";

            const activeConv = document.querySelector('.conversation-item.active');
            if (activeConv && activeConv.dataset.id === id) {
                appendMessage(responseText, 'received');
                activeConv.querySelector('.conversation-preview').textContent = responseText;
            }

            if (!messagesData[id]) messagesData[id] = [];
            messagesData[id].push({ type: 'received', text: responseText, time: 'Now' });
        }, 1500);
    }

    function filterConversations(type) {
        conversationItems.forEach(item => {
            if (type === 'all') item.style.display = 'flex';
            else item.style.display = (item.dataset.type === type) ? 'flex' : 'none';
        });
    }

    // Default load Rina
    loadMessages('rina');
});
