/* ===========================================
   Marketing Dashboard JavaScript
   =========================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize traffic chart
    initTrafficChart();
});

// Traffic Overview Chart
function initTrafficChart() {
    const ctx = document.getElementById('trafficChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1 Jan', '5 Jan', '10 Jan', '15 Jan', '20 Jan', '25 Jan', '30 Jan'],
            datasets: [
                {
                    label: 'Organic',
                    data: [1200, 1450, 1380, 1650, 1890, 2100, 1980],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                },
                {
                    label: 'Paid',
                    data: [800, 950, 1100, 1250, 1400, 1520, 1680],
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                },
                {
                    label: 'Referral',
                    data: [400, 520, 480, 610, 580, 720, 850],
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString('id-ID');
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Calculate ROI
function calculateROI() {
    const budget = parseFloat(document.getElementById('marketingBudget').value.replace(/\./g, '').replace(',', '.'));
    const revenue = parseFloat(document.getElementById('campaignRevenue').value.replace(/\./g, '').replace(',', '.'));

    if (isNaN(budget) || isNaN(revenue) || budget === 0) {
        alert('Masukkan budget dan revenue yang valid');
        return;
    }

    const profit = revenue - budget;
    const roi = ((profit / budget) * 100).toFixed(0);
    const cpa = (budget / 111).toFixed(0); // Assuming 111 conversions

    const roiValue = document.querySelector('.roi-value .value');
    const profitDisplay = document.querySelectorAll('.breakdown-item .value')[0];
    const cpaDisplay = document.querySelectorAll('.breakdown-item .value')[1];

    if (roiValue) {
        roiValue.textContent = roi + '%';
        roiValue.className = 'value ' + (roi >= 0 ? 'positive' : 'negative');
    }

    if (profitDisplay) {
        profitDisplay.textContent = 'Rp ' + profit.toLocaleString('id-ID');
    }

    if (cpaDisplay) {
        cpaDisplay.textContent = 'Rp ' + parseInt(cpa).toLocaleString('id-ID');
    }

    showNotification('ROI berhasil dihitung: ' + roi + '%', 'success');
}

// Generate Content Ideas
function generateIdeas() {
    showNotification('Generating content ideas...', 'info');

    const ideas = [
        {
            icon: 'video',
            title: 'Tutorial Merawat Produk Kulit',
            desc: 'Tips & tricks untuk memperpanjang umur produk kulit Anda'
        },
        {
            icon: 'camera',
            title: 'Flat Lay Product Photography',
            desc: 'Foto produk estetik untuk feed Instagram yang menarik'
        },
        {
            icon: 'mic',
            title: 'Live Q&A Session',
            desc: 'Sesi tanya jawab langsung dengan followers'
        }
    ];

    setTimeout(() => {
        showNotification('3 ide konten baru telah di-generate!', 'success');
    }, 1500);
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
        <span>${message}</span>
    `;

    // Add notification styles if not exists
    if (!document.querySelector('.notification-styles')) {
        const style = document.createElement('style');
        style.className = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 1rem;
                right: 1rem;
                padding: 1rem 1.5rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 1100;
                transform: translateX(calc(100% + 1rem));
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification i {
                width: 24px;
                height: 24px;
            }
            .notification-success { border-left: 4px solid #10B981; }
            .notification-success i { color: #10B981; }
            .notification-error { border-left: 4px solid #EF4444; }
            .notification-error i { color: #EF4444; }
            .notification-info { border-left: 4px solid #3B82F6; }
            .notification-info i { color: #3B82F6; }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
