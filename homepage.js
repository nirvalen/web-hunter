
// Intersection Observer for scroll reveals
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  },
);

reveals.forEach((el) => observer.observe(el));

// Hero elements animate on load
window.addEventListener("load", () => {
  document.querySelectorAll(".hero .reveal").forEach((el) => {
    el.classList.add("visible");
  });
});

// Navbar: hide logo when scrolled, show when at top
const navbarLogo = document.getElementById("navbar-logo");
const SCROLL_THRESHOLD = 10;

window.addEventListener("scroll", () => {
  if (window.scrollY > SCROLL_THRESHOLD) {
    navbarLogo.classList.add("hidden");
  } else {
    navbarLogo.classList.remove("hidden");
  }
});

const carouselItem = document.querySelectorAll(".carousel-item");

let carouselActive = 1;

if (carouselItem) {
  carouselItem.forEach((slider, index) => {
    if (index === 0) {
      slider.setAttribute("data-show", "show");
    }
    else {
      slider.setAttribute("data-show", "hidden");
    };
  });

  setInterval(() => {
    carouselItem.forEach((slider, index) => {
      if (carouselActive === index) {
        slider.setAttribute("data-show", "show");
      }
      else {
        slider.setAttribute("data-show", "hidden");
      }
    });

    if (carouselActive === carouselItem.length - 1) {
      carouselActive = 0;
    }
    else {
      carouselActive++;
    };

  }, 5000);
}


// ── Mobile Core Values Marquee (≤ 480px) ─────────────────────────────────
// JS-driven so the user can drag manually while auto-scroll still runs.
if (window.innerWidth <= 480) {
  const valuesTrack = document.querySelector('.values');
  if (valuesTrack) {

    // 1. Clone items to create a seamless double-set [A B C | A B C]
    Array.from(valuesTrack.children).forEach(child => {
      valuesTrack.appendChild(child.cloneNode(true));
    });

    // 2. Kill the CSS animation — we drive position entirely from JS
    valuesTrack.style.animation = 'none';

    // ── Constants ────────────────────────────────────────────────────────
    const ITEM_VW = 72;   // matches .value-item { width: 72vw }
    const GAP_VW = 5;    // matches .values { gap: 5vw }
    const SET_VW = 3 * (ITEM_VW + GAP_VW); // 231 vw = one full set
    const DURATION = 15000; // ms for one full set to scroll past (= CSS 15s)

    // Convert vw to px at runtime (handles viewport correctly)
    const vw = () => window.innerWidth / 100;
    const setW = () => SET_VW * vw();       // one-set width in px
    const speed = () => setW() / DURATION;   // px / ms

    // ── State ────────────────────────────────────────────────────────────
    let posX = 0;     // current track offset in px (always ≤ 0)
    let lastTs = null;  // previous rAF timestamp
    let dragging = false;
    let touchX0 = 0;     // finger X at touchstart
    let trackX0 = 0;     // posX at touchstart

    // ── Helpers ──────────────────────────────────────────────────────────
    function applyX() {
      valuesTrack.style.transform = `translateX(${posX}px)`;
    }

    // Wrap posX into the window (-setW, 0] for seamless looping
    function normalise() {
      const w = setW();
      posX = posX % w;          // result is in (-w, 0] for negative inputs
      if (posX > 0) posX -= w;  // guard against tiny positive float errors
    }

    // ── rAF loop ─────────────────────────────────────────────────────────
    function tick(ts) {
      if (!dragging) {
        if (lastTs !== null) {
          posX -= speed() * (ts - lastTs);
          normalise();
          applyX();
        }
        lastTs = ts;
      }
      requestAnimationFrame(tick);
    }

    // ── Touch handlers ────────────────────────────────────────────────────
    valuesTrack.addEventListener('touchstart', e => {
      dragging = true;
      touchX0 = e.touches[0].clientX;
      trackX0 = posX;
    }, { passive: true });

    valuesTrack.addEventListener('touchmove', e => {
      if (!dragging) return;
      const dx = e.touches[0].clientX - touchX0;
      posX = trackX0 + dx;
      normalise();
      applyX();
    }, { passive: true });

    valuesTrack.addEventListener('touchend', () => {
      dragging = false;
      normalise();
      lastTs = null; // reset so first auto-scroll tick has no large delta jump
    });

    // ── Start ─────────────────────────────────────────────────────────────
    requestAnimationFrame(tick);
  }
}
// ── END Mobile Core Values Marquee ───────────────────────────────────────
