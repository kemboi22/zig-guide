# zig.guide — Nuxt Content template

A docs-site template inspired by [zig.guide](https://zig.guide/), rebuilt with **Nuxt 4** and **Nuxt Content v3**. It reproduces the original's layout — collapsible sidebar, version selector, on-page table of contents, prev/next pagination, dark/light mode — as a Markdown-driven Nuxt app you can drop your own content into.

## Stack

- [Nuxt 4](https://nuxt.com)
- [`@nuxt/content`](https://content.nuxt.com) v3 — Markdown collections, full-text-search-ready
- [`@nuxtjs/color-mode`](https://color-mode.nuxtjs.org) — dark/light theme toggle
- Hand-written CSS using custom properties (no Tailwind/UI framework dependency), themed around Zig's brand orange (`#f7a41d`)

## Getting started

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

> **Note:** `@nuxt/content` defaults to the native `better-sqlite3` driver, which needs to compile a small native module on install. This template instead forces Nuxt Content's `node:sqlite` connector (Node ≥ 22, no native build step) via `experimental.sqliteConnector: 'native'` in `nuxt.config.ts`. If you're on an older Node version, remove that option and let it fall back to `better-sqlite3` instead.

## Project structure

```
content/
  0.13/                       ← one folder per "version" of the docs
    getting-started/
      1.welcome.md
      2.installation.md
      3.hello-world.md
      4.running-tests.md
    language-basics/
    standard-library/
    build-system/
    working-with-c/
  posts/                      ← blog-style posts, shown at /posts

app/
  pages/
    [...slug].vue             ← catch-all docs route (sidebar + content + TOC)
    posts/index.vue           ← posts listing
    posts/[...slug].vue       ← individual post
  components/
    SiteHeader.vue            ← top bar: logo, nav, version switcher, theme toggle
    DocsSidebar.vue           ← left nav, grouped + collapsible
    DocsToc.vue                ← right-hand "On this page" with scroll-spy
    DocsPager.vue             ← prev/next footer links
    content/Callout.vue       ← ::callout{type="tip|warning|danger|info"} block
  composables/
    useDocsNav.ts             ← builds the grouped sidebar tree from the content collection
  layouts/default.vue
  app.config.ts               ← site name, GitHub link, current version label
  assets/css/main.css         ← design tokens (colors, type, spacing) + prose styles
```

## Adding documentation pages

Drop a new Markdown file into the right folder under `content/0.13/<section>/`. Use a numeric prefix to control ordering within that folder:

```markdown
---
title: My New Page
description: One-line summary used for <meta description> and SEO.
order: 5
---

# My New Page

Regular **Markdown** works as expected, including tables, code blocks with syntax
highlighting (`zig`, `bash`, `c`, `json`, `yaml`, `diff` are preconfigured), and:

::callout{type="tip"}
Custom callout blocks for tips, warnings, danger notes, and info asides.
::
```

To add a brand-new top-level section (sidebar group), create a new folder under `content/0.13/` and add an entry to `SECTION_META` in `app/composables/useDocsNav.ts` so it gets a proper label and sort order — otherwise it'll still show up, just title-cased from the folder name.

## Adding posts

Add a Markdown file to `content/posts/`. Frontmatter supports `title`, `description`, `date`, and `author`.

## Customizing the brand

Edit `app/app.config.ts` for the site name, GitHub repo link, Mastodon link, and the version label shown in the header/version-pill. Edit the CSS custom properties at the top of `app/assets/css/main.css` (`--accent`, `--bg`, fonts, etc.) to re-theme the whole site — both the `:root`/`.dark` and `.light` blocks need updating for full dark/light parity.

## Multiple doc versions

The content folder is structured as `content/0.13/...` so you can add `content/0.12/...`, `content/0.11/...` etc. alongside it, then wire up the version-switcher in `SiteHeader.vue` (currently a static list) to actually change the path prefix used by the `[...slug].vue` page.

## Building for production

```bash
npm run build    # Node server output in .output/
npm run generate # fully static output, if you don't need an SSR server
```
