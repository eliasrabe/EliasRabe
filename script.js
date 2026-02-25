// script.js
(function () {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    links.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Scroll progress bar
  const bar = document.getElementById("progressBar");
  function updateProgress() {
    if (!bar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  // Active nav highlight (scroll spy)
  const navAnchors = Array.from(document.querySelectorAll(".nav-links a"))
    .filter(a => (a.getAttribute("href") || "").startsWith("#"));

  const sections = navAnchors
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function setActive() {
    const y = window.scrollY + 140; // header offset
    let current = sections[0]?.id;
    for (const s of sections) {
      if (s.offsetTop <= y) current = s.id;
    }
    navAnchors.forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  }
  window.addEventListener("scroll", setActive, { passive: true });
  window.addEventListener("resize", setActive);
  setActive();

  // Scroll reveal (with stagger via CSS var --d)
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("in");
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });

  revealEls.forEach(el => io.observe(el));

  // Subtle divider emphasis while scrolling
  const dividers = document.querySelectorAll(".section-divider");
  const dio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.animate(
          [{ opacity: 0.35 }, { opacity: 0.85 }, { opacity: 0.55 }],
          { duration: 900, easing: "ease-out" }
        );
      }
    });
  }, { threshold: 0.2 });
  dividers.forEach(d => dio.observe(d));

  // ----------------------------
  // Full-page project view (replaces dialog modal UX)
  // ----------------------------
  const page = document.getElementById("projectPage");
  const pageContent = document.getElementById("projectPageContent");

  const tplMap = {
    internships: document.getElementById("tpl-internships"),
    classes: document.getElementById("tpl-classes"),
    orgs: document.getElementById("tpl-orgs"),
  };

  function lockScroll(on) {
    document.documentElement.classList.toggle("no-scroll", Boolean(on));
  }

  function openProjectPage(key) {
    if (!page || !pageContent) return;
    const tpl = tplMap[key];
    if (!tpl) return;

    pageContent.innerHTML = "";
    pageContent.appendChild(tpl.content.cloneNode(true));

    // show
    page.classList.add("open");
    page.setAttribute("aria-hidden", "false");
    lockScroll(true);

    // start at top
    const inner = page.querySelector(".project-page-inner");
    if (inner) inner.scrollTop = 0;
  }

  function closeProjectPage() {
    if (!page) return;
    page.classList.remove("open");
    page.setAttribute("aria-hidden", "true");
    lockScroll(false);
  }

  // Open page triggers:
  // <button data-page="internships">...</button>
  // <a data-page="internships" href="#projects" data-jump="projects">...</a>
  document.querySelectorAll("[data-page]").forEach(el => {
    el.addEventListener("click", (e) => {
      const key = el.getAttribute("data-page");
      const jumpId = el.getAttribute("data-jump");

      // anchors: allow hash navigation, then open
      if (el.tagName === "A") {
        setTimeout(() => openProjectPage(key), 140);

        if (jumpId) {
          const target = document.getElementById(jumpId);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }

      // buttons: open immediately
      e.preventDefault();
      if (jumpId) {
        const target = document.getElementById(jumpId);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => openProjectPage(key), 160);
      } else {
        openProjectPage(key);
      }
    });
  });

  // Close handlers
  document.querySelectorAll("[data-page-close]").forEach(el => {
    el.addEventListener("click", closeProjectPage);
  });

  // Esc closes
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && page?.classList.contains("open")) {
      closeProjectPage();
    }
  });
})();