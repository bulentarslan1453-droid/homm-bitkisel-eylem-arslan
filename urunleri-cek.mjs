// Resmi katalogdan ürün adı, kodu, görseli, fiyatları ve kategorisini çeker -> urunler.json
// Fiyatları güncellemek için: node urunleri-cek.mjs && INDEX=1 node build.mjs
import { writeFileSync } from 'node:fs';
const B = 'https://www.hommbitkisel.com.tr/urunler-b/';
const al = async (u) => (await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0' } })).text();
const coz = (h) => [...h.matchAll(/data-product-json="([^"]+)"/g)].map(x => JSON.parse(decodeURIComponent(x[1])));
const tum = await al(B + 'tumu');
const urunler = coz(tum);

// Menü: üst kategori > alt kategori. Alt kategori sayfasındaki ürünlere üst kategorinin adı verilir.
const i0 = tum.indexOf('href="/urunler-b/');
const menu = tum.slice(i0 - 200, i0 + 30000);
const re = new RegExp('<a href="/urunler-b/([a-z0-9-]+)">([^<]+)</a>(<span class="arrow"></span><ul>)?|</ul>', 'g');
const yaprak = []; let ust = null; const gorulen = new Set();
for (const t of menu.matchAll(re)) {
  if (t[0] === '</ul>') { ust = null; continue; }
  const [, slug, ad, ok] = t;
  if (gorulen.has(slug) || ['tumu', 'katalog', 'kampanyali-urunler'].includes(slug)) continue;
  gorulen.add(slug);
  const temiz = ad.replace(/&amp;/g, '&').trim();
  if (ok) { ust = temiz; continue; }
  yaprak.push([slug, ust || temiz]);
}
const katAd = {};
const bekle = (ms) => new Promise(r => setTimeout(r, ms));
for (const [slug, ad] of yaprak) {
  let liste = [];
  for (let d = 0; d < 4 && !liste.length; d++) { await bekle(d ? 4000 : 700); liste = coz(await al(B + slug)); }
  console.log(slug, liste.length);
  for (const p of liste) if (!katAd[p.id]) katAd[p.id] = ad;
}

const tl = (s) => parseFloat(String(s).replace(/\./g, '').replace(',', '.'));
const baslik = (s) => s.toLocaleLowerCase('tr').replace(/(^|[\s\/&-])(\p{L})/gu, (m, a, b) => a + b.toLocaleUpperCase('tr'));
const out = urunler.filter(p => !/^TESTER|NUMUNE/i.test(p.urun_adi)).map(p => ({
  kod: p.urun_kodu, ad: p.urun_adi.replace(/\s+/g, ' ').trim(), img: p.urun_kapak,
  fiyat: tl(p.network_fiyat), uye: tl(p.uyeye_ozel), kat: baslik(katAd[p.id] || 'Diğer'),
}));
writeFileSync('urunler.json', JSON.stringify({ tarih: new Date().toISOString().slice(0, 10), urunler: out }));
const say = {}; out.forEach(u => say[u.kat] = (say[u.kat] || 0) + 1);
console.log(out.length + ' ürün', say);
