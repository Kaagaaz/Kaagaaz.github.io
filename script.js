// --- GLOBAL THEME SYSTEM ---


// Apply saved theme
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




// Blue flash + butterfly transition

function showThemeAnimation() {


    const animation = document.createElement("div");


    animation.className = "theme-animation";



    // Number of butterflies

    const butterflyCount = 30;



    for (let i = 0; i < butterflyCount; i++) {



        const butterfly = document.createElement("div");


        butterfly.className = "butterfly";



        // Butterfly structure

        butterfly.innerHTML = `

            <span class="wing left"></span>

            <span class="wing right"></span>

            <span class="body"></span>

        `;



        // Random scattering distance

        const x =
            (Math.random() - 0.5) * window.innerWidth * 1.2;


        const y =
            (Math.random() - 0.5) * window.innerHeight * 1.2;



        butterfly.style.setProperty(
            "--x",
            x + "px"
        );


        butterfly.style.setProperty(
            "--y",
            y + "px"
        );



        // Random butterfly size

        const size =
            0.4 + Math.random() * 0.8;


        butterfly.style.transform =
            `scale(${size})`;



        // Random flying delay

        butterfly.style.animationDelay =
            Math.random() * 0.7 + "s";



        animation.appendChild(butterfly);


    }



    document.body.appendChild(animation);




    setTimeout(() => {

        animation.remove();

    }, 3000);



}




// Load theme on opening

applyTheme();





// Fix browser cache issue

window.addEventListener("pageshow", () => {

    applyTheme();

});






// Theme toggle button

document.addEventListener("DOMContentLoaded", () => {



    const themeToggleBtn =
        document.getElementById("theme-toggle");



    if (themeToggleBtn) {



        themeToggleBtn.addEventListener("click", () => {



            const isDark =
                document.body.classList.toggle("dark-mode");



            localStorage.setItem(
                "theme",
                isDark ? "dark" : "light"
            );



            updateToggleIcon(isDark);



            // Start butterfly effect

            showThemeAnimation();



        });



    }



});
