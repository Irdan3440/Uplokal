/**
 * Auto-scroll automation for horizontal sliders.
 * Allows smooth continuous movement that pauses on user interaction
 * and supports mouse dragging on desktop.
 */
class AutoSlider {
    constructor(selector, speed = 0.5) {
        this.container = document.querySelector(selector);
        if (!this.container) return;

        this.speed = speed;
        this.isPaused = false;
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.scrollPos = this.container.scrollLeft;

        this.init();
    }

    init() {
        // Set visual cue for dragging
        this.container.style.cursor = 'grab';
        this.container.style.userSelect = 'none';

        // Mouse Events for Dragging (Laptop/Desktop)
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
                // Sync position for smooth resumption
                this.scrollPos = this.container.scrollLeft;
            }
        });

        this.container.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            const x = e.pageX - this.container.offsetLeft;
            const walk = (x - this.startX) * 1.5; // Scroll speed multiplier
            this.container.scrollLeft = this.scrollLeft - walk;
        });

        // Touch Events (Mobile)
        this.container.addEventListener('touchstart', () => {
            this.isPaused = true;
        }, { passive: true });

        this.container.addEventListener('touchend', () => {
            this.isPaused = false;
            this.scrollPos = this.container.scrollLeft;
        });

        // Pause on Hover
        this.container.addEventListener('mouseenter', () => {
            if (!this.isDragging) this.isPaused = true;
        });
        this.container.addEventListener('mouseleave', () => {
            if (!this.isDragging) this.isPaused = false;
        });

        // Start animation loop
        this.animate();
    }

    animate() {
        if (!this.isPaused && !this.isDragging) {
            this.scrollPos += this.speed;

            // Loop logic: reset when reaching halfway point
            const halfWidth = this.container.scrollWidth / 2;
            if (this.scrollPos >= halfWidth) {
                this.scrollPos = 0;
            }

            this.container.scrollLeft = this.scrollPos;
        } else if (this.isPaused && !this.isDragging) {
            // Constant sync while manually scrolling (trackpad/swipe)
            this.scrollPos = this.container.scrollLeft;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize sliders when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AutoSlider('.categories-slider', 0.6);
    new AutoSlider('.suppliers-slider', 0.4);
});
