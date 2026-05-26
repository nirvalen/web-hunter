// ── CAROUSEL ──────────────────────────────────────────────────────────────
const track = document.getElementById("carouselTrack");
const dotsCont = document.getElementById("carouselDots");
const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");

// 1. Read all items from HTML into a data array, then clear the track
const rawItems = Array.from(track.querySelectorAll(".carousel-item"));
const slidesData = rawItems.map(el => el.innerHTML.trim()); // store inner HTML
const TOTAL = slidesData.length;  // works for any count (3, 5, …)

let centerIdx = 0;  // which data index is currently in the CENTER slot
let isAnimating = false;

// 1a. Preload all images so the browser caches them before they slide in
slidesData.forEach(html => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  tmp.querySelectorAll("img").forEach(img => {
    const pre = new Image();
    pre.src = img.src;  // triggers download immediately
  });
});

// 2. Dynamically generate dots matching the total count
dotsCont.innerHTML = "";
slidesData.forEach((_, i) => {
  const dot = document.createElement("span");
  dot.className = "carousel-dot";
  dot.dataset.index = i;
  dotsCont.appendChild(dot);
});
const dots = dotsCont.querySelectorAll(".carousel-dot");

// 3. Helper: create a DOM slot for a given data index
function createSlot(dataIdx) {
  const div = document.createElement("div");
  div.className = "carousel-item";
  div.innerHTML = slidesData[dataIdx];
  return div;
}

// 4. Always keep exactly 3 slots in the track: [prev, center, next]
function initTrack() {
  track.innerHTML = "";
  const prevIdx = (centerIdx - 1 + TOTAL) % TOTAL;
  const nextIdx = (centerIdx + 1) % TOTAL;
  track.appendChild(createSlot(prevIdx));
  track.appendChild(createSlot(centerIdx));
  track.appendChild(createSlot(nextIdx));
}

// 5. Update active dot
function updateDots() {
  dots.forEach((dot, i) => dot.classList.toggle("active", i === centerIdx));
}

// 6. Slide one step in a direction; update centerIdx and swap slot content
function updateCarousel(direction) {
  const firstItem = track.firstElementChild;
  const SLIDE_DIST = firstItem.getBoundingClientRect().width +
    parseFloat(getComputedStyle(track).gap);

  const sign = direction === "right" ? -1 : 1;
  track.style.transition = "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)";
  track.style.transform = `translateX(${sign * SLIDE_DIST}px)`;

  track.addEventListener("transitionend", function onEnd() {
    track.removeEventListener("transitionend", onEnd);
    track.style.transition = "none";
    track.style.transform = "translateX(0)";

    if (direction === "right") {
      // Advance center forward
      centerIdx = (centerIdx + 1) % TOTAL;
      // Move first slot to end, repopulate it with the new "next" item
      const firstSlot = track.firstElementChild;
      track.appendChild(firstSlot);
      firstSlot.innerHTML = slidesData[(centerIdx + 1) % TOTAL];
    } else {
      // Advance center backward
      centerIdx = (centerIdx - 1 + TOTAL) % TOTAL;
      // Move last slot to front, repopulate it with the new "prev" item
      const lastSlot = track.lastElementChild;
      track.insertBefore(lastSlot, track.firstElementChild);
      lastSlot.innerHTML = slidesData[(centerIdx - 1 + TOTAL) % TOTAL];
    }

    updateDots();
    isAnimating = false;
  }, { once: true });
}

// 7. Arrow click handlers — reset auto-scroll timer on manual click
const AUTO_INTERVAL = 5000; // 5 seconds for all devices
let globalAutoTimer = setInterval(stepAutoScroll, AUTO_INTERVAL);

function stepAutoScroll() {
  if (!isAnimating) {
    isAnimating = true;
    updateCarousel("right");
  }
}

function resetGlobalTimer() {
  clearInterval(globalAutoTimer);
  globalAutoTimer = setInterval(stepAutoScroll, AUTO_INTERVAL);
}

arrowRight.addEventListener("click", () => {
  if (isAnimating) return;
  isAnimating = true;
  updateCarousel("right");
  resetGlobalTimer();
});

arrowLeft.addEventListener("click", () => {
  if (isAnimating) return;
  isAnimating = true;
  updateCarousel("left");
  resetGlobalTimer();
});

// 8. Init
initTrack();
updateDots();
// ── END CAROUSEL ──────────────────────────────────────────────────────────


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
  document.querySelectorAll(".cooking-hero .reveal").forEach((el) => {
    el.classList.add("visible");
  });
});



// ── Mobile Carousel Enhancements (≤ 480px) ───────────────────────────────
if (window.innerWidth <= 480) {


  // Touch / swipe — pauses the shared globalAutoTimer while finger is down
  const trackContainer = document.querySelector(".carousel-track-container");
  let touchStartX = 0;

  trackContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    clearInterval(globalAutoTimer); // pause during touch
  }, { passive: true });

  trackContainer.addEventListener("touchend", (e) => {
    const swipeDist = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(swipeDist) > 40 && !isAnimating) {
      isAnimating = true;
      updateCarousel(swipeDist > 0 ? "right" : "left");
    }
    resetGlobalTimer(); // resume at 5s after touch
  }, { passive: true });
}
// ── END Mobile Carousel Enhancements ─────────────────────────────────────