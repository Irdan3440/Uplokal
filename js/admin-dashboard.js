/**
 * Admin Dashboard JavaScript
 * Handles My Tasks functionality with automatic and manual task management
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ============================
    // MY TASKS FUNCTIONALITY
    // ============================

    const STORAGE_KEY = 'uplokal_admin_tasks';

    // System-generated tasks (simulated from platform data)
    const systemTasks = [
        { id: 'sys-1', text: 'Review 5 pending verifications', type: 'system', completed: false, source: 'verifications' },
        { id: 'sys-2', text: 'Follow up RFQ #1247', type: 'system', completed: false, source: 'rfq' },
        { id: 'sys-3', text: 'Prepare monthly report', type: 'system', completed: false, source: 'reports' },
        { id: 'sys-4', text: '3 new messages need response', type: 'system', completed: false, source: 'messages' }
    ];

    // DOM Elements
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addTaskForm = document.getElementById('addTaskForm');
    const newTaskInput = document.getElementById('newTaskInput');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');

    // Load tasks from localStorage or initialize
    function loadTasks() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        // Initialize with system tasks
        return [...systemTasks];
    }

    // Save tasks to localStorage
    function saveTasks(tasks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    // Render tasks to DOM
    function renderTasks() {
        const tasks = loadTasks();
        taskList.innerHTML = '';

        // Sort: uncompleted first, then completed
        const sortedTasks = tasks.sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
        });

        sortedTasks.forEach(task => {
            const taskEl = document.createElement('label');
            taskEl.className = 'task-item';
            taskEl.dataset.id = task.id;

            const isSystem = task.type === 'system';
            const sourceIcon = getSourceIcon(task.source);

            taskEl.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                ${isSystem ? `<span class="task-badge" title="Auto-generated from ${task.source}">${sourceIcon}</span>` : ''}
                <button class="task-delete-btn" title="Delete task">
                    <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                </button>
            `;

            // Checkbox change handler
            const checkbox = taskEl.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => toggleTask(task.id));

            // Delete button handler
            const deleteBtn = taskEl.querySelector('.task-delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteTask(task.id);
            });

            taskList.appendChild(taskEl);
        });

        // Re-initialize Lucide icons for new elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Get icon based on task source
    function getSourceIcon(source) {
        const icons = {
            'verifications': '🔍',
            'rfq': '📋',
            'reports': '📊',
            'messages': '💬',
            'manual': '✏️'
        };
        return icons[source] || '📌';
    }

    // Toggle task completion
    function toggleTask(taskId) {
        const tasks = loadTasks();
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveTasks(tasks);
            renderTasks();
        }
    }

    // Delete task
    function deleteTask(taskId) {
        const tasks = loadTasks();
        const filtered = tasks.filter(t => t.id !== taskId);
        saveTasks(filtered);
        renderTasks();
    }

    // Add new manual task
    function addTask(text) {
        if (!text.trim()) return;

        const tasks = loadTasks();
        const newTask = {
            id: 'manual-' + Date.now(),
            text: text.trim(),
            type: 'manual',
            completed: false,
            source: 'manual'
        };
        tasks.unshift(newTask); // Add to beginning
        saveTasks(tasks);
        renderTasks();
    }

    // Refresh system tasks (simulate fetching from API)
    function refreshSystemTasks() {
        const tasks = loadTasks();

        // Update system tasks with current platform data
        // In a real app, this would fetch from backend
        const pendingVerifications = 5; // Simulated
        const pendingRFQ = 7; // Simulated
        const unreadMessages = 3; // Simulated

        // Find and update or add system tasks
        updateOrAddSystemTask(tasks, 'sys-1', `Review ${pendingVerifications} pending verifications`, 'verifications');
        updateOrAddSystemTask(tasks, 'sys-rfq', `${pendingRFQ} RFQ items in queue`, 'rfq');
        updateOrAddSystemTask(tasks, 'sys-msg', `${unreadMessages} new messages need response`, 'messages');

        saveTasks(tasks);
    }

    function updateOrAddSystemTask(tasks, id, text, source) {
        const existing = tasks.find(t => t.id === id);
        if (existing && !existing.completed) {
            existing.text = text;
        } else if (!existing) {
            tasks.push({
                id: id,
                text: text,
                type: 'system',
                completed: false,
                source: source
            });
        }
    }

    // Event Listeners
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            addTaskForm.style.display = 'block';
            newTaskInput.focus();
        });
    }

    if (saveTaskBtn) {
        saveTaskBtn.addEventListener('click', () => {
            addTask(newTaskInput.value);
            newTaskInput.value = '';
            addTaskForm.style.display = 'none';
        });
    }

    if (cancelTaskBtn) {
        cancelTaskBtn.addEventListener('click', () => {
            newTaskInput.value = '';
            addTaskForm.style.display = 'none';
        });
    }

    if (newTaskInput) {
        newTaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask(newTaskInput.value);
                newTaskInput.value = '';
                addTaskForm.style.display = 'none';
            }
        });
    }

    // Initialize
    if (taskList) {
        refreshSystemTasks();
        renderTasks();
    }
});
