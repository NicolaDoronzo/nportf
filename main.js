const imgContainer = document.querySelector(".img-container");
for (let i = 0; i < 30; i++) {
  const el = document.createElement("img");
  const w = randomIntFromInterval(200, 500);
  const h = randomIntFromInterval(200, 500);
  const cat = Math.random() > 0.5 ? "vestitiRealizzati" : "prototipi";
  el.src = `https://picsum.photos/seed/${i}/${w}/${h}?grayscale`;
  el.setAttribute("loading", "lazy");
  el.setAttribute("data-category", cat);
  imgContainer.appendChild(el);
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const navItems = document.querySelectorAll("nav li");
let selectedCategory = null;
navItems.forEach((item) =>
  item.addEventListener("click", () => {
    const clickedCategory = item.getAttribute("data-category-filter");
    selectedCategory =
      clickedCategory !== selectedCategory ? clickedCategory : null;
    document.querySelectorAll("img").forEach((img) => {
      if (
        !selectedCategory ||
        img.getAttribute("data-category") === selectedCategory
      ) {
        img.style.display = "inline-block";
      } else {
        img.style.display = "none";
      }
    });
    navItems.forEach((i) => i.classList.remove("selected"));
    if (selectedCategory === item.getAttribute("data-category-filter")) {
      item.classList.add("selected");
    }
  })
);
