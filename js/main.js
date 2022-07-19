MicroModal.init();
const bgImageSrc = "./assets/webp/hero-bg.webp";
const modalContainer = document.querySelector("#main-modal");
const heroSection = document.getElementById("hero");
const navItems = document.querySelectorAll(`nav li a`);

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
        ModalImage.create(obj);
        MicroModal.show("main-modal");
      });
      document.getElementById(cat).appendChild(el);
    });
  });

  function selectSectionByItem(navItem) {
    navItems.forEach((i) => i.classList.remove("selected"));
    const selectedSection = navItem.getAttribute("data-section-trigger");
    navItem.classList.add("selected");
    document.querySelectorAll(".img-container").forEach((section) => {
      if (section.id === selectedSection) {
        section.style.display = "grid";
      } else {
        section.style.display = "none";
      }
    });
  }

  selectSectionByItem(navItems[0]);

  navItems.forEach((navItem) =>
    navItem.addEventListener("click", selectSectionByItem.bind(null, navItem))
  );
}

Promise.all([
  fetch("./assets/assets.json").then((v) => v.json()),
  preload(bgImageSrc),
]).then(([assets]) => {
  init(assets);
});
