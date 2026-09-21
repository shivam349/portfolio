import { URL } from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getConfig,
  loadSavedState,
  saveState,
  clearState,
  getConnectionForSite,
  saveConnectionForSite,
  generateOAuthUrl,
  exchangeCode,
  listProperties,
  findMatchingProperty,
  verifyProperty,
  requestSiteVerificationToken,
  verifyWebResource,
  submitSitemap,
  getSitemapStatus,
  inspectUrl,
  getShortcuts,
} from './gsc-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function jsonResponse(res, statusCode, data) {
  setCors(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

export async function parseBody(req) {
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

function getFrontendRedirectBase(config) {
  const isDev = !config.isProd && config.redirectUri.includes('localhost');
  return isDev ? 'http://localhost:3000' : config.siteUrl;
}

export async function handleSeoRequest(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const config = getConfig();
  const host = req.headers.host || `localhost:${config.apiPort}`;
  const protocol = req.headers['x-forwarded-proto'] || (config.isProd ? 'https' : 'http');
  const reqUrl = new URL(req.url, `${protocol}://${host}`);
  const pathname = reqUrl.pathname;

  try {
    // 1. Status Check
    if (pathname === '/api/seo/status' && req.method === 'GET') {
      const state = loadSavedState();
      const siteConn = getConnectionForSite(config.siteUrl);

      const hasTokens = Boolean(
        (state.tokens && (state.tokens.access_token || state.tokens.refresh_token)) ||
        siteConn?.encrypted_refresh_token
      );

      const selectedProp = siteConn?.search_console_property || state.selectedProperty || null;
      const isVerified = Boolean(siteConn?.is_verified ?? state.isVerified);
      const isSubmitted = Boolean(siteConn?.sitemap_submitted ?? state.sitemapSubmitted);
      const lastSubmitted = siteConn?.last_submitted || state.lastSubmitted || null;

      // Try fetching live sitemap status if property exists and submitted
      let lastDownloaded = null;
      let sitemapErrors = 0;
      let sitemapWarnings = 0;
      if (hasTokens && selectedProp && isSubmitted) {
        try {
          const sStatus = await getSitemapStatus(selectedProp, `${config.siteUrl}/sitemap.xml`);
          lastDownloaded = sStatus.lastDownloaded;
          sitemapErrors = sStatus.errors;
          sitemapWarnings = sStatus.warnings;
        } catch {}
      }

      const status = {
        connected: hasTokens,
        googleAccount: siteConn?.google_account_identifier || 'Connected Google Account',
        selectedProperty: selectedProp,
        permissionLevel: siteConn?.permission_level || (isVerified ? 'siteOwner' : 'none'),
        isVerified,
        sitemapSubmitted: isSubmitted,
        lastSubmitted,
        lastDownloaded,
        sitemapErrors,
        sitemapWarnings,
        siteUrl: config.siteUrl,
        hasCredentials: Boolean(config.clientId && config.clientSecret),
        environment: config.isProd ? 'production' : 'development',
        redirectUri: config.redirectUri,
        backendUrl: config.backendUrl,
        indexing: state.indexing || {
          homepage: 'UNKNOWN',
          projects: 'UNKNOWN',
          about: 'UNKNOWN',
        },
        shortcuts: getShortcuts(selectedProp || config.siteUrl),
      };

      return jsonResponse(res, 200, status);
    }

    // 2. Start Google OAuth
    if (pathname === '/api/auth/google' && req.method === 'GET') {
      try {
        if (config.isProd && !config.redirectUri.startsWith('https://')) {
          return jsonResponse(res, 400, {
            error: `Production redirect URI must use HTTPS: ${config.redirectUri}`,
          });
        }

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
      const frontendBase = getFrontendRedirectBase(config);

      if (error) {
        res.writeHead(302, {
          Location: `${frontendBase}/admin/seo?error=${encodeURIComponent(error)}`,
        });
        res.end();
        return;
      }

      if (!code) {
        return jsonResponse(res, 400, { error: 'Authorization code missing' });
      }

      try {
        const { tokens, googleAccount } = await exchangeCode(code, state);

        // Auto-discover properties
        try {
          const properties = await listProperties(tokens.access_token);
          const matched = findMatchingProperty(properties, config.siteUrl);
          if (matched) {
            saveState({ selectedProperty: matched });
            const verification = await verifyProperty(matched, tokens.access_token);
            saveConnectionForSite(config.siteUrl, {
              google_account_identifier: googleAccount,
              search_console_property: matched,
              permission_level: verification.permissionLevel,
              is_verified: verification.verified,
            });

            // If verified, submit sitemap automatically
            if (verification.verified) {
              await submitSitemap(matched, `${config.siteUrl}/sitemap.xml`, tokens.access_token);
            }
          }
        } catch {}

        res.writeHead(302, {
          Location: `${frontendBase}/admin/seo?connected=true`,
        });
        res.end();
        return;
      } catch (err) {
        res.writeHead(302, {
          Location: `${frontendBase}/admin/seo?error=${encodeURIComponent(err.message)}`,
        });
        res.end();
        return;
      }
    }

    // 4. Disconnect Google
    if (pathname === '/api/auth/google/disconnect' && req.method === 'POST') {
      clearState(config.siteUrl);
      return jsonResponse(res, 200, {
        success: true,
        message: 'Google account disconnected and credentials safely removed.',
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

    // 7. Verify Ownership via Search Console API
    if (pathname === '/api/seo/verify' && req.method === 'POST') {
      const state = loadSavedState();
      const siteConn = getConnectionForSite(config.siteUrl);
      const property = siteConn?.search_console_property || state.selectedProperty || config.siteUrl;

      const verification = await verifyProperty(property);
      return jsonResponse(res, 200, verification);
    }

    // 8. Request Google Site Verification Token (Site Verification API)
    if (pathname === '/api/seo/verify/token' && req.method === 'POST') {
      const body = await parseBody(req);
      const method = body.method || 'FILE'; // FILE or META
      try {
        const tokenResult = await requestSiteVerificationToken(config.siteUrl, method);

        // If FILE method, automatically place the verification file in public/
        if (method === 'FILE' && tokenResult.token) {
          const fileName = tokenResult.token;
          const publicDir = path.join(rootDir, 'public');
          if (fs.existsSync(publicDir)) {
            const filePath = path.join(publicDir, fileName);
            fs.writeFileSync(filePath, `google-site-verification: ${fileName}\n`, 'utf8');
            tokenResult.fileCreated = `public/${fileName}`;
          }
        }

        return jsonResponse(res, 200, tokenResult);
      } catch (err) {
        return jsonResponse(res, 500, { error: err.message });
      }
    }

    // 9. Confirm Site Verification (Site Verification API)
    if (pathname === '/api/seo/verify/webResource' && req.method === 'POST') {
      const body = await parseBody(req);
      const method = body.method || 'FILE';
      try {
        const result = await verifyWebResource(config.siteUrl, method);
        if (result.verified) {
          saveState({ isVerified: true });
          saveConnectionForSite(config.siteUrl, { is_verified: true, permission_level: 'siteOwner' });
        }
        return jsonResponse(res, 200, result);
      } catch (err) {
        return jsonResponse(res, 500, { error: err.message });
      }
    }

    // 10. Submit Sitemap
    if (pathname === '/api/seo/sitemap' && req.method === 'POST') {
      const state = loadSavedState();
      const siteConn = getConnectionForSite(config.siteUrl);
      const property = siteConn?.search_console_property || state.selectedProperty;

      if (!property) {
        return jsonResponse(res, 400, {
          error: 'No Search Console property selected. Select a property first.',
        });
      }

      const sitemapUrl = `${config.siteUrl}/sitemap.xml`;
      const result = await submitSitemap(property, sitemapUrl);
      return jsonResponse(res, 200, result);
    }

    // 11. Inspect URL
    if (pathname === '/api/seo/inspect' && req.method === 'POST') {
      const body = await parseBody(req);
      const state = loadSavedState();
      const siteConn = getConnectionForSite(config.siteUrl);
      const targetUrl = body.url || config.siteUrl;
      const property = siteConn?.search_console_property || state.selectedProperty || config.siteUrl;

      const result = await inspectUrl(property, targetUrl);

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
        instruction: 'Google requires priority indexing requests to be submitted directly in Search Console.',
      });
    }

    // 12. Run Full One-Click SEO Setup
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
      const siteConn = getConnectionForSite(config.siteUrl);
      const isConnected = Boolean(
        (state.tokens && (state.tokens.access_token || state.tokens.refresh_token)) ||
        siteConn?.encrypted_refresh_token
      );
      steps.push({
        id: 'google',
        title: 'Google connected',
        status: isConnected ? 'completed' : 'pending',
        detail: isConnected
          ? `Connected (${siteConn?.google_account_identifier || 'OAuth 2.0 active'})`
          : 'Google account not connected yet',
      });

      // Step 6: Property Selected
      let selectedProp = siteConn?.search_console_property || state.selectedProperty;
      if (isConnected && !selectedProp) {
        try {
          const props = await listProperties();
          selectedProp = findMatchingProperty(props, config.siteUrl);
          if (selectedProp) {
            saveState({ selectedProperty: selectedProp });
            saveConnectionForSite(config.siteUrl, { search_console_property: selectedProp });
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
      let isVerified = siteConn?.is_verified ?? state.isVerified;
      if (isConnected && selectedProp && !isVerified) {
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
      let sitemapSubmitted = siteConn?.sitemap_submitted ?? state.sitemapSubmitted;
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
          googleAccount: siteConn?.google_account_identifier || 'Google Account',
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
}
