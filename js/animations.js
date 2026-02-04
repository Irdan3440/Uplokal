/**
 * Hybrid Auto-Scroll Animations
 * Supports smooth continuous marquee movement with desktop drag and mobile swipe support.
 */
class HybridSlider {
    constructor(selector, speed = 0.5) {
        this.container = document.querySelector(selector);
        if (!this.container) return;

        this.speed = speed;
        this.isPaused = false;
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.scrollPos = this.container.scrollLeft;
        this.lastTime = 0;

        this.init();
    }

    init() {
        // Core styling for interaction
        this.container.style.cursor = 'grab';
        this.container.style.userSelect = 'none';
        this.container.style.webkitUserDrag = 'none';

        // Mouse Events
        this.container.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.isPaused = true;
            this.container.style.cursor = 'grabbing';
            this.startX = e.pageX - this.container.offsetLeft;
            this.scrollLeft = this.container.scrollLeft;
        });

        window.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.isPaused = false;
                this.container.style.cursor = 'grab';
                this.scrollPos = this.container.scrollLeft;
            }
        });

        this.container.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            const x = e.pageX - this.container.offsetLeft;
            const walk = (x - this.startX) * 1.5;
            this.container.scrollLeft = this.scrollLeft - walk;
        });

        // Touch Events
        this.container.addEventListener('touchstart', () => {
            this.isPaused = true;
        }, { passive: true });

        this.container.addEventListener('touchend', () => {
            this.isPaused = false;
            this.scrollPos = this.container.scrollLeft;
        });

        // Hover Behavior
        this.container.addEventListener('mouseenter', () => {
            if (!this.isDragging) this.isPaused = true;
        });
        this.container.addEventListener('mouseleave', () => {
            if (!this.isDragging) this.isPaused = false;
        });

        // Start Loop
        requestAnimationFrame((time) => this.animate(time));
    }

    animate(time) {
        if (!this.lastTime) this.lastTime = time;
        const delta = time - this.lastTime;
        this.lastTime = time;

        if (!this.isPaused && !this.isDragging) {
            // Use delta for frame-rate independent movement
            const moveStep = this.speed * (delta / 16.67);
            this.scrollPos += moveStep;

            const halfWidth = this.container.scrollWidth / 2;
            if (this.scrollPos >= halfWidth) {
                this.scrollPos = 0;
            }

            this.container.scrollLeft = this.scrollPos;
        } else {
            // Keep scrollPos synced with manual movement
            this.scrollPos = this.container.scrollLeft;
        }

        requestAnimationFrame((t) => this.animate(t));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Categories slider
    new HybridSlider('.categories-slider', 0.8);
    // Suppliers slider
    new HybridSlider('.suppliers-slider', 0.5);
});
