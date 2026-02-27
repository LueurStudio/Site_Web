/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Convertit tous les fichiers JPG/JPEG du bucket Supabase "projects" en WebP
 * puis met a jour les URLs en base:
 * - projects.image
 * - projects.photos[]
 * - reservations.inspiration_photos[]
 * - reservations.gallery_photos[]
 *
 * Usage:
 *   npm run migrate:supabase:webp
 *
 * Variables d'environnement requises:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");

const BUCKET = "projects";
const WEBP_QUALITY = 82;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Variables manquantes: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

function isJpegPath(path) {
  return /\.(jpe?g)$/i.test(path);
}

function toWebpPath(path) {
  return path.replace(/\.(jpe?g)$/i, ".webp");
}

function toPublicUrl(path) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function extractObjectPathFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const markerIndex = parsed.pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    const rawPath = parsed.pathname.slice(markerIndex + marker.length);
    return decodeURIComponent(rawPath);
  } catch {
    return null;
  }
}

async function listAllBucketObjects(prefix = "") {
  const files = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
      limit: 100,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const item of data) {
      const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
      const isFolder = item.id == null;
      if (isFolder) {
        const nested = await listAllBucketObjects(itemPath);
        files.push(...nested);
      } else {
        files.push(itemPath);
      }
    }

    if (data.length < 100) break;
    offset += 100;
  }

  return files;
}

async function ensureWebpForObject(jpegPath, convertedMap) {
  if (!isJpegPath(jpegPath)) return null;

  if (convertedMap.has(jpegPath)) {
    return convertedMap.get(jpegPath);
  }

  const webpPath = toWebpPath(jpegPath);

  const existingWebp = await supabase.storage.from(BUCKET).download(webpPath);
  if (!existingWebp.error) {
    convertedMap.set(jpegPath, webpPath);
    return webpPath;
  }

  const { data: sourceFile, error: downloadError } = await supabase.storage
    .from(BUCKET)
    .download(jpegPath);

  if (downloadError || !sourceFile) {
    console.warn(`- Impossible de telecharger: ${jpegPath}`);
    return null;
  }

  const sourceBuffer = Buffer.from(await sourceFile.arrayBuffer());
  const webpBuffer = await sharp(sourceBuffer).webp({ quality: WEBP_QUALITY }).toBuffer();

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(webpPath, webpBuffer, {
    contentType: "image/webp",
    upsert: true,
  });

  if (uploadError) {
    console.warn(`- Echec upload WebP: ${jpegPath} -> ${webpPath}`);
    return null;
  }

  const { error: deleteError } = await supabase.storage.from(BUCKET).remove([jpegPath]);
  if (deleteError) {
    console.warn(`- Conversion ok mais suppression JPG impossible: ${jpegPath}`);
  }

  convertedMap.set(jpegPath, webpPath);
  return webpPath;
}

async function migrateStorageJpegs(convertedMap) {
  const allObjects = await listAllBucketObjects("");
  const jpegObjects = allObjects.filter(isJpegPath);

  console.log(`Fichiers detectes dans le bucket: ${allObjects.length}`);
  console.log(`JPG/JPEG a convertir: ${jpegObjects.length}`);

  let converted = 0;
  for (const jpegPath of jpegObjects) {
    const result = await ensureWebpForObject(jpegPath, convertedMap);
    if (result) {
      converted += 1;
      console.log(`  ✓ ${jpegPath} -> ${result}`);
    }
  }

  return converted;
}

function replaceUrlIfConverted(url, convertedMap) {
  const objectPath = extractObjectPathFromUrl(url);
  if (!objectPath) return url;

  const convertedPath = convertedMap.get(objectPath);
  if (!convertedPath) return url;

  return toPublicUrl(convertedPath);
}

function replaceArrayUrlsIfConverted(urls, convertedMap) {
  if (!Array.isArray(urls)) return urls;
  return urls.map((url) => replaceUrlIfConverted(url, convertedMap));
}

async function migrateProjectsRows(convertedMap) {
  const { data: rows, error } = await supabase
    .from("projects")
    .select("slug,image,photos");

  if (error) throw error;
  if (!rows || rows.length === 0) return 0;

  let updatedCount = 0;

  for (const row of rows) {
    const oldImage = row.image;
    const oldPhotos = Array.isArray(row.photos) ? row.photos : [];

    const newImage = replaceUrlIfConverted(oldImage, convertedMap);
    const newPhotos = replaceArrayUrlsIfConverted(oldPhotos, convertedMap);

    const imageChanged = newImage !== oldImage;
    const photosChanged = JSON.stringify(newPhotos) !== JSON.stringify(oldPhotos);

    if (!imageChanged && !photosChanged) continue;

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        image: newImage,
        photos: newPhotos,
      })
      .eq("slug", row.slug);

    if (updateError) {
      console.warn(`- Echec update projects.slug=${row.slug}`);
      continue;
    }

    updatedCount += 1;
    console.log(`  ✓ projects.slug=${row.slug} mis a jour`);
  }

  return updatedCount;
}

async function migrateReservationsRows(convertedMap) {
  const { data: sampleRows, error: sampleError } = await supabase
    .from("reservations")
    .select("*")
    .limit(1);

  if (sampleError) throw sampleError;

  const sample = sampleRows && sampleRows[0] ? sampleRows[0] : {};
  const inspirationKey = Object.prototype.hasOwnProperty.call(sample, "inspiration_photos")
    ? "inspiration_photos"
    : (Object.prototype.hasOwnProperty.call(sample, "inspirationPhotos") ? "inspirationPhotos" : null);
  const galleryKey = Object.prototype.hasOwnProperty.call(sample, "gallery_photos")
    ? "gallery_photos"
    : (Object.prototype.hasOwnProperty.call(sample, "galleryPhotos") ? "galleryPhotos" : null);

  if (!inspirationKey && !galleryKey) {
    return 0;
  }

  const columns = ["id"];
  if (inspirationKey) columns.push(inspirationKey);
  if (galleryKey) columns.push(galleryKey);

  const { data: rows, error } = await supabase
    .from("reservations")
    .select(columns.join(","));

  if (error) throw error;
  if (!rows || rows.length === 0) return 0;

  let updatedCount = 0;

  for (const row of rows) {
    const oldInspiration = inspirationKey && Array.isArray(row[inspirationKey]) ? row[inspirationKey] : [];
    const oldGallery = galleryKey && Array.isArray(row[galleryKey]) ? row[galleryKey] : [];

    const newInspiration = replaceArrayUrlsIfConverted(oldInspiration, convertedMap);
    const newGallery = replaceArrayUrlsIfConverted(oldGallery, convertedMap);

    const inspirationChanged = JSON.stringify(newInspiration) !== JSON.stringify(oldInspiration);
    const galleryChanged = JSON.stringify(newGallery) !== JSON.stringify(oldGallery);

    if (!inspirationChanged && !galleryChanged) continue;

    const updatePayload = {};
    if (inspirationKey) updatePayload[inspirationKey] = newInspiration;
    if (galleryKey) updatePayload[galleryKey] = newGallery;

    const { error: updateError } = await supabase
      .from("reservations")
      .update(updatePayload)
      .eq("id", row.id);

    if (updateError) {
      console.warn(`- Echec update reservations.id=${row.id}`);
      continue;
    }

    updatedCount += 1;
    console.log(`  ✓ reservations.id=${row.id} mis a jour`);
  }

  return updatedCount;
}

async function main() {
  console.log("=== Migration Supabase JPG/JPEG -> WebP ===");
  console.log(`Bucket: ${BUCKET}`);

  const convertedMap = new Map();

  const convertedFiles = await migrateStorageJpegs(convertedMap);
  const updatedProjects = await migrateProjectsRows(convertedMap);
  const updatedReservations = await migrateReservationsRows(convertedMap);

  console.log("");
  console.log("=== Resume ===");
  console.log(`Fichiers convertis: ${convertedFiles}`);
  console.log(`Lignes projects mises a jour: ${updatedProjects}`);
  console.log(`Lignes reservations mises a jour: ${updatedReservations}`);
  console.log("Migration terminee.");
}

main().catch((err) => {
  console.error("Erreur fatale:", err);
  process.exit(1);
});
