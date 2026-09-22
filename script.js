document.addEventListener("DOMContentLoaded", () => {
  // Configured specifically for your repository
  const GITHUB_USERNAME = "Kaagaaz";
  const GITHUB_REPO = "kaagaaz.github.io";

  // 1. Theme Toggle Logic
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;

  function updateThemeIcon() {
    if (!themeIcon) return;
    themeIcon.className = document.body.classList.contains("dark-mode")
      ? "fa-solid fa-sun"
      : "fa-solid fa-moon";
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

  // 2. Audio Toggle Logic
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

  // 3. Dynamic GitHub Issues Fetcher
  const projectList = document.querySelector(".project-list");
  const blogList = document.querySelector(".blog-list");

  if (projectList || blogList) {
    const label = projectList ? "project" : "blog";
    const targetContainer = projectList || blogList;

    fetchIssues(GITHUB_USERNAME, GITHUB_REPO, label, targetContainer);
  }
});

async function fetchIssues(owner, repo, label, container) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?labels=${label}&state=open`
    );

    if (!response.ok) throw new Error("Failed to fetch issues");

    const issues = await response.json();
    container.innerHTML = ""; 

    if (issues.length === 0) {
      container.innerHTML = `<p class="bio-paragraph">No ${label}s found yet.</p>`;
      return;
    }

    issues.forEach((issue) => {
      if (label === "project") {
        container.appendChild(createProjectElement(issue));
      } else {
        container.appendChild(createBlogElement(issue));
      }
    });
  } catch (error) {
    console.error("Error fetching GitHub issues:", error);
    container.innerHTML = `<p class="bio-paragraph">Unable to load ${label}s right now.</p>`;
  }
}

function createProjectElement(issue) {
  const article = document.createElement("article");
  article.className = "project-item";

  article.innerHTML = `
    <div class="project-header">
      <h2 class="project-title">${escapeHTML(issue.title)}</h2>
      <a href="${issue.html_url}" target="_blank" rel="noopener noreferrer" class="project-link" title="View Issue / Discussion">
        <i class="fa-brands fa-github"></i>
      </a>
    </div>
    <p class="project-desc">${escapeHTML(issue.body || "No description provided.")}</p>
  `;
  return article;
}

function createBlogElement(issue) {
  const article = document.createElement("article");
  article.className = "blog-item";

  const createdDate = new Date(issue.created_at)
    .toISOString()
    .split("T")[0]
    .replace(/-/g, ".");

  article.innerHTML = `
    <span class="blog-date">${createdDate}</span>
    <h2 class="blog-title">
      <a href="${issue.html_url}" target="_blank" rel="noopener noreferrer">${escapeHTML(issue.title)}</a>
    </h2>
    <p class="blog-snippet">${escapeHTML(issue.body || "").slice(0, 160)}...</p>
  `;
  return article;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
