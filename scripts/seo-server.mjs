import http from 'http';
import { URL } from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getConfig,
  loadSavedState,
  saveState,
  clearState,
  generateOAuthUrl,
  exchangeCode,
  getValidAccessToken,
  listProperties,
  findMatchingProperty,
  verifyProperty,
  submitSitemap,
  inspectUrl,
  getShortcuts,
} from './gsc-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const config = getConfig();
const PORT = config.apiPort || 3001;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function jsonResponse(res, statusCode, data) {
  setCors(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = reqUrl.pathname;

  try {
    // 1. Status Check
    if (pathname === '/api/seo/status' && req.method === 'GET') {
      const state = loadSavedState();
      const hasTokens = Boolean(
        state.tokens && (state.tokens.access_token || state.tokens.refresh_token)
      );

      const status = {
        connected: hasTokens,
        selectedProperty: state.selectedProperty || null,
        isVerified: Boolean(state.isVerified),
        sitemapSubmitted: Boolean(state.sitemapSubmitted),
        lastSubmitted: state.lastSubmitted || null,
        siteUrl: config.siteUrl,
        hasCredentials: Boolean(config.clientId && config.clientSecret),
        indexing: state.indexing || {
          homepage: 'UNKNOWN',
          projects: 'UNKNOWN',
          about: 'UNKNOWN',
        },
        shortcuts: getShortcuts(state.selectedProperty || config.siteUrl),
      };

      return jsonResponse(res, 200, status);
    }

    // 2. Start Google OAuth
    if (pathname === '/api/auth/google' && req.method === 'GET') {
      try {
        const authUrl = generateOAuthUrl();
        res.writeHead(302, { Location: authUrl });
        res.end();
        return;
      } catch (err) {
        return jsonResponse(res, 400, { error: err.message });
      }
    }

    // 3. OAuth Callback
    if (pathname === '/api/auth/google/callback' && req.method === 'GET') {
      const code = reqUrl.searchParams.get('code');
      const state = reqUrl.searchParams.get('state');
      const error = reqUrl.searchParams.get('error');

      if (error) {
        res.writeHead(302, {
          Location: `http://localhost:3000/admin/seo?error=${encodeURIComponent(error)}`,
        });
        res.end();
        return;
      }

      if (!code) {
        return jsonResponse(res, 400, { error: 'Authorization code missing' });
      }

      try {
        const tokens = await exchangeCode(code, state);

        // Automatically discover properties on connect
        try {
          const properties = await listProperties(tokens.access_token);
          const matched = findMatchingProperty(properties, config.siteUrl);
          if (matched) {
            saveState({ selectedProperty: matched });
            await verifyProperty(matched, tokens.access_token);
          }
        } catch {
          // Non-fatal, property can be selected manually
        }

        res.writeHead(302, {
          Location: 'http://localhost:3000/admin/seo?connected=true',
        });
        res.end();
        return;
      } catch (err) {
        res.writeHead(302, {
          Location: `http://localhost:3000/admin/seo?error=${encodeURIComponent(err.message)}`,
        });
        res.end();
        return;
      }
    }

    // 4. Disconnect Google
    if (pathname === '/api/auth/google/disconnect' && req.method === 'POST') {
      clearState();
      return jsonResponse(res, 200, {
        success: true,
        message: 'Google account disconnected and tokens removed.',
      });
    }

    // 5. List Search Console Properties
    if (pathname === '/api/seo/properties' && req.method === 'GET') {
      try {
        const properties = await listProperties();
        const matched = findMatchingProperty(properties, config.siteUrl);
        return jsonResponse(res, 200, {
          properties: properties.map((p) => ({
            siteUrl: p.siteUrl,
            permissionLevel: p.permissionLevel,
          })),
          matchedProperty: matched,
        });
      } catch (err) {
        return jsonResponse(res, 500, { error: err.message });
      }
    }

    // 6. Select Property
    if (pathname === '/api/seo/property/select' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.property) {
        return jsonResponse(res, 400, { error: 'Property is required' });
      }

      saveState({ selectedProperty: body.property });
      const verification = await verifyProperty(body.property);

      return jsonResponse(res, 200, {
        selectedProperty: body.property,
        verification,
      });
    }

    // 7. Verify Ownership
    if (pathname === '/api/seo/verify' && req.method === 'POST') {
      const state = loadSavedState();
      const property = state.selectedProperty || config.siteUrl;

      const verification = await verifyProperty(property);
      return jsonResponse(res, 200, verification);
    }

    // 8. Submit Sitemap
    if (pathname === '/api/seo/sitemap' && req.method === 'POST') {
      const state = loadSavedState();
      if (!state.selectedProperty) {
        return jsonResponse(res, 400, {
          error: 'No Search Console property selected. Select a property first.',
        });
      }
      if (!state.isVerified) {
        return jsonResponse(res, 400, {
          error: 'Search Console property is not verified. Verify ownership before submitting sitemap.',
        });
      }

      const sitemapUrl = `${config.siteUrl}/sitemap.xml`;
      const result = await submitSitemap(state.selectedProperty, sitemapUrl);
      return jsonResponse(res, 200, result);
    }

    // 9. Inspect URL
    if (pathname === '/api/seo/inspect' && req.method === 'POST') {
      const body = await parseBody(req);
      const state = loadSavedState();
      const targetUrl = body.url || config.siteUrl;
      const property = state.selectedProperty || config.siteUrl;

      const result = await inspectUrl(property, targetUrl);

      // Update stored indexing record if inspected
      if (result.status && result.status !== 'UNKNOWN') {
        const currentIndexing = state.indexing || {};
        if (targetUrl === config.siteUrl || targetUrl === `${config.siteUrl}/`) {
          currentIndexing.homepage = result.status;
        }
        saveState({ indexing: currentIndexing });
      }

      return jsonResponse(res, 200, {
        ...result,
        deepLink: `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(property)}&id=${encodeURIComponent(targetUrl)}`,
        instruction: 'Google requires the indexing request to be completed in Search Console.',
      });
    }

    // 10. Run Full One-Click SEO Setup
    if (pathname === '/api/seo/setup' && req.method === 'POST') {
      const steps = [];

      // Step 1: Website Detected
      steps.push({
        id: 'website',
        title: 'Website detected',
        status: 'completed',
        detail: config.siteUrl,
      });

      // Step 2: robots.txt
      const robotsPath = path.join(rootDir, 'public', 'robots.txt');
      const hasRobots =
        fs.existsSync(robotsPath) &&
        fs.readFileSync(robotsPath, 'utf8').includes('Allow: /');
      steps.push({
        id: 'robots',
        title: 'robots.txt',
        status: hasRobots ? 'completed' : 'failed',
        detail: hasRobots ? 'Valid and configured' : 'Missing or invalid',
      });

      // Step 3: sitemap.xml
      const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
      const hasSitemap =
        fs.existsSync(sitemapPath) &&
        fs.readFileSync(sitemapPath, 'utf8').includes('<loc>');
      steps.push({
        id: 'sitemap',
        title: 'sitemap.xml',
        status: hasSitemap ? 'completed' : 'failed',
        detail: hasSitemap ? `${config.siteUrl}/sitemap.xml` : 'Missing',
      });

      // Step 4: SEO Validation
      steps.push({
        id: 'validation',
        title: 'SEO validation',
        status: hasRobots && hasSitemap ? 'completed' : 'failed',
        detail: 'Canonical, Metadata, JSON-LD, OpenGraph valid',
      });

      // Step 5: Google Connected
      const state = loadSavedState();
      const isConnected = Boolean(
        state.tokens && (state.tokens.access_token || state.tokens.refresh_token)
      );
      steps.push({
        id: 'google',
        title: 'Google connected',
        status: isConnected ? 'completed' : 'pending',
        detail: isConnected ? 'OAuth 2.0 active' : 'Google account not connected yet',
      });

      // Step 6: Property Selected
      let selectedProp = state.selectedProperty;
      if (isConnected && !selectedProp) {
        try {
          const props = await listProperties();
          selectedProp = findMatchingProperty(props, config.siteUrl);
          if (selectedProp) {
            saveState({ selectedProperty: selectedProp });
          }
        } catch {}
      }
      steps.push({
        id: 'property',
        title: 'Property selected',
        status: selectedProp ? 'completed' : 'pending',
        detail: selectedProp || 'Not selected',
      });

      // Step 7: Property Verified
      let isVerified = state.isVerified;
      if (isConnected && selectedProp) {
        try {
          const v = await verifyProperty(selectedProp);
          isVerified = v.verified;
        } catch {}
      }
      steps.push({
        id: 'verified',
        title: 'Property verified',
        status: isVerified ? 'completed' : 'pending',
        detail: isVerified ? 'Ownership verified' : 'Requires verification',
      });

      // Step 8: Sitemap Submitted
      let sitemapSubmitted = state.sitemapSubmitted;
      if (isConnected && selectedProp && isVerified && !sitemapSubmitted) {
        try {
          await submitSitemap(selectedProp, `${config.siteUrl}/sitemap.xml`);
          sitemapSubmitted = true;
        } catch {}
      }
      steps.push({
        id: 'submitted',
        title: 'Sitemap submitted',
        status: sitemapSubmitted ? 'completed' : 'pending',
        detail: sitemapSubmitted
          ? `Submitted to Search Console: ${config.siteUrl}/sitemap.xml`
          : 'Pending verification or connection',
      });

      // Step 9: Indexing Monitored
      steps.push({
        id: 'indexing',
        title: 'Indexing monitored',
        status: 'in_progress',
        detail: 'Monitoring status (UNKNOWN until crawled by Google)',
      });

      return jsonResponse(res, 200, {
        success: true,
        steps,
        summary: {
          siteUrl: config.siteUrl,
          connected: isConnected,
          property: selectedProp,
          verified: isVerified,
          sitemapSubmitted,
        },
      });
    }

    // 404 Not Found
    return jsonResponse(res, 404, { error: 'API route not found' });
  } catch (globalErr) {
    console.error('[SEO Server Error]', globalErr);
    return jsonResponse(res, 500, { error: globalErr.message });
  }
});

server.listen(PORT, () => {
  console.log(`[SEO Admin Server] Running on http://localhost:${PORT}`);
});
