/**
 * Messages Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log("Messages JS Loaded");

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Chat history storage
    const messagesData = {
        'pt-mega-trading': [
            { type: 'received', text: 'Selamat pagi! Kami dari PT Mega Trading ingin menanyakan ketersediaan produk tas kulit premium Anda.', time: '09:15' },
            { type: 'sent', text: 'Selamat pagi! Terima kasih atas pertanyaannya. Ya, kami masih memiliki stok produk tas kulit premium. Apakah ada model tertentu yang diminati?', time: '09:20' },
            { type: 'received', text: 'Kami tertarik dengan koleksi Signature Series. Bisakah Anda kirimkan sample ke kantor kami untuk evaluasi?', time: '09:45' },
            { type: 'sent', text: 'Tentu! Saya akan menyiapkan sample dan mengirimkannya dalam 2-3 hari kerja. Mohon kirimkan alamat lengkap kantor Anda.', time: '10:00' },
            { type: 'received', text: 'Terima kasih atas sample produknya, kami sangat tertarik untuk melakukan pemesanan dalam jumlah besar. Bisakah kita jadwalkan meeting untuk membahas lebih lanjut?', time: '10:30' }
        ],
        'budi-santoso': [
            { type: 'received', text: 'Apakah ada update untuk order minggu lalu?', time: 'Yesterday' },
            { type: 'sent', text: 'Halo Pak Budi, order Anda sedang dalam tahap pengemasan. Resi akan diinfokan sore ini.', time: 'Yesterday' }
        ],
        'uplokal-support': [
            { type: 'received', text: 'Profil bisnis Anda telah berhasil diverifikasi!', time: '2 days ago' },
            { type: 'sent', text: 'Terima kasih Tim Uplokal. Sangat membantu!', time: '2 days ago' }
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
            console.log("Scrolling to bottom, current height:", chatMessages.scrollHeight);
            setTimeout(() => {
                chatMessages.scrollTo({
                    top: chatMessages.scrollHeight,
                    behavior: smooth ? 'smooth' : 'auto'
                });
                if (!smooth) chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
    }

    // Tab filtering
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
            const nameEl = this.querySelector('.conversation-name');
            if (!nameEl) return;

            const name = nameEl.textContent;
            const convId = name.toLowerCase().replace(/\s+/g, '-');
            console.log("Selected Conversation:", convId);

            conversationItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const avatarSrc = this.querySelector('img').src;

            chatUserName.textContent = name;
            chatUserAvatar.src = avatarSrc;
            chatUserStatus.textContent = 'Online';

            loadMessages(convId);
            const badge = this.querySelector('.unread-badge');
            if (badge) badge.remove();
        });
    });

    function loadMessages(id) {
        const messages = messagesData[id] || [];
        chatMessages.innerHTML = `<div class="message-date">Hari ini</div>`;

        messages.forEach(msg => {
            renderMessage(msg.text, msg.type, msg.time);
        });

        scrollToBottom(false);
    }

    function renderMessage(text, type, time = null) {
        if (!time) {
            const now = new Date();
            time = now.getHours().toString().padStart(2, '0') + ':' +
                now.getMinutes().toString().padStart(2, '0');
        }

        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
        chatMessages.appendChild(messageEl);
        scrollToBottom();
    }

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        renderMessage(text, 'sent');
        chatInput.value = '';

        // Simulate reply after 1.5 seconds
        setTimeout(() => {
            renderMessage('Terima kasih atas pesannya. Kami akan segera merespons.', 'received');
        }, 1500);
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
                renderMessage(`📎 File lampiran: <strong>${fileName}</strong>`, 'sent');

                setTimeout(() => {
                    renderMessage("Lampiran Anda telah kami terima, admin akan segera meninjau.", "received");
                }, 1000);
            }
        });
    }

    // Send Input
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    function filterConversations(type) {
        conversationItems.forEach(item => {
            if (type === 'all') {
                item.style.display = 'flex';
            } else if (type === 'unread') {
                const hasUnread = item.querySelector('.unread-badge');
                item.style.display = hasUnread ? 'flex' : 'none';
            }
        });
    }

    // Initial load scroll
    scrollToBottom(false);
});
