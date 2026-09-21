import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const TOKENS_FILE = path.join(rootDir, '.gsc-tokens.json');
const CONNECTIONS_FILE = path.join(rootDir, '.gsc-connections.json');

// Load environment variables from .env.local if present
export function loadEnv() {
  const envPath = path.join(rootDir, '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        const key = k.trim();
        if (!process.env[key]) {
          process.env[key] = v.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  }
}

// Derive a 32-byte AES key from GOOGLE_ENCRYPTION_KEY or fallback
function getEncryptionKey() {
  loadEnv();
  const rawKey = process.env.GOOGLE_ENCRYPTION_KEY || 'default-fallback-portfolio-key-32b';
  if (rawKey.length === 64 && /^[0-9a-fA-F]+$/.test(rawKey)) {
    return Buffer.from(rawKey, 'hex');
  }
  return crypto.createHash('sha256').update(rawKey).digest();
}

// AES-256-GCM symmetric encryption for tokens at rest
export function encryptText(plainText) {
  if (!plainText) return '';
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptText(cipherText) {
  if (!cipherText || !cipherText.includes(':')) return '';
  try {
    const [ivHex, tagHex, encryptedHex] = cipherText.split(':');
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return decipher.update(encrypted, undefined, 'utf8') + decipher.final('utf8');
  } catch {
    return '';
  }
}

export function getConfig() {
  loadEnv();
  function resolveProductionUrl() {
    if (process.env.GITHUB_ACTIONS === 'true') {
      return process.env.SITE_URL || 'https://shivam349.github.io/portfolio';
    }
    if (process.env.VERCEL === '1') {
      if (process.env.SITE_URL && !process.env.SITE_URL.includes('github.io')) {
        return process.env.SITE_URL;
      }
      if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
      }
      return 'https://portfolio-eight-sigma-mzugu1b20s.vercel.app';
    }
    if (process.env.SITE_URL && !process.env.SITE_URL.includes('github.io')) {
      return process.env.SITE_URL;
    }
    if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('github.io')) {
      return process.env.NEXT_PUBLIC_SITE_URL;
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    return 'https://portfolio-eight-sigma-mzugu1b20s.vercel.app';
  }

  const rawSiteUrl = resolveProductionUrl();
  const siteUrl = rawSiteUrl.replace(/\/+$/, '');
  const isProd = process.env.NODE_ENV === 'production' || process.env.GITHUB_ACTIONS === 'true';

  return {
    siteUrl,
    isProd,
    projectId: process.env.GOOGLE_PROJECT_ID || 'portfolio-509304',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ||
      'http://localhost:3001/api/auth/google/callback',
    searchConsoleProperty: process.env.GOOGLE_SEARCH_CONSOLE_PROPERTY || null,
    sitemapUrl: process.env.GOOGLE_SITEMAP_URL || `${siteUrl}/sitemap.xml`,
    apiPort: parseInt(process.env.SEO_ADMIN_PORT || '3001', 10),
    backendUrl:
      process.env.NEXT_PUBLIC_SEO_BACKEND_URL ||
      'http://localhost:3001',
  };
}

// Multi-client connection repository
export function loadAllConnections() {
  if (!fs.existsSync(CONNECTIONS_FILE)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(CONNECTIONS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

export function saveAllConnections(connections) {
  fs.writeFileSync(CONNECTIONS_FILE, JSON.stringify(connections, null, 2), 'utf8');
}

export function getConnectionForSite(siteUrl) {
  const normalized = siteUrl.replace(/\/+$/, '').toLowerCase();
  const connections = loadAllConnections();
  return connections.find(
    (c) => c.site_url.replace(/\/+$/, '').toLowerCase() === normalized
  ) || null;
}

export function saveConnectionForSite(siteUrl, connectionData) {
  const normalized = siteUrl.replace(/\/+$/, '');
  const connections = loadAllConnections();
  const index = connections.findIndex(
    (c) => c.site_url.replace(/\/+$/, '').toLowerCase() === normalized.toLowerCase()
  );

  const existing = index >= 0 ? connections[index] : null;
  const updated = {
    connection_id: existing?.connection_id || crypto.randomUUID(),
    google_account_identifier: connectionData.google_account_identifier || existing?.google_account_identifier || 'unknown',
    encrypted_refresh_token: connectionData.encrypted_refresh_token || existing?.encrypted_refresh_token || '',
    site_url: normalized,
    search_console_property: connectionData.search_console_property ?? existing?.search_console_property ?? null,
    permission_level: connectionData.permission_level ?? existing?.permission_level ?? 'none',
    is_verified: connectionData.is_verified ?? existing?.is_verified ?? false,
    sitemap_submitted: connectionData.sitemap_submitted ?? existing?.sitemap_submitted ?? false,
    last_submitted: connectionData.last_submitted ?? existing?.last_submitted ?? null,
    created_at: existing?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (index >= 0) {
    connections[index] = updated;
  } else {
    connections.push(updated);
  }

  saveAllConnections(connections);
  return updated;
}

export function loadSavedState() {
  if (!fs.existsSync(TOKENS_FILE)) {
    return {
      tokens: null,
      selectedProperty: null,
      isVerified: false,
      sitemapSubmitted: false,
      lastSubmitted: null,
      indexing: {
        homepage: 'UNKNOWN',
        projects: 'UNKNOWN',
        about: 'UNKNOWN',
      },
      csrfState: null,
    };
  }
  try {
    return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
  } catch {
    return {
      tokens: null,
      selectedProperty: null,
      isVerified: false,
      sitemapSubmitted: false,
      lastSubmitted: null,
      indexing: {
        homepage: 'UNKNOWN',
        projects: 'UNKNOWN',
        about: 'UNKNOWN',
      },
      csrfState: null,
    };
  }
}

export function saveState(stateUpdates) {
  const current = loadSavedState();
  const updated = {
    ...current,
    ...stateUpdates,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(updated, null, 2), 'utf8');
  return updated;
}

export function clearState(siteUrl) {
  if (fs.existsSync(TOKENS_FILE)) {
    fs.unlinkSync(TOKENS_FILE);
  }
  if (siteUrl) {
    const connections = loadAllConnections();
    const filtered = connections.filter(
      (c) => c.site_url.replace(/\/+$/, '').toLowerCase() !== siteUrl.replace(/\/+$/, '').toLowerCase()
    );
    saveAllConnections(filtered);
  }
  return loadSavedState();
}

// Google OAuth URL generation with CSRF state & required production scopes
export function generateOAuthUrl() {
  const config = getConfig();
  if (!config.clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured');
  }

  const csrfState = crypto.randomBytes(24).toString('hex');
  saveState({ csrfState });

  // Official Scopes: Search Console, Site Verification, User Profile email
  const scopes = [
    'https://www.googleapis.com/auth/webmasters',
    'https://www.googleapis.com/auth/siteverification',
    'https://www.googleapis.com/auth/userinfo.email',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',
    prompt: 'consent',
    state: csrfState,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// Fetch Google Account email identifier
export async function getGoogleUserIdentifier(accessToken) {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.ok) {
      const data = await res.json();
      return data.email || data.id || 'Google User';
    }
  } catch {}
  return 'Google User';
}

// OAuth code exchange
export async function exchangeCode(code, returnedState) {
  const config = getConfig();
  const state = loadSavedState();

  if (returnedState && state.csrfState && returnedState !== state.csrfState) {
    throw new Error('Invalid OAuth CSRF state parameter. Request rejected.');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Google OAuth token exchange failed (${response.status}): ${errorBody}`);
  }

  const tokenData = await response.json();
  const expiryTimestamp = Date.now() + (tokenData.expires_in || 3600) * 1000;

  const currentSaved = loadSavedState();
  const refreshToken = tokenData.refresh_token || (currentSaved.tokens?.refresh_token ?? null);

  const tokens = {
    access_token: tokenData.access_token,
    refresh_token: refreshToken,
    expires_at: expiryTimestamp,
    scope: tokenData.scope,
    token_type: tokenData.token_type,
  };

  saveState({ tokens, csrfState: null });

  // Multi-client connection persistence
  const googleAccount = await getGoogleUserIdentifier(tokenData.access_token);
  if (refreshToken) {
    saveConnectionForSite(config.siteUrl, {
      google_account_identifier: googleAccount,
      encrypted_refresh_token: encryptText(refreshToken),
    });
  }

  return { tokens, googleAccount };
}

// Access token retrieval & automatic refresh
export async function getValidAccessToken() {
  const config = getConfig();
  const state = loadSavedState();
  const siteConn = getConnectionForSite(config.siteUrl);

  const envRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const decryptedConnToken = siteConn?.encrypted_refresh_token ? decryptText(siteConn.encrypted_refresh_token) : null;
  const refreshToken = envRefreshToken || decryptedConnToken || state.tokens?.refresh_token;

  if (!state.tokens?.access_token && !refreshToken) {
    throw new Error('Google Search Console is not connected. Connect via OAuth first.');
  }

  // Use cached access token if valid for > 60s
  if (state.tokens?.access_token && state.tokens.expires_at > Date.now() + 60000) {
    return state.tokens.access_token;
  }

  if (!refreshToken) {
    throw new Error('Google OAuth access token expired and no refresh token is available. Reconnect Google.');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to refresh Google token (${response.status}): ${errorBody}`);
  }

  const tokenData = await response.json();
  const expiryTimestamp = Date.now() + (tokenData.expires_in || 3600) * 1000;

  const newTokens = {
    access_token: tokenData.access_token,
    refresh_token: refreshToken,
    expires_at: expiryTimestamp,
    scope: tokenData.scope || state.tokens?.scope,
    token_type: tokenData.token_type || 'Bearer',
  };

  saveState({ tokens: newTokens });
  return newTokens.access_token;
}

// List Search Console properties
export async function listProperties(accessToken) {
  const token = accessToken || (await getValidAccessToken());

  const response = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Google authorization expired (401). Please reconnect your Google account.');
    }
    if (response.status === 403) {
      throw new Error('Search Console API permission denied (403). Ensure Search Console API is enabled in Google Cloud Console.');
    }
    const errorBody = await response.text();
    throw new Error(`Search Console sites.list error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.siteEntry || [];
}

// Accurate property matching without guessing
export function findMatchingProperty(properties, siteUrl) {
  if (!properties || properties.length === 0) return null;

  const normalizedSiteUrl = siteUrl.replace(/\/+$/, '').toLowerCase();
  const parsed = new URL(normalizedSiteUrl);
  const hostname = parsed.hostname.toLowerCase();

  // 1. Exact match with or without slash
  const exactSlash = `${normalizedSiteUrl}/`;
  const exactMatch = properties.find(
    (p) =>
      p.siteUrl.toLowerCase() === normalizedSiteUrl ||
      p.siteUrl.toLowerCase() === exactSlash
  );
  if (exactMatch) return exactMatch.siteUrl;

  // 2. Domain property match (sc-domain:hostname)
  const domainProp = `sc-domain:${hostname}`;
  const domainMatch = properties.find(
    (p) => p.siteUrl.toLowerCase() === domainProp
  );
  if (domainMatch) return domainMatch.siteUrl;

  // 3. Prefix match
  const prefixMatch = properties.find((p) =>
    normalizedSiteUrl.startsWith(p.siteUrl.replace(/\/+$/, '').toLowerCase())
  );
  if (prefixMatch) return prefixMatch.siteUrl;

  return null;
}

// Automatically add site to Google Search Console via sites.add
export async function addProperty(siteUrl, accessToken) {
  const token = accessToken || (await getValidAccessToken());
  const normalized = siteUrl.replace(/\/+$/, '') + '/';
  const encoded = encodeURIComponent(normalized);
  const response = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encoded}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Length': '0',
    },
  });
  if (!response.ok && response.status !== 204 && response.status !== 200) {
    const errorBody = await response.text();
    throw new Error(`Failed to add property (${response.status}): ${errorBody}`);
  }
  return { success: true, siteUrl: normalized };
}

// Verify property ownership via Search Console API
export async function verifyProperty(property, accessToken) {
  const token = accessToken || (await getValidAccessToken());
  const encodedProperty = encodeURIComponent(property);

  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedProperty}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return { verified: false, permissionLevel: 'none', message: 'Property not found in Google Search Console account.' };
    }
    const errorBody = await response.text();
    throw new Error(`Search Console verification check failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const isVerified =
    data.permissionLevel === 'siteOwner' ||
    data.permissionLevel === 'siteFullUser';

  saveState({ selectedProperty: property, isVerified });
  saveConnectionForSite(getConfig().siteUrl, {
    search_console_property: property,
    permission_level: data.permissionLevel,
    is_verified: isVerified,
  });

  return {
    verified: isVerified,
    permissionLevel: data.permissionLevel,
    message: isVerified
      ? 'PROPERTY VERIFIED'
      : 'PROPERTY NOT VERIFIED (Account lacks owner permissions or domain verification pending)',
  };
}

// Google Site Verification API (automated verification token & webResource)
export async function requestSiteVerificationToken(siteUrl, method = 'META', accessToken) {
  const token = accessToken || (await getValidAccessToken());

  const response = await fetch('https://www.googleapis.com/siteVerification/v1/token', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      verificationMethod: method,
      site: {
        type: 'SITE',
        identifier: siteUrl,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Site Verification token request failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return {
    method,
    token: data.token,
  };
}

export async function verifyWebResource(siteUrl, method = 'META', accessToken) {
  const token = accessToken || (await getValidAccessToken());

  const response = await fetch(
    `https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=${encodeURIComponent(method)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        site: {
          type: 'SITE',
          identifier: siteUrl,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    return {
      verified: false,
      error: `Site Verification pending (${response.status}): ${errorBody}`,
    };
  }

  const data = await response.json();
  return {
    verified: true,
    data,
  };
}

export function getLocalSitemapHash() {
  const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) return null;
  const content = fs.readFileSync(sitemapPath, 'utf8');
  return crypto.createHash('sha256').update(content).digest('hex');
}

// Get live sitemap status from Google Search Console API
export async function getSitemapStatus(property, sitemapUrl, accessToken) {
  const token = accessToken || (await getValidAccessToken());
  const encodedProperty = encodeURIComponent(property);
  const encodedFeed = encodeURIComponent(sitemapUrl);

  try {
    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodedProperty}/sitemaps/${encodedFeed}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      return {
        status: 'PENDING',
        lastDownloaded: null,
        errors: 0,
        warnings: 0,
      };
    }

    const data = await response.json();
    return {
      status: data.isPending ? 'PENDING' : 'PROCESSED',
      lastDownloaded: data.lastDownloaded || null,
      lastSubmitted: data.lastSubmitted || null,
      errors: parseInt(data.errors || '0', 10),
      warnings: parseInt(data.warnings || '0', 10),
      contents: data.contents || [],
    };
  } catch {
    return {
      status: 'UNKNOWN',
      lastDownloaded: null,
      errors: 0,
      warnings: 0,
    };
  }
}

// Submit sitemap via official Search Console Sitemaps API
// Automatically detects sitemap hash changes to avoid redundant submissions
export async function submitSitemap(property, sitemapUrl, accessToken, force = false) {
  const token = accessToken || (await getValidAccessToken());
  const encodedProperty = encodeURIComponent(property);
  const encodedFeed = encodeURIComponent(sitemapUrl);
  const currentHash = getLocalSitemapHash();
  const state = loadSavedState();

  // If already submitted, sitemap has not changed, and submitted within last 24h, skip redundant submission
  if (
    !force &&
    state.sitemapSubmitted &&
    state.sitemapHash &&
    state.sitemapHash === currentHash &&
    state.lastSubmitted &&
    Date.now() - new Date(state.lastSubmitted).getTime() < 86400000
  ) {
    const statusResult = await getSitemapStatus(property, sitemapUrl, token);
    return {
      success: true,
      sitemapUrl,
      property,
      timestamp: state.lastSubmitted,
      status: 'SITEMAP SUBMITTED',
      skippedRedundant: true,
      lastDownloaded: statusResult.lastDownloaded,
      message: 'Sitemap unchanged and previously submitted within 24h. Active in Google Search Console.',
    };
  }

  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedProperty}/sitemaps/${encodedFeed}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to submit sitemap (${response.status}): ${errorBody}`);
  }

  const timestamp = new Date().toISOString();
  saveState({
    selectedProperty: property,
    sitemapSubmitted: true,
    sitemapHash: currentHash,
    lastSubmitted: timestamp,
  });

  saveConnectionForSite(getConfig().siteUrl, {
    search_console_property: property,
    sitemap_submitted: true,
    last_submitted: timestamp,
  });

  return {
    success: true,
    sitemapUrl,
    property,
    timestamp,
    status: 'SITEMAP SUBMITTED',
  };
}

// Inspect URL indexing status via Search Console URL Inspection API
export async function inspectUrl(property, targetUrl, accessToken) {
  const token = accessToken || (await getValidAccessToken());

  try {
    const response = await fetch(
      'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inspectionUrl: targetUrl,
          siteUrl: property,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const inspectionResult = data.inspectionResult || {};
      const indexStatusResult = inspectionResult.indexStatusResult || {};

      let status = 'UNKNOWN';
      const coverage = indexStatusResult.coverageState || '';
      const verdict = indexStatusResult.verdict || '';

      if (verdict === 'PASS' || coverage.toLowerCase().includes('indexed')) {
        status = 'INDEXED';
      } else if (coverage.toLowerCase().includes('crawled')) {
        status = 'CRAWLED';
      } else if (coverage.toLowerCase().includes('discovered')) {
        status = 'DISCOVERED';
      } else if (verdict === 'FAIL' || coverage.toLowerCase().includes('excluded')) {
        status = 'NOT INDEXED';
      }

      return {
        url: targetUrl,
        status,
        coverageState: coverage,
        verdict,
        lastCrawlTime: indexStatusResult.lastCrawlTime || null,
      };
    }
  } catch {
    // Gracefully fall back to UNKNOWN
  }

  return {
    url: targetUrl,
    status: 'UNKNOWN',
    note: 'Inspection requires manual check or Google URL Inspection API activation.',
  };
}

export function getShortcuts(property) {
  const encoded = encodeURIComponent(property || '');
  return {
    searchConsole: `https://search.google.com/search-console${property ? `?resource_id=${encoded}` : ''}`,
    sitemaps: `https://search.google.com/search-console/sitemaps${property ? `?resource_id=${encoded}` : ''}`,
    urlInspection: `https://search.google.com/search-console/inspect${property ? `?resource_id=${encoded}` : ''}`,
    propertySettings: `https://search.google.com/search-console/settings${property ? `?resource_id=${encoded}` : ''}`,
    ownershipVerification: `https://search.google.com/search-console/ownership${property ? `?resource_id=${encoded}` : ''}`,
  };
}

// Check whether a valid refresh token exists in environment, connection store, or tokens file
export function hasStoredRefreshToken() {
  loadEnv();
  const config = getConfig();
  const state = loadSavedState();
  const siteConn = getConnectionForSite(config.siteUrl);
  const envRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const decryptedConnToken = siteConn?.encrypted_refresh_token ? decryptText(siteConn.encrypted_refresh_token) : null;
  const refreshToken = envRefreshToken || decryptedConnToken || state.tokens?.refresh_token;
  return Boolean(refreshToken && refreshToken.trim().length > 0);
}

// Save refresh token to .env.local without exposing it in logs
export function saveRefreshTokenToEnvLocal(refreshToken) {
  if (!refreshToken) return;
  loadEnv();
  const envPath = path.join(rootDir, '.env.local');
  if (!fs.existsSync(envPath)) return;
  let content = fs.readFileSync(envPath, 'utf8');
  if (content.includes('GOOGLE_REFRESH_TOKEN=')) {
    content = content.replace(/GOOGLE_REFRESH_TOKEN=.*(\r?\n|$)/, `GOOGLE_REFRESH_TOKEN=${refreshToken}$1`);
  } else {
    content = `${content.trimEnd()}\nGOOGLE_REFRESH_TOKEN=${refreshToken}\n`;
  }
  fs.writeFileSync(envPath, content, 'utf8');
}

// Strict pre-submission validation for sitemap & robots.txt
export async function verifySitemapPrerequisites(siteUrl, sitemapUrl) {
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, '');
  const targetSitemap = sitemapUrl || `${normalizedSiteUrl}/sitemap.xml`;
  const checks = {
    http200: false,
    validXml: false,
    productionDomainOnly: false,
    robotsTxtReferencesSitemap: false,
  };
  const errors = [];

  // 1. Verify the sitemap URL returns HTTP 200
  let sitemapContent = '';
  try {
    const sitemapRes = await fetch(targetSitemap);
    if (sitemapRes.status === 200) {
      checks.http200 = true;
      sitemapContent = await sitemapRes.text();
    } else {
      errors.push(`Sitemap URL (${targetSitemap}) returned HTTP ${sitemapRes.status} (expected 200).`);
    }
  } catch (e) {
    errors.push(`Failed to reach sitemap URL (${targetSitemap}): ${e.message}`);
  }

  // 2. Verify valid XML structure
  if (checks.http200) {
    if (sitemapContent.includes('<urlset') && sitemapContent.includes('</urlset>')) {
      checks.validXml = true;
    } else {
      errors.push('Sitemap does not contain valid XML urlset tags (<urlset>...</urlset>).');
    }
  }

  // 3. Verify all URLs use the production domain
  if (checks.validXml) {
    const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
    if (locMatches.length === 0) {
      errors.push('No <loc> URLs were found within sitemap.xml.');
    } else {
      const invalidUrls = locMatches.filter((url) => !url.startsWith(normalizedSiteUrl));
      if (invalidUrls.length > 0) {
        errors.push(
          `Sitemap contains URLs that do not match the production domain (${normalizedSiteUrl}): ${invalidUrls.slice(0, 3).join(', ')}`
        );
      } else {
        checks.productionDomainOnly = true;
      }
    }
  }

  // 4. Verify robots.txt references the sitemap
  try {
    const robotsUrl = `${normalizedSiteUrl}/robots.txt`;
    const robotsRes = await fetch(robotsUrl);
    if (robotsRes.status === 200) {
      const robotsText = await robotsRes.text();
      const sitemapMatch = robotsText.match(/Sitemap:\s*(https?:\/\/[^\s]+)/i);
      if (sitemapMatch && sitemapMatch[1].trim().toLowerCase() === targetSitemap.toLowerCase()) {
        checks.robotsTxtReferencesSitemap = true;
      } else if (sitemapMatch) {
        errors.push(
          `robots.txt references sitemap '${sitemapMatch[1].trim()}', but target is '${targetSitemap}'.`
        );
      } else {
        errors.push(`robots.txt at ${robotsUrl} is missing the "Sitemap:" directive.`);
      }
    } else {
      errors.push(`robots.txt returned HTTP ${robotsRes.status} (expected 200).`);
    }
  } catch (e) {
    errors.push(`Failed to reach robots.txt (${normalizedSiteUrl}/robots.txt): ${e.message}`);
  }

  const passed = Object.values(checks).every(Boolean);
  return {
    passed,
    checks,
    errors,
    sitemapUrl: targetSitemap,
  };
}

