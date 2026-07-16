import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Proxy all Firebase Auth / helper requests (/__) to official Firebase Hosting origin
// This allows Google OAuth popups and handlers to run cleanly under the hosted.app domain
app.use('/__', createProxyMiddleware({
  target: 'https://laguairaresilente.firebaseapp.com',
  changeOrigin: true,
  secure: true
}));

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

// SPA fallback: return 404 for missing static assets, otherwise serve index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/assets/') || /\.(js|css|json|png|jpg|jpeg|svg|ico|woff|woff2|map)$/i.test(req.path)) {
    return res.status(404).send('Asset not found');
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 La Guaira Resiliente running on port ${PORT}`);
});
