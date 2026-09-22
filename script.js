/* =========================================================
   BLOG POST — ARTICLE VIEW
   ========================================================= */

.single-page {
    max-width: 820px;
    margin: 0 auto;
    padding: 35px 0 110px;
}


/* BACK LINK */

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 9px;

    margin-bottom: 70px;

    color: var(--muted);
    text-decoration: none;

    font-size: 0.72rem;

    transition:
        color 0.2s ease,
        gap 0.2s ease;
}

.back-link:hover {
    color: var(--text);
    gap: 13px;
}


/* ARTICLE HEADER */

.single-header {
    margin-bottom: 55px;
}

.single-header .page-label {
    margin-bottom: 18px;
}

.single-title {
    margin: 0 0 18px;

    max-width: 900px;

    font-size: clamp(
        2.1rem,
        5vw,
        4rem
    );

    line-height: 1.08;

    letter-spacing: -0.055em;

    font-weight: 600;
}

.single-meta {
    color: var(--subtle);

    font-size: 0.7rem;
}


/* ARTICLE CONTENT */

.markdown-content {
    color: var(--text);

    font-size: 0.88rem;

    line-height: 1.9;
}


/* PARAGRAPHS */

.markdown-content p {
    margin: 0 0 25px;
}


/* HEADINGS */

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4 {
    margin-top: 55px;
    margin-bottom: 20px;

    line-height: 1.3;

    letter-spacing: -0.025em;
}

.markdown-content h1 {
    font-size: 1.7rem;
}

.markdown-content h2 {
    font-size: 1.35rem;
}

.markdown-content h3 {
    font-size: 1.1rem;
}

.markdown-content h4 {
    font-size: 0.95rem;
}


/* LINKS */

.markdown-content a {
    color: var(--accent);

    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
}


/* LISTS */

.markdown-content ul,
.markdown-content ol {
    margin: 0 0 28px;

    padding-left: 25px;
}

.markdown-content li {
    margin-bottom: 9px;
}


/* BLOCKQUOTE */

.markdown-content blockquote {
    margin: 35px 0;

    padding: 5px 0 5px 20px;

    border-left: 2px solid var(--border);

    color: var(--muted);
}


/* CODE */

.markdown-content pre {
    overflow-x: auto;

    margin: 32px 0;

    padding: 22px;

    border: 1px solid var(--border);

    background: var(--surface);

    font-size: 0.76rem;

    line-height: 1.7;
}

.markdown-content code {
    font-family: inherit;
}

.markdown-content :not(pre) > code {
    padding: 3px 6px;

    border: 1px solid var(--border);

    background: var(--surface);

    font-size: 0.8em;
}


/* IMAGES */

.markdown-content img {
    display: block;

    max-width: 100%;
    height: auto;

    margin: 38px auto;

    border: 1px solid var(--border);
}


/* TABLES */

.markdown-content table {
    width: 100%;

    margin: 35px 0;

    border-collapse: collapse;

    font-size: 0.78rem;
}

.markdown-content th,
.markdown-content td {
    padding: 12px 14px;

    border: 1px solid var(--border);

    text-align: left;
}

.markdown-content th {
    font-weight: 600;

    background: var(--surface);
}


/* HORIZONTAL RULE */

.markdown-content hr {
    margin: 55px 0;

    border: 0;

    border-top: 1px solid var(--border);
}


/* ARTICLE ACTION */

.single-actions {
    display: flex;

    margin-top: 65px;

    padding-top: 25px;

    border-top: 1px solid var(--border);
}

.single-actions .button {
    display: inline-flex;

    align-items: center;
    gap: 10px;
}


/* MOBILE */

@media (max-width: 700px) {

    .single-page {
        padding:
            25px
            0
            80px;
    }

    .back-link {
        margin-bottom: 50px;
    }

    .single-header {
        margin-bottom: 40px;
    }

    .single-title {
        font-size: 2rem;

        letter-spacing: -0.045em;
    }

    .markdown-content {
        font-size: 0.84rem;

        line-height: 1.85;
    }

    .markdown-content pre {
        margin-left: -10px;
        margin-right: -10px;

        border-left: 0;
        border-right: 0;
    }

    .markdown-content table {
        display: block;

        overflow-x: auto;

        white-space: nowrap;
    }

}

What this changes

Your blog now has two distinct states:

Blog listing

/blog

Things I find
interesting.

Research, experiments...

────────────────────────────
DDLC Deep Dark Iceberg
Research into...
20 Sep 2026
────────────────────────────
Another Blog Post
...

Individual post

← back to blog

/blog

DDLC Deep Dark Iceberg

20 Sep 2026

The rabbit hole goes much deeper...

## Hidden Files

...

## Secret Poems

...

────────────────────────────
view on GitHub

It also properly handles Markdown headings, code blocks, images, tables, lists, links, blockquotes, and horizontal rules, which is useful since your GitHub Issues are acting as the CMS.

Next: we can refine the Projects page so the cards have the sleek look you want without making them overly bulky.
