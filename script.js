// --- GLOBAL THEME PERSISTENCE ENGINE ---

// 1. Function to evaluate and apply the correct theme from localStorage
function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateToggleIcon(true);
    } else {
        body.classList.remove('dark-mode');
        updateToggleIcon(false);
    }
}

// Helper function to swap the icon shape (Moon <-> Sun)
function updateToggleIcon(isDark) {
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        if (isDark) {
            icon.className = 'fas fa-sun'; // Sun icon for dark mode
        } else {
            icon.className = 'fas fa-moon'; // Moon icon for light mode
        }
    }
}

// 2. Run immediately on script load (handles fresh page entries)
applyTheme();

// 3. Crucial BF-Cache Fix: Listen to 'pageshow' to force-sync the theme
// This triggers even if the browser restores a frozen page from cache memory
window.addEventListener('pageshow', () => {
    applyTheme();
});

// 4. Bind the click event to toggle and save themes
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateToggleIcon(isDark);
        });
    }
});
