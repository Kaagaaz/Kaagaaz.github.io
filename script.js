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


    const directions = [
        [-250, -200],
        [-150, 120],
        [0, -300],
        [200, -180],
        [260, 100],
        [-220, 200],
        [120, 230],
        [300, -100]
    ];


    directions.forEach((direction, index) => {

        const butterfly = document.createElement("span");

        butterfly.className = "butterfly";

        butterfly.innerHTML = `
            <span class="wing left"></span>
            <span class="wing right"></span>
            <span class="body"></span>
        `;


        butterfly.style.setProperty(
            "--x",
            direction[0] + "px"
        );

        butterfly.style.setProperty(
            "--y",
            direction[1] + "px"
        );


        butterfly.style.animationDelay =
            index * 0.08 + "s";


        animation.appendChild(butterfly);

    });


    document.body.appendChild(animation);


    setTimeout(() => {
        animation.remove();
    }, 2500);

}
