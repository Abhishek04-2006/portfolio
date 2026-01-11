/**
 * Theme Switcher Module
 * Handles light/dark mode toggling with localStorage persistence
 * @module theme-switcher
 */

const ThemeSwitcher = (() => {
    const THEME_KEY = 'portfolio-theme';
    const DARK_MODE_CLASS = 'dark';
    
    /**
     * Initialize theme switcher
     */
    const init = () => {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        
        // Load saved theme or detect system preference
        loadTheme();
        
        // Add event listener to toggle button
        themeToggle.addEventListener('click', toggle);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange);
    };
    
    /**
     * Load theme from localStorage or system preference
     */
    const loadTheme = () => {
        const saved = localStorage.getItem(THEME_KEY);
        
        if (saved) {
            setTheme(saved);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    };
    
    /**
     * Set theme to light or dark
     * @param {string} theme - 'light' or 'dark'
     */
    const setTheme = (theme) => {
        const html = document.documentElement;
        const themeToggle = document.getElementById('theme-toggle');
        
        if (theme === 'dark') {
            html.classList.add(DARK_MODE_CLASS);
            if (themeToggle) themeToggle.textContent = '☀️';
        } else {
            html.classList.remove(DARK_MODE_CLASS);
            if (themeToggle) themeToggle.textContent = '🌙';
        }
        
        localStorage.setItem(THEME_KEY, theme);
    };
    
    /**
     * Toggle between light and dark themes
     */
    const toggle = () => {
        const isDark = document.documentElement.classList.contains(DARK_MODE_CLASS);
        setTheme(isDark ? 'light' : 'dark');
    };
    
    /**
     * Handle system theme changes
     * @param {MediaQueryListEvent} e - Media query event
     */
    const handleSystemThemeChange = (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    };
    
    return {
        init,
        toggle,
        setTheme,
        isDark: () => document.documentElement.classList.contains(DARK_MODE_CLASS)
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ThemeSwitcher.init);
} else {
    ThemeSwitcher.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSwitcher;
}
