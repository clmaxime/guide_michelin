import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sources = [
  "assets/images/site/tinder/dish_card_1.webp",
  "assets/images/site/tinder/dish_card_2.webp",
  "assets/images/site/tinder/dish_card_3.webp",
  "assets/images/site/tinder/dish_detail.webp",
];

const outputDir = path.resolve("assets/images/plats");

const variants = [
  { name: "plat_01.webp", source: 0, hue: 0, sat: 1.05, bright: 1.02 },
  { name: "plat_02.webp", source: 1, hue: -12, sat: 1.1, bright: 1.03 },
  { name: "plat_03.webp", source: 2, hue: 14, sat: 1.02, bright: 0.97 },
  { name: "plat_04.webp", source: 3, hue: -6, sat: 0.96, bright: 1.05 },
  { name: "plat_05.webp", source: 0, hue: 20, sat: 1.08, bright: 0.98 },
  { name: "plat_06.webp", source: 1, hue: -20, sat: 0.9, bright: 1.04 },
  { name: "plat_07.webp", source: 2, hue: 8, sat: 1.15, bright: 1.02 },
  { name: "plat_08.webp", source: 3, hue: 11, sat: 1.02, bright: 1.07 },
  { name: "plat_09.webp", source: 0, hue: -15, sat: 0.94, bright: 1.06 },
  { name: "plat_10.webp", source: 1, hue: 16, sat: 1.06, bright: 1.01 },
  { name: "plat_11.webp", source: 2, hue: -7, sat: 0.92, bright: 0.98 },
  { name: "plat_12.webp", source: 3, hue: 6, sat: 1.1, bright: 0.96 },
  { name: "plat_13.webp", source: 0, hue: -24, sat: 0.9, bright: 1.03 },
  { name: "plat_14.webp", source: 1, hue: 24, sat: 1.12, bright: 1.02 },
  { name: "plat_15.webp", source: 2, hue: -17, sat: 1.03, bright: 1.05 },
  { name: "plat_16.webp", source: 3, hue: 18, sat: 1.06, bright: 0.95 },
  { name: "plat_17.webp", source: 0, hue: 12, sat: 0.96, bright: 1.02 },
  { name: "plat_18.webp", source: 1, hue: -10, sat: 1.08, bright: 1.01 },
  { name: "plat_19.webp", source: 2, hue: 4, sat: 0.94, bright: 1.04 },
  { name: "plat_20.webp", source: 3, hue: -4, sat: 1.09, bright: 1.02 },
];

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  await Promise.all(
    variants.map(async (variant) => {
      const source = sources[variant.source];
      const sourceMeta = await sharp(source).metadata();
      const width = sourceMeta.width ?? 900;
      const height = sourceMeta.height ?? 1200;
      const extractHeight = Math.floor(height * 0.9);

      await sharp(source)
        .extract({
          left: 0,
          top: Math.max(0, Math.floor((height - extractHeight) / 2)),
          width,
          height: extractHeight,
        })
        .resize(840, 1180, { fit: "cover", position: "attention" })
        .modulate({
          hue: variant.hue,
          saturation: variant.sat,
          brightness: variant.bright,
        })
        .sharpen({ sigma: 1.2, m1: 1, m2: 2 })
        .webp({ quality: 90 })
        .toFile(path.join(outputDir, variant.name));
    }),
  );

  console.log(`Generated ${variants.length} assets in ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
