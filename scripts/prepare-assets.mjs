import sharp from "sharp";
const root = process.argv[2];
if (!root)
  throw new Error(
    "Pass the directory containing extracted PDF mask images. See README.md.",
  );
const mask = await sharp(`${root}/identity-003.png`)
  .extractChannel(0)
  .toBuffer();
const go = await sharp({
  create: { width: 3207, height: 1396, channels: 3, background: "#53C56B" },
})
  .joinChannel(mask)
  .png()
  .toBuffer();
await sharp(go).resize({ width: 1600 }).png().toFile("public/brand/go.png");
const inverse = await sharp(`${root}/identity-003.png`)
  .extractChannel(0)
  .negate()
  .toBuffer();
const stencil = await sharp({
  create: { width: 3207, height: 1396, channels: 3, background: "#ffffff" },
})
  .joinChannel(inverse)
  .png()
  .toBuffer();
await sharp(stencil)
  .resize({ width: 2000 })
  .png()
  .toFile("public/brand/go-stencil.png");
await sharp("public/brand/go.png")
  .resize({ width: 256 })
  .png()
  .toFile("src/app/icon.png");
console.log(
  "GO aperture, symbol and favicon prepared. Supplied wordmarks remain unchanged.",
);
