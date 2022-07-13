MicroModal.init();

const modalContainer = document.querySelector("#main-modal");
const imgContainer = document.querySelector(".img-container");

const observer = new MutationObserver((mutations) => {
  const isOpen = mutations[0].target.classList.contains("is-open");
  document.body.style.overflow = isOpen ? "hidden" : "auto";
});

observer.observe(modalContainer, {
  attributes: true,
  childList: false,
  subtree: false,
  attributeFilter: ["class"],
  characterData: false,
  characterDataOldValue: false,
  attributeOldValue: false,
});
const cats = ["vr", "proto"];
cats.forEach((cat) => {
  assets[cat].forEach((src) => {
    const el = document.createElement("img");
    el.src = `./assets/webp/${cat}/${src}`;
    el.setAttribute("loading", "lazy");
    el.setAttribute("data-category", cat);
    el.setAttribute("data-micromodal-trigger", "");
    el.addEventListener("click", () => {
      ModalImage.create(el.src);
      MicroModal.show("main-modal");
    });
    imgContainer.appendChild(el);
  });
});

const navItems = document.querySelectorAll("nav li");
let selectedCategory = null;
navItems.forEach((item) =>
  item.addEventListener("click", () => {
    const clickedCategory = item.getAttribute("data-category-filter");
    selectedCategory =
      clickedCategory !== selectedCategory ? clickedCategory : null;
    imgContainer.querySelectorAll("img").forEach((img) => {
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
