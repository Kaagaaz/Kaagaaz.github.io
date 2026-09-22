/* =========================================================
   KAAGAAZ — SITE JAVASCRIPT
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const GITHUB_USERNAME = "Kaagaaz";
const REPO_NAME = "Kaagaaz.github.io";


/* =========================================================
   THEME
   ========================================================= */

function getCurrentTheme() {
    return localStorage.getItem("theme") || "dark";
}


function applyTheme() {

    const theme = getCurrentTheme();

    const isDark = theme === "dark";

    document.body.classList.toggle(
        "dark-mode",
        isDark
    );

    updateThemeIcon(isDark);
}


function updateThemeIcon(isDark) {

    const icon =
        document.querySelector(
            "#theme-toggle i"
        );

    if (!icon) return;

    icon.className = isDark
        ? "fa-solid fa-sun"
        : "fa-solid fa-moon";
}


/* =========================================================
   MUSIC
   ========================================================= */

function setupMusic() {

    const music =
        document.getElementById("bgm");

    const button =
        document.getElementById("music-toggle");

    if (!music || !button) return;

    const icon =
        button.querySelector("i");


    button.addEventListener(
        "click",
        async () => {

            try {

                if (music.paused) {

                    await music.play();

                    icon.className =
                        "fa-solid fa-pause";

                    button.setAttribute(
                        "aria-label",
                        "Pause music"
                    );

                } else {

                    music.pause();

                    icon.className =
                        "fa-solid fa-headphones";

                    button.setAttribute(
                        "aria-label",
                        "Play music"
                    );
                }

            } catch (error) {

                console.warn(
                    "Music could not start:",
                    error
                );

            }

        }
    );
}


/* =========================================================
   GITHUB API
   ========================================================= */

const feedCache = {};


async function fetchIssues(label) {

    if (feedCache[label]) {
        return feedCache[label];
    }


    const url =
        `https://api.github.com/repos/` +
        `${GITHUB_USERNAME}/` +
        `${REPO_NAME}/issues` +
        `?labels=${encodeURIComponent(label)}` +
        `&state=open`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            `GitHub API error: ${response.status}`
        );

    }


    const issues =
        await response.json();


    feedCache[label] =
        issues;


    return issues;
}


/* =========================================================
   SECURITY / HTML ESCAPING
   ========================================================= */

function escapeHTML(text) {

    const element =
        document.createElement("div");

    element.textContent =
        text || "";

    return element.innerHTML;
}


/* =========================================================
   TEXT PREVIEW
   ========================================================= */

function createSnippet(text) {

    if (!text) {
        return "No preview available.";
    }


    const cleanText =
        text

            .replace(
                /<!--[\s\S]*?-->/g,
                ""
            )

            .replace(
                /<[^>]*>/g,
                ""
            )

            .replace(
                /!\[.*?\]\(.*?\)/g,
                ""
            )

            .replace(
                /\[.*?\]\(.*?\)/g,
                ""
            )

            .replace(
                /```[\s\S]*?```/g,
                ""
            )

            .replace(
                /`.*?`/g,
                ""
            )

            .replace(
                /[#*_~-]/g,
                ""
            )

            .replace(
                /\s+/g,
                " "
            )

            .trim();


    if (!cleanText) {

        return "View the full entry for details.";

    }


    if (cleanText.length > 180) {

        return (
            cleanText.substring(0, 180) +
            "..."
        );

    }


    return cleanText;
}


/* =========================================================
   DATE FORMAT
   ========================================================= */

function formatDate(date) {

    return new Date(date)
        .toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );
}


/* =========================================================
   BLOG / NOTES
   ========================================================= */

