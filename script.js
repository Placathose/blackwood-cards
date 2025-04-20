const urlParams = new URLSearchParams(window.location.search);
const chapter = urlParams.get("chapter");
const container = document.getElementById("cardContainer");
const unmarkAllBtn = document.getElementById("unmarkAllBtn");

const scannedKey = `scanned_cards_ch${chapter}`;
let scannedCards = JSON.parse(localStorage.getItem(scannedKey)) || [];

async function loadCards() {
  const res = await fetch(`data/chapter${chapter}.json`);
  const cardList = await res.json();

  cardList.forEach((cardName, index) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    if (scannedCards.includes(cardName)) {
      slide.classList.add("scanned");
    }

    const img = document.createElement("img");
    img.src = `cards/${cardName}`;
    img.alt = `Card ${index + 1}`;
    img.addEventListener("click", () => toggleScanned(cardName, slide));

    const overlay = document.createElement("div");
    overlay.className = "overlay";

    slide.appendChild(img);
    slide.appendChild(overlay);
    container.appendChild(slide);
  });

  new Swiper(".swiper", {
    loop: false,
    spaceBetween: 20,
    centeredSlides: true,
    slidesPerView: 1.2,
    grabCursor: true,
    effect: "slide",
    breakpoints: {
      640: { slidesPerView: 1.5 },
      768: { slidesPerView: 2 },
    },
  });
}

function toggleScanned(cardName, slideEl) {
  const index = scannedCards.indexOf(cardName);
  if (index > -1) {
    scannedCards.splice(index, 1);
    slideEl.classList.remove("scanned");
  } else {
    scannedCards.push(cardName);
    slideEl.classList.add("scanned");
  }
  localStorage.setItem(scannedKey, JSON.stringify(scannedCards));
}

unmarkAllBtn.addEventListener("click", () => {
  scannedCards = [];
  localStorage.removeItem(scannedKey);
  document.querySelectorAll(".swiper-slide").forEach((slide) => {
    slide.classList.remove("scanned");
  });
});

if (chapter) {
  loadCards();
} else {
  container.innerHTML = "<p>No chapter selected.</p>";
}

const prevBtn = document.getElementById("prevChapterBtn");
const nextBtn = document.getElementById("nextChapterBtn");

prevBtn.addEventListener("click", () => {
  const prev = parseInt(chapter) - 1;
  if (prev >= 1) {
    window.location.href = `chapter.html?chapter=${prev}`;
  }
});

nextBtn.addEventListener("click", () => {
  const next = parseInt(chapter) + 1;
  if (next <= 3) {
    window.location.href = `chapter.html?chapter=${next}`;
  }
});
