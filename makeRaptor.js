const fs = require("fs");
const sharp = require("sharp");

const raptorSvg = fs.readFileSync("./raptor.svg");

const SOL_ADDRESS = "EBirNSYBRzDboNvEuYXA41m8n2rb6EpECyaPXEpW1u2y";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
let bgColor = "#FFFFFF";
let lineColor = "#000000";
let colorPair = bgColor + lineColor;
let colorPairs = [colorPair];
for (let i = 0; i < 69; i++) {
  while (colorPairs.includes(colorPair)) {
    bgColor = getRandomColor();
    lineColor = getRandomColor();
    colorPair = bgColor + lineColor;
  }
  colorPairs.push(colorPair);
  const coloredRaptorSvg = raptorSvg
    .toString()
    .replace("__BG__", bgColor)
    .replace("__LINE__", lineColor);

  const svgBuffer = Buffer.from(coloredRaptorSvg);
  const imgFileName = `${i}.png`;
  sharp(svgBuffer)
    .png()
    .toFile(`./raptors/${imgFileName}`)
    .then(function (info) {})
    .catch(function (err) {
      console.log(err);
    });

  const id = i + 1;
  const metaData = {
    name: `Raptor ${id}`,
    description: `This is a raptor #${id}/69 with a ${lineColor} skeleton and a ${bgColor} backdrop`,
    image: imgFileName,
    properties: {
      files: [{ uri: imgFileName, type: "image/png" }],
      category: "image",
      creators: [
        {
          address: SOL_ADDRESS,
          share: 100,
        },
      ],
    },
  };

  fs.writeFileSync(`./raptors/${i}.json`, JSON.stringify(metaData));
}
