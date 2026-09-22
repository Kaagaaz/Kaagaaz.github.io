/* =========================================================
   KAAGAAZ — MAIN SCRIPT
   ========================================================= */

const GITHUB_USERNAME = "Kaagaaz";
const REPO_NAME = "Kaagaaz.github.io";

const API_BASE =
    `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/issues`;

const issueCache = {};


// =========================================================
// THEME
// =========================================================

function setupTheme() {

    const savedTheme =
        localStorage.getItem("theme");

    const isLight =
        savedTheme === "light";

    // Keep <html> and <body> synchronized
    document.documentElement.classList.toggle(
        "dark-mode",
        !isLight
    );

    document.body.classList.toggle(
        "dark-mode",
        !isLight
    );

    updateThemeIcon();

    const themeButton =
        document.getElementById("theme-toggle");

    if (!themeButton) return;

    themeButton.addEventListener("click", () => {

        const currentlyDark =
            document.documentElement.classList.contains(
                "dark-mode"
            );

        const nextTheme =
            currentlyDark ? "light" : "dark";


        /*
         * Temporarily enable transitions so the
         * theme changes smoothly.
         */

        document.documentElement.classList.add(
            "theme-transition"
        );

        document.body.classList.add(
            "theme-transition"
        );


        // Change theme
        document.documentElement.classList.toggle(
            "dark-mode",
            nextTheme === "dark"
        );

        document.body.classList.toggle(
            "dark-mode",
            nextTheme === "dark"
        );


        // Remember theme
        localStorage.setItem(
            "theme",
            nextTheme
        );


        // Update icon
        updateThemeIcon();


        // Remove transition helper
        setTimeout(() => {

            document.documentElement.classList.remove(
                "theme-transition"
            );

            document.body.classList.remove(
                "theme-transition"
            );

        }, 500);

    });
}


function updateThemeIcon() {

    const button =
        document.getElementById("theme-toggle");

    if (!button) return;

    const icon =
        button.querySelector("i");

    if (!icon) return;

    const isDark =
        document.documentElement.classList.contains(
            "dark-mode"
        );

    icon.className = isDark
        ? "fa-solid fa-sun"
        : "fa-solid fa-moon";
}


// =========================================================
// MUSIC
// =========================================================

function setupMusic() {

    const music =
        document.getElementById("bgm");

    const button =
        document.getElementById("music-toggle");

    if (!music || !button) return;

    const icon =
        button.querySelector("i");


    button.addEventListener("click", async () => {

        try {

            if (music.paused) {

                await music.play();

                if (icon) {
                    icon.className =
                        "fa-solid fa-volume-high";
                }

            } else {

                music.pause();

                if (icon) {
                    icon.className =
                        "fa-solid fa-volume-xmark";
                }

            }

        } catch (error) {

            console.warn(
                "Music could not be played:",
                error
            );

        }

    });


    music.addEventListener("ended", () => {

        if (icon) {
            icon.className =
                "fa-solid fa-volume-xmark";
        }

    });

}


// =========================================================
// GITHUB ISSUES
// =========================================================

async function fetchIssues(label) {

    // Use cached results when available
    if (issueCache[label]) {
        return issueCache[label];
    }


    try {

        const response = await fetch(
            `${API_BASE}?labels=${encodeURIComponent(label)}&state=open&per_page=100`
        );


        if (!response.ok) {

            throw new Error(
                `GitHub API returned ${response.status}`
            );

        }


        const issues =
            await response.json();


        /*
         * GitHub's Issues API also returns pull requests.
         * Remove them so they don't appear as projects
         * or notes.
         */

        const filtered =
            issues.filter(
                issue => !issue.pull_request
            );


        issueCache[label] =
            filtered;


        return filtered;

    } catch (error) {

        console.error(
            `Failed to load ${label} issues:`,
            error
        );

        return [];

    }

}


// =========================================================
// HTML ESCAPING
// =========================================================

