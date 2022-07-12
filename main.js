const imgContainer = document.querySelector(".img-container");
const cats = ['vr', 'proto'];
cats.forEach(cat => {
  assets[cat].forEach(src => {
    const el = document.createElement("img");
    el.src = `./assets/webp/${cat}/${src}`;
    el.setAttribute("loading", "lazy");
    el.setAttribute("data-category", cat);
    imgContainer.appendChild(el);
  })
})

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
