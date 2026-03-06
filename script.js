// Loader: hides when page is fully loaded.
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.classList.add("hidden"), 500);
});

// Mobile navigation toggle.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close mobile nav after click.
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Intersection observer for reveal animations.
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);
revealElements.forEach((el) => revealObserver.observe(el));

// Animated counters in About section.
const counters = document.querySelectorAll(".counter h3");
const counterObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.target);
      let current = 0;
      const increment = Math.max(1, Math.floor(target / 90));

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          counter.textContent = current.toLocaleString();
        }
      }, 20);

      obs.unobserve(counter);
    });
  },
  { threshold: 0.3 }
);
counters.forEach((counter) => counterObserver.observe(counter));

// Render animated stars for testimonials.
document.querySelectorAll(".stars").forEach((starContainer, idx) => {
  const totalStars = Number(starContainer.dataset.stars);
  setTimeout(() => {
    for (let i = 0; i < totalStars; i += 1) {
      const icon = document.createElement("i");
      icon.className = "fa-solid fa-star";
      icon.style.opacity = "0";
      icon.style.transition = "opacity 0.25s ease";
      starContainer.appendChild(icon);

      setTimeout(() => {
        icon.style.opacity = "1";
      }, i * 120);
    }
  }, idx * 200);
});

// Gallery lightbox.
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("closeLightbox");

galleryItems.forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

const hideLightbox = () => {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
};

closeLightbox.addEventListener("click", hideLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) hideLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideLightbox();
});

// Dark mode toggle with localStorage.
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const DARK_KEY = "dahiya_dark_mode";

if (localStorage.getItem(DARK_KEY) === "true") {
  body.classList.add("dark");
  darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  darkModeToggle.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
  localStorage.setItem(DARK_KEY, String(isDark));
});

// Contact form simulation for frontend-only website.
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const phoneInput = document.getElementById("phone");

// Keep phone input strictly numeric and capped at 10 digits.
phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = phoneInput.value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !phone || !message) {
    formStatus.textContent = "Please fill all fields before sending.";
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    formStatus.textContent = "Please enter exactly 10 digits for phone number.";
    return;
  }

  formStatus.textContent = "Thank you! Your request has been received.";
  contactForm.reset();
});
