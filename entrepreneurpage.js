
      // ── CAROUSEL ──────────────────────────────────
      const track = document.getElementById("carouselTrack");
      const items = track.querySelectorAll(".carousel-item");
      const dots = document.querySelectorAll(".carousel-dot");
      const arrowLeft = document.getElementById("arrowLeft");
      const arrowRight = document.getElementById("arrowRight");

      const TOTAL = items.length; // 3
      // activeIndex = which item is in the CENTER slot
      let activeIndex = 0;
      let isAnimating = false;

      function updateCarousel(direction) {
        // direction: "left" (prev) or "right" (next)
        const firstItem = track.firstElementChild;
        const SLIDE_DIST =
          firstItem.getBoundingClientRect().width +
          parseFloat(getComputedStyle(track).gap);

        // slide the track
        const sign = direction === "right" ? -1 : 1;
        track.style.transition = "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)";
        track.style.transform = `translateX(${sign * SLIDE_DIST}px)`;

        track.addEventListener(
          "transitionend",
          function onEnd() {
            track.removeEventListener("transitionend", onEnd);
            // disable transition, rotate items in DOM, reset transform
            track.style.transition = "none";
            track.style.transform = "translateX(0)";

            if (direction === "right") {
              // move first item to end
              track.appendChild(track.firstElementChild);
              activeIndex = (activeIndex + 1) % TOTAL;
            } else {
              // move last item to front
              track.insertBefore(
                track.lastElementChild,
                track.firstElementChild,
              );
              activeIndex = (activeIndex - 1 + TOTAL) % TOTAL;
            }

            updateDots();
            isAnimating = false;
          },
          { once: true },
        );
      }

      function updateDots() {
        // dot that lights up = the item currently in CENTER position (index 1 of track)
        // After rotation, activeIndex tracks the logical index of center item
        dots.forEach((dot, i) => {
          dot.classList.toggle("active", i === activeIndex);
        });
      }

      arrowRight.addEventListener("click", () => {
        if (isAnimating) return;
        isAnimating = true;
        updateCarousel("right");
      });

      arrowLeft.addEventListener("click", () => {
        if (isAnimating) return;
        isAnimating = true;
        updateCarousel("left");
      });

      // init dots — first item starts as center (index 0 active)
      updateDots();
      // ── END CAROUSEL ──────────────────────────────

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
    