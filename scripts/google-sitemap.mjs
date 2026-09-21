import {
  getConfig,
  loadSavedState,
  hasStoredRefreshToken,
  getValidAccessToken,
  getGoogleUserIdentifier,
  listProperties,
  findMatchingProperty,
  verifyProperty,
  submitSitemap,
  getSitemapStatus,
  verifySitemapPrerequisites,
  getShortcuts,
} from './gsc-lib.mjs';

async function runGoogleSitemap() {
  console.log('\n==================================================');
  console.log('GOOGLE SEARCH CONSOLE — SITEMAP SUBMISSION (API)');
  console.log('==================================================\n');

  const config = getConfig();
  const state = loadSavedState();
  const isCi = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

  // --------------------------------------------------
  // STEP 1: Pre-submission Sitemap Validation
  // --------------------------------------------------
  console.log('[1/4] Validating sitemap prerequisites...');
  const validation = await verifySitemapPrerequisites(config.siteUrl, config.sitemapUrl);

  console.log(`  - Sitemap HTTP 200 Status       : ${validation.checks.http200 ? 'PASS' : 'FAIL'}`);
  console.log(`  - Valid XML Syntax (<urlset>)   : ${validation.checks.validXml ? 'PASS' : 'FAIL'}`);
  console.log(`  - Production Domain Matching    : ${validation.checks.productionDomainOnly ? 'PASS' : 'FAIL'}`);
  console.log(`  - robots.txt References Sitemap : ${validation.checks.robotsTxtReferencesSitemap ? 'PASS' : 'FAIL'}`);

  if (!validation.passed) {
    console.error('\n[!] Sitemap validation failed before submission:');
    for (const err of validation.errors) {
      console.error(`    * ${err}`);
    }
    console.error('\nFix the issues above before submitting to Search Console.');
    process.exit(1);
  }
  console.log('✓ All sitemap prerequisites PASSED\n');

  // --------------------------------------------------
  // STEP 2: OAuth & Token Check
  // --------------------------------------------------
  console.log('[2/4] Checking Google Search Console authentication...');
  if (!hasStoredRefreshToken()) {
    console.log('\n--------------------------------------------------');
    console.log('NOTICE: Google authorization required — run npm run google:auth once.');
    console.log('--------------------------------------------------');
    console.log('A stored refresh token is required to submit sitemaps via the official API.');
    console.log('Run the one-time authentication command locally:');
    console.log('   npm run google:auth\n');
    console.log('In CI/CD, set the secret GOOGLE_REFRESH_TOKEN in your repository settings.');
    console.log('==================================================\n');
    // Exit with 0 in CI so deployment pipelines don't fail, or 1 in manual execution
    process.exit(isCi ? 0 : 1);
  }

  let accessToken = null;
  let userEmail = 'Google Account';
  try {
    accessToken = await getValidAccessToken();
    userEmail = await getGoogleUserIdentifier(accessToken);
    console.log(`✓ Authenticated as: ${userEmail}\n`);
  } catch (err) {
    console.error(`\n[!] Google authentication failed: ${err.message}`);
    console.error('Run "npm run google:auth" to refresh authorization.\n');
    process.exit(isCi ? 0 : 1);
  }

  // --------------------------------------------------
  // STEP 3: Property Discovery & Verification Check
  // --------------------------------------------------
  console.log('[3/4] Checking Search Console property...');
  let properties = [];
  try {
    properties = await listProperties(accessToken);
  } catch (err) {
    console.error(`[!] Failed to list Search Console properties: ${err.message}`);
    process.exit(1);
  }

  const targetProperty =
    config.searchConsoleProperty ||
    state.selectedProperty ||
    findMatchingProperty(properties, config.siteUrl);

  if (!targetProperty) {
    console.warn(`\n[!] Property matching '${config.siteUrl}' was not found in account '${userEmail}'.`);
    console.warn('Available properties:');
    if (properties.length === 0) {
      console.warn('  (No properties currently registered in this Google account)');
    } else {
      for (const p of properties) {
        console.warn(`  - ${p.siteUrl} (permission: ${p.permissionLevel})`);
      }
    }
    console.warn('\nTo add this property:');
    console.warn(`  1. Open https://search.google.com/search-console/welcome`);
    console.warn(`  2. Add URL prefix: ${config.siteUrl}/`);
    console.warn(`  3. Re-run: npm run google:sitemap\n`);
    process.exit(isCi ? 0 : 1);
  }

  console.log(`✓ Matched Property: ${targetProperty}`);

  const verification = await verifyProperty(targetProperty, accessToken);
  console.log(`  - Permission Level : ${verification.permissionLevel}`);
  console.log(`  - Ownership Status : ${verification.verified ? 'VERIFIED' : 'PENDING VERIFICATION'}`);

  if (!verification.verified) {
    console.warn(`\n[!] Warning: Property ownership is pending.`);
    console.warn('Google Search Console requires verified ownership before processing sitemaps.');
    console.warn(`Complete verification at: https://search.google.com/search-console/ownership?resource_id=${encodeURIComponent(targetProperty)}\n`);
    process.exit(isCi ? 0 : 1);
  }

  // --------------------------------------------------
  // STEP 4: Official API Sitemap Submission
  // --------------------------------------------------
  console.log('\n[4/4] Submitting sitemap via official Search Console API...');
  const force = process.argv.includes('--force');
  let submissionResult = null;

  try {
    submissionResult = await submitSitemap(targetProperty, config.sitemapUrl, accessToken, force);
  } catch (err) {
    console.error(`[!] Sitemap submission failed: ${err.message}`);
    process.exit(1);
  }

  const sitemapStatus = await getSitemapStatus(targetProperty, config.sitemapUrl, accessToken);
  const shortcuts = getShortcuts(targetProperty);

  // --------------------------------------------------
  // FINAL REPORT
  // --------------------------------------------------
  console.log('\n==================================================');
  console.log('SITEMAP SUBMISSION STATUS REPORT');
  console.log('==================================================');
  console.log(`Production URL       : ${config.siteUrl}`);
  console.log(`Sitemap URL          : ${config.sitemapUrl}`);
  console.log(`Target Property      : ${targetProperty}`);
  console.log(`Account Email        : ${userEmail}`);
  console.log(`Submission Action    : ${submissionResult.skippedRedundant ? 'UP TO DATE (Skipped redundant submission)' : 'SUBMITTED TO GOOGLE'}`);
  console.log(`Submission Timestamp : ${submissionResult.timestamp}`);
  console.log(`Processing Status    : ${sitemapStatus.status}`);
  console.log(`Last Googlebot Crawl : ${sitemapStatus.lastDownloaded || 'Pending initial crawl'}`);
  console.log(`Sitemap Errors       : ${sitemapStatus.errors}`);
  console.log(`Sitemap Warnings     : ${sitemapStatus.warnings}`);
  console.log('--------------------------------------------------');
  console.log('IMPORTANT NOTE ON INDEXING:');
  console.log('• Sitemap submission queues all portfolio URLs for automatic Google discovery and crawling.');
  console.log('• The Search Console API does not support programmatic triggering of the "Request Indexing" button for general web portfolios.');
  console.log('• If you require immediate individual indexing for the homepage, test live and click "Request Indexing" in the Search Console console:');
  console.log(`  ${shortcuts.urlInspection}`);
  console.log('==================================================\n');

  process.exit(0);
}

runGoogleSitemap().catch((err) => {
  console.error(`Fatal error during sitemap submission: ${err.message}`);
  process.exit(1);
});
