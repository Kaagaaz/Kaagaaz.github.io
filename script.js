document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle Logic
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;

  function updateThemeIcon() {
    if (!themeIcon) return;
    if (document.body.classList.contains("dark-mode")) {
      themeIcon.className = "fa-solid fa-sun";
    } else {
      themeIcon.className = "fa-solid fa-moon";
    }
  }

  updateThemeIcon();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      updateThemeIcon();
    });
  }

  // Audio Toggle Logic
  const bgm = document.getElementById("bgm");
  const musicToggleBtn = document.getElementById("music-toggle");

  if (musicToggleBtn && bgm) {
    musicToggleBtn.addEventListener("click", () => {
      if (bgm.paused) {
        bgm.play();
        musicToggleBtn.classList.add("playing");
      } else {
        bgm.pause();
        musicToggleBtn.classList.remove("playing");
      }
    });
  }
});
