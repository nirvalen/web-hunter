
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
