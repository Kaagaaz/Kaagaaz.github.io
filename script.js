// --- GLOBAL THEME SYSTEM ---


// Apply saved theme
function applyTheme() {

    const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    body.classList.remove("dark-mode");
    updateToggleIcon(false);
} else {
    // Default = Dark
    body.classList.add("dark-mode");
    updateToggleIcon(true);
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

        butterfly.style.setProperty(
    "--size",
    0.5 + Math.random() * 0.3
);


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

// --- HOME PAGE MUSIC SYSTEM ---

document.addEventListener("DOMContentLoaded",()=>{


const music = document.getElementById("bgm");

const musicBtn = document.getElementById("music-toggle");



if(music && musicBtn){


const icon = musicBtn.querySelector("i");



musicBtn.addEventListener("click",()=>{


if(music.paused){


    music.play();


    icon.className="fa-solid fa-pause";


}

else{


    music.pause();


    icon.className="fa-solid fa-play";


}


});


}


});
