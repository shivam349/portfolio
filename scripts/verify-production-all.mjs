const domain = 'https://portfolio-eight-sigma-mzugu1b20s.vercel.app';

async function audit() {
  console.log('==================================================');
  console.log(`FULL PRODUCTION AUDIT: ${domain}`);
  console.log('==================================================\n');

  // 1. Homepage
  console.log('[1/3] Auditing Homepage (/)...');
  const homeRes = await fetch(domain, { redirect: 'manual' });
  const homeHtml = await homeRes.text();
  console.log(`- Status: HTTP ${homeRes.status} ${homeRes.statusText}`);
  console.log(`- Content-Type: ${homeRes.headers.get('content-type')}`);

  const canonical = homeHtml.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  const title = homeHtml.match(/<title[^>]*>(.*?)<\/title>/i);
  const desc = homeHtml.match(/<meta[^>]+name=["']description["'][^>]*>/i);
  const robots = homeHtml.match(/<meta[^>]+name=["']robots["'][^>]*>/i);
  const googlebot = homeHtml.match(/<meta[^>]+name=["']googlebot["'][^>]*>/i);
  const ogTitle = homeHtml.match(/<meta[^>]+property=["']og:title["'][^>]*>/i);
  const ogUrl = homeHtml.match(/<meta[^>]+property=["']og:url["'][^>]*>/i);
  const ogImage = homeHtml.match(/<meta[^>]+property=["']og:image["'][^>]*>/i);
  const twitterCard = homeHtml.match(/<meta[^>]+name=["']twitter:card["'][^>]*>/i);
  const jsonLd = homeHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);

  console.log(`- Canonical tag: ${canonical ? canonical[0] : 'MISSING'}`);
  console.log(`- Title: ${title ? title[1] : 'MISSING'}`);
  console.log(`- Description: ${desc ? desc[0] : 'MISSING'}`);
  console.log(`- Robots Meta: ${robots ? robots[0] : 'MISSING'}`);
  console.log(`- Googlebot Meta: ${googlebot ? googlebot[0] : 'MISSING'}`);
  console.log(`- Open Graph URL: ${ogUrl ? ogUrl[0] : 'MISSING'}`);
  console.log(`- Open Graph Image: ${ogImage ? ogImage[0] : 'MISSING'}`);
  console.log(`- Twitter Card: ${twitterCard ? twitterCard[0] : 'MISSING'}`);
  console.log(`- Structured Data Blocks (JSON-LD): ${jsonLd ? jsonLd.length : 0} blocks detected`);

  // 2. robots.txt
  console.log('\n[2/3] Auditing /robots.txt...');
  const robotsRes = await fetch(`${domain}/robots.txt`);
  const robotsText = await robotsRes.text();
  console.log(`- Status: HTTP ${robotsRes.status} ${robotsRes.statusText}`);
  console.log(`- Content-Type: ${robotsRes.headers.get('content-type')}`);
  console.log('- Body:');
  console.log(robotsText.trim());

  // 3. sitemap.xml
  console.log('\n[3/3] Auditing /sitemap.xml...');
  const sitemapRes = await fetch(`${domain}/sitemap.xml`);
  const sitemapText = await sitemapRes.text();
  console.log(`- Status: HTTP ${sitemapRes.status} ${sitemapRes.statusText}`);
  console.log(`- Content-Type: ${sitemapRes.headers.get('content-type')}`);
  console.log('- Body:');
  console.log(sitemapText.trim());

  console.log('\n==================================================');
  console.log('AUDIT COMPLETED');
  console.log('==================================================');
}

audit().catch(console.error);
