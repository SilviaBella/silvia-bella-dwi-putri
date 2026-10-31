
 // JavaScript untuk website Rasa Lokal

// 1. Mode terang dan gelap
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
} else {
  document.body.classList.remove("dark-theme");
}

function updateThemeButton() {
  if (!themeToggle) return;

  const isDark = document.body.classList.contains("dark-theme");

  themeToggle.innerHTML = isDark
    ? '☀ <span>Mode terang</span>'
    : '☾ <span>Mode gelap</span>';

  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"
  );
}

updateThemeButton();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");

    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeButton();
  });
}


// 2. Tombol sapaan
const greetButton = document.getElementById("greetButton");
const greetingMessage = document.getElementById("greetingMessage");

if (greetButton && greetingMessage) {
  greetButton.addEventListener("click", () => {
    greetingMessage.textContent =
      "Halo, pencinta kuliner! Semoga kamu menemukan makanan favorit hari ini. 💙";
  });
}


// 3. Pencarian dan filter kategori kartu serta tabel
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const foodCards = [...document.querySelectorAll(".food-card")];

// Menggunakan ID tbody tabel yang baru
const tableBody =
  document.getElementById("detailTableBody") ||
  document.getElementById("foodTableBody");

const tableRows = tableBody
  ? [...tableBody.querySelectorAll("tr")]
  : [];

const noResults = document.getElementById("noResults");
const emptyTableMessage = document.getElementById("emptyTableMessage");

function normalizeText(value) {
  return (value || "").trim().toLowerCase();
}

function normalizeCategory(value) {
  const category = normalizeText(value);

  if (
    category.includes("semua") ||
    category === "all" ||
    category === ""
  ) {
    return "semua";
  }

  if (
    category.includes("makanan berat") ||
    category === "food"
  ) {
    return "makanan berat";
  }

  if (
    category.includes("camilan") ||
    category.includes("snack")
  ) {
    return "camilan";
  }

  if (
    category.includes("minuman") ||
    category === "drink"
  ) {
    return "minuman";
  }

  return category;
}

function filterFood() {
  const keyword = normalizeText(searchInput?.value);
  const selectedOption = categoryFilter?.options[
    categoryFilter.selectedIndex
  ];

  const categoryValue = normalizeCategory(categoryFilter?.value);
  const categoryText = normalizeCategory(selectedOption?.textContent);

  const selectedCategory =
    categoryValue === "semua" ? "semua" : categoryValue;

  let visibleCards = 0;
  let visibleRows = 0;

  // Filter kartu kuliner
  foodCards.forEach((card) => {
    const name = normalizeText(
      card.dataset.name || card.querySelector("h3")?.textContent
    );

    const cardCategory = normalizeCategory(card.dataset.category);

    const matchesName = name.includes(keyword);
    const matchesCategory =
      selectedCategory === "semua" ||
      cardCategory === selectedCategory ||
      (
        cardCategory === "" &&
        categoryText !== "semua" &&
        normalizeCategory(selectedOption?.textContent) === selectedCategory
      );

    const visible = matchesName && matchesCategory;

    card.hidden = !visible;

    if (visible) visibleCards++;
  });

  // Filter baris tabel detail kuliner
  tableRows.forEach((row) => {
    const name = normalizeText(
      row.dataset.name || row.cells[1]?.textContent
    );

    const rowCategory = normalizeCategory(
      row.dataset.category || row.cells[3]?.textContent
    );

    const matchesName = name.includes(keyword);
    const matchesCategory =
      selectedCategory === "semua" ||
      rowCategory === selectedCategory;

    const visible = matchesName && matchesCategory;

    row.hidden = !visible;

    // Perbarui nomor baris agar tetap berurutan
    if (visible) {
      visibleRows++;

      if (row.cells[0]) {
        row.cells[0].textContent = String(visibleRows).padStart(2, "0");
      }
    }
  });

  // Pesan jika kartu tidak ditemukan
  if (noResults) {
    noResults.hidden = visibleCards > 0;
  }

  // Pesan jika tabel tidak memiliki hasil
  if (emptyTableMessage) {
    emptyTableMessage.hidden = visibleRows > 0;
  }
}

if (searchInput) {
  searchInput.addEventListener("input", filterFood);
}

if (categoryFilter) {
  categoryFilter.addEventListener("change", filterFood);
}

// Terapkan filter awal ketika halaman dibuka
filterFood();


// 4. Validasi formulir rekomendasi
const recommendForm = document.getElementById("recommendForm");
const visitorName = document.getElementById("visitorName");
const visitorEmail = document.getElementById("visitorEmail");
const foodSuggestion = document.getElementById("foodSuggestion");
const formFeedback = document.getElementById("formFeedback");

