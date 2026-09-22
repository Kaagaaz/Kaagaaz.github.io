document.addEventListener("DOMContentLoaded", () => {
  const GITHUB_USERNAME = "Kaagaaz";
  const GITHUB_REPO = "kaagaaz.github.io";

  // 1. Theme Toggle
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

  // 2. Audio Toggle
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

  // 3. Projects Page
  const projectsGrid = document.getElementById("projects-grid-container");
  const projectDetail = document.getElementById("project-detail");
  const projectsHeader = document.getElementById("projects-header-area");

  if (projectsGrid) {
    fetchIssues(GITHUB_USERNAME, GITHUB_REPO, "project")
      .then((issues) => {
        projectsGrid.innerHTML = "";
        if (issues.length === 0) {
          projectsGrid.innerHTML = "<p class='bio-paragraph'>No projects found.</p>";
          return;
        }

        issues.forEach((issue) => {
          const item = document.createElement("article");
          item.className = "project-item";
          item.style.cursor = "pointer";

          item.innerHTML = `
            <div class="project-header">
              <h2 class="project-title">${escapeHTML(issue.title)}</h2>
              <span class="project-link"><i class="fa-solid fa-arrow-right"></i></span>
            </div>
            <p class="project-desc">${cleanSnippet(issue.body, 140)}</p>
          `;

          item.addEventListener("click", () => {
            showSingleView(issue, projectsGrid, projectDetail, projectsHeader);
          });

          projectsGrid.appendChild(item);
        });
      })
      .catch((err) => {
        console.error(err);
        projectsGrid.innerHTML = "<p class='bio-paragraph'>Error loading projects.</p>";
      });
  }

  // 4. Blog Page
  const blogList = document.getElementById("blog-posts-container");
  const blogDetail = document.getElementById("blog-detail");
  const blogHeader = document.getElementById("blog-header-area");

  if (blogList) {
    fetchIssues(GITHUB_USERNAME, GITHUB_REPO, "blog")
      .then((issues) => {
        blogList.innerHTML = "";
        if (issues.length === 0) {
          blogList.innerHTML = "<p class='bio-paragraph'>No blog posts found.</p>";
          return;
        }

        issues.forEach((issue) => {
          const createdDate = new Date(issue.created_at)
            .toISOString()
            .split("T")[0]
            .replace(/-/g, ".");

          const item = document.createElement("article");
          item.className = "blog-item";
          item.style.cursor = "pointer";

          item.innerHTML = `
            <span class="blog-date">${createdDate}</span>
            <h2 class="blog-title"><a>${escapeHTML(issue.title)}</a></h2>
            <p class="blog-snippet">${cleanSnippet(issue.body, 160)}</p>
          `;

          item.addEventListener("click", () => {
            showSingleView(issue, blogList, blogDetail, blogHeader);
          });

          blogList.appendChild(item);
        });
      })
      .catch((err) => {
        console.error(err);
        blogList.innerHTML = "<p class='bio-paragraph'>Error loading blog posts.</p>";
      });
  }
});

// Fetch Issues API
async function fetchIssues(owner, repo, label) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues?labels=${label}&state=open`
  );
  if (!response.ok) throw new Error("Failed to fetch issues");
  return await response.json();
}

// Single View Render Routine
function showSingleView(issue, listContainer, detailContainer, headerArea) {
  // Completely hide list & section headers
  listContainer.style.display = "none";
  if (headerArea) headerArea.style.display = "none";

  const parsedContent = typeof marked !== "undefined" && marked.parse 
    ? marked.parse(issue.body || "") 
    : `<p>${escapeHTML(issue.body || "")}</p>`;

  const createdDate = new Date(issue.created_at)
    .toISOString()
    .split("T")[0]
    .replace(/-/g, ".");

  detailContainer.hidden = false;
  detailContainer.style.display = "block";

  detailContainer.innerHTML = `
    <button id="back-btn" class="icon-btn" style="margin-bottom: 24px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem; cursor: pointer;">
      <i class="fa-solid fa-arrow-left"></i> Back
    </button>
    <div class="hero-header">
      <span class="greeting">${createdDate}</span>
      <h1 class="name">${escapeHTML(issue.title)}</h1>
    </div>
    <div class="markdown-body" style="margin-top: 24px;">
      ${parsedContent}
    </div>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    detailContainer.hidden = true;
    detailContainer.style.display = "none";
    detailContainer.innerHTML = "";
    
    // Restore list & headers
    listContainer.style.display = "flex";
    if (headerArea) headerArea.style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function cleanSnippet(str, length) {
  if (!str) return "";
  // Strip HTML and Markdown images/links from card preview text
  const clean = str
    .replace(/<[^>]*>?/gm, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .trim();
  return escapeHTML(clean.slice(0, length)) + (clean.length > length ? "..." : "");
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
