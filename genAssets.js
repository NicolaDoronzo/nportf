const fs = require("fs");
const webpConverter = require("webp-converter");

const configs = {
  webpQuality: 100,
};

webpConverter.grant_permission();

/* UTILS */
const toWebp = (basepath) => (filename) =>
  webpConverter.cwebp(
    `./assets/${basepath}/${filename}`,
    `./assets/webp/${basepath}/${filename.split(".")[0]}.webp`,
    `-q ${configs.webpQuality}`
  );

const byFirstNumberOfName = (a, b) => +a.split("(")[0] - +b.split("(")[0];

/* MAIN SCRIPT */

const categories = ["vr", "proto"];

Promise.all(
  categories
    .map((cat) => fs.readdirSync(`./assets/${cat}`).map(toWebp(cat)))
    .flat()
).then(() => writeAssetsFile());

const writeAssetsFile = () =>
  fs.writeFileSync(
    "./assets.js",
    `const assets = { 
      proto: [${fs
        .readdirSync("./assets/webp/proto")
        .sort(byFirstNumberOfName)
        .map((s) => `'${s}'`)}], 
      vr: [${fs
        .readdirSync("./assets/webp/vr")
        .sort(byFirstNumberOfName)
        .map((s) => `'${s}'`)}]
    }`
  );
