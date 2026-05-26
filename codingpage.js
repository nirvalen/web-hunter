// ── Scroll reveal ──
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
reveals.forEach((el) => revealObserver.observe(el));

function revealHero() {
  document.querySelectorAll('.hero .reveal').forEach((el) => el.classList.add('visible'));
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', revealHero);
} else {
  revealHero();
}



// ── Dynamic Projects Data ──
const projectsData = [
  {
    title: 'SAHABAT<br><span>PROPERTY</span>',
    desc: 'Sahabat Property adalah platform digital yang dirancang untuk menjembatani calon pemilik hunian dengan properti impian mereka. Proyek ini memfokuskan pada penyampaian informasi yang transparan dan antarmuka yang ramah pengguna (user-friendly), memungkinkan pengunjung mengeksplorasi unit properti secara detail dan profesional.',
    slides: [
      { img: 'CodingAssets/SahabatProperty1.jpg', name: 'Homepage' },
      { img: 'CodingAssets/SahabatProperty2.jpg', name: 'Product Gallery' },
      { img: 'CodingAssets/SahabatProperty3.jpg', name: 'Detail Unit' },
      { img: 'CodingAssets/SahabatProperty4.jpg', name: 'Contact Us' }
    ]
  },
  {
    title: 'TOERAH<br><span>INVENTORY</span>',
    desc: 'Toerah Inventory Management adalah solusi digital yang dirancang untuk menyederhanakan pelacakan stok dan pengelolaan aset secara real-time. Proyek ini fokus pada akurasi data dan kemudahan akses bagi pengguna untuk memastikan alur inventaris berjalan lancar, terorganisir, dan transparan.',
    slides: [
      { img: 'CodingAssets/Toerah1.png', name: 'Inventory Page' },
      { img: 'CodingAssets/Toerah2.png', name: 'Login Page' },
      { img: 'CodingAssets/Toerah3.png', name: 'Dashboard Page' },
      { img: 'CodingAssets/Toerah4.png', name: 'Detail Item Page' }
    ]
  },
  {
    title: 'PROJECT<br><span>BOMBERMAN</span>',
    desc: 'Project Bomberman adalah game petualangan klasik yang dibangun kembali dengan teknologi modern. Pemain mengontrol karakter utama untuk menempatkan bom secara strategis guna menghancurkan rintangan, mengalahkan musuh, dan menemukan jalan keluar dalam labirin.',
    slides: [
      { img: 'CodingAssets/Bomberman1.png', name: 'Main Menu Page' },
      { img: 'CodingAssets/Bomberman2.png', name: 'Loading' },
      { img: 'CodingAssets/Bomberman3.png', name: 'Gameplay Page' },
      { img: 'CodingAssets/Bomberman4.png', name: 'Settings' }
    ]
  },
];

let currentProjectIndex = 1; // Default to Toerah Inventory (index 1)
let currentSlideIndex = 0;
let carouselInterval = null;

const titleEl = document.getElementById('dyn-project-title');
const descEl = document.getElementById('dyn-project-desc');
const trackEl = document.getElementById('carousel-track');
const pageNameEl = document.getElementById('page-name-display');

function renderProject(index) {
  currentProjectIndex = index;
  currentSlideIndex = 0;

  const project = projectsData[index];

  // Update Title & Description
  titleEl.innerHTML = project.title;
  descEl.textContent = project.desc;

  // Render Slides
  trackEl.innerHTML = project.slides.map(slide => `
          <div class="carousel-slide">
            <img src="${slide.img}" alt="${slide.name}" />
          </div>
        `).join('');

  // Reset slide position
  trackEl.style.transform = `translateX(0)`;

  // Update Page Name text
  pageNameEl.textContent = project.slides[0].name;

  // Update active project selector card
  document.querySelectorAll('.project-card-item').forEach((card, i) => {
    if (i === index) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  // Restart autoplay
  startCarouselTimer();
}

function nextSlide() {
  const project = projectsData[currentProjectIndex];
  const totalSlides = project.slides.length;
  currentSlideIndex = (currentSlideIndex + 1) % totalSlides;

  // Slide from right to left
  trackEl.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

  // Fade transition for the active page name
  pageNameEl.classList.add('fade-out');
  setTimeout(() => {
    pageNameEl.textContent = project.slides[currentSlideIndex].name;
    pageNameEl.classList.remove('fade-out');
  }, 300);
}

function startCarouselTimer() {
  clearInterval(carouselInterval);
  carouselInterval = setInterval(nextSlide, 4000);
}

function selectProject(index) {
  renderProject(index);
}

function goToProject(index) {
  renderProject(index);
  document.getElementById('our-project').scrollIntoView({ behavior: 'smooth' });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  renderProject(1); // Load with Toerah Inventory by default
});


// ── Navbar logo hide on scroll ──
const navbarLogo = document.getElementById("navbar-logo");
const SCROLL_THRESHOLD = 150;

window.addEventListener("scroll", () => {
  if (window.scrollY > SCROLL_THRESHOLD) {
    navbarLogo.classList.add("hidden");
  } else {
    navbarLogo.classList.remove("hidden");
  }
});