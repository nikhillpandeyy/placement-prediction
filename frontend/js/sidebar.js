/**
 * sidebar.js — Sidebar Navigation Controller (Enhanced)
 * Handles toggle, mobile menu, active page highlighting,
 * tooltips for collapsed state, and smooth transitions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Populate user info from localStorage
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user && user.name) {
                const nameEl = document.getElementById('sidebar-user-name');
                const avatarEl = document.getElementById('sidebar-avatar');
                if (nameEl) nameEl.textContent = user.name;
                if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
            }
        }
    } catch (e) {
        console.error('Error loading user info', e);
    }

    // Highlight active nav item based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.nav-item').forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPage.includes(href.replace('.html', ''))) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Mobile hamburger toggle
    const hamburger = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('visible');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
        });
    }

    // Manage tooltip visibility based on sidebar collapsed state
    manageSidebarTooltips();
    window.addEventListener('resize', manageSidebarTooltips);
});

/**
 * Show tooltips only when sidebar is collapsed (tablet breakpoint)
 */
function manageSidebarTooltips() {
    const tooltips = document.querySelectorAll('.nav-tooltip');
    const isCollapsed = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    tooltips.forEach(tooltip => {
        tooltip.style.display = isCollapsed ? '' : 'none';
    });
}
