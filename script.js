// =========================================
// KAAGAAZ.GITHUB.IO — SITE SCRIPT
// Theme + butterflies + music + GitHub-issues CMS
// Separate pages: index / projects / blog
// =========================================


// --- GLOBAL THEME SYSTEM ---


// Apply saved theme
function applyTheme() {

    const savedTheme = localStorage.getItem("theme");
    const body = document.body;

    if (savedTheme === "light") {
        body.classList.remove("dark-mode");
        updateToggleIcon(false);
    } else {
        body.classList.add("dark-mode");
        updateToggleIcon(true);
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


        butterfly.style.setProperty("--x", x + "px");

        butterfly.style.setProperty("--y", y + "px");


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



// --- MUSIC SYSTEM (index page) ---

document.addEventListener("DOMContentLoaded", () => {


    const music = document.getElementById("bgm");

    const musicBtn = document.getElementById("music-toggle");


    if (music && musicBtn) {


        const icon = musicBtn.querySelector("i");


        musicBtn.addEventListener("click", () => {


            if (music.paused) {

                music.play();

                icon.className = "fa-solid fa-pause";

                musicBtn.classList.add("playing");

            } else {

                music.pause();

                icon.className = "fa-solid fa-play";

                musicBtn.classList.remove("playing");

            }

        });

    }

});



// =========================================
// FEED SYSTEM — BLOGS & PROJECTS FROM ISSUES
// =========================================


const GITHUB_USERNAME = "Kaagaaz";

const REPO_NAME = "Kaagaaz.github.io";


const feedCache = {};


async function fetchIssues(label) {

    if (feedCache[label]) {
        return feedCache[label];
    }


    const url =
        `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/issues?labels=${label}&state=open`;


    const response = await fetch(url);


    if (!response.ok) {
        throw new Error("Failed to load " + label + " feed");
    }


    const issues = await response.json();

    feedCache[label] = issues;

    return issues;

}


// Cleans up Markdown to create a neat text snippet
function createSnippet(markdownText) {

    if (!markdownText) return "No preview available.";


    let cleanText = markdownText

        .replace(/<!--[\s\S]*?-->/g, "")  // HTML comments
        .replace(/<[^>]*>/g, "")          // HTML tags
        .replace(/!\[.*?\]\(.*?\)/g, '')  // images
        .replace(/\[.*?\]\(.*?\)/g, '')   // hyper-links
        .replace(/`{3}[\s\S]*?`{3}/g, '') // code blocks
        .replace(/`.*?`/g, '')            // inline code
        .replace(/[#*_-]/g, '')           // markdown symbols
        .trim();


    if (cleanText.length > 140) {
        return cleanText.substring(0, 140) + "...";
    }


    return cleanText || "View full entry for details.";

}


// Prevents GitHub issue titles from becoming HTML
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text || "";

    return div.innerHTML;

}


function formatDate(isoString) {

    return new Date(isoString).toLocaleDateString('en-US', {

        year: 'numeric',
        month: 'long',
        day: 'numeric'

    });

}



// ---------- BLOG PAGE ----------


async function loadBlogList() {

    const container =
        document.getElementById('blog-posts-container');


    try {


        const issues = await fetchIssues('blog');

        container.innerHTML = '';


        if (issues.length === 0) {

            container.innerHTML =
                `<p class="no-posts">No updates posted yet. Come back soon!</p>`;

            return;

        }


        issues.forEach(issue => {


            const postCard = document.createElement('article');

            postCard.className = 'blog-post';


            const snippet = createSnippet(issue.body);


            postCard.innerHTML = `

                <h2 class="post-title">${escapeHTML(issue.title)}</h2>

                <p class="post-date">Logged on ${formatDate(issue.created_at)}</p>

                <p class="post-snippet">${escapeHTML(snippet)}</p>

                <a href="blog.html?post=${issue.number}" class="btn">Read Full Post →</a>

            `;


            container.appendChild(postCard);

        });


    } catch (error) {

        console.error(error);

        container.innerHTML =
            `<p class="no-posts">Oops! Failed to connect to the digital archive.</p>`;

    }

}



// ---------- BLOG SINGLE ----------


async function showSingleBlogPost(id) {

    const container = document.getElementById('blog-posts-container');

    const headerArea = document.getElementById('blog-header-area');

    const detail = document.getElementById('blog-detail');


    if (!detail) return;


    if (container) container.style.display = 'none';

    if (headerArea) headerArea.style.display = 'none';

    detail.hidden = false;


    detail.innerHTML =
        `<p class="feed-message">Opening the log entry...</p>`;


    const url =
        `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/issues/${id}`;


    try {


        const response = await fetch(url);


        if (!response.ok) throw new Error("Entry missing");


        const issue = await response.json();


        const parsedBody =
            marked.parse(issue.body || "No content written.");


        detail.innerHTML = `

            <a href="blog.html" class="back-link">

                <i class="fas fa-arrow-left"></i> back to all blogs

            </a>

            <h1 class="full-title">${escapeHTML(issue.title)}</h1>

            <p class="post-date">Logged on ${formatDate(issue.created_at)}</p>

            <div class="post-body">${parsedBody}</div>

        `;


    } catch (error) {

        console.error(error);

        detail.innerHTML = `

            <p class="no-posts">

                Oops! This log entry couldn't be found.

                <a href="blog.html">Return to logs</a>

            </p>

        `;

    }

}



// ---------- PROJECTS PAGE ----------


async function loadProjectsList() {

    const container =
        document.getElementById('projects-grid-container');


    try {


        const issues = await fetchIssues('project');

        container.innerHTML = '';


        if (issues.length === 0) {

            container.innerHTML = `

                <p class="feed-message">

                    No projects showcased yet. Check back soon!

                </p>

            `;

            return;

        }


        issues.forEach(issue => {


            const projectCard = document.createElement("article");

            projectCard.className = "project-card";


            const snippet = createSnippet(issue.body);


            projectCard.innerHTML = `

                <div class="project-card-top">

                    <span>[ SYSTEM_FILE: PROJ_${issue.number} ]</span>

                    <span class="gacha-stars">✦ ✦ ✦ ✦ ✦</span>

                </div>

                <div class="project-card-content">

                    <h2>${escapeHTML(issue.title)}</h2>

                    <p class="project-card-body">${escapeHTML(snippet)}</p>

                </div>

                <a href="projects.html?project=${issue.number}" class="project-view-btn">View →</a>

            `;


            container.appendChild(projectCard);

        });


    } catch (error) {

        console.error(error);

        container.innerHTML = `

            <p class="feed-message">

                Oops! Failed to connect to the creations grid.

            </p>

        `;

    }

}



// ---------- PROJECT SINGLE ----------


async function showSingleProject(id) {

    const container =
        document.getElementById('projects-grid-container');

    const headerArea =
        document.getElementById('projects-header-area');

    const detail = document.getElementById('project-detail');


    if (!detail) return;


    if (container) container.style.display = 'none';

    if (headerArea) headerArea.style.display = 'none';

    detail.hidden = false;


    detail.innerHTML =
        `<p class="feed-message">Booting project file...</p>`;


    const url =
        `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/issues/${id}`;


    try {


        const response = await fetch(url);


        if (!response.ok) throw new Error("Project not found");


        const issue = await response.json();


        const parsedContent =
            marked.parse(issue.body || "No documentation supplied.");


        detail.innerHTML = `

            <a href="projects.html" class="back-link">

                <i class="fas fa-arrow-left"></i> back to all projects

            </a>

            <h1 class="full-title">${escapeHTML(issue.title)}</h1>

            <div class="post-body">${parsedContent}</div>

        `;


    } catch (error) {

        console.error(error);

        detail.innerHTML = `

            <p class="no-posts">

                Oops! This project detail could not be loaded.

                <a href="projects.html">Return to projects</a>

            </p>

        `;

    }

}



// ---------- ROUTING ----------


/*

 * Each page initializes only its own feed:

 *   index.html    -> about section only (no feeds)

 *   blog.html     -> ?post=N opens one post, otherwise the list

 *   projects.html -> ?project=N opens one project, otherwise the grid

 */


function routeCurrentPage() {


    const params =
        new URLSearchParams(window.location.search);


    if (document.getElementById("blog-posts-container")) {


        const postId = params.get("post");


        if (postId) {
            showSingleBlogPost(postId);
        } else {
            loadBlogList();
        }

    }


    if (document.getElementById("projects-grid-container")) {


        const projectId = params.get("project");


        if (projectId) {
            showSingleProject(projectId);
        } else {
            loadProjectsList();
        }

    }

}



// ---------- INITIALIZE ----------


document.addEventListener("DOMContentLoaded", () => {

    routeCurrentPage();

});
