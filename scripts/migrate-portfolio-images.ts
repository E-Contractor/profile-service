/**
 * One-time migration: move base64 portfolio images out of contractor documents
 * and into the file-service, replacing each data URL with a /files/view/<id> URL.
 *
 * Why: portfolio images used to be stored as base64 strings *inside* the
 * contractor document, bloating every profile/auth response and pushing toward
 * MongoDB's 16MB document cap. This script slims existing documents to match the
 * new upload flow (which stores file-service URLs).
 *
 * All E-Contractor services share one database, so a single MONGO_URI connection
 * covers both the `contractors` and `files` collections. Files are written to the
 * file-service's uploads/ directory so its existing /files/view/:id endpoint can
 * serve them unchanged.
 *
 * Run from the profile-service directory:
 *   npx tsx scripts/migrate-portfolio-images.ts            # apply
 *   DRY_RUN=1 npx tsx scripts/migrate-portfolio-images.ts  # report only, no writes
 *
 * Optional env overrides:
 *   FILE_UPLOADS_DIR        absolute path to file-service/uploads (default: ../../file-service/uploads)
 *   PUBLIC_FILES_BASE_URL   base for stored URLs (default: http://localhost:3000/api/files)
 *                           — set this to match your frontend's gateway origin
 *                           (e.g. https://<tunnel>.devtunnels.ms/api/files).
 */
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';
const MONGO_URI = process.env.MONGO_URI;
const UPLOADS_DIR =
  process.env.FILE_UPLOADS_DIR ||
  path.resolve(__dirname, '../../file-service/uploads');
const PUBLIC_FILES_BASE_URL = (
  process.env.PUBLIC_FILES_BASE_URL || 'http://localhost:3000/api/files'
).replace(/\/+$/, '');

const extForMime = (mime: string): string =>
  mime === 'image/png'
    ? 'png'
    : mime === 'image/webp'
      ? 'webp'
      : mime === 'image/jpeg' || mime === 'image/jpg'
        ? 'jpg'
        : 'bin';

const DATA_URL_RE = /^data:([^;]+);base64,(.+)$/s;

async function main() {
  if (!MONGO_URI) {
    console.error('MONGO_URI is not set. Add it to profile-service/.env');
    process.exit(1);
  }

  if (!DRY_RUN && !fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  console.log(`[migrate] mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'APPLY'}`);
  console.log(`[migrate] uploads dir: ${UPLOADS_DIR}`);
  console.log(`[migrate] public base: ${PUBLIC_FILES_BASE_URL}`);

  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db!;
  const contractors = db.collection('contractors');
  const files = db.collection('files');

  const cursor = contractors.find({ 'portfolio.0': { $exists: true } });

  let contractorsScanned = 0;
  let contractorsUpdated = 0;
  let imagesConverted = 0;
  let imagesReused = 0; // duplicate base64 within the same contractor

  // Convert one data URL → file-service view URL (cached per contractor so the
  // duplicated legacy `images` array reuses the same uploaded file).
  const convert = async (
    dataUrl: string,
    userId: any,
    cache: Map<string, string>
  ): Promise<string | null> => {
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return null;
    const cached = cache.get(dataUrl);
    if (cached) {
      imagesReused += 1;
      return cached;
    }
    const m = DATA_URL_RE.exec(dataUrl);
    if (!m) return null;
    const mime = m[1];
    const buffer = Buffer.from(m[2], 'base64');
    const ext = extForMime(mime);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const relPath = `uploads/${filename}`;

    if (!DRY_RUN) {
      fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
      const now = new Date();
      const inserted = await files.insertOne({
        userId,
        filename,
        originalName: `portfolio-${filename}`,
        mimeType: mime,
        size: buffer.length,
        path: relPath,
        createdAt: now,
        updatedAt: now,
      });
      const url = `${PUBLIC_FILES_BASE_URL}/view/${inserted.insertedId.toString()}`;
      cache.set(dataUrl, url);
      imagesConverted += 1;
      return url;
    }

    // Dry run: count it, return a placeholder so the caller still flags a change.
    imagesConverted += 1;
    const placeholder = `${PUBLIC_FILES_BASE_URL}/view/<new>`;
    cache.set(dataUrl, placeholder);
    return placeholder;
  };

  while (await cursor.hasNext()) {
    const doc: any = await cursor.next();
    contractorsScanned += 1;
    const portfolio: any[] = Array.isArray(doc.portfolio) ? doc.portfolio : [];
    const cache = new Map<string, string>();
    let changed = false;

    for (const item of portfolio) {
      if (Array.isArray(item.tradeTags)) {
        for (const tag of item.tradeTags) {
          const url = await convert(tag.image, doc.userId, cache);
          if (url) {
            tag.image = url;
            changed = true;
          }
        }
      }
      if (Array.isArray(item.images)) {
        for (let i = 0; i < item.images.length; i++) {
          const url = await convert(item.images[i], doc.userId, cache);
          if (url) {
            item.images[i] = url;
            changed = true;
          }
        }
      }
    }

    if (changed) {
      contractorsUpdated += 1;
      if (!DRY_RUN) {
        await contractors.updateOne({ _id: doc._id }, { $set: { portfolio } });
      }
      console.log(
        `[migrate] ${DRY_RUN ? 'would update' : 'updated'} contractor ${doc._id} (userId ${doc.userId})`
      );
    }
  }

  console.log('\n[migrate] summary');
  console.log(`  contractors scanned : ${contractorsScanned}`);
  console.log(`  contractors updated : ${contractorsUpdated}`);
  console.log(`  images converted    : ${imagesConverted}`);
  console.log(`  duplicate refs reused: ${imagesReused}`);
  if (DRY_RUN) console.log('  (dry run — no files written, no documents changed)');

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('[migrate] failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
