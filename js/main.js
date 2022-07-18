MicroModal.init();
const bgImageSrc = "./assets/webp/hero-bg.webp";
const modalContainer = document.querySelector("#main-modal");
const imgContainer = document.querySelector(".img-container");
const heroSection = document.getElementById("hero");

const isModalOpenObserver = new MutationObserver((mutations) => {
  const isOpen = mutations[0].target.classList.contains("is-open");
  document.body.style.overflowY = isOpen ? "hidden" : "auto";
});

function init(assets) {
  heroSection.style.backgroundImage = `url(${bgImageSrc})`;
  setTimeout(() => {
    document.body.classList.add("content-loaded");
  }, 500);
  setTimeout(
    () => heroSection.querySelector("a").classList.add("visible"),
    1500
  );
  isModalOpenObserver.observe(modalContainer, {
    attributes: true,
    childList: false,
    subtree: false,
    attributeFilter: ["class"],
    characterData: false,
    characterDataOldValue: false,
    attributeOldValue: false,
  });

  const categories = Object.keys(assets);

  categories.forEach((cat) => {
    assets[cat].forEach((obj) => {
      const el = document.createElement("img");
      el.srcset = `
      ${obj[200]} 200w,
      ${obj[400]} 400w,
      `;
      el.src = obj[400];
      el.setAttribute("loading", "lazy");
      el.addEventListener("click", () => {
        ModalImage.create(obj.full);
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
}

Promise.all([
  fetch("./assets/assets.json").then((v) => v.json()),
  preload(bgImageSrc),
]).then(([assets]) => {
  init(assets);
});
