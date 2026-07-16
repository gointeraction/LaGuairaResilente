import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the Vite build output
const distPath = path.join(__dirname, 'app', 'dist');

// Cache static assets (JS, CSS, images) for 1 year
app.use('/assets', express.static(path.join(distPath, 'assets'), {
  maxAge: '1y',
  immutable: true
}));

// Serve other static files with no-cache
app.use(express.static(distPath, {
  maxAge: 0,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
}));

// SPA fallback: serve index.html for all non-file routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 La Guaira Resiliente running on port ${PORT}`);
});
