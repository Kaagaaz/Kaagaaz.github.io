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


// Blue flash + floating butterfly animation
function showThemeAnimation() {

    const animation = document.createElement("div");

    animation.className = "theme-animation";


    // Create glowing butterflies
    for (let i = 0; i < 8; i++) {

        const butterfly = document.createElement("span");

        butterfly.className = "butterfly";

        butterfly.innerHTML = "🦋";


        butterfly.style.left = Math.random() * 100 + "%";

        butterfly.style.animationDelay =
            Math.random() * 0.5 + "s";


        butterfly.style.fontSize =
            (10 + Math.random() * 10) + "px";


        animation.appendChild(butterfly);
    }


    document.body.appendChild(animation);


    setTimeout(() => {

        animation.remove();

    }, 1200);

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


            // Show blue butterfly transition
            showThemeAnimation();


        });

    }

});
