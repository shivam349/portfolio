import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getConfig,
  loadSavedState,
  saveState,
  getValidAccessToken,
  listProperties,
  findMatchingProperty,
  verifyProperty,
  submitSitemap,
  inspectUrl,
} from './gsc-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function runSync() {
  console.log('==================================================');
  console.log('GOOGLE SEARCH CONSOLE AUTOMATED SYNC');
  console.log('==================================================');

  const config = getConfig();
  const state = loadSavedState();

  const clientId = process.env.GOOGLE_CLIENT_ID || config.clientId;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || config.clientSecret;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN || state.tokens?.refresh_token;

  if (!clientId || !clientSecret || !refreshToken) {
    console.log('[GSC Sync] Notice: Google Search Console credentials not fully configured.');
    console.log('Required secrets for automated submission:');
    console.log('  - GOOGLE_CLIENT_ID');
    console.log('  - GOOGLE_CLIENT_SECRET');
    console.log('  - GOOGLE_REFRESH_TOKEN');
    console.log('\nTechnical SEO checks have passed. Deployment continues without GSC sync.');
    console.log('To enable automated sitemap submission, follow instructions in SETUP.md.');
    process.exit(0);
  }

  try {
    console.log(`Site URL: ${config.siteUrl}`);
    console.log('Authenticating with Google Search Console API...');

    const accessToken = await getValidAccessToken();
    console.log('✓ Successfully authenticated via OAuth 2.0');

    console.log('Discovering Search Console properties...');
    const properties = await listProperties(accessToken);
    console.log(`Found ${properties.length} properties in Google account.`);

    let targetProperty = state.selectedProperty || findMatchingProperty(properties, config.siteUrl);

    if (!targetProperty) {
      console.warn(`[!] No matching Search Console property found for ${config.siteUrl}.`);
      console.warn('Ensure the property is added to your Google Search Console account.');
      process.exit(0);
    }

    console.log(`✓ Matched property: ${targetProperty}`);

    console.log('Verifying property ownership...');
    const verification = await verifyProperty(targetProperty, accessToken);
    if (!verification.verified) {
      console.warn(`[!] Property is not verified: ${verification.message}`);
      process.exit(0);
    }
    console.log('✓ Property ownership verified');

    const sitemapUrl = `${config.siteUrl}/sitemap.xml`;
    console.log(`Submitting sitemap: ${sitemapUrl}...`);
    const submission = await submitSitemap(targetProperty, sitemapUrl, accessToken);
    if (submission.skippedRedundant) {
      console.log(`✓ SITEMAP UP TO DATE: ${submission.message}`);
    } else {
      console.log(`✓ SITEMAP SUBMITTED successfully at ${submission.timestamp}`);
    }

    // Retrieve sitemap processing status from Search Console
    console.log('Retrieving Search Console sitemap status...');
    const sitemapStatus = await getSitemapStatus(targetProperty, sitemapUrl, accessToken);
    console.log(`Sitemap Processing Status: ${sitemapStatus.status}`);
    if (sitemapStatus.lastDownloaded) {
      console.log(`Last Googlebot Download: ${sitemapStatus.lastDownloaded}`);
    }
    if (sitemapStatus.errors > 0) {
      console.warn(`[!] Search Console reported ${sitemapStatus.errors} sitemap error(s).`);
    }
    if (sitemapStatus.warnings > 0) {
      console.warn(`[!] Search Console reported ${sitemapStatus.warnings} sitemap warning(s).`);
    }

    console.log('Checking indexing status...');
    const homepageInspection = await inspectUrl(targetProperty, config.siteUrl, accessToken);
    console.log(`Homepage Indexing Status: ${homepageInspection.status}`);

    console.log('\n==================================================');
    console.log('GSC SYNC COMPLETED SUCCESSFULLY');
    console.log('==================================================\n');
  } catch (err) {
    console.error(`[!] GSC Sync error: ${err.message}`);
    // Do not fail deployment because of third-party API issues
    process.exit(0);
  }
}

runSync();
