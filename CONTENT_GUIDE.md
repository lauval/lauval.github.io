# Content Creation Guide

This guide explains how to add new content to your website, preserving the knowledge from the sample files we removed.

## 1. Projects
Projects are displayed in the "Projects" section and can have dedicated pages with redirects or detailed layouts.

### Creating a New Project
Create a markdown file in `_projects/` (e.g., `_projects/my_new_project.md`).

**Front Matter Options:**
```yaml
---
layout: page
title: Project Title
description: Brief description
img: assets/img/thumbnail.jpg
importance: 1 # Lower number = Higher priority in grid
category: work # 'work', 'fun', etc. (used for filtering)
related_publications: true # If true, shows papers associated with this project
redirect: https://external-link.com # Optional: redirect immediately to another URL
---
```

### Project Content Features
-   **Grid Images**: Use Bootstrap grid to display images.
    ```html
    <div class="row">
        <div class="col-sm mt-3 mt-md-0">
            {% include figure.liquid path="assets/img/1.jpg" title="Title" class="img-fluid rounded z-depth-1" %}
        </div>
    </div>
    <div class="caption">Image caption here</div>
    ```

---

## 2. Blog Posts
Create a markdown file in `_posts/` with the format `YYYY-MM-DD-title.md`.

**Front Matter:**
```yaml
---
layout: post
title: My Post Title
date: 2025-01-01 12:00:00
description: Short summary
tags: [tag1, tag2]
categories: [category1]
featured: false # Set true to show on homepage
---
```

### Advanced Features
-   **Code Diffs**:
    ```markdown
    ```diff
    - old code
    + new code
    ```
    ```
    (Or use `diff2html` language for prettier diffs).

-   **Math**:
    Enable `enable_math: true` in `_config.yml` (already enabled).
    Use `$$ E = mc^2 $$` for block math or `$ E = mc^2 $` for inline.

-   **Tables**:
    Add `pretty_table: true` to front matter for styled tables.
    ```markdown
    | Header 1 | Header 2 |
    | :------- | -------: |
    | Cell 1   | Cell 2   |
    ```

-   **Redirects**:
    To redirect a post to an external URL (like Medium), add `redirect: https://medium.com/...` to front matter.

-   **Images**:
    Use the figure include for responsive images:
    ```liquid
    {% include figure.liquid path="assets/img/my-image.jpg" class="img-fluid rounded z-depth-1" %}
    ```

-   **Code Blocks**: Standard markdown fences.
-   **Blockquotes**: Standard `> Quote` markdown.
