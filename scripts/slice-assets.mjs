import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = path.resolve("assets/images/maquettes/all_pics.png");
const outDir = path.resolve("assets/images/site");

const crops = [
  { name: "hero_background.webp", left: 589, top: 84, width: 370, height: 176 },
  { name: "hero_dish.webp", left: 974, top: 84, width: 167, height: 176 },
  { name: "hero_wine.webp", left: 1156, top: 84, width: 169, height: 176 },
  { name: "hero_detail.webp", left: 1339, top: 84, width: 172, height: 176 },
  { name: "card_restaurant.webp", left: 15, top: 374, width: 233, height: 125 },
  { name: "card_hotel.webp", left: 271, top: 373, width: 240, height: 126 },
  { name: "inspiration_1.webp", left: 550, top: 374, width: 238, height: 125 },
  { name: "inspiration_2.webp", left: 802, top: 374, width: 233, height: 124 },
  { name: "inspiration_3.webp", left: 1049, top: 374, width: 221, height: 124 },
  { name: "inspiration_4.webp", left: 1284, top: 374, width: 227, height: 124 },
  { name: "article_1.webp", left: 15, top: 546, width: 115, height: 132 },
  { name: "article_2.webp", left: 167, top: 548, width: 221, height: 130 },
  { name: "article_3.webp", left: 426, top: 547, width: 205, height: 131 },
  { name: "article_4.webp", left: 668, top: 546, width: 192, height: 132 },
  { name: "dest_france.webp", left: 15, top: 721, width: 234, height: 132 },
  { name: "dest_italy.webp", left: 272, top: 721, width: 215, height: 132 },
  { name: "dest_japan.webp", left: 513, top: 721, width: 222, height: 132 },
  { name: "dest_spain.webp", left: 758, top: 721, width: 228, height: 133 },
  { name: "dest_usa.webp", left: 1013, top: 721, width: 229, height: 132 },
  { name: "dest_thailand.webp", left: 1270, top: 722, width: 239, height: 131 },
];

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  await Promise.all(
    crops.map(async (crop) => {
      const outputPath = path.join(outDir, crop.name);
      await sharp(source)
        .extract({
          left: crop.left,
          top: crop.top,
          width: crop.width,
          height: crop.height,
        })
        .webp({ quality: 90 })
        .toFile(outputPath);
    }),
  );

  console.log(`Generated ${crops.length} webp assets in ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
