const scroller = scrollama();

scroller
  .setup({
    step: ".perspective-block",
    offset: 0.6
  })
  .onStepEnter((response) => {
    response.element.classList.add("active");
  })
  .onStepExit((response) => {
    response.element.classList.remove("active");
  });

const navbar = document.querySelector(".navbar");
const lightSection = document.querySelector(".plans-section");

if (navbar && lightSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navbar.classList.add("light-mode");
        } else {
          navbar.classList.remove("light-mode");
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  observer.observe(lightSection);
}

const galleryModal = document.getElementById("galleryModal");
const galleryModalImage = document.getElementById("galleryModalImage");
const galleryCounter = document.getElementById("galleryCounter");
const galleryPrev = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");
const galleryCloseButtons = document.querySelectorAll("[data-gallery-close]");
const galleryImages = Array.from(document.querySelectorAll("[data-gallery-image='intro-collage']"));

let currentGalleryIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

function renderGalleryImage(index) {
  if (!galleryImages.length || !galleryModalImage || !galleryCounter) return;

  currentGalleryIndex = (index + galleryImages.length) % galleryImages.length;
  const currentImage = galleryImages[currentGalleryIndex];

  galleryModalImage.src = currentImage.getAttribute("src");
  galleryModalImage.alt = currentImage.getAttribute("alt") || "Gallery image";
  galleryCounter.textContent = `${currentGalleryIndex + 1} / ${galleryImages.length}`;
}

function openGallery(index) {
  if (!galleryModal) return;

  renderGalleryImage(index);
  galleryModal.classList.add("is-open", "active");
  galleryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("gallery-open");
}

function closeGallery() {
  if (!galleryModal) return;

  galleryModal.classList.remove("is-open", "active");
  galleryModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("gallery-open");
}

function showNextImage() {
  renderGalleryImage(currentGalleryIndex + 1);
}

function showPrevImage() {
  renderGalleryImage(currentGalleryIndex - 1);
}

galleryImages.forEach((image, index) => {
  image.style.cursor = "zoom-in";
  image.addEventListener("click", () => openGallery(index));
});

if (galleryPrev) {
  galleryPrev.addEventListener("click", showPrevImage);
}

if (galleryNext) {
  galleryNext.addEventListener("click", showNextImage);
}

galleryCloseButtons.forEach((button) => {
  button.addEventListener("click", closeGallery);
});

document.addEventListener("keydown", (event) => {
  if (!galleryModal || !galleryModal.classList.contains("is-open")) return;

  if (event.key === "Escape") closeGallery();
  if (event.key === "ArrowRight") showNextImage();
  if (event.key === "ArrowLeft") showPrevImage();
});

if (galleryModal) {
  galleryModal.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  galleryModal.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < 45) return;

    if (swipeDistance < 0) {
      showNextImage();
    } else {
      showPrevImage();
    }
  }, { passive: true });
}