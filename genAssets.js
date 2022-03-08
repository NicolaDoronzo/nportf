const fs = require("fs");

console.log();

const vr = fs.readdirSync("./assets/vr");
const proto = fs.readdirSync("./assets/proto");

const byFirstNumberOfName = (a, b) => +a.split("(")[0] - +b.split("(")[0];

fs.writeFileSync(
  "./assets.js",
  `const assets = { 
      proto: [${proto.sort(byFirstNumberOfName).map((s) => `'${s}'`)}], 
      vr: [${vr.sort(byFirstNumberOfName).map((s) => `'${s}'`)}]
    }`
);
