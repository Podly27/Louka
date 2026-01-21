const meadow = document.getElementById("meadow");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const createFlower = (name, x, y) => {
  const flower = document.createElement("div");
  flower.className = "flower";
  flower.dataset.stage = "0";
  flower.dataset.bloomed = "false";
  flower.dataset.plucked = "false";

  const label = document.createElement("div");
  label.className = "flower-name";
  label.textContent = name;

  const bud = document.createElement("div");
  bud.className = "bud";

  const stem = document.createElement("div");
  stem.className = "stem";

  flower.style.left = `${x}%`;
  flower.style.top = `${y}%`;

  flower.appendChild(label);
  flower.appendChild(bud);
  flower.appendChild(stem);

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
    return;
  }

  const currentStage = Number(flower.dataset.stage);
  if (currentStage < 10) {
    flower.dataset.stage = String(currentStage + 1);
    return;
  }

  flower.dataset.bloomed = "true";
  flower.classList.add("bloomed");
};

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
});
