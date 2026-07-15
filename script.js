// --- GLOBAL THEME SYSTEM ---

function applyTheme() {

    const savedTheme = localStorage.getItem("theme");
    const body = document.body;

    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        updateToggleIcon(true);
    } else {
        body.classList.remove("dark-mode");
        updateToggleIcon(false);
    }
}


// Change moon/sun icon
function updateToggleIcon(isDark) {

    const icon = document.querySelector("#theme-toggle i");

    if (icon) {
        icon.className = isDark 
            ? "fas fa-sun" 
            : "fas fa-moon";
    }
}


// Blue flash + particle animation
function showThemeAnimation() {

    const animation = document.createElement("div");

    animation.className = "theme-animation";

    document.body.appendChild(animation);


    setTimeout(() => {

        animation.remove();

    }, 800);

}


// Load saved theme
applyTheme();


// Fix browser cache issue
window.addEventListener("pageshow", () => {

    applyTheme();

});


// Theme button
document.addEventListener("DOMContentLoaded", () => {


    const themeToggleBtn = document.getElementById("theme-toggle");


    if (themeToggleBtn) {


        themeToggleBtn.addEventListener("click", () => {


            const isDark = document.body.classList.toggle("dark-mode");


            localStorage.setItem(
                "theme",
                isDark ? "dark" : "light"
            );


            updateToggleIcon(isDark);


            // Show blue theme transition
            showThemeAnimation();


        });

    }

});
