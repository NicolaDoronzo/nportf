const fs = require("fs");
const path = require("path");
const sharp = require('sharp');
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

Promise.all([
  ...categories
    .map((cat) => fs.readdirSync(`./assets/${cat}`).map(toWebp(cat + "/")))
    .flat(),
  toWebp()("hero-bg.jpg"),
]).then(() => writeAssetsFile());

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
