MicroModal.init();

const bgImageSrc = "./assets/webp/hero-bg.webp";
load(bgImageSrc).then(() => {
  const heroSection = document.getElementById("hero");
  heroSection.style.backgroundImage = `url(${bgImageSrc})`;
  document.body.classList.add("content-loaded");
  setTimeout(
    () => heroSection.querySelector("a").classList.add("visible"),
    1500
  );
});

const modalContainer = document.querySelector("#main-modal");
const imgContainer = document.querySelector(".img-container");

const isModalOpenObserver = new MutationObserver((mutations) => {
  const isOpen = mutations[0].target.classList.contains("is-open");
  document.body.style.overflowY = isOpen ? "hidden" : "auto";
});

isModalOpenObserver.observe(modalContainer, {
  attributes: true,
  childList: false,
  subtree: false,
  attributeFilter: ["class"],
  characterData: false,
  characterDataOldValue: false,
  attributeOldValue: false,
});

categories.forEach((cat) => {
  assets[cat].forEach((src, i) => {
    const el = document.createElement("img");
    el.src = `./assets/webp/${cat}/${src}`;
    el.setAttribute("loading", "lazy");
    el.setAttribute("data-category", cat);
    el.setAttribute("data-micromodal-trigger", "");
    el.addEventListener("click", () => {
      ModalImage.create(el.src);
      MicroModal.show("main-modal");
    });
    document.getElementById(cat).appendChild(el);
  });
});

categories.forEach((cat) => {
  const io = new IntersectionObserver(
    (entries) => {
      document
        .querySelector(`li [href="#${cat}"]`)
        .classList[entries[0].isIntersecting ? "add" : "remove"]("selected");
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.001,
    }
  );
  io.observe(document.getElementById(cat));
});
