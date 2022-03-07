const fs = require("fs");

console.log();

const vr = fs.readdirSync("./assets/vr");
const proto = fs.readdirSync("./assets/proto");

fs.writeFileSync(
  "./assets.js",
  `const assets = { 
      proto: [${proto.map((s) => `'${s}'`)}], 
      vr: [${vr.map((s) => `'${s}'`)}]
    }`
);
