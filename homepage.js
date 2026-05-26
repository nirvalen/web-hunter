
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


// ── Values Slider (Core Values section) ───────────────────────────────────
const valuesTrackEl = document.getElementById('valuesTrack');
const valuesDotsCont = document.getElementById('valuesDots');
const valuesArrowLeft = document.getElementById('valuesArrowLeft');
const valuesArrowRight = document.getElementById('valuesArrowRight');

if (valuesTrackEl && valuesDotsCont && valuesArrowLeft && valuesArrowRight) {

  // 1. Keep a backup of the original HTML content of the track and the original items
  const originalHTML = valuesTrackEl.innerHTML;
  const rawValues = Array.from(valuesTrackEl.querySelectorAll('.value-item'));
  const valuesData = rawValues.map(el => el.innerHTML.trim());
  const VALUES_TOTAL = valuesData.length;

  let valuesCenterIdx = 0;
  let valuesIsAnimating = false;
  let valuesAutoTimer = null;
  let isSliderActive = false;

  function initSlider() {
    if (isSliderActive) return;
    isSliderActive = true;

    // Generate dots
    valuesDotsCont.innerHTML = '';
    valuesData.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'values-dot';
      dot.dataset.index = i;
      valuesDotsCont.appendChild(dot);
    });

    valuesCenterIdx = 0;
    initValuesTrack();
    updateValuesDots();

    // Start auto-scroll
    resetValuesTimer();
  }

  function destroySlider() {
    if (!isSliderActive) return;
    isSliderActive = false;

    // Stop timer
    if (valuesAutoTimer) {
      clearInterval(valuesAutoTimer);
      valuesAutoTimer = null;
    }

    // Revert track to original HTML structure and order
    valuesTrackEl.innerHTML = originalHTML;
    // Clear dots
    valuesDotsCont.innerHTML = '';
  }

  function checkViewport() {
    if (window.innerWidth <= 480) {
      initSlider();
    } else {
      destroySlider();
    }
  }

  // 3. Create a DOM slot for a given data index
  function createValueSlot(dataIdx) {
    const div = document.createElement('div');
    div.className = 'value-item';
    div.innerHTML = valuesData[dataIdx];
    return div;
  }

  // 4. Keep exactly 3 slots: [prev, center, next]
  function initValuesTrack() {
    valuesTrackEl.innerHTML = '';
    const prevIdx = (valuesCenterIdx - 1 + VALUES_TOTAL) % VALUES_TOTAL;
    const nextIdx = (valuesCenterIdx + 1) % VALUES_TOTAL;
    valuesTrackEl.appendChild(createValueSlot(prevIdx));
    valuesTrackEl.appendChild(createValueSlot(valuesCenterIdx));
    valuesTrackEl.appendChild(createValueSlot(nextIdx));
  }

  // 5. Update active dot
  function updateValuesDots() {
    const valuesDots = valuesDotsCont.querySelectorAll('.values-dot');
    valuesDots.forEach((dot, i) => dot.classList.toggle('active', i === valuesCenterIdx));
  }

  // 6. Slide one step
  function updateValuesCarousel(direction) {
    if (!isSliderActive) return;
    const firstItem = valuesTrackEl.firstElementChild;
    if (!firstItem) return;
    const SLIDE_DIST = firstItem.getBoundingClientRect().width +
      parseFloat(getComputedStyle(valuesTrackEl).gap);

    const sign = direction === 'right' ? -1 : 1;
    valuesTrackEl.style.transition = 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
    valuesTrackEl.style.transform = `translateX(${sign * SLIDE_DIST}px)`;

    valuesTrackEl.addEventListener('transitionend', function onEnd() {
      valuesTrackEl.removeEventListener('transitionend', onEnd);
      valuesTrackEl.style.transition = 'none';
      valuesTrackEl.style.transform = 'translateX(0)';

      if (!isSliderActive) return;

      if (direction === 'right') {
        valuesCenterIdx = (valuesCenterIdx + 1) % VALUES_TOTAL;
        const firstSlot = valuesTrackEl.firstElementChild;
        valuesTrackEl.appendChild(firstSlot);
        firstSlot.innerHTML = valuesData[(valuesCenterIdx + 1) % VALUES_TOTAL];
      } else {
        valuesCenterIdx = (valuesCenterIdx - 1 + VALUES_TOTAL) % VALUES_TOTAL;
        const lastSlot = valuesTrackEl.lastElementChild;
        valuesTrackEl.insertBefore(lastSlot, valuesTrackEl.firstElementChild);
        lastSlot.innerHTML = valuesData[(valuesCenterIdx - 1 + VALUES_TOTAL) % VALUES_TOTAL];
      }

      updateValuesDots();
      valuesIsAnimating = false;
    }, { once: true });
  }

  const VALUES_AUTO_INTERVAL = 5000;

  function valuesAutoStep() {
    if (isSliderActive && !valuesIsAnimating) {
      valuesIsAnimating = true;
      updateValuesCarousel('right');
    }
  }

  function resetValuesTimer() {
    if (valuesAutoTimer) {
      clearInterval(valuesAutoTimer);
    }
    valuesAutoTimer = setInterval(valuesAutoStep, VALUES_AUTO_INTERVAL);
  }

  valuesArrowRight.addEventListener('click', () => {
    if (!isSliderActive || valuesIsAnimating) return;
    valuesIsAnimating = true;
    updateValuesCarousel('right');
    resetValuesTimer();
  });

  valuesArrowLeft.addEventListener('click', () => {
    if (!isSliderActive || valuesIsAnimating) return;
    valuesIsAnimating = true;
    updateValuesCarousel('left');
    resetValuesTimer();
  });

  // Run on load
  checkViewport();

  // Listen for resize
  window.addEventListener('resize', checkViewport);
}

if (window.innerWidth <= 480) {

  // Navbar: hide logo when scrolled, show when at top
  const navbarLogo = document.getElementById("navbar-logo");
  const SCROLL_THRESHOLD = 100;

  window.addEventListener("scroll", () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbarLogo.classList.add("hidden");
    } else {
      navbarLogo.classList.remove("hidden");
    }
  });
}
// ── END Values Slider ─────────────────────────────────────────────────────
