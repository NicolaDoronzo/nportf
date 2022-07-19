const fs = require("fs");
const sharp = require("sharp");

/* MAIN SCRIPT */

const vestitiRealizzati = [
  "camicia-sciarpa",
  "sweater-smanicato",
  "camicia-bianca-stringhe",
  "giacca-gonna-scozzese",
  "camicia-bianca-smanicata",
  "vestito-lungo-argento",
  "vestito-bordeaux-panneggio",
  "gonna-panneggio",
  "camicia-patchwork",
  "vestito-nero",
  // "jeans",
  // "camicia-maniche-aperte",
  // "vestito-rosa-fiori",
  // "camicia-top-pattern-verde",
  // "vestito-lungo-fiori",
  // "pantaloncini-beige",
];

const prototipi = [
  "camicia-baby(1)",
  "vestito-top(1)",
  "giacca(1)",
  "vestito-maniche-lunghe(1)",
  "vestito-manica-rigonfia(1)",
  "vestito-colletto-sovrapposto(1)",
];

const getRowOfThree = (str) => [`${str}(1)`, `${str}(2)`, `${str}(3)`];

const outputPath = "./assets/out";
const toPath = (str) => `./assets/src/${str}.jpg`;

const toFormatsObj = (filename) => ({
  filename,
  200: `${outputPath}/${filename}-200w.webp`,
  400: `${outputPath}/${filename}-400w.webp`,
  full: `${outputPath}/${filename}.webp`,
  blur: `${outputPath}/${filename}-blur.webp`,
});

const saveToJson = (data) => {
  fs.writeFileSync(`./assets/assets.json`, JSON.stringify(data), {
    encoding: "utf-8",
  });
};

const prepare = (filename) => getRowOfThree(filename).map(toFormatsObj);

const makeFullResWebp = (obj) =>
  sharp(toPath(obj.filename))
    .toFormat("webp", { quality: 100 })
    .toFile(`${outputPath}/${obj.filename}.webp`);

const makeBlurredFullResWebp = (obj) =>
  sharp(toPath(obj.filename))
    .toFormat("webp", { quality: 50 })
    .blur(200)
    .toFile(`${outputPath}/${obj.filename}-blur.webp`);

const make200wWebp = (obj) =>
  sharp(toPath(obj.filename))
    .resize(200)
    .toFormat("webp", { quality: 100 })
    .toFile(`${outputPath}/${obj.filename}-200w.webp`);

const make400wWebp = (obj) =>
  sharp(toPath(obj.filename))
    .resize(400)
    .toFormat("webp", { quality: 100 })
    .toFile(`${outputPath}/${obj.filename}-400w.webp`);

const readyVr = vestitiRealizzati.flatMap(prepare);
const readyProto = prototipi.map(toFormatsObj);

fs.rmSync(outputPath, { force: true, recursive: true });
fs.mkdirSync(outputPath);

saveToJson({
  "vestiti-realizzati": readyVr,
  prototipi: readyProto,
});

const makeFiles = (obj) => {
  make200wWebp(obj);
  make400wWebp(obj);
  makeBlurredFullResWebp(obj);
  makeFullResWebp(obj);
};

readyVr.forEach(makeFiles);
readyProto.forEach(makeFiles);
