const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const webpConverter = require("webp-converter");

const configs = {
  webpQuality: 100,
};

webpConverter.grant_permission();

/* UTILS */
const toWebp =
  (basepath = "") =>
  (filename) =>
    webpConverter.cwebp(
      `./assets/${basepath}${filename}`,
      `./assets/webp/${basepath}${filename.split(".")[0]}.webp`,
      `-q ${configs.webpQuality}`
    );

const byFirstNumberOfName = (a, b) => +a.split("(")[0] - +b.split("(")[0];

/* MAIN SCRIPT */

const categories = ["vestiti-realizzati", "prototipi"];

// Promise.all([
//   ...categories
//     .map((cat) => fs.readdirSync(`./assets/${cat}`).map(toWebp(cat + "/")))
//     .flat(),
//   toWebp()("hero-bg.jpg"),
// ]).then(() => writeAssetsFile());

const writeAssetsFile = () =>
  fs.writeFileSync(
    path.join(__dirname, "assets.js"),
    `const assets = { 
      '${categories[0]}': [${fs
      .readdirSync(`./assets/webp/${categories[0]}`)
      .sort(byFirstNumberOfName)
      .map((s) => `'${s}'`)}], 
      '${categories[1]}': [${fs
      .readdirSync(`./assets/webp/${categories[1]}`)
      .sort(byFirstNumberOfName)
      .map((s) => `'${s}'`)}]
    }
    const categories = ['${categories[0]}', '${categories[1]}']
    `
  );

// sharp('./assets/hero-bg.jpg').resize(150).toFormat("webp").toFile("test.webp");

// Promise.all([
//   ...categories
//     .map((cat) => fs.readdirSync(`./assets/${cat}`).map(filename => sharp(`./assets/${cat}/${filename}`)))
//     .flat(),
//   toWebp()("hero-bg.jpg"),
// ]).then(() => writeAssetsFile());

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
  "jeans",
  "camicia-maniche-aperte",
  "vestito-rosa-fiori",
  "camicia-top-pattern-verde",
  "vestito-lungo-fiori",
  "pantaloncini-beige",
];

const prototipi = [
  "camicia-baby",
  "vestito-top",
  "giacca",
  "vestito-maniche-lunghe",
  "vestito-manica-rigonfia",
  "vestito-colletto-sovrapposto",
];

const getRowOfThree = (str) => [`${str}(1)`, `${str}(2)`, `${str}(3)`];

const outputPath = "./assets/out";
const toPath = (str) => `./assets/src/${str}.jpg`;
const toName = (str) => str.split(".jpg")[0].split("src/")[1];

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
    .toFormat("webp", { quality: 100 })
    .blur(10)
    .toFile(`${outputPath}/${obj.filename}-blurred.webp`);

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
const readyProto = prototipi.flatMap(prepare);

fs.rmSync(outputPath, { force: true, recursive: true });
fs.mkdirSync(outputPath);

saveToJson({
  "vestiti-realizzati": vestitiRealizzati.flatMap(prepare),
  prototipi: prototipi.flatMap(prepare),
});

const makeFiles = (obj) => {
  make200wWebp(obj);
  make400wWebp(obj);
  makeBlurredFullResWebp(obj);
  makeFullResWebp(obj);
};

readyVr.forEach(makeFiles);
readyProto.forEach(makeFiles);
