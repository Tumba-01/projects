// ===========================================================
// NAV ANIMATION — isolated, unchanged logic from portfolio site
// ===========================================================
document.addEventListener('DOMContentLoaded', () => {
  const latestBtn = document.getElementById('latest-cv');
  const projectsBtn = document.getElementById('projects');
  const aboutBtn = document.getElementById('about');

  let timeoutID;

  function resetDelayTimer() {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      projectsBtn.style.marginLeft = '-75px';
      aboutBtn.style.marginLeft = '-65px';
      latestBtn.querySelector('.main-btn').style.backgroundColor = 'rgba(100, 100, 100, 0.25)';
      latestBtn.querySelector('.main-btn').style.color = 'white';
      projectsBtn.querySelector('.main-btn').style.backgroundColor = 'rgba(100, 100, 100, 0.25)';
      projectsBtn.querySelector('.main-btn').style.color = 'transparent';
      aboutBtn.querySelector('.main-btn').style.backgroundColor = 'rgba(100, 100, 100, 0.25)';
      aboutBtn.querySelector('.main-btn').style.color = 'transparent';
    }, 5000);
  }

  latestBtn.addEventListener('mouseenter', () => {
    projectsBtn.style.marginLeft = '0';
    aboutBtn.style.marginLeft = '0';
    latestBtn.querySelector('.main-btn').style.backgroundColor = 'white';
    latestBtn.querySelector('.main-btn').style.color = 'black';
    projectsBtn.querySelector('.main-btn').style.backgroundColor = 'white';
    projectsBtn.querySelector('.main-btn').style.color = 'black';
    aboutBtn.querySelector('.main-btn').style.backgroundColor = 'white';
    aboutBtn.querySelector('.main-btn').style.color = 'black';
    resetDelayTimer();
  });

  latestBtn.addEventListener('mouseleave', resetDelayTimer);
});

// ===========================================================
// BLOB FOLLOWS THE MOUSE
// ===========================================================
document.addEventListener('DOMContentLoaded', () => {
  const blob = document.getElementById("blob");

  document.body.onpointermove = event => {
    const { clientX, clientY } = event;
    blob.animate(
      [
        { left: `${blob.style.left}`, top: `${blob.style.top}` },
        { left: `${clientX}px`, top: `${clientY}px` }
      ],
      { duration: 3000, fill: "forwards" }
    );
  };
});

// ===========================================================
// GALLERY LIGHTBOX + CAROUSEL (event delegation — robust)
// Supports images, GIFs (just treat as images), videos, iframes.
// ===========================================================
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightbox-content");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const lightboxCounter = document.getElementById("lightbox-counter");

  let currentItems = [];
  let currentType = "image";
  let currentIndex = 0;

  // add media-count badges up front
  document.querySelectorAll(".gallery-card").forEach((card) => {
    const items = (card.dataset.mediaSrc || "").split(",").map(s => s.trim()).filter(Boolean);
    if (items.length > 1) {
      const badge = document.createElement("span");
      badge.className = "media-count";
      badge.textContent = `1 / ${items.length}`;
      const media = card.querySelector(".gallery-media");
      if (media) media.appendChild(badge);
    }
  });

  function renderLightboxItem() {
    lightboxContent.innerHTML = "";
    const src = currentItems[currentIndex];

    if (currentType === "video") {
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      lightboxContent.appendChild(video);
    } else if (currentType === "iframe") {
      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.allowFullscreen = true;
      lightboxContent.appendChild(iframe);
    } else {
      // "image" covers jpg/png/gif — <img> animates gifs natively
      const img = document.createElement("img");
      img.src = src;
      lightboxContent.appendChild(img);
    }

    const showArrows = currentItems.length > 1;
    lightboxPrev.classList.toggle("hidden-arrow", !showArrows);
    lightboxNext.classList.toggle("hidden-arrow", !showArrows);
    lightboxCounter.style.display = showArrows ? "block" : "none";
    lightboxCounter.textContent = `${currentIndex + 1} / ${currentItems.length}`;
  }

  function openLightbox(type, items, startIndex) {
    currentType = type;
    currentItems = items;
    currentIndex = startIndex;
    renderLightboxItem();
    lightbox.classList.add("active");
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightboxContent.innerHTML = "";
    currentItems = [];
  }

  function showPrev() {
    if (currentItems.length < 2) return;
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    renderLightboxItem();
  }

  function showNext() {
    if (currentItems.length < 2) return;
    currentIndex = (currentIndex + 1) % currentItems.length;
    renderLightboxItem();
  }

  // Event delegation: works even if cards are added/changed later
  document.addEventListener("click", (e) => {
    const link = e.target.closest(".gallery-link");
    if (link) return; // let the project link navigate normally

    const card = e.target.closest(".gallery-card");
    if (card) {
      const type = card.dataset.mediaType || "image";
      const items = (card.dataset.mediaSrc || "").split(",").map(s => s.trim()).filter(Boolean);
      if (items.length) openLightbox(type, items, 0);
      return;
    }

    if (e.target.closest("#lightbox-prev")) { showPrev(); return; }
    if (e.target.closest("#lightbox-next")) { showNext(); return; }
    if (e.target.closest("#lightbox-close")) { closeLightbox(); return; }
    if (e.target === lightbox) { closeLightbox(); return; }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });
});