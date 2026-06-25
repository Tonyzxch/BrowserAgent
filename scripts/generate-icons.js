import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const svgPath = path.join(rootDir, 'public/icons/icon.svg');
const iconsDir = path.join(rootDir, 'public/icons');

const sizes = [16, 32, 48, 128];

async function generateIcons() {
  console.log('🎨 生成插件图标...');

  // 读取SVG
  const svgBuffer = await fs.readFile(svgPath);

  // 生成不同尺寸的PNG
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `icon${size}.png`));

    console.log(`✅ 生成 icon${size}.png`);
  }

  console.log('🎉 图标生成完成！');
}

generateIcons().catch(console.error);
