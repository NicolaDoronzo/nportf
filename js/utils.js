function clamp(min, max, v) {
  return Math.max(Math.min(v, max), min);
}

function preload(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", resolve);
    image.addEventListener("error", reject);
    image.src = src;
  });
}