async function loadBlogList() {

    const container =
        document.getElementById(
            "blog-posts-container"
        );


    if (!container) return;


    try {

        const issues =
            await fetchIssues("blog");


        container.innerHTML = "";


        if (!issues.length) {

            container.innerHTML = `
                <p class="no-posts">
                    No notes yet.
                    Check back soon.
                </p>
            `;

            return;
        }


        issues.forEach(issue => {

            const post =
                document.createElement(
                    "article"
                );


            post.className =
                "blog-post";


            post.innerHTML = `

                <h2 class="post-title">
                    ${escapeHTML(issue.title)}
                </h2>


                <p class="post-date">
                    ${formatDate(issue.created_at)}
                </p>


                <p class="post-snippet">
                    ${escapeHTML(
                        createSnippet(issue.body)
                    )}
                </p>


                <a
                    href="blog.html?post=${issue.number}"
                    class="btn"
                >
                    read note →
                </a>

            `;


            container.appendChild(post);

        });

    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <p class="no-posts">
                Couldn't connect to the
                notes archive.
            </p>
        `;

    }

}


/* =========================================================
   SINGLE BLOG POST
   ========================================================= */

async function showSingleBlogPost(id) {

    const container =
        document.getElementById(
            "blog-posts-container"
        );


    const header =
        document.getElementById(
            "blog-header-area"
        );


    const detail =
        document.getElementById(
            "blog-detail"
        );


    if (!detail) return;


    if (container) {
        container.style.display =
            "none";
    }


    if (header) {
        header.style.display =
            "none";
    }


    detail.hidden = false;


    detail.innerHTML = `
        <p class="feed-message">
            Opening note...
        </p>
    `;


    try {

        const response =
            await fetch(
                `https://api.github.com/repos/` +
                `${GITHUB_USERNAME}/` +
                `${REPO_NAME}/issues/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Note not found"
            );

        }


        const issue =
            await response.json();


        detail.innerHTML = `

            <a
                href="blog.html"
                class="back-link"
            >
                <i class="fas fa-arrow-left"></i>
                all notes
            </a>


            <h1 class="full-title">
                ${escapeHTML(issue.title)}
            </h1>


            <p class="post-date">
                ${formatDate(issue.created_at)}
            </p>


            <div class="post-body">

                ${
                    typeof marked !== "undefined"
                        ? marked.parse(
                            issue.body || ""
                        )
                        : escapeHTML(
                            issue.body || ""
                        )
                }

            </div>

        `;

    } catch (error) {

        console.error(error);


        detail.innerHTML = `

            <p class="no-posts">

                This note couldn't be found.

                <br><br>

                <a
                    class="back-link"
                    href="blog.html"
                >
                    ← return to notes
                </a>

            </p>

        `;

    }

}


/* =========================================================
   PROJECTS
   ========================================================= */

async function loadProjectsList() {

    const container =
        document.getElementById(
            "projects-grid-container"
        );


    if (!container) return;


    try {

        const issues =
            await fetchIssues("project");


        container.innerHTML = "";


        if (!issues.length) {

            container.innerHTML = `
                <p class="feed-message">
                    No projects showcased yet.
                </p>
            `;

            return;
        }


        issues.forEach(issue => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "project-card";


            card.innerHTML = `

                <div class="project-card-top">

                    <span>
                        PROJECT_${String(
                            issue.number
                        ).padStart(2, "0")}
                    </span>


                    <span class="gacha-stars">
                        ✦ ✦ ✦
                    </span>

                </div>


                <div class="project-card-content">

                    <h2>
                        ${escapeHTML(issue.title)}
                    </h2>


                    <p class="project-card-body">
                        ${escapeHTML(
                            createSnippet(
                                issue.body
                            )
                        )}
                    </p>

                </div>


                <a
                    href="projects.html?project=${issue.number}"
                    class="project-view-btn"
                >
                    view project →
                </a>

            `;


            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <p class="feed-message">
                Couldn't connect to the
                project archive.
            </p>
        `;

    }

}


/* =========================================================
   SINGLE PROJECT
   ========================================================= */

async function showSingleProject(id) {

    const container =
        document.getElementById(
            "projects-grid-container"
        );


    const header =
        document.getElementById(
            "projects-header-area"
        );


    const detail =
        document.getElementById(
            "project-detail"
        );


    if (!detail) return;


    if (container) {
        container.style.display =
            "none";
    }


    if (header) {
        header.style.display =
            "none";
    }


    detail.hidden = false;


    detail.innerHTML = `
        <p class="feed-message">
            Opening project...
        </p>
    `;


    try {

        const response =
            await fetch(
                `https://api.github.com/repos/` +
                `${GITHUB_USERNAME}/` +
                `${REPO_NAME}/issues/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Project not found"
            );

        }


        const issue =
            await response.json();


        detail.innerHTML = `

            <a
                href="projects.html"
                class="back-link"
            >
                <i class="fas fa-arrow-left"></i>
                all projects
            </a>


            <h1 class="full-title">
                ${escapeHTML(issue.title)}
            </h1>


            <div class="post-body">

                ${
                    typeof marked !== "undefined"
                        ? marked.parse(
                            issue.body || ""
                        )
                        : escapeHTML(
                            issue.body || ""
                        )
                }

            </div>

        `;

    } catch (error) {

        console.error(error);


        detail.innerHTML = `

            <p class="no-posts">

                This project couldn't be loaded.

                <br><br>

                <a
                    class="back-link"
                    href="projects.html"
                >
                    ← return to projects
                </a>

            </p>

        `;

    }

}


/* =========================================================
   PAGE ROUTING
   ========================================================= */

function routeCurrentPage() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    /* ---------- BLOG ---------- */

    const blogContainer =
        document.getElementById(
            "blog-posts-container"
        );


    if (blogContainer) {

        const postId =
            params.get("post");


        if (postId) {

            showSingleBlogPost(
                postId
            );

        } else {

            loadBlogList();

        }

    }


    /* ---------- PROJECTS ---------- */

    const projectsContainer =
        document.getElementById(
            "projects-grid-container"
        );


    if (projectsContainer) {

        const projectId =
            params.get("project");


        if (projectId) {

            showSingleProject(
                projectId
            );

        } else {

            loadProjectsList();

        }

    }

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* Theme */

        applyTheme();


        const themeButton =
            document.getElementById(
                "theme-toggle"
            );


        if (themeButton) {

            themeButton.addEventListener(
                "click",
                () => {

                    const isDark =
                        !document.body.classList.contains(
                            "dark-mode"
                        );


                    document.body.classList.toggle(
                        "dark-mode",
                        isDark
                    );


                    localStorage.setItem(
                        "theme",
                        isDark
                            ? "dark"
                            : "light"
                    );


                    updateThemeIcon(
                        isDark
                    );

                }
            );

        }


        /* Music */

        setupMusic();


        /* GitHub feeds */

        routeCurrentPage();

    }
);
