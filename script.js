// --- GLOBAL THEME PERSISTENCE ENGINE ---

// 1. Immediately check for a saved theme preference on page load
const savedTheme = localStorage.getItem('theme');
const body = document.body;

// 2. Apply the saved theme right away
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    updateToggleIcon(true);
} else {
    body.classList.remove('dark-mode');
    updateToggleIcon(false);
}

// 3. Wait for the DOM to load to attach the button listener
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Toggle the class on body
            const isDark = body.classList.toggle('dark-mode');
            
            // Save the new state in browser memory
            if (isDark) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            
            // Update the icon
            updateToggleIcon(isDark);
        });
    }
});

// Helper function to seamlessly swap the icon (Moon <-> Sun)
function updateToggleIcon(isDark) {
    // Looks for an <i> element inside any element with the id 'theme-toggle'
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        if (isDark) {
            icon.className = 'fas fa-sun'; // Sun icon when dark mode is active
        } else {
            icon.className = 'fas fa-moon'; // Moon icon when light mode is active
        }
    }
}
