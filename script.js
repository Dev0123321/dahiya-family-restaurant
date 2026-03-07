// Loader: hides when page is fully loaded.
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.classList.add("hidden"), 500);
});

// Mobile navigation toggle.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

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

// Cart and online ordering.
const CART_KEY = "dahiya_cart_items";
let cart = [];

try {
  const storedCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  cart = Array.isArray(storedCart) ? storedCart : [];
} catch {
  cart = [];
}

const addToCartButtons = document.querySelectorAll(".add-to-cart");
const openCartBtn = document.getElementById("openCart");
const closeCartBtn = document.getElementById("closeCart");
const cartOverlay = document.getElementById("cartOverlay");
const cartPanel = document.getElementById("cartPanel");
const cartCount = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutItemsEl = document.getElementById("checkoutItems");
const checkoutTotalEl = document.getElementById("checkoutTotal");
const checkoutLink = document.getElementById("checkoutLink");
const clearCartBtn = document.getElementById("clearCart");
const orderForm = document.getElementById("orderForm");
const orderStatus = document.getElementById("orderStatus");
const orderPhoneInput = document.getElementById("orderPhone");

const formatCurrency = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const saveCart = () => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const getTotals = () => {
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  return { itemCount, totalAmount };
};

const openCart = () => {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("show");
  cartPanel.setAttribute("aria-hidden", "false");
  body.classList.add("cart-open");
};

const closeCart = () => {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("show");
  cartPanel.setAttribute("aria-hidden", "true");
  body.classList.remove("cart-open");
};

const renderCart = () => {
  const { itemCount, totalAmount } = getTotals();
  cartCount.textContent = String(itemCount);
  cartTotalEl.textContent = formatCurrency(totalAmount);
  checkoutTotalEl.textContent = formatCurrency(totalAmount);

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<li class="empty">No items added yet.</li>';
    checkoutItemsEl.innerHTML = '<li class="empty">Your cart is empty. Add items from menu.</li>';
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item, index) => `
      <li class="cart-row">
        <h4>${item.name}</h4>
        <p>${formatCurrency(item.price)} each</p>
        <div class="cart-controls">
          <button class="qty-btn" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">-</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
          <button class="remove-btn" data-action="remove" data-index="${index}" aria-label="Remove item"><i class="fa-solid fa-trash"></i></button>
        </div>
      </li>
    `
    )
    .join("");

  checkoutItemsEl.innerHTML = cart
    .map(
      (item) => `
      <li>
        <span>${item.name} x${item.qty}</span>
        <strong>${formatCurrency(item.qty * item.price)}</strong>
      </li>
    `
    )
    .join("");
};

const addToCart = (name, price) => {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  saveCart();
  renderCart();
};

const updateItemQty = (index, type) => {
  const item = cart[index];
  if (!item) return;

  if (type === "increase") {
    item.qty += 1;
  }

  if (type === "decrease") {
    item.qty -= 1;
    if (item.qty <= 0) {
      cart.splice(index, 1);
    }
  }

  if (type === "remove") {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
};

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    addToCart(name, price);

    const defaultLabel = button.textContent;
    button.textContent = "Added";
    button.classList.add("added");
    setTimeout(() => {
      button.textContent = defaultLabel;
      button.classList.remove("added");
    }, 700);
  });
});

cartItemsEl.addEventListener("click", (event) => {
  const actionButton = event.target.closest("button[data-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.action;
  const index = Number(actionButton.dataset.index);
  updateItemQty(index, action);
});

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
checkoutLink.addEventListener("click", closeCart);

clearCartBtn.addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
  orderStatus.textContent = "Cart cleared.";
});

orderPhoneInput.addEventListener("input", () => {
  orderPhoneInput.value = orderPhoneInput.value.replace(/\D/g, "").slice(0, 10);
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (cart.length === 0) {
    orderStatus.textContent = "Please add items to cart before placing an order.";
    return;
  }

  const customerName = document.getElementById("orderName").value.trim();
  const customerPhone = orderPhoneInput.value.trim();
  const customerAddress = document.getElementById("orderAddress").value.trim();
  const customerNotes = document.getElementById("orderNotes").value.trim();

  if (!customerName || !customerPhone || !customerAddress) {
    orderStatus.textContent = "Please fill all required order details.";
    return;
  }

  if (!/^\d{10}$/.test(customerPhone)) {
    orderStatus.textContent = "Phone number must be exactly 10 digits.";
    return;
  }

  const { totalAmount } = getTotals();
  const itemsText = cart
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} x${item.qty} - ${formatCurrency(item.qty * item.price)}`
    )
    .join("\n");

  const orderMessage = [
    "*New Online Order - Dahiya Family Restaurant*",
    `Name: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Address/Pickup Note: ${customerAddress}`,
    customerNotes ? `Notes: ${customerNotes}` : "Notes: None",
    "",
    "*Order Items:*",
    itemsText,
    "",
    `*Total: ${formatCurrency(totalAmount)}*`
  ].join("\n");

  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(orderMessage)}`;
  const newWindow = window.open(whatsappUrl, "_blank", "noopener");

  if (!newWindow) {
    orderStatus.textContent = "Popup blocked. Please allow popups to place order on WhatsApp.";
    return;
  }

  orderStatus.textContent = "WhatsApp opened with your order details.";
  cart = [];
  saveCart();
  renderCart();
  orderForm.reset();
});

renderCart();

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

// UPI scanner fallback and copy action.
const upiQrImage = document.getElementById("upiQrImage");
const upiQrStatus = document.getElementById("upiQrStatus");

if (upiQrImage) {
  const qrSources = [
    upiQrImage.getAttribute("src") || "",
    upiQrImage.dataset.srcSecondary || "",
    upiQrImage.dataset.srcTertiary || ""
  ].filter(Boolean);
  let qrSourceIndex = 0;

  upiQrImage.addEventListener("error", () => {
    qrSourceIndex += 1;

    if (qrSourceIndex < qrSources.length) {
      upiQrImage.src = qrSources[qrSourceIndex];
      return;
    }

    if (upiQrStatus) {
      upiQrStatus.textContent = "Scanner could not load. Please use UPI ID below.";
    }
  });
}

const copyUpiButton = document.getElementById("copyUpiButton");
const upiIdText = document.getElementById("upiIdText");
const upiCopyStatus = document.getElementById("upiCopyStatus");

if (copyUpiButton && upiIdText && upiCopyStatus) {
  copyUpiButton.addEventListener("click", async () => {
    const upiId = upiIdText.textContent ? upiIdText.textContent.trim() : "";
    if (!upiId) {
      upiCopyStatus.textContent = "UPI ID missing.";
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(upiId);
      } else {
        const helper = document.createElement("textarea");
        helper.value = upiId;
        helper.setAttribute("readonly", "");
        helper.style.position = "absolute";
        helper.style.left = "-9999px";
        document.body.appendChild(helper);
        helper.select();
        document.execCommand("copy");
        document.body.removeChild(helper);
      }

      upiCopyStatus.textContent = "UPI ID copied.";
    } catch {
      upiCopyStatus.textContent = "Copy failed. Please copy UPI ID manually.";
    }
  });
}
