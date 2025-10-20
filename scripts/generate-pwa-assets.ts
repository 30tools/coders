import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Create necessary directories
const publicDir = join(process.cwd(), 'public');
const iconsDir = join(publicDir, 'icons');
const assetsDir = join(publicDir, 'assets');

// Create directories if they don't exist
mkdirSync(iconsDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

// Source image - using a simple gradient for the PWA icon
const generateBaseImage = (width: number, height: number): Buffer => {
  // Create a simple gradient background with the app's theme color
  const canvas = Buffer.alloc(width * height * 4);
  const color1 = [63, 94, 251]; // Blue
  const color2 = [252, 74, 26];  // Orange
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      // Create a diagonal gradient
      const r = Math.floor(color1[0] + (color2[0] - color1[0]) * (x + y) / (width + height));
      const g = Math.floor(color1[1] + (color2[1] - color1[1]) * (x + y) / (width + height));
      const b = Math.floor(color1[2] + (color2[2] - color1[2]) * (x + y) / (width + height));
      
      canvas[index] = r;     // R
      canvas[index + 1] = g; // G
      canvas[index + 2] = b; // B
      canvas[index + 3] = 255; // A
    }
  }
  
  return canvas;
};

// Generate PWA icons in various sizes
const sizes = [16, 32, 48, 72, 96, 14, 192, 256, 384, 512];
const iconPromises = sizes.map(size => {
  const buffer = generateBaseImage(size, size);
  
  return sharp(buffer, {
    raw: {
      width: size,
      height: size,
      channels: 4
    }
  })
    .png()
    .resize(size, size)
    .toFile(join(iconsDir, `icon-${size}x${size}.png`));
});

// Wait for all icon promises to resolve
Promise.all(iconPromises)
  .then(() => console.log('PWA icons generated successfully'))
  .catch(err => console.error('Error generating PWA icons:', err));

// Generate favicon.ico (16x16, 32x32, 48x48 in one file)
const generateFavicon = async () => {
  try {
    // Create different sizes for favicon
    const sizes = [16, 32, 48];
    const faviconBuffers = await Promise.all(
      sizes.map(async (size) => {
        const buffer = generateBaseImage(size, size);
        return sharp(buffer, {
          raw: {
            width: size,
            height: size,
            channels: 4
          }
        })
          .png()
          .resize(size, size)
          .toBuffer();
      })
    );

    // Create favicon.ico
    // For simplicity, we'll create a 32x32 favicon
    const buffer = generateBaseImage(32, 32);
    await sharp(buffer, {
      raw: {
        width: 32,
        height: 32,
        channels: 4
      }
    })
      .png()
      .resize(32, 32)
      .toFile(join(publicDir, 'favicon.ico'));

    console.log('Favicon generated successfully');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
};

// Generate OG image (1200x630)
const generateOGImage = async () => {
  try {
    // Create a 1200x630 image with gradient background
    const width = 1200;
    const height = 630;
    const buffer = generateBaseImage(width, height);
    
    await sharp(buffer, {
      raw: {
        width,
        height,
        channels: 4
      }
    })
      .png()
      .resize(width, height)
      .composite([{
        input: Buffer.from(`<svg width="${width}" height="${height}">
          <rect width="${width}" height="${height}" fill="rgba(0,0,0,0.3)" />
          <text x="${width/2}" y="${height/2}" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle">
            Coders App
          </text>
          <text x="${width/2}" y="${height/2 + 60}" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
            Your Next.js Application
          </text>
        </svg>`),
        top: 0,
        left: 0
      }])
      .toFile(join(assetsDir, 'og-image.png'));

    console.log('OG image generated successfully');
  } catch (error) {
    console.error('Error generating OG image:', error);
  }
};

// Generate Apple touch icons
const generateAppleTouchIcons = async () => {
  try {
    const appleSizes = [57, 60, 72, 76, 114, 120, 144, 152, 180];
    const applePromises = appleSizes.map(size => {
      const buffer = generateBaseImage(size, size);
      
      return sharp(buffer, {
        raw: {
          width: size,
          height: size,
          channels: 4
        }
      })
        .png()
        .resize(size, size)
        .toFile(join(iconsDir, `apple-icon-${size}x${size}.png`));
    });

    await Promise.all(applePromises);
    console.log('Apple touch icons generated successfully');
  } catch (error) {
    console.error('Error generating Apple touch icons:', error);
  }
};

// Execute all generation functions
generateFavicon();
generateOGImage();
generateAppleTouchIcons();

// Create manifest.json
const manifest = {
  name: 'Coders App',
  short_name: 'Coders',
  description: 'A powerful Next.js application',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#3f5efb',
  orientation: 'any',
  icons: sizes.map(size => ({
    src: `/icons/icon-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: 'image/png'
  }))
};

writeFileSync(
  join(publicDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('Manifest.json generated successfully');