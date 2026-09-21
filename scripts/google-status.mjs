import {
  getConfig,
  loadSavedState,
  hasStoredRefreshToken,
  getValidAccessToken,
  getGoogleUserIdentifier,
  listProperties,
  findMatchingProperty,
  verifyProperty,
  getSitemapStatus,
  inspectUrl,
  getShortcuts,
} from './gsc-lib.mjs';

async function runGoogleStatus() {
  console.log('\n==================================================');
  console.log('GOOGLE SEARCH CONSOLE — STATUS AUDIT');
  console.log('==================================================\n');

  const config = getConfig();
  const state = loadSavedState();

  console.log(`Target Site URL : ${config.siteUrl}`);
  console.log(`Sitemap URL     : ${config.sitemapUrl}`);

  if (!hasStoredRefreshToken()) {
    console.log('\nAuthentication Status : NOT AUTHORIZED');
    console.log('Run "npm run google:auth" once to authorize Search Console access.\n');
    console.log('==================================================\n');
    process.exit(0);
  }

  try {
    const accessToken = await getValidAccessToken();
    const userEmail = await getGoogleUserIdentifier(accessToken);
    console.log(`Authentication Status : AUTHORIZED (${userEmail})`);

    const properties = await listProperties(accessToken);
    const targetProperty =
      config.searchConsoleProperty ||
      state.selectedProperty ||
      findMatchingProperty(properties, config.siteUrl);

    if (!targetProperty) {
      console.log(`Property Status       : NOT FOUND in account ${userEmail}`);
      console.log('\nAdd your property at: https://search.google.com/search-console/welcome');
      process.exit(0);
    }

    console.log(`Matched Property      : ${targetProperty}`);

    const verification = await verifyProperty(targetProperty, accessToken);
    console.log(`Verification Status   : ${verification.verified ? 'VERIFIED' : 'PENDING'} (${verification.permissionLevel})`);

    const sitemapStatus = await getSitemapStatus(targetProperty, config.sitemapUrl, accessToken);
    console.log('\n--- Sitemap API Details ---');
    console.log(`Sitemap State         : ${sitemapStatus.status}`);
    console.log(`Last Downloaded       : ${sitemapStatus.lastDownloaded || 'Pending initial download'}`);
    console.log(`Errors / Warnings     : ${sitemapStatus.errors} errors, ${sitemapStatus.warnings} warnings`);

    console.log('\n--- Live Inspection Status ---');
    const inspection = await inspectUrl(targetProperty, config.siteUrl, accessToken);
    console.log(`Homepage Index Status : ${inspection.status}`);
    if (inspection.coverageState) {
      console.log(`Coverage Verdict      : ${inspection.coverageState}`);
    }

    const shortcuts = getShortcuts(targetProperty);
    console.log('\n--- Quick Console Links ---');
    console.log(`Search Console UI     : ${shortcuts.searchConsole}`);
    console.log(`Sitemaps Manager      : ${shortcuts.sitemaps}`);
    console.log(`URL Inspection        : ${shortcuts.urlInspection}`);
    console.log('==================================================\n');
  } catch (err) {
    console.error(`[!] Error retrieving Search Console status: ${err.message}`);
    process.exit(1);
  }
}

runGoogleStatus().catch((err) => {
  console.error(err);
  process.exit(1);
});
