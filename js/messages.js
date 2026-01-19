/**
 * Messages Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Conversation tabs
    const convTabs = document.querySelectorAll('.conv-tab');
    convTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            convTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const tabType = this.dataset.tab;
            filterConversations(tabType);
        });
    });

    // Conversation selection
    const conversationItems = document.querySelectorAll('.conversation-item');
    conversationItems.forEach(item => {
        item.addEventListener('click', function () {
            conversationItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // On mobile, show chat panel
            const convPanel = document.querySelector('.conversations-panel');
            if (window.innerWidth <= 768) {
                convPanel.classList.remove('show');
            }
        });
    });

    // Send message
    const chatInput = document.querySelector('.chat-input input');
    const sendBtn = document.querySelector('.btn-send');

    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // New message button
    const newMsgBtn = document.getElementById('newMessageBtn');
    if (newMsgBtn) {
        newMsgBtn.addEventListener('click', function () {
            showNotification('Fitur pesan baru segera hadir!', 'info');
        });
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        const chatMessages = document.querySelector('.chat-messages');
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0');

        const messageEl = document.createElement('div');
        messageEl.className = 'message sent';
        messageEl.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${timeStr}</span>
            </div>
        `;

        chatMessages.appendChild(messageEl);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Simulate reply after 2 seconds
        setTimeout(() => {
            const replyEl = document.createElement('div');
            replyEl.className = 'message received';
            replyEl.innerHTML = `
                <div class="message-content">
                    <p>Terima kasih atas pesannya. Kami akan segera merespons.</p>
                    <span class="message-time">${timeStr}</span>
                </div>
            `;
            chatMessages.appendChild(replyEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 2000);
    }

    function filterConversations(type) {
        const items = document.querySelectorAll('.conversation-item');
        items.forEach(item => {
            if (type === 'all') {
                item.style.display = 'flex';
            } else if (type === 'unread') {
                const hasUnread = item.querySelector('.unread-badge');
                item.style.display = hasUnread ? 'flex' : 'none';
            }
        });
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});
