const target = 'https://portfolio-eight-sigma-mzugu1b20s.vercel.app';

async function check() {
  const res = await fetch(target);
  const html = await res.text();

  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  const title = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const desc = html.match(/<meta[^>]+name=["']description["'][^>]*>/i);
  const ogUrl = html.match(/<meta[^>]+property=["']og:url["'][^>]*>/i);
  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]*>/i);

  console.log('HTTP Status:', res.status);
  console.log('Canonical:', canonical ? canonical[0] : 'None');
  console.log('Title:', title ? title[1] : 'None');
  console.log('Desc:', desc ? desc[0] : 'None');
  console.log('OG URL:', ogUrl ? ogUrl[0] : 'None');
  console.log('OG Image:', ogImage ? ogImage[0] : 'None');

  const robotsRes = await fetch(`${target}/robots.txt`);
  console.log('\n/robots.txt HTTP Status:', robotsRes.status);
  console.log(await robotsRes.text());

  const sitemapRes = await fetch(`${target}/sitemap.xml`);
  console.log('\n/sitemap.xml HTTP Status:', sitemapRes.status);
  console.log(await sitemapRes.text());
}

check().catch(console.error);
