import http from 'http';
import readline from 'readline';
import { URL } from 'url';
import {
  getConfig,
  generateOAuthUrl,
  exchangeCode,
  saveRefreshTokenToEnvLocal,
  getGoogleUserIdentifier,
} from './gsc-lib.mjs';

async function runGoogleAuth() {
  console.log('\n==================================================');
  console.log('GOOGLE SEARCH CONSOLE — ONE-TIME OAUTH SETUP');
  console.log('==================================================\n');

  const config = getConfig();

  if (!config.clientId || !config.clientSecret) {
    console.error('ERROR: Missing Google OAuth credentials.');
    console.error('Ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are configured in your environment or .env.local.');
    process.exit(1);
  }

  const authUrl = generateOAuthUrl();
  const redirectUrl = new URL(config.redirectUri);
  const listenPort = parseInt(redirectUrl.port || '3001', 10);

  console.log('STEP 1: Open the following URL in your browser:\n');
  console.log(authUrl);
  console.log('\n--------------------------------------------------');
  console.log('STEP 2: Sign in with the Google Account that owns your Search Console property.');
  console.log('STEP 3: Approve access to Google Search Console and Site Verification.');
  console.log('--------------------------------------------------\n');
  console.log('Listening for OAuth authorization code...\n');
  console.log(`[A] Automatic: Redirecting to ${config.redirectUri}`);
  console.log('[B] Manual: Or paste the authorization code (or redirected URL) here in the terminal.\n');

  let resolved = false;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  async function handleCode(rawCode, stateParam) {
    if (resolved) return;
    resolved = true;

    try {
      console.log('\nExchanging authorization code for OAuth tokens...');
      const { tokens, googleAccount } = await exchangeCode(rawCode, stateParam);

      if (tokens.refresh_token) {
        saveRefreshTokenToEnvLocal(tokens.refresh_token);
      }

      console.log('\n==================================================');
      console.log('✓ GOOGLE OAUTH AUTHORIZATION SUCCESSFUL');
      console.log('==================================================');
      console.log(`Authenticated Account : ${googleAccount}`);
      console.log(`Target Site URL       : ${config.siteUrl}`);
      console.log(`OAuth Scopes Granted  : ${tokens.scope || 'Search Console + Verification'}`);
      console.log('Refresh Token Status  : Securely saved (AES-256 encrypted server-side)');
      console.log('\nNext steps:');
      console.log('  1. Submit & verify sitemap:  npm run google:sitemap');
      console.log('  2. Inspect indexing status:  npm run google:status');
      console.log('==================================================\n');

      cleanup();
      process.exit(0);
    } catch (err) {
      console.error(`\n[!] OAuth token exchange failed: ${err.message}`);
      cleanup();
      process.exit(1);
    }
  }

  // Create temporary local callback server
  let server = null;
  try {
    server = http.createServer(async (req, res) => {
      try {
        const reqUrl = new URL(req.url, `http://localhost:${listenPort}`);
        if (reqUrl.pathname === redirectUrl.pathname) {
          const code = reqUrl.searchParams.get('code');
          const state = reqUrl.searchParams.get('state');
          const error = reqUrl.searchParams.get('error');

          if (error) {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<h2>Authentication Failed</h2><p>${error}</p>`);
            console.error(`OAuth error received: ${error}`);
            cleanup();
            process.exit(1);
            return;
          }

          if (code) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Google Search Console Connected</title>
                  <style>
                    body { font-family: system-ui, sans-serif; background: #090a0f; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                    .card { background: #121526; border: 1px solid #2a3150; padding: 2.5rem; border-radius: 1rem; text-align: center; max-width: 480px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                    h1 { color: #10b981; font-size: 1.5rem; margin-top: 0; }
                    p { color: #94a3b8; line-height: 1.6; font-size: 0.95rem; }
                    .code { font-family: monospace; background: #1a2035; padding: 0.2rem 0.5rem; border-radius: 0.3rem; color: #38bdf8; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <h1>&#10003; Authorization Complete</h1>
                    <p>Your Google Search Console account is successfully connected to your portfolio.</p>
                    <p>You can close this browser tab and return to the terminal.</p>
                  </div>
                </body>
              </html>
            `);
            await handleCode(code, state);
          }
        } else {
          res.writeHead(404);
          res.end();
        }
      } catch (e) {
        res.writeHead(500);
        res.end(e.message);
      }
    });

    server.listen(listenPort, () => {
      // Server listening
    });

    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.log(`[Info] Port ${listenPort} is already in use. Waiting for manual code paste below.`);
      }
    });
  } catch (e) {
    // Port listener optional fallback
  }

  // CLI prompt fallback
  rl.question('Paste Code or Redirected URL: ', async (input) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    let code = trimmed;
    let state = null;

    if (trimmed.includes('?') || trimmed.includes('&') || trimmed.startsWith('http')) {
      try {
        const parsed = new URL(trimmed.startsWith('http') ? trimmed : `http://localhost?${trimmed}`);
        code = parsed.searchParams.get('code') || code;
        state = parsed.searchParams.get('state') || null;
      } catch {}
    }

    await handleCode(code, state);
  });

  function cleanup() {
    try {
      if (server) server.close();
    } catch {}
    try {
      rl.close();
    } catch {}
  }
}

runGoogleAuth().catch((err) => {
  console.error(`Fatal error during Google auth: ${err.message}`);
  process.exit(1);
});
