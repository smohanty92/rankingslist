const params = new URLSearchParams(window.location.search);
const slug = params.get("slug") || "top-3-fruits";

let list = null;
let currentIndex = 0;
let touchStartX = 0;
let touchStartY = 0;

const listTitle = document.getElementById("listTitle");
const listDescription = document.getElementById("listDescription");
const rankLabel = document.getElementById("rankLabel");
const entry = document.getElementById("entry");
const entryImage = document.getElementById("entryImage");
const entryEmoji = document.getElementById("entryEmoji");
const entryTitle = document.getElementById("entryTitle");
const entrySubtitle = document.getElementById("entrySubtitle");
const entryComment = document.getElementById("entryComment");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const dots = document.getElementById("dots");
const shareButton = document.getElementById("shareButton");

async function loadList() {
  try {
    const response = await fetch(`./lists/${slug}.json`);

    if (!response.ok) {
      throw new Error(`Could not load list: ${slug}`);
    }

    list = await response.json();
    document.title = `${list.title} | RankingsList`;
    render();
  } catch (error) {
    document.querySelector(".rank-card").innerHTML = `
      <div class="error-card">
        <h2>List not found</h2>
        <p>We couldn't find a list for <strong>${slug}</strong>.</p>
        <p><a href="./index.html">Go back home</a></p>
      </div>
    `;
    listTitle.textContent = "List not found";
    listDescription.textContent = "Try opening one of the example lists from the homepage.";
  }
}

function renderDots() {
  dots.innerHTML = "";

  list.items.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = "dot" + (index === currentIndex ? " active" : "");
    dots.appendChild(dot);
  });
}

function render() {
  const item = list.items[currentIndex];

  listTitle.textContent = list.title;
  listDescription.textContent = list.description || "";

  entry.style.animation = "none";
  entry.offsetHeight;
  entry.style.animation = "";

  rankLabel.textContent = `#${item.rank}`;
  entryTitle.textContent = item.title;
  entrySubtitle.textContent = item.subtitle || "";
  entryComment.textContent = item.comment || "";

  if (item.image) {
    entryImage.src = item.image;
    entryImage.alt = item.imageAlt || item.title;
    entryImage.classList.remove("hidden");
    entryEmoji.classList.add("hidden");
  } else {
    entryEmoji.textContent = item.emoji || "🏆";
    entryEmoji.setAttribute("aria-label", item.imageAlt || item.title);
    entryEmoji.classList.remove("hidden");
    entryImage.classList.add("hidden");
  }

  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === list.items.length - 1;

  renderDots();
}

function goPrevious() {
  if (currentIndex > 0) {
    currentIndex--;
    render();
  }
}

function goNext() {
  if (list && currentIndex < list.items.length - 1) {
    currentIndex++;
    render();
  }
}

entry.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
}, { passive: true });

entry.addEventListener("touchend", (event) => {
  const touchEndX = event.changedTouches[0].screenX;
  const touchEndY = event.changedTouches[0].screenY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const isHorizontalSwipe = Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY);

  if (!isHorizontalSwipe) return;

  if (deltaX < 0) goNext();
  if (deltaX > 0) goPrevious();
});

prevButton.addEventListener("click", goPrevious);
nextButton.addEventListener("click", goNext);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") goPrevious();
  if (event.key === "ArrowRight") goNext();
});

shareButton.addEventListener("click", async () => {
  const shareData = {
    title: list?.title || "RankingsList",
    text: list?.description || "Check out this ranked list.",
    url: window.location.href
  };

  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }

  await navigator.clipboard.writeText(window.location.href);
  shareButton.textContent = "Copied!";
  setTimeout(() => {
    shareButton.textContent = "Share";
  }, 1300);
});

loadList();
