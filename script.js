const params = new URLSearchParams(window.location.search);
const slug = params.get("slug") || "top-3-fruits";

let list = null;
let currentIndex = 0;

const listTitle = document.getElementById("listTitle");
const listDescription = document.getElementById("listDescription");
const rankLabel = document.getElementById("rankLabel");
const progressLabel = document.getElementById("progressLabel");
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
  progressLabel.textContent = `${currentIndex + 1} of ${list.items.length}`;
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

prevButton.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    render();
  }
});

nextButton.addEventListener("click", () => {
  if (list && currentIndex < list.items.length - 1) {
    currentIndex++;
    render();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") prevButton.click();
  if (event.key === "ArrowRight") nextButton.click();
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