function showError(input, errorId, message) {
  const errorElement = document.getElementById(errorId);

  if (errorElement) {
    errorElement.textContent = message;
  }

  input.classList.toggle("invalid", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

if (
  recommendForm &&
  visitorName &&
  visitorEmail &&
  foodSuggestion &&
  formFeedback
) {
  recommendForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameValue = visitorName.value.trim();
    const emailValue = visitorEmail.value.trim();
    const foodValue = foodSuggestion.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const nameError =
      nameValue.length < 2
        ? "Nama harus diisi minimal 2 karakter."
        : "";

    const emailError =
      !emailPattern.test(emailValue)
        ? "Masukkan alamat email yang valid."
        : "";

    const foodError =
      foodValue.length < 2
        ? "Nama kuliner harus diisi minimal 2 karakter."
        : "";

    showError(visitorName, "nameError", nameError);
    showError(visitorEmail, "emailError", emailError);
    showError(foodSuggestion, "foodError", foodError);

    const valid = !nameError && !emailError && !foodError;

    if (!valid) {
      formFeedback.textContent =
        "Periksa kembali data yang masih salah, ya.";
      return;
    }

    formFeedback.textContent =
      `Terima kasih, ${nameValue}! Rekomendasi "${foodValue}" berhasil divalidasi pada demo ini.`;

    recommendForm.reset();

    [visitorName, visitorEmail, foodSuggestion].forEach((input) => {
      input.classList.remove("invalid");
      input.setAttribute("aria-invalid", "false");
    });
  });

  [
    [visitorName, "nameError"],
    [visitorEmail, "emailError"],
    [foodSuggestion, "foodError"]
  ].forEach(([input, errorId]) => {
    input.addEventListener("input", () => {
      const errorElement = document.getElementById(errorId);

      if (errorElement) {
        errorElement.textContent = "";
      }

      input.classList.remove("invalid");
      input.setAttribute("aria-invalid", "false");
      formFeedback.textContent = "";
    });
  });
}


// 5. Menu navigasi responsif
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}


// 6. Tahun footer otomatis
const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


const sliderSearchForm = document.getElementById("sliderSearchForm");

if (sliderSearchForm) {
  sliderSearchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const keyword = document.getElementById("inputHotel").value.trim();
    const category = document.getElementById("inputLocation").value;

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const menuSection = document.querySelector(".menu-section");

    if (searchInput) {
      searchInput.value = keyword;
    }

    if (categoryFilter) {
      categoryFilter.value = category || "semua";
    }

    if (searchInput) {
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    }

    if (categoryFilter) {
      categoryFilter.dispatchEvent(new Event("change", { bubbles: true }));
    }

    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(
    ".slider_section .slider_container"
  );

  if (!slider) return;

  const prev = document.createElement("button");
  const next = document.createElement("button");

  prev.className = "food-nav food-prev";
  next.className = "food-nav food-next";

  prev.innerHTML = "‹";
  next.innerHTML = "›";

  prev.setAttribute("aria-label", "Foto sebelumnya");
  next.setAttribute("aria-label", "Foto berikutnya");

  slider.parentElement.append(prev, next);

  prev.addEventListener("click", function () {
    slider.scrollBy({
      left: -280,
      behavior: "smooth"
    });
  });

  next.addEventListener("click", function () {
    slider.scrollBy({
      left: 280,
      behavior: "smooth"
    });
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".scroll-animate");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animation = element.dataset.animation || "fadeInUp";

        element.classList.add("show", "animated", animation);

        observer.unobserve(element);
      }
    });
  }, {
    threshold: 0.15
  });

  elements.forEach((element) => observer.observe(element));
});


document.addEventListener("DOMContentLoaded", function () {
  const heroSlider = document.getElementById("heroSlider");

  if (!heroSlider) return;

  const images = [
    "img/headerr.jpeg",
    "img/header.jpeg",
    "img/headerrr.jpeg"
  ];

  let currentImage = 0;

  setInterval(function () {
    heroSlider.classList.add("changing");

    setTimeout(function () {
      currentImage = (currentImage + 1) % images.length;

      heroSlider.src = images[currentImage];

      heroSlider.onload = function () {
        heroSlider.classList.remove("changing");
      };
    }, 500);

  }, 3000);
});

document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".scroll-animate");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;

        const animation = element.dataset.animation || "fadeInUp";
        const delay = element.style.getPropertyValue("--delay") || "0s";

        element.style.animationDelay = delay;

        element.classList.add("show", "animated", animation);

        observer.unobserve(element);
      }
    });
  }, {
    threshold: 0.15
  });

  elements.forEach((element) => observer.observe(element));
});