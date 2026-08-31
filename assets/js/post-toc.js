(() => {
  const MINIMUM_HEADINGS = 4;
  const shell = document.querySelector("[data-post-shell]");
  const toc = shell?.querySelector("[data-post-toc]");
  const content = shell?.querySelector("#markdown-content");

  if (!shell || !toc || !content) return;

  const headings = [...content.querySelectorAll("h2, h3")].filter((heading) => !heading.matches("[data-toc-skip]") && heading.textContent.trim());

  if (headings.length < MINIMUM_HEADINGS) return;

  const nav = toc.querySelector("[data-post-toc-nav]");
  const panel = toc.querySelector("[data-post-toc-panel]");
  const toggle = toc.querySelector("[data-post-toc-toggle]");
  const closeButton = toc.querySelector("[data-post-toc-close]");
  const usedIds = new Set([...document.querySelectorAll("[id]")].map((element) => element.id));

  const uniqueHeadingId = (heading) => {
    if (heading.id) return heading.id;

    const base =
      heading.textContent
        .trim()
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "section";
    let id = base;
    let suffix = 2;

    while (usedIds.has(id)) {
      id = `${base}-${suffix}`;
      suffix += 1;
    }

    usedIds.add(id);
    heading.id = id;
    return id;
  };

  const list = document.createElement("ol");
  list.className = "post-toc__list";

  headings.forEach((heading) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const id = uniqueHeadingId(heading);

    item.className = `post-toc__item post-toc__item--${heading.tagName.toLowerCase()}`;
    link.className = "post-toc__link";
    link.href = `#${encodeURIComponent(id)}`;
    link.textContent = heading.textContent.trim();
    link.dataset.headingId = id;
    item.append(link);
    list.append(item);
  });

  nav.append(list);
  toc.hidden = false;
  shell.classList.add("post-shell--has-toc");

  const links = [...nav.querySelectorAll(".post-toc__link")];
  let activeId = "";
  let ticking = false;

  const setActive = (id) => {
    if (!id || id === activeId) return;
    activeId = id;

    links.forEach((link) => {
      const isActive = link.dataset.headingId === id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
        link.scrollIntoView({ block: "nearest" });
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateActiveHeading = () => {
    const readingLine = 112;
    let current = headings[0];

    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= readingLine) current = heading;
      else break;
    }

    setActive(current.id);
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateActiveHeading);
  };

  const setOpen = (open, restoreFocus = false) => {
    toc.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Hide table of contents" : "Show table of contents");
    panel.hidden = !open;

    if (open) {
      const activeLink = nav.querySelector(".is-active") || links[0];
      window.requestAnimationFrame(() => activeLink?.focus({ preventScroll: true }));
    } else if (restoreFocus) {
      toggle.focus({ preventScroll: true });
    }
  };

  toggle.addEventListener("click", () => setOpen(!toc.classList.contains("is-open")));
  closeButton.addEventListener("click", () => setOpen(false, true));

  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-heading-id]");
    if (!link) return;

    const heading = document.getElementById(link.dataset.headingId);
    if (!heading) return;

    event.preventDefault();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    heading.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    window.history.pushState(null, "", link.getAttribute("href"));

    if (window.matchMedia("(max-width: 1199px)").matches) {
      if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
      setOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (toc.classList.contains("is-open") && !toc.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toc.classList.contains("is-open")) setOpen(false, true);
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateActiveHeading();
})();
