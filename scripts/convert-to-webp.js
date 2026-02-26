/**
 * Convertit tous les fichiers JPG/JPEG/PNG de public/images en WebP.
 * Qualité 82 : bon compromis qualité/poids pour le web.
 * Utilise Sharp (déjà dans le projet).
 * Supprime les fichiers originaux après conversion.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMAGES_DIR = path.join(__dirname, "..", "public", "images");
const QUALITY = 82; // 80-85 recommandé pour le web
const EXTENSIONS = [".jpg", ".jpeg", ".png"];

async function convertToWebP() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error("Dossier public/images introuvable.");
    process.exit(1);
  }

  const toConvert = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.includes(ext)) {
        toConvert.push(fullPath);
      }
    }
  };

  walk(IMAGES_DIR);

  if (toConvert.length === 0) {
    console.log("Aucun fichier JPG/JPEG à convertir.");
    return;
  }

  console.log(`Conversion de ${toConvert.length} fichier(s) en WebP (qualité ${QUALITY})...`);

  for (const inputPath of toConvert) {
    const baseName = path.basename(inputPath, path.extname(inputPath));
    const outputPath = path.join(path.dirname(inputPath), `${baseName}.webp`);

    try {
      await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);
      fs.unlinkSync(inputPath);
      console.log(`  ✓ ${path.relative(IMAGES_DIR, inputPath)} → ${path.relative(IMAGES_DIR, outputPath)}`);
    } catch (err) {
      console.error(`  ✗ ${file}:`, err.message);
    }
  }

  console.log("Conversion terminée.");
}

convertToWebP().catch((err) => {
  console.error(err);
  process.exit(1);
});
