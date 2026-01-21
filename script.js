const meadow = document.getElementById("meadow");

const STORAGE_KEY = "louka-flowers";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const saveFlowers = () => {
  const flowers = Array.from(meadow.querySelectorAll(".flower")).map((flower) => ({
    id: flower.dataset.id,
    name: flower.querySelector(".flower-name")?.textContent ?? "",
    x: Number.parseFloat(flower.style.left),
    y: Number.parseFloat(flower.style.top),
    stage: Number(flower.dataset.stage),
    bloomed: flower.dataset.bloomed === "true",
    plucked: flower.dataset.plucked === "true",
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(flowers));
};

const loadFlowers = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch (error) {
    console.warn("Nepovedlo se načíst uložené květiny.", error);
    return [];
  }
};

const createFlower = (name, x, y, options = {}) => {
  const flower = document.createElement("div");
  flower.className = "flower";
  flower.dataset.stage = String(options.stage ?? 0);
  flower.dataset.bloomed = String(options.bloomed ?? false);
  flower.dataset.plucked = String(options.plucked ?? false);
  flower.dataset.id = options.id ?? crypto.randomUUID();

  const label = document.createElement("div");
  label.className = "flower-name";
  label.textContent = name;

  const flowerHead = document.createElement("div");
  flowerHead.className = "flower-head";

  const petals = document.createElement("div");
  petals.className = "petals";

  const bud = document.createElement("div");
  bud.className = "bud";

  const stem = document.createElement("div");
  stem.className = "stem";

  flower.style.left = `${x}%`;
  flower.style.top = `${y}%`;

  flower.appendChild(label);
  flowerHead.appendChild(petals);
  flowerHead.appendChild(bud);

  flower.appendChild(flowerHead);
  flower.appendChild(stem);

  if (flower.dataset.bloomed === "true") {
    flower.classList.add("bloomed");
  }

  if (flower.dataset.plucked === "true") {
    flower.classList.add("plucked");
  }

  flower.addEventListener("click", (event) => {
    event.stopPropagation();
    handleFlowerClick(flower);
  });

  return flower;
};

const handleFlowerClick = (flower) => {
  if (flower.dataset.plucked === "true") {
    return;
  }

  if (flower.dataset.bloomed === "true") {
    flower.dataset.plucked = "true";
    flower.classList.add("plucked");
    saveFlowers();
    return;
  }

  const currentStage = Number(flower.dataset.stage);
  if (currentStage < 10) {
    flower.dataset.stage = String(currentStage + 1);
    saveFlowers();
    return;
  }

  flower.dataset.bloomed = "true";
  flower.classList.add("bloomed");
  saveFlowers();
};

const restoreFlowers = () => {
  const storedFlowers = loadFlowers();
  storedFlowers.forEach((flowerData) => {
    if (!flowerData.name) {
      return;
    }

    const flower = createFlower(flowerData.name, flowerData.x, flowerData.y, flowerData);
    meadow.appendChild(flower);
  });
};

restoreFlowers();

meadow.addEventListener("click", (event) => {
  const name = window.prompt("Jak se bude květina jmenovat?");
  const trimmedName = name ? name.trim() : "";
  if (!trimmedName) {
    return;
  }

  const rect = meadow.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  const percentX = clamp((clickX / rect.width) * 100, 5, 90);
  const percentY = clamp((clickY / rect.height) * 100, 20, 85);

  const flower = createFlower(trimmedName, percentX, percentY);
  meadow.appendChild(flower);
  saveFlowers();
});
