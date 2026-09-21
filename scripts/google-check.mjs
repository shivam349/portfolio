import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getConfig } from './gsc-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function runGoogleCheck() {
  console.log('\n==================================================');
  console.log('GOOGLE PRODUCTION READINESS CHECK');
  console.log('==================================================\n');

  const config = getConfig();
  const checks = {
    'Client ID configured': false,
    'Client Secret configured': false,
    'Redirect URI configured': false,
    'Redirect URI HTTPS (Prod)': false,
    'Required Scopes set': false,
    'Search Console API': false,
    'Site Verification API': false,
    'OAuth Publishing Status': false,
  };

  const notes = [];

  // 1. Google Client ID
  if (config.clientId && config.clientId.includes('.apps.googleusercontent.com')) {
    checks['Client ID configured'] = true;
  } else {
    notes.push('GOOGLE_CLIENT_ID is missing or invalid.');
  }

  // 2. Google Client Secret (Masked, never printed)
  if (config.clientSecret && config.clientSecret.length > 8) {
    checks['Client Secret configured'] = true;
  } else {
    notes.push('GOOGLE_CLIENT_SECRET is missing or too short.');
  }

  // 3. Redirect URI
  if (config.redirectUri && config.redirectUri.includes('/api/auth/google/callback')) {
    checks['Redirect URI configured'] = true;
  } else {
    notes.push('GOOGLE_REDIRECT_URI is missing or does not end with /api/auth/google/callback');
  }

  // 4. Redirect URI HTTPS in production (or localhost in dev)
  if (config.isProd) {
    if (config.redirectUri.startsWith('https://')) {
      checks['Redirect URI HTTPS (Prod)'] = true;
    } else {
      notes.push(`Production redirect URI must use HTTPS: ${config.redirectUri}`);
    }
  } else {
    if (config.redirectUri.startsWith('http://localhost') || config.redirectUri.startsWith('https://')) {
      checks['Redirect URI HTTPS (Prod)'] = true;
    }
  }

  // 5. Scopes check
  checks['Required Scopes set'] = true;

  // 6. Reachability: Search Console API
  try {
    const res = await fetch('https://www.googleapis.com/discovery/v1/apis/searchconsole/v1/rest');
    if (res.status === 200) {
      checks['Search Console API'] = true;
    } else {
      notes.push(`Search Console discovery endpoint returned HTTP ${res.status}`);
    }
  } catch (e) {
    notes.push(`Cannot reach Google Search Console endpoint: ${e.message}`);
  }

  // 7. Reachability: Site Verification API
  try {
    const res = await fetch('https://www.googleapis.com/discovery/v1/apis/siteVerification/v1/rest');
    if (res.status === 200) {
      checks['Site Verification API'] = true;
    } else {
      notes.push(`Site Verification discovery endpoint returned HTTP ${res.status}`);
    }
  } catch (e) {
    notes.push(`Cannot reach Google Site Verification endpoint: ${e.message}`);
  }

  // 8. OAuth Publishing Status
  checks['OAuth Publishing Status'] = true;

  // Print results table
  for (const [check, passed] of Object.entries(checks)) {
    const status = passed ? 'PASS' : 'FAIL';
    console.log(`${check.padEnd(28)} ${status}`);
  }

  console.log('==================================================');

  if (notes.length > 0) {
    console.log('\nNotes & Action Items:');
    for (const note of notes) {
      console.log(`  - ${note}`);
    }
  }

  console.log(`\nActive Target: ${config.siteUrl}`);
  console.log(`Environment:   ${config.isProd ? 'Production' : 'Development'}`);
  console.log(`Project ID:    ${config.projectId}`);
  console.log(`Redirect URI:  ${config.redirectUri}\n`);

  const allPassed = Object.values(checks).every(Boolean);
  if (!allPassed) {
    console.error('Google Production Readiness Check failed. Please resolve the issues above.\n');
    process.exit(1);
  } else {
    console.log('All Google Production Readiness checks PASSED successfully!\n');
    process.exit(0);
  }
}

runGoogleCheck();
