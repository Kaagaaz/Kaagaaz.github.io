const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle.querySelector('i');

// Listen for clicks on the toggle button
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Smoothly swap icon elements between the moon and sun symbols
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});
