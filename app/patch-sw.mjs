import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swPath = path.join(__dirname, 'dist', 'sw.js');

if (fs.existsSync(swPath)) {
  let content = fs.readFileSync(swPath, 'utf-8');
  const wrapper = `if(self.clients&&self.clients.claim){const _c=self.clients.claim.bind(self.clients);self.clients.claim=()=>_c().catch(e=>console.warn('clients.claim safe catch:',e.message));}\n`;
  if (!content.includes('clients.claim safe catch')) {
    fs.writeFileSync(swPath, wrapper + content, 'utf-8');
    console.log('✅ Successfully patched dist/sw.js with safe clients.claim wrapper');
  }
}
