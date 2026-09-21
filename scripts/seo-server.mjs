import http from 'http';
import { getConfig } from './gsc-lib.mjs';
import { handleSeoRequest } from './seo-handler.mjs';

const config = getConfig();
const PORT = config.apiPort || 3001;

const server = http.createServer(handleSeoRequest);

server.listen(PORT, () => {
  console.log(`[SEO Admin Server] Running on http://localhost:${PORT}`);
  console.log(`[SEO Admin Server] Mode: ${config.isProd ? 'Production' : 'Development'}`);
  console.log(`[SEO Admin Server] Target Site: ${config.siteUrl}`);
  console.log(`[SEO Admin Server] Redirect URI: ${config.redirectUri}`);
});