function escapeHTML(value = "") {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================================================
// MARKDOWN
// =========================================================

function renderMarkdown(markdown = "") {

    if (
        typeof marked !== "undefined" &&
        typeof marked.parse === "function"
    ) {

        return marked.parse(markdown, {
            breaks: true,
            gfm: true
        });

    }


    // Fallback if Marked fails to load
    return `<p>${escapeHTML(markdown)}</p>`;

}


// =========================================================
// DATE FORMATTING
// =========================================================

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// =========================================================
// CREATE TEXT SNIPPET
// =========================================================

function createSnippet(
    text = "",
    length = 180
) {

    const cleanText =
        String(text)
            .replace(/[#>*_`~]/g, "")
            .replace(
                /\[([^\]]+)\]\([^)]+\)/g,
                "$1"
            )
            .replace(/\s+/g, " ")
            .trim();


    if (cleanText.length <= length) {
        return cleanText;
    }


    return (
        cleanText
            .substring(0, length)
            .trim() +
        "..."
    );

}


// =========================================================
// LOADING / ERROR STATES
// =========================================================

function showLoading(
    container,
    message
) {

    if (!container) return;

    container.innerHTML = `
        <div class="loading-state">
            ${escapeHTML(message)}
        </div>
    `;

}


function showError(
    container,
    message
) {

    if (!container) return;

    container.innerHTML = `
        <div class="empty-state">
            <p>${escapeHTML(message)}</p>
        </div>
    `;

}


// =========================================================
// BLOG / NOTES LIST
// =========================================================

async function loadBlogList() {

    const container =
        document.getElementById(
            "blog-list-container"
        );


    if (!container) return;


    showLoading(
        container,
        "Loading notes..."
    );


    const posts =
        await fetchIssues("blog");


    if (!posts.length) {

        showError(
            container,
            "No notes found."
        );

        return;
    }


    container.innerHTML =
        posts.map(post => {

            const title =
                escapeHTML(post.title);


            const description =
                escapeHTML(
                    createSnippet(
                        post.body || "",
                        180
                    )
                );


            const date =
                formatDate(
                    post.created_at
                );


            return `

                <a
                    class="blog-item"
                    href="blog.html?post=${post.number}"
                >

                    <div class="blog-item-main">

                        <div class="blog-item-title">
                            ${title}
                        </div>

                        <div class="blog-item-description">
                            ${description}
                        </div>

                    </div>

                    <div class="blog-item-date">
                        ${date}
                    </div>

                </a>

            `;

        }).join("");

}


// =========================================================
// SINGLE BLOG POST
// =========================================================

async function loadSingleBlog(
    postNumber
) {

    const detail =
        document.getElementById(
            "blog-detail"
        );


    const header =
        document.getElementById(
            "blog-header-area"
        );


    const list =
        document.getElementById(
            "blog-list-container"
        );


    if (!detail) return;

    if (!postNumber) return;


    // Hide list
    if (header) {
        header.style.display = "none";
    }

    if (list) {
        list.style.display = "none";
    }


    // Show detail
    detail.hidden = false;


    showLoading(
        detail,
        "Loading note..."
    );


    const posts =
        await fetchIssues("blog");


    const post =
        posts.find(
            item =>
                String(item.number) ===
                String(postNumber)
        );


    if (!post) {

        showError(
            detail,
            "This note could not be found."
        );

        return;
    }


    document.title =
        `${post.title} | Kaagaaz`;


    detail.innerHTML = `

        <a
            class="back-link"
            href="blog.html"
        >
            <i class="fa-solid fa-arrow-left"></i>
            back to notes
        </a>


        <div class="single-header">

            <div class="page-label">
                / note
            </div>

            <h1 class="single-title">
                ${escapeHTML(post.title)}
            </h1>

            <div class="single-meta">
                ${formatDate(post.created_at)}
            </div>

        </div>


        <div class="markdown-content">
            ${renderMarkdown(post.body || "")}
        </div>

    `;

}


// =========================================================
// PROJECT LIST
// =========================================================

async function loadProjectsList() {

    const container =
        document.getElementById(
            "projects-grid-container"
        );


    if (!container) return;


    showLoading(
        container,
        "Loading projects..."
    );


    const projects =
        await fetchIssues("project");


    if (!projects.length) {

        showError(
            container,
            "No projects found."
        );

        return;
    }


    container.innerHTML =
        projects.map(project => {

            const title =
                escapeHTML(
                    project.title
                );


            const description =
                escapeHTML(
                    createSnippet(
                        project.body || "",
                        150
                    )
                );


            const date =
                formatDate(
                    project.created_at
                );


            const number =
                String(project.number)
                    .padStart(2, "0");


            return `

                <a
                    class="project-card"
                    href="projects.html?project=${project.number}"
                >

                    <div class="project-card-top">

                        <span class="project-number">
                            #${number}
                        </span>

                        <i
                            class="fa-solid fa-arrow-up-right-from-square"
                        ></i>

                    </div>


                    <h2 class="project-card-title">
                        ${title}
                    </h2>


                    <p class="project-card-description">
                        ${description}
                    </p>


                    <div class="project-card-footer">
                        ${date}
                    </div>

                </a>

            `;

        }).join("");

}


// =========================================================
// SINGLE PROJECT
// =========================================================

async function loadSingleProject(
    projectNumber
) {

    const detail =
        document.getElementById(
            "project-detail"
        );


    const header =
        document.getElementById(
            "projects-header-area"
        );


    const grid =
        document.getElementById(
            "projects-grid-container"
        );


    if (!detail) return;

    if (!projectNumber) return;


    // Hide project list
    if (header) {
        header.style.display = "none";
    }

    if (grid) {
        grid.style.display = "none";
    }


    // Show project
    detail.hidden = false;


    showLoading(
        detail,
        "Loading project..."
    );


    const projects =
        await fetchIssues("project");


    const project =
        projects.find(
            item =>
                String(item.number) ===
                String(projectNumber)
        );


    if (!project) {

        showError(
            detail,
            "This project could not be found."
        );

        return;
    }


    document.title =
        `${project.title} | Kaagaaz`;


    detail.innerHTML = `

        <a
            class="back-link"
            href="projects.html"
        >
            <i class="fa-solid fa-arrow-left"></i>
            back to projects
        </a>


        <div class="single-header">

            <div class="page-label">
                / project #${String(project.number).padStart(2, "0")}
            </div>

            <h1 class="single-title">
                ${escapeHTML(project.title)}
            </h1>

            <div class="single-meta">
                ${formatDate(project.created_at)}
            </div>

        </div>


        <div class="markdown-content">
            ${renderMarkdown(project.body || "")}
        </div>


        <div class="single-actions">

            <a
                href="${project.html_url}"
                target="_blank"
                rel="noopener noreferrer"
                class="button button-secondary"
            >
                view on GitHub
                <i
                    class="fa-solid fa-arrow-up-right-from-square"
                ></i>
            </a>

        </div>

    `;

}


// =========================================================
// PAGE ROUTING
// =========================================================

function routeCurrentPage() {

    const path =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const params =
        new URLSearchParams(
            window.location.search
        );


    // -----------------------------------------
    // BLOG
    // -----------------------------------------

    if (path === "blog.html") {

        const postNumber =
            params.get("post");


        if (postNumber) {

            loadSingleBlog(
                postNumber
            );

        } else {

            loadBlogList();

        }


        return;
    }


    // -----------------------------------------
    // PROJECTS
    // -----------------------------------------

    if (path === "projects.html") {

        const projectNumber =
            params.get("project");


        if (projectNumber) {

            loadSingleProject(
                projectNumber
            );

        } else {

            loadProjectsList();

        }


        return;
    }

}


// =========================================================
// INITIALIZATION
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupTheme();

        setupMusic();

        routeCurrentPage();

    }
);
