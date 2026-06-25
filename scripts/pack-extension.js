import fs from 'fs-extra';
import archiver from 'archiver';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const outputDir = path.join(rootDir, 'extension');

async function packExtension() {
  console.log('📦 开始打包Chrome插件...');

  // 确保输出目录存在
  await fs.ensureDir(outputDir);

  // 复制manifest.json到dist
  await fs.copy(
    path.join(rootDir, 'public/manifest.json'),
    path.join(distDir, 'manifest.json')
  );

  // 复制icons（如果存在）
  const iconsDir = path.join(rootDir, 'public/icons');
  if (await fs.pathExists(iconsDir)) {
    await fs.copy(iconsDir, path.join(distDir, 'icons'));
  }

  // 创建zip文件
  const output = fs.createWriteStream(path.join(outputDir, 'browser-agent-assistant.zip'));
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`✅ 插件打包完成！文件大小: ${(archive.pointer() / 1024).toFixed(2)} KB`);
    console.log(`📁 输出位置: ${path.join(outputDir, 'browser-agent-assistant.zip')}`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(distDir, false);
  await archive.finalize();
}

packExtension().catch(console.error);
