import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = path.resolve("assets/images/maquettes/tinder_food.png");
const outDir = path.resolve("assets/images/site/tinder");

const crops = [
  { name: "onboarding_hero.webp", left: 36, top: 140, width: 210, height: 560 },
  { name: "dish_card_1.webp", left: 300, top: 144, width: 210, height: 285 },
  { name: "dish_card_2.webp", left: 569, top: 144, width: 210, height: 285 },
  { name: "dish_card_3.webp", left: 836, top: 144, width: 210, height: 285 },
  { name: "dish_detail.webp", left: 33, top: 818, width: 220, height: 372 },
  { name: "favorites_list.webp", left: 300, top: 823, width: 210, height: 360 },
  { name: "algo_screen.webp", left: 569, top: 817, width: 210, height: 372 },
  { name: "empty_screen.webp", left: 836, top: 820, width: 210, height: 371 },
];

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  await Promise.all(
    crops.map(async (crop) => {
      await sharp(source)
        .extract({
          left: crop.left,
          top: crop.top,
          width: crop.width,
          height: crop.height,
        })
        .webp({ quality: 92 })
        .toFile(path.join(outDir, crop.name));
    }),
  );
  console.log(`Generated ${crops.length} tinder assets in ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
