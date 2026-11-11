// Homm Bitkisel bağımsız temsilci sitesi üretici.
// Yayın sürümü:  INDEX=1 node build.mjs   (INDEX olmadan Google'a kapalı üretir)
// Eylem Arslan'ın fotoğrafı assets/eylem-arslan.jpg olarak konursa otomatik kullanılır.
import { mkdirSync, writeFileSync, rmSync, existsSync, cpSync } from 'node:fs';

const REPO = 'homm-bitkisel-eylem-arslan';
const ORIGIN = 'https://bulentarslan1453-droid.github.io';
const P = `/${REPO}/`;
const BASE = ORIGIN + P;
const INDEX = process.env.INDEX === '1';
const AD = 'Eylem Arslan';
const EKIP = 'Arslan Ekip';
const KARIYER = 'Emerald';
const TEL = '0542 580 62 33', TEL_INT = '905425806233';
const KAYIT = 'https://www.hommbitkisel.com.tr/yeni-kayit/eylem-arslan-HOMM903621099';            // yeni kayıt linki
const KAYIT_AM = KAYIT + '?_k=e32304929cfd2ee1';                                               // ayrıcalıklı müşteri linki
const MAGAZA = 'https://www.hommbitkisel.com.tr/magaza/eylem-arslan-HOMM903621099';             // perakende satış linki
const WA = (m) => `https://wa.me/${TEL_INT}?text=${encodeURIComponent(m)}`;
const WA_GENEL = WA('Merhaba, Homm Bitkisel üyeliği hakkında bilgi almak istiyorum.');
const OUT = 'docs';
const FOTO = existsSync('assets/eylem-arslan.jpg');

const nav = [
  ['', 'Ana Sayfa'], ['hakkimizda/', 'Hakkımızda'], ['hizli-basvuru/', 'Hızlı Başvuru'], ['homm-bitkisel-urunleri/', 'Ürünler'],
  ['homm-bitkisel-kayit/', 'Nasıl Kayıt Olunur'], ['homm-bitkisel-temsilci-ol/', 'Temsilci Ol'], ['kazanc-plani/', 'Kazanç Planı'], ['sertifikalar/', 'Sertifikalar'],
  ['sik-sorulan-sorular/', 'Sık Sorulanlar'], ['iletisim/', 'İletişim'],
];
const altnav = [['ayricalikli-musteri/', 'Ayrıcalıklı Müşteri'], ['eylem-arslan/', 'Eylem Arslan Kimdir?'], ['kvkk/', 'KVKK Aydınlatma Metni']];

// Görseller ve adlar hommbitkisel.com.tr resmi ürün sayfasından alınmıştır.
const URUN_URL = MAGAZA;
// Mağaza en fazla 20 ürün gösterir. Tüm katalog için önce mağaza linki açılır (referans kaydedilir), sonra aynı sekme kataloğa geçer.
const KATALOG = 'https://www.hommbitkisel.com.tr/urunler-b/tumu';
const tumBtn = (cls = 'btn primary', yazi = 'Tüm Ürünleri Gör (350+)') => `<a class="${cls}" href="${MAGAZA}" onclick="return tumUrunler()" rel="nofollow" target="_blank">${yazi}</a>`;
const urunler = [
  ['balli-krem', 'Ballı Krem', '50 ml', 'Cilt Bakımı'],
  ['ozonlu-zeytinyagi', 'Ozonla Zenginleştirilmiş Zeytinyağı', '30 ml', 'Cilt Bakımı'],
  ['papatyali-yuz-jeli', 'Papatyalı Yüz Yıkama Jeli', '250 ml', 'Cilt Bakımı'],
  ['yogun-nemlendirici', 'Yoğun Nemlendirici Krem', '75 ml', 'Cilt Bakımı'],
  ['bright-c-serum', 'Powerfull Bright C Serum', '30 ml', 'Cilt Bakımı'],
  ['gunes-kremi', 'Güneş Kremi 50 SPF', '50 ml', 'Cilt Bakımı'],
  ['argan-serum', 'Argan Yağlı Serum', '30 ml', 'Saç ve Kişisel Bakım'],
  ['yaseminli-dus-jeli', 'Yaseminli Duş Jeli', '400 ml', 'Saç ve Kişisel Bakım'],
  ['dis-macunu', 'Damla Sakızlı Diş Macunu', '75 ml', 'Saç ve Kişisel Bakım'],
  ['bebek-sampuani', 'Bebek Saç ve Vücut Şampuanı', '400 ml', 'Saç ve Kişisel Bakım'],
  ['bulasik-deterjani', 'Konsantre Bulaşık Deterjanı', '500 ml', 'Ev Temizliği'],
  ['camasir-deterjani', 'Ekstra Konsantre Çamaşır Deterjanı', '1000 ml', 'Ev Temizliği'],
  ['yag-cozucu', 'Yağ Çözücü', '500 ml', 'Ev Temizliği'],
  ['yuzey-temizleyici', 'Yüzey Temizleyicisi', '1000 ml', 'Ev Temizliği'],
  ['kolajenli-kahve', 'Kolajenli Hindiba Kahve', '100 gr', 'Kahve ve İçecek'],
  ['corekotu-kahve', 'Çörekotu Kahve', '30 adet', 'Kahve ve İçecek'],
];
const urunKart = ([d, ad, boy, kat]) => `<a class="urun" href="${URUN_URL}" rel="nofollow noopener" target="_blank"><span class="ug"><img src="${P}img/urun/${d}.png" alt="Homm ${ad} ${boy}" loading="lazy"></span><small>${kat}</small><b>${ad}</b><i>${boy}</i></a>`;
const urunGrid = (list) => `<div class="urunler">${list.map(urunKart).join('')}</div>`;
const sertifikalar = [[11, 'Doğrudan Satış Yetki Belgesi', 'T.C. Ticaret Bakanlığı'], [1, 'Helal Kozmetik Sertifikası', 'Helal uygunluk belgesi'], [2, 'Helal Gıda Sertifikası', 'Helal uygunluk belgesi'], [8, 'Helal Deterjan Sertifikası', 'Helal uygunluk belgesi'], [3, 'İyi Üretim Uygulamaları (GMP)', 'Good Manufacturing Practices'], [4, 'Gıda Güvenliği Yönetimi', 'Food Safety Management'], [5, 'Kalite Yönetimi', 'Quality Management'], [10, 'İşletme Kayıt Belgesi', 'Resmi kayıt belgesi']];
const uyeBant = `<div class="uyebant"><div><b>Üye olun, daha avantajlı alın</b><span>Üyelik ücretsiz · hoş geldin avantajı · ürünlerde <b>%30 indirim</b></span></div><a class="btn primary kucuk" href="${KAYIT}" rel="nofollow noopener" target="_blank">Ücretsiz Üye Ol</a><a class="btn ghost kucuk" href="${MAGAZA}" rel="nofollow noopener" target="_blank">Üye olmadan alışveriş</a></div>`;

const ik = {
  hediye: '<svg viewBox="0 0 24 24"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z"/></svg>',
  sepet: '<svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>',
  ekip: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
  egitim: '<svg viewBox="0 0 24 24"><path d="M22 10L12 5 2 10l10 5 10-5zM6 12v5c3 3 9 3 12 0v-5"/></svg>',
  ev: '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10"/></svg>',
  tel: '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/></svg>',
  onay: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
  wa: '<svg viewBox="0 0 24 24" class="dolu"><path fill-rule="evenodd" d="M12 2a10 10 0 00-8.66 15L2 22l5.16-1.3A10 10 0 1012 2zM8.6 7.2c.2 0 .45 0 .6.4l.8 1.9c.08.2.05.4-.05.55l-.7.9c-.1.15-.15.3-.05.5.5.9 1.6 2.1 3.3 2.85.2.1.35.05.48-.08l.8-.95c.15-.18.35-.2.55-.12l1.85.88c.2.1.33.2.36.36.05.5-.15 1.3-.75 1.75-.6.45-1.5.55-2.6.2-2.6-.8-5.2-3.2-6.1-5.7-.4-1.1-.2-2.2.5-2.95.3-.3.6-.5 1-.5z"/></svg>',
};

const form = (baslik = 'Sizi arayalım') => `
<section class="formkart" id="form">
  <div class="formsol">
    <span class="rozet">Ücretsiz destek</span>
    <h2>${baslik}</h2>
    <p>Adınızı ve numaranızı bırakın; ${AD} veya ${EKIP}'ten bir bağımsız temsilci sizi arayıp üyelik adımlarında ücretsiz yardımcı olsun.</p>
    <ul class="tik">
      <li>${ik.onay}Kayıt formunu birlikte doldururuz</li>
      <li>${ik.onay}Size uygun üyelik türünü seçeriz</li>
      <li>${ik.onay}“Aramayın” dediğiniz an numaranız silinir</li>
    </ul>
  </div>
  <form onsubmit="return gonder(this)">
    <label>Adınız Soyadınız<input name="ad" required minlength="3" autocomplete="name"></label>
    <label>Telefon Numaranız<input name="tel" required type="tel" inputmode="tel" pattern="[0-9 +()]{10,17}" placeholder="05xx xxx xx xx" autocomplete="tel"></label>
    <label>Şehir<input name="sehir" required autocomplete="address-level1"></label>
    <label>İlgilendiğiniz konu
      <select name="konu"><option>Temsilci olmak istiyorum</option><option>Sadece indirimli alışveriş (Ayrıcalıklı Müşteri)</option><option>Bilgi almak istiyorum</option></select>
    </label>
    <label class="onay"><input type="checkbox" required> <span><a href="${P}kvkk/">KVKK Aydınlatma Metni</a>'ni okudum; bilgilerimin üyelik hakkında aranmam amacıyla işlenmesine ve tarafımla telefon/WhatsApp üzerinden iletişime geçilmesine onay veriyorum.</span></label>
    <button class="btn wa" type="submit">${ik.wa}WhatsApp ile Gönder</button>
    <small>Gönder'e bastığınızda WhatsApp açılır ve mesajınız hazır gelir; yalnızca göndermeniz yeterli.</small>
  </form>
</section>`;

const cta = `
<div class="cta">
  <a class="btn primary" href="${KAYIT}" rel="nofollow noopener" target="_blank">Hemen Ücretsiz Üye Ol</a>
  <a class="btn ghost" href="${MAGAZA}" rel="nofollow noopener" target="_blank">Üye Olmadan Alışveriş Yap</a>
  <a class="btn ghost" href="#form">Beni Arayın</a>
</div>
<p class="not">Üyelik ücretsizdir; üye olanlar hoş geldin avantajı kazanır ve ürünleri %30 indirimli alır. Kayıt formunda “Tavsiye eden” alanında <b>${AD}</b> yazdığını göreceksiniz.</p>`;

const avatar = (cls = '') => FOTO
  ? `<img class="avatar ${cls}" src="${P}img/eylem-arslan.jpg" alt="${AD} – ${EKIP} kurucu lideri" loading="lazy">`
  : `<div class="avatar mono ${cls}" role="img" aria-label="${AD}">EA</div>`;

const bioKart = `
<section class="bio">
  ${avatar()}
  <div>
    <span class="rozet zumrut">◆ ${KARIYER} Lider</span>
    <h2>${AD}</h2>
    <p class="unvan">${EKIP} Kurucu Lideri · Homm Bitkisel Bağımsız Temsilcisi</p>
    <p>${AD}, Homm Bitkisel'de <b>${KARIYER}</b> kariyerine ulaşmış bir bağımsız temsilci ve <b>${EKIP}</b>'in kurucu lideridir. Ekibine katılan herkesle kayıttan ilk siparişe, panel kullanımından ekip kurmaya kadar birebir ilgilenir.</p>
    <p><a href="${P}eylem-arslan/">Eylem Arslan hakkında daha fazlası →</a></p>
  </div>
</section>`;

const sss = [
  ['Homm Bitkisel üyelik ücretli mi?', 'Hayır. Kayıt olurken giriş ücreti veya sermaye istenmez. Bu sitede size yapılan yönlendirme ve telefon desteği de ücretsizdir.'],
  ['Üye olunca ürünleri indirimli alır mıyım?', 'Evet. Üye olduktan sonra ürünleri, üye olmadan alınan fiyata göre %30 indirimli alırsınız. Bu indirim hem Temsilci hem Ayrıcalıklı Müşteri üyeliğinde geçerlidir.'],
  ['Homm Bitkisel’e kimler üye olabilir?', 'Bağımsız temsilci olmak için 18 yaşını doldurmuş olmanız yeterlidir. Yalnızca alışveriş yapmak isteyenler kayıt formunda “Ayrıcalıklı Müşteri” seçeneğini işaretler.'],
  ['Temsilci ile Ayrıcalıklı Müşteri arasındaki fark nedir?', 'Temsilci hem alışveriş yapar hem de ürün satışı ve ekip kurma yoluyla kazanç elde edebilir. Ayrıcalıklı Müşteri yalnızca kendi alışverişini yapar; satış yapma zorunluluğu yoktur.'],
  ['Satış yapmak zorunda mıyım?', 'Hayır. İsterseniz yalnızca kendi ihtiyaçlarınız için alışveriş yapabilirsiniz.'],
  ['Sistemi bilmiyorum, destek veriliyor mu?', `Evet. ${EKIP}'te kayıttan sonra panel kullanımı, sipariş verme ve ürün bilgisi konusunda birebir destek ve ekip eğitimi veriyoruz.`],
  ['Evden çalışabilir miyim?', 'Evet. Tanıtım ve satışınızı telefonunuzdan, evinizden yapabilirsiniz; belirli bir mesai saati yoktur.'],
  ['Kayıt ne kadar sürer?', 'Resmi kayıt formunu doldurmak birkaç dakika sürer. Formu gönderdikten sonra telefonunuza gelen sözleşmeyi onayladığınızda üyeliğiniz tanımlanır.'],
  ['Kayıt formunda “Tavsiye eden” neden önemli?', `Tavsiye eden kişi, sisteme girdikten sonra size destek olacak sponsorunuzdur. Bu sitedeki kayıt bağlantısıyla girdiğinizde tavsiye eden olarak ${AD} görünür ve eğitim, sipariş, panel kullanımı gibi konularda ekibimiz size yardımcı olur.`],
  ['Ne kadar kazanırım?', 'Kazanç tamamen sizin çalışmanıza, satışınıza ve ekibinize bağlıdır. Garanti edilen bir gelir yoktur; kimseye sabit kazanç sözü vermiyoruz.'],
  ['Üyelikten çıkabilir miyim?', 'Evet. Temsilci sözleşmesine göre resmi sitedeki hesabınızda yer alan “Temsilcilikten Ayrıl” seçeneğiyle veya şirkete yazılı başvuruyla üyeliğinizi sonlandırabilirsiniz.'],
  ['Bu site Homm Bitkisel’in resmi sitesi mi?', `Hayır. Bu site Homm Bitkisel bağımsız temsilcisi ${AD} tarafından hazırlanmış bir bilgilendirme sayfasıdır. Şirketin resmi sitesi hommbitkisel.com.tr, müşteri hizmetleri numarası 444 77 97’dir.`],
  ['Numaramı bırakırsam ne olur?', `Yalnızca üyelik hakkında bilgi vermek için ${AD} veya ekibindeki bir bağımsız temsilci tarafından aranırsınız. Aranmak istemediğinizi söylediğiniz anda numaranız silinir.`],
];
const sssHtml = (list) => `<div class="sss">${list.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`;

const pages = [
{ path: '', title: `Homm Bitkisel Üyelik – Ücretsiz Üye Ol | ${EKIP} · ${AD}`,
  desc: `Homm Bitkisel’e ücretsiz üye olun, ürünleri %30 indirimli alın. ${KARIYER} lider ${AD} ve ${EKIP}; kayıt, temsilcilik ve ayrıcalıklı müşteri üyeliğinde birebir ücretsiz destek veriyor.`,
  h1: 'Homm Bitkisel Üyelik',
  hero: `
<section class="hero"><div class="ic heroic">
  <div>
    <span class="rozet">${EKIP} · Homm Bitkisel Bağımsız Temsilcisi</span>
    <h1>Homm Bitkisel'e <em>ücretsiz</em> üye olun, ilk günden yalnız kalmayın</h1>
    <p class="lead">Ben ${KARIYER} lider <b>${AD}</b>. Üyelik ücretsiz; üye olan <b>hoş geldin avantajı</b> kazanır ve ürünleri <b>%30 indirimli</b> alır. İster yalnızca alışveriş yapın, ister kendi işinizi kurun; kayıt formunu birlikte dolduralım, ilk adımları ekibimle birlikte atın.</p>
    <div class="cta">
      <a class="btn primary" href="${KAYIT}" rel="nofollow noopener" target="_blank">Hemen Ücretsiz Üye Ol</a>
      <a class="btn ghost" href="${MAGAZA}" rel="nofollow noopener" target="_blank">Üye Olmadan Alışveriş Yap</a>
    </div>
    <p class="altlink"><a href="#form">Önce bilgi almak istiyorum, beni arayın →</a></p>
    <ul class="cip">
      <li>${ik.onay}Üyelere %30 indirim</li><li>${ik.onay}Hoş geldin avantajı</li><li>${ik.onay}Üyelik ücretsiz</li><li>${ik.onay}Satış zorunluluğu yok</li><li>${ik.onay}Birebir destek</li>
    </ul>
  </div>
  <div class="herogorsel">
    <img src="${P}img/hero.jpg" alt="Bitkisel cilt bakım ürünü tutan gülümseyen kadın" width="896" height="1120" fetchpriority="high">
    <div class="yuzen"><b>Üyelere %30 indirim</b><span>Üye olmadan alınan fiyata göre</span></div>
  </div>
</div></section>`,
  body: `
<section class="tanitim">
  <div>
    <p class="ustbaslik">Homm Bitkisel nedir?</p>
    <h2>Doğrudan satışla çalışan bitkisel ürünler markası</h2>
    <p>Homm Bitkisel; kişisel bakım, kozmetik, ev temizliği ve gıda kategorilerinde ürünler sunan bir doğrudan satış şirketidir. Üyeler ürünleri kendi hesaplarından, üye olmayanlara göre <b>%30 indirimli</b> sipariş eder; dileyen çevresine önererek ve ekip kurarak ek gelir fırsatı oluşturur.</p>
    <p>İster yalnızca alışveriş yapmak için katılın, ister satış ve ekip çalışmasıyla ilerleyin; ${EKIP} iki yolda da yanınızda.</p>
    <a class="btn ghost" href="${P}hakkimizda/">Hakkımızda</a>
  </div>
  <img src="${P}img/ekip.jpg" alt="Evde birlikte çalışan ${EKIP} üyeleri (temsili)" loading="lazy" width="1100" height="733">
</section>

<section class="bolum">
  <p class="ustbaslik">Neden bu ekip?</p>
  <h2>Üyelikte sizi neler bekliyor?</h2>
  <div class="grid3">
    <div class="card ikon">${ik.hediye}<h3>Ücretsiz üyelik + hoş geldin</h3><p>Kayıtta ücret veya sermaye istenmez; yeni üyeler hoş geldin avantajı kazanır.</p></div>
    <div class="card ikon">${ik.sepet}<h3>%30 üye indirimi</h3><p>Üye olduktan sonra ürünleri, üye olmadan alınan fiyata göre %30 indirimli alırsınız.</p></div>
    <div class="card ikon">${ik.ev}<h3>Evden çalışma</h3><p>Telefonunuzla, kendi saatlerinizde çalışırsınız.</p></div>
    <div class="card ikon">${ik.egitim}<h3>Eğitim</h3><p>Panel, sipariş ve ürün bilgisi eğitimlerine katılırsınız.</p></div>
    <div class="card ikon">${ik.ekip}<h3>Ekip desteği</h3><p>${EKIP}'te soru sorabileceğiniz bir ekip sizi bekler.</p></div>
    <div class="card ikon">${ik.tel}<h3>Birebir ilgi</h3><p>Takıldığınız her yerde bir telefon uzağınızdayız.</p></div>
  </div>
</section>

${bioKart}

<section class="bolum">
  <p class="ustbaslik">Nasıl başlanır?</p>
  <h2>3 adımda üye olun</h2>
  <ol class="adimlar">
    <li><span>1</span><div><h3>Kayıt bağlantısını açın</h3><p>Resmi kayıt formunda “Tavsiye eden: ${AD}” yazdığını kontrol edin.</p></div></li>
    <li><span>2</span><div><h3>Üyelik türünü seçin</h3><p>Temsilci ya da Ayrıcalıklı Müşteri'yi seçip iletişim ve kişisel bilgilerinizi girin.</p></div></li>
    <li><span>3</span><div><h3>Sözleşmeyi onaylayın</h3><p>Telefonunuza gelen sözleşmeyi onaylayın; üyeliğiniz tanımlanır, biz de sizi ararız.</p></div></li>
  </ol>
  <p><a href="${P}homm-bitkisel-kayit/">Kayıt formunun adım adım anlatımı →</a></p>
</section>

<section class="bolum">
  <p class="ustbaslik">Size hangisi uygun?</p>
  <h2>İki üyelik seçeneği</h2>
  <div class="ikili">
    <div class="card secenek">
      <span class="rozet">Kazanç + Alışveriş</span>
      <h3>Temsilci</h3>
      <p>Ürünleri kendiniz kullanır, çevrenize ve internetten satar, dilerseniz kendi ekibinizi kurarsınız.</p>
      <ul class="tik"><li>${ik.onay}%30 indirimli alışveriş</li><li>${ik.onay}Satış ve kazanç</li><li>${ik.onay}Ekip kurma</li></ul>
      <a href="${P}homm-bitkisel-temsilci-ol/">Temsilcilik şartları →</a>
    </div>
    <div class="card secenek">
      <span class="rozet">Sadece Alışveriş</span>
      <h3>Ayrıcalıklı Müşteri</h3>
      <p>Satış yapmadan, yalnızca kendi ihtiyaçlarınız için alışveriş yaparsınız.</p>
      <ul class="tik"><li>${ik.onay}%30 indirimli alışveriş</li><li>${ik.onay}Satış zorunluluğu yok</li><li>${ik.onay}Sade ve hızlı kayıt</li></ul>
      <a href="${P}ayricalikli-musteri/">Ayrıcalıklı Müşteri nedir? →</a>
    </div>
  </div>
</section>

<section class="bolum">
  <p class="ustbaslik">Ürünler</p>
  <h2>Öne çıkan Homm ürünleri</h2>
  <p class="indirim"><b>%30</b><span>Üye olduğunuzda bu ürünleri, üye olmadan alınan fiyata göre <b>%30 indirimli</b> alırsınız.</span></p>
  ${urunGrid([0, 1, 2, 6, 7, 10, 11, 14].map(i => urunler[i]))}
  ${uyeBant}
  <div class="cta">${tumBtn('btn ghost')}</div>
</section>

${form()}

<section class="bolum">
  <p class="ustbaslik">Merak edilenler</p>
  <h2>Sık sorulan sorular</h2>
  ${sssHtml(sss.slice(0, 7))}
  <p><a href="${P}sik-sorulan-sorular/">Tüm soruları görün →</a></p>
</section>` },

{ path: 'homm-bitkisel-kayit/', title: `Homm Bitkisel Kayıt: Adım Adım Nasıl Üye Olunur? | ${AD}`,
  desc: `Homm Bitkisel yeni kayıt formu nasıl doldurulur? Ülke, tavsiye eden, iletişim ve kişisel bilgiler adım adım. Takıldığınız yerde ${AD} ücretsiz yardımcı olur.`,
  h1: 'Homm Bitkisel Kayıt: Adım Adım Nasıl Üye Olunur?',
  lead: 'Homm Bitkisel yeni kayıt formu tek sayfadır ve birkaç dakikada doldurulur. Aşağıda her alanı sırasıyla anlattım.',
  body: `
${cta}
<h2>Kayıt formundaki adımlar</h2>
<ol class="adimlar">
  <li><span>1</span><div><h3>Kayıt türünü seçin</h3><p>Sayfanın başında iki kutu vardır: <i>Temsilci (Kazanç + Alışveriş)</i> ve <i>Ayrıcalıklı Müşteri (Sadece alışveriş yapacağım)</i>. Size uygun olanı işaretleyin.</p></div></li>
  <li><span>2</span><div><h3>Ülke ve tavsiye eden</h3><p>Ülkenizi seçin. “Tavsiye eden” alanında <b>${AD}</b> yazıyorsa doğru bağlantıdasınız; bu alan sizi destekleyecek sponsoru gösterir.</p></div></li>
  <li><span>3</span><div><h3>İletişim bilgileri</h3><p>Cep telefonu numaranızı iki kez ve e-posta adresinizi yazın. Onay mesajı bu numaraya gelir, bu yüzden kendi numaranızı kullanın.</p></div></li>
  <li><span>4</span><div><h3>Kişisel bilgiler</h3><p>Ad, soyad, şifre, kimlik numarası, doğum tarihi ve cinsiyet alanlarını doldurun. Şifrenizi not edin; temsilci girişinde kullanacaksınız.</p></div></li>
  <li><span>5</span><div><h3>Sözleşme onayı</h3><p>Formu gönderdikten sonra telefonunuza gelen sözleşmeyi onaylayın. Onaydan sonra size özel referans kodu tanımlanır.</p></div></li>
</ol>
<h2>Kayıtta en sık yapılan hatalar</h2>
<ul>
  <li><b>Tavsiye eden alanını boş bırakmak.</b> Boş kalırsa sistem sonradan bir sponsor belirler ve sizi tanımayan biriyle eşleşebilirsiniz.</li>
  <li><b>Başkasının telefon numarasını yazmak.</b> Onay mesajı size ulaşmaz, kayıt tamamlanmaz.</li>
  <li><b>Yanlış üyelik türünü seçmek.</b> Yalnızca alışveriş yapacaksanız Ayrıcalıklı Müşteri'yi seçin.</li>
</ul>
<h2>Kayıttan sonra ne olur?</h2>
<p>Üyeliğiniz açıldığında resmi sitedeki <i>Temsilci Girişi</i> bölümünden panelinize girersiniz. Ekibimiz sizi arayarak panelin kullanımını, ilk siparişin nasıl verileceğini ve eğitimlere nasıl katılacağınızı anlatır.</p>
${form('Formu birlikte dolduralım')}` },

{ path: 'homm-bitkisel-temsilci-ol/', title: `Homm Bitkisel Temsilci Ol: Şartlar ve Başvuru | ${AD}`,
  desc: `Homm Bitkisel temsilcisi olmak için gereken şartlar, başvuru adımları ve temsilcilikte sizi nelerin beklediği. ${EKIP}'ten ücretsiz başlangıç desteği.`,
  h1: 'Homm Bitkisel Temsilci Ol',
  lead: 'Homm Bitkisel bağımsız temsilcisi olarak ürünleri kendi çevrenize ve internet üzerinden satabilir, dilerseniz kendi ekibinizi kurabilirsiniz.',
  body: `
${cta}
<figure class="gorsel"><img src="${P}img/ekip.jpg" alt="Evde birlikte çalışan üç kadın" loading="lazy" width="1100" height="733"></figure>
<h2>Temsilci olmak için şartlar</h2>
<ul class="tik buyuk">
  <li>${ik.onay}18 yaşını doldurmuş olmak.</li>
  <li>${ik.onay}Resmi kayıt formunu doldurmak ve telefonunuza gelen temsilci sözleşmesini onaylamak.</li>
  <li>${ik.onay}Giriş ücreti veya sermaye gerekmez.</li>
</ul>
<h2>Temsilci olunca ne yaparsınız?</h2>
<div class="grid3">
  <div class="card ikon">${ik.sepet}<h3>Alışveriş</h3><p>Ürünleri temsilci panelinizden kendiniz sipariş edersiniz.</p></div>
  <div class="card ikon">${ik.ev}<h3>Satış</h3><p>Ürünleri çevrenize ve şirket kurallarına uyarak internetten satabilirsiniz.</p></div>
  <div class="card ikon">${ik.ekip}<h3>Ekip</h3><p>Kendi kayıt bağlantınızla yeni üyeler kaydedip ekip kurabilirsiniz.</p></div>
</div>
<h2>Dürüst olalım: kazanç garantisi yok</h2>
<p>Bu iş bir maaş değildir. Kazancınız yaptığınız satışa, ayırdığınız zamana ve ekibinize bağlıdır. Kimseye sabit gelir sözü vermiyoruz; verenlere de itibar etmeyin. Bizim sözümüz şu: başlarken yalnız kalmazsınız.</p>
<h2>${EKIP}'te ne sunuyoruz?</h2>
<ul class="tik buyuk">
  <li>${ik.onay}Kayıt formunda birebir yardım.</li>
  <li>${ik.onay}Panel, sipariş ve ürün bilgisi eğitimi.</li>
  <li>${ik.onay}Soru sorabileceğiniz bir ekip ve düzenli görüşmeler.</li>
</ul>
${bioKart}
${form('Temsilcilik hakkında sizi arayalım')}` },

{ path: 'ayricalikli-musteri/', title: `Homm Bitkisel Ayrıcalıklı Müşteri Üyeliği Nedir? | ${AD}`,
  desc: `Satış yapmadan, ürünleri %30 indirimli almak isteyenler için Homm Bitkisel Ayrıcalıklı Müşteri üyeliği: nedir, nasıl kayıt olunur, temsilcilikten farkı ne?`,
  h1: 'Homm Bitkisel Ayrıcalıklı Müşteri Üyeliği',
  lead: 'Satış yapmak ya da ekip kurmak istemiyor, yalnızca ürünleri kendiniz için almak mı istiyorsunuz? Ayrıcalıklı Müşteri üyeliği bunun için var.',
  body: `
<div class="cta">
  <a class="btn primary" href="${KAYIT_AM}" rel="nofollow noopener" target="_blank">Ayrıcalıklı Müşteri Ol (Ücretsiz)</a>
  <a class="btn ghost" href="${MAGAZA}" rel="nofollow noopener" target="_blank">Üye Olmadan Alışveriş Yap</a>
  <a class="btn ghost" href="#form">Beni Arayın</a>
</div>
<h2>Ayrıcalıklı Müşteri kimdir?</h2>
<p>Ayrıcalıklı Müşteri, Homm Bitkisel'e yalnızca alışveriş amacıyla üye olan kişidir. Satış yapma zorunluluğu yoktur. Siparişlerinizi resmi site üzerinden kendi hesabınızla verirsiniz.</p>
<p class="indirim"><b>%30</b><span>Üye olduktan sonra ürünleri, üye olmadan alınan fiyata göre <b>%30 indirimli</b> alırsınız.</span></p>
<h2>Nasıl kayıt olunur?</h2>
<ol class="adimlar">
  <li><span>1</span><div><h3>Kayıt bağlantısını açın</h3><p>Bu sayfadaki “Ayrıcalıklı Müşteri Ol” butonunu kullanın.</p></div></li>
  <li><span>2</span><div><h3>Ayrıcalıklı Müşteri'yi seçin</h3><p>Sayfanın başındaki <i>Ayrıcalıklı Müşteri (Sadece alışveriş yapacağım)</i> kutusunu işaretleyin.</p></div></li>
  <li><span>3</span><div><h3>Formu gönderin</h3><p>İletişim ve kişisel bilgilerinizi girip formu gönderin.</p></div></li>
</ol>
<h2>Temsilci mi, Ayrıcalıklı Müşteri mi?</h2>
<div class="tablo"><table>
  <tr><th></th><th>Temsilci</th><th>Ayrıcalıklı Müşteri</th></tr>
  <tr><td>Alışveriş</td><td>Evet</td><td>Evet</td></tr>
  <tr><td>%30 üye indirimi</td><td>Evet</td><td>Evet</td></tr>
  <tr><td>Satış ve kazanç</td><td>Evet</td><td>Hayır</td></tr>
  <tr><td>Ekip kurma</td><td>Evet</td><td>Hayır</td></tr>
  <tr><td>Satış zorunluluğu</td><td>Yok</td><td>Yok</td></tr>
</table></div>
<p>Hangisinin size uygun olduğundan emin değilseniz numaranızı bırakın, birlikte karar verelim.</p>
${form()}` },

{ path: 'homm-bitkisel-urunleri/', title: `Homm Bitkisel Ürünleri: Kategoriler ve Sipariş | ${AD}`,
  desc: `Homm Bitkisel ürün kategorileri: cilt bakımı, saç bakımı, kişisel bakım, ev temizliği ve daha fazlası. Üye olarak nasıl sipariş verilir?`,
  h1: 'Homm Bitkisel Ürünleri',
  lead: 'Ürünleri mağaza linkimden üye olmadan alabilir, ücretsiz üye olursanız aynı ürünleri %30 indirimli alırsınız.',
  body: `
${['Cilt Bakımı', 'Saç ve Kişisel Bakım', 'Ev Temizliği', 'Kahve ve İçecek'].map(k => `<h2>${k}</h2>${urunGrid(urunler.filter(u => u[3] === k))}`).join('')}
<p class="indirim"><b>%30</b><span>Üye olduğunuzda ürünleri, üye olmadan alınan fiyata göre <b>%30 indirimli</b> alırsınız. Üyelik ücretsizdir.</span></p>
<p>Burada yalnızca bir seçki var; katalogda 350'den fazla ürün bulunuyor. Hepsini benim referansımla görmek için aşağıdaki butonu kullanın.</p>
${uyeBant}
<div class="cta">${tumBtn()}<a class="btn ghost" href="${MAGAZA}" rel="nofollow noopener" target="_blank">Öne Çıkan 20 Ürün</a></div>
<p class="not">“Tüm Ürünleri Gör” butonu mağazamı açar ve birkaç saniye içinde tüm kataloğa geçer; sayfanın üstünde “${AD} referansı ile alışveriş yapıyorsunuz” yazısını görürsünüz.</p>
<h2>Nasıl sipariş verilir?</h2>
<p>Ürünleri üye olmadan da alabilirsiniz; ancak üye olduğunuzda aynı ürünleri %30 indirimli alırsınız. Üye olmadan almak için ürün kartına ya da mağaza butonuna tıklayın; üye olduysanız kendi hesabınıza girip sepete ekleyerek indirimli sipariş verirsiniz. Hangi ürünün size uygun olduğunu sormak isterseniz bize yazın.</p>
<p class="not">Ürün görselleri ve adları Homm Bitkisel'e aittir; güncel fiyat ve içerik mağaza sayfasında yer alır. Bu sayfadaki bilgiler genel tanıtım amaçlıdır; ürünler tıbbi tedavi amacı taşımaz, sağlık sorunlarınız için hekiminize danışın.</p>
${cta}
${form('Ürünler hakkında bilgi alın')}` },

{ path: 'hakkimizda/', title: `Hakkımızda | ${EKIP} · Homm Bitkisel Bağımsız Temsilcisi ${AD}`,
  desc: `${EKIP}; Homm Bitkisel'e katılmak isteyenlere doğru bilgi, birebir destek ve ekip çalışması sunar. Kurucu lider: ${KARIYER} kariyerinden ${AD}.`,
  h1: 'Hakkımızda',
  lead: `${EKIP}; Homm Bitkisel'e katılmak isteyenlere doğru bilgi, birebir destek ve sürdürülebilir ekip çalışması sunmak için kuruldu.`,
  body: `
<figure class="gorsel"><img src="${P}img/ekip.jpg" alt="Birlikte çalışan ekip üyeleri (temsili)" width="1100" height="733"></figure>
<h2>Amacımız</h2>
<p>Hedefimiz yalnızca kayıt oluşturmak değil; bilinçli, aktif ve uzun vadeli ilerleyen bir ekip kurmak. Yeni başlayan üyelerin sistemi kolay öğrenebilmesi için süreç boyunca iletişimde kalıyor, eğitimlere yönlendiriyor ve her aşamada yanlarında oluyoruz.</p>
<div class="grid3">
  <div class="card ikon">${ik.tel}<h3>Doğru bilgi</h3><p>Sistemi abartmadan, olduğu gibi anlatırız.</p></div>
  <div class="card ikon">${ik.egitim}<h3>Eğitim</h3><p>Panel, sipariş ve ürün eğitimlerine yönlendiririz.</p></div>
  <div class="card ikon">${ik.ekip}<h3>Birlikte büyüme</h3><p>Ekip kurmak isteyenlere tecrübemizi aktarırız.</p></div>
</div>
${bioKart}
<h2>Homm Bitkisel hakkında</h2>
<p>Homm Bitkisel Ürünler Pazarlama A.Ş.; merkezi İstanbul Maltepe'de bulunan, ürünlerini bağımsız temsilciler aracılığıyla satan bir doğrudan satış şirketidir. Şirketin belgeleri <a href="${P}sertifikalar/">Sertifikalar</a>, kazanç sistemi ise <a href="${P}kazanc-plani/">Kazanç Planı</a> sayfasında.</p>
<div class="cta">
  <a class="btn primary" href="${P}hizli-basvuru/">Hızlı Başvuru Formu</a>
  <a class="btn ghost" href="${KAYIT}" rel="nofollow noopener" target="_blank">Hemen Ücretsiz Kayıt Ol</a>
</div>` },

{ path: 'hizli-basvuru/', title: `Homm Bitkisel Hızlı Başvuru Formu | ${EKIP} · ${AD}`,
  desc: `Homm Bitkisel hızlı başvuru: adınızı, şehrinizi ve telefonunuzu bırakın, ${EKIP} sizi arayıp ücretsiz üyeliğinizi birlikte tamamlasın.`,
  h1: 'Hızlı Başvuru Formu',
  lead: 'Başvurunuzu bir dakikada bırakın, sizi arayıp üyeliğinizi birlikte tamamlayalım.',
  body: `
${form('Başvurunuzu bırakın')}
<h2>Başvurudan sonra ne olur?</h2>
<ol class="adimlar">
  <li><span>1</span><div><h3>Sizi ararız</h3><p>${AD} veya ${EKIP}'ten bir bağımsız temsilci sizi arar.</p></div></li>
  <li><span>2</span><div><h3>Üyelik türünü seçeriz</h3><p>Temsilci mi, Ayrıcalıklı Müşteri mi; size uygun olanı birlikte belirleriz.</p></div></li>
  <li><span>3</span><div><h3>Kaydı tamamlarız</h3><p>Resmi kayıt formunu telefonda birlikte doldururuz; üyeliğiniz ücretsiz açılır.</p></div></li>
</ol>
<p>Beklemeden kendiniz kayıt olmak isterseniz:</p>
<div class="cta"><a class="btn primary" href="${KAYIT}" rel="nofollow noopener" target="_blank">Hemen Ücretsiz Kayıt Ol</a></div>` },

{ path: 'sertifikalar/', title: `Homm Bitkisel Sertifikaları ve Belgeleri | ${AD}`,
  desc: 'Homm Bitkisel\'in Ticaret Bakanlığı Doğrudan Satış Yetki Belgesi, helal sertifikaları, GMP, kalite ve gıda güvenliği belgeleri bu sayfada.',
  h1: 'Homm Bitkisel Sertifikaları',
  lead: 'Şirketin sertifika ve belgeleri aşağıda; büyütmek için üzerine dokunun.',
  genis: true,
  body: `
<div class="sertgrid">${sertifikalar.map(([no, ad, alt]) => `<a class="sertkart" href="${P}img/sertifika/${no}.jpg" target="_blank"><img src="${P}img/sertifika/${no}.jpg" alt="Homm Bitkisel ${ad}" loading="lazy"><b>${ad}</b><small>${alt}</small></a>`).join('')}</div>
<p class="not">Bu belgeler Homm Bitkisel Ürünler Pazarlama A.Ş.'ye aittir ve bilgi amacıyla gösterilmektedir.</p>
${cta}
${form()}` },

{ path: 'kazanc-plani/', title: `Homm Bitkisel Kazanç Planı Nasıl İşler? | ${EKIP} · ${AD}`,
  desc: `Homm Bitkisel kazanç planı: perakende satış kârı, ciro puanı (CP), aktiflik puanı (AP) ve kariyer basamakları. ${KARIYER} lider ${AD} anlatıyor.`,
  h1: 'Homm Bitkisel Kazanç Planı',
  lead: 'Homm Bitkisel\'de kazanç üç kaynaktan oluşur: kendi satışınız, ekibinizin cirosu ve ulaştığınız kariyer.',
  body: `
<div class="grid3">
  <div class="card ikon">${ik.sepet}<h3>1. Perakende satış kârı</h3><p>Üye olarak ürünleri %30 indirimli alır, çevrenize liste fiyatından satarsınız; aradaki fark sizin kazancınızdır.</p></div>
  <div class="card ikon">${ik.ekip}<h3>2. Ekip primi</h3><p>Kendi kayıt linkinizle üye kaydeder, ekibinizin yaptığı ciro üzerinden prim kazanırsınız.</p></div>
  <div class="card ikon">${ik.egitim}<h3>3. Kariyer gelirleri</h3><p>Cironuz büyüdükçe kariyer basamaklarında yükselir, basamağa bağlı ek gelirlere hak kazanırsınız.</p></div>
</div>
<h2>Plandaki temel kavramlar</h2>
<div class="tablo"><table>
  <tr><th>Kavram</th><th>Ne demek?</th></tr>
  <tr><td><b>CP</b> (Ciro Puanı)</td><td>Her ürünün bir ciro puanı vardır. Sizin ve ekibinizin alışverişleri CP olarak toplanır; kariyer ve primler bu puana göre hesaplanır.</td></tr>
  <tr><td><b>AP</b> (Aktiflik Puanı)</td><td>O dönem aktif sayılmanız için kendi alışverişinizle doldurmanız gereken puandır.</td></tr>
  <tr><td><b>Kariyer</b></td><td>Toplam cironuza göre ulaştığınız basamaktır. ${AD} bu basamaklardan <b>${KARIYER}</b> kariyerindedir.</td></tr>
</table></div>
<h2>Güncel kazanç tablosu</h2>
<p>Kariyer basamaklarının güncel CP şartlarını ve prim oranlarını gösteren şirket tablosunu sizinle birebir paylaşıyor, kendi hedefinize göre üzerinden birlikte geçiyoruz.</p>
<div class="cta">
  <a class="btn primary" href="${WA('Merhaba, Homm Bitkisel güncel kazanç tablosunu almak istiyorum.')}" rel="nofollow noopener" target="_blank">Güncel Tabloyu WhatsApp'tan İste</a>
  <a class="btn ghost" href="${KAYIT}" rel="nofollow noopener" target="_blank">Hemen Ücretsiz Üye Ol</a>
</div>
<p class="not">Kazanç kişinin çalışmasına, satışına ve ekibine bağlıdır; garanti edilen bir gelir yoktur.</p>
${form('Kazanç planını telefonda anlatalım')}` },

{ path: 'eylem-arslan/', title: `${AD} Kimdir? ${EKIP} Kurucu Lideri, Homm Bitkisel ${KARIYER} Lider`,
  desc: `${AD}: Homm Bitkisel'de ${KARIYER} kariyerinde bağımsız temsilci ve ${EKIP}'in kurucu lideri. Ekibe nasıl katılırsınız, size nasıl destek olur?`,
  h1: `${AD}`,
  lead: `${EKIP} Kurucu Lideri · Homm Bitkisel ${KARIYER} Lider`,
  body: `
<section class="bio buyuk">
  ${avatar('b')}
  <div>
    <span class="rozet zumrut">◆ ${KARIYER} Lider</span>
    <p>${AD}, Homm Bitkisel'de <b>${KARIYER}</b> kariyerine ulaşmış bir bağımsız temsilci ve <b>${EKIP}</b>'in kurucu lideridir.</p>
    <p>${EKIP}'i, Homm Bitkisel'e yeni katılanların ilk günlerinde yalnız kalmaması için kurdu. Ekibe katılan herkesle kayıt formundan ilk siparişe, panel kullanımından kendi ekibini kurmaya kadar birebir ilgilenir.</p>
  </div>
</section>
<h2>${EKIP}'te çalışma şeklimiz</h2>
<div class="grid3">
  <div class="card ikon">${ik.tel}<h3>Önce tanışırız</h3><p>Sizi arar, ne istediğinizi dinler, size uygun üyelik türünü birlikte seçeriz.</p></div>
  <div class="card ikon">${ik.egitim}<h3>Sonra öğretiriz</h3><p>Paneli, sipariş vermeyi ve ürünleri adım adım anlatırız.</p></div>
  <div class="card ikon">${ik.ekip}<h3>Birlikte büyürüz</h3><p>Ekip kurmak isteyenlere kendi tecrübemizi aktarırız.</p></div>
</div>
<h2>Sözümüz</h2>
<p>Kimseye garanti kazanç vaat etmiyoruz. Vaat ettiğimiz şey emek: sorularınız yanıtsız kalmaz, başlarken yalnız kalmazsınız.</p>
<div class="cta">
  <a class="btn primary" href="${KAYIT}" rel="nofollow noopener" target="_blank">${EKIP}'e Katıl</a>
  <a class="btn ghost" href="${WA_GENEL}" rel="nofollow noopener" target="_blank">WhatsApp'tan Yaz</a>
</div>
${form(`${AD} sizi arasın`)}` },

{ path: 'sik-sorulan-sorular/', title: `Homm Bitkisel Üyelik Hakkında Sık Sorulan Sorular | ${AD}`,
  desc: `Homm Bitkisel üyelik ücretli mi, kimler üye olabilir, satış zorunlu mu, üyelikten nasıl çıkılır? En çok sorulan soruların kısa ve net yanıtları.`,
  h1: 'Homm Bitkisel Üyelik: Sık Sorulan Sorular',
  lead: 'En çok sorulan soruların kısa ve net yanıtları.',
  faq: true,
  body: `${sssHtml(sss)}${cta}${form('Sorunuz mu var? Arayalım')}` },

{ path: 'iletisim/', title: `İletişim | ${EKIP} · Homm Bitkisel Bağımsız Temsilcisi ${AD}`,
  desc: `Homm Bitkisel bağımsız temsilcisi ${AD} ile iletişim: telefon ${TEL}, WhatsApp ve geri arama formu.`,
  h1: 'İletişim',
  lead: 'Üyelik, kayıt ve ürünler hakkında bana doğrudan ulaşabilirsiniz.',
  body: `
<div class="grid3">
  <a class="card ikon link" href="tel:+${TEL_INT}">${ik.tel}<h3>Telefon</h3><p>${TEL}</p></a>
  <a class="card ikon link" href="${WA_GENEL}" rel="nofollow noopener" target="_blank">${ik.wa}<h3>WhatsApp</h3><p>Mesaj gönderin</p></a>
  <a class="card ikon link" href="${KAYIT}" rel="nofollow noopener" target="_blank">${ik.hediye}<h3>Ücretsiz üyelik</h3><p>Kayıt formunu açın</p></a>
  <a class="card ikon link" href="${MAGAZA}" rel="nofollow noopener" target="_blank">${ik.sepet}<h3>Alışveriş</h3><p>Mağazamdan sipariş verin</p></a>
</div>
${form()}
<h2>Şirketin resmi iletişim bilgileri</h2>
<p>Sipariş, kargo, iade ve hesap sorunları için Homm Bitkisel müşteri hizmetleri: <b>444 77 97</b> (hafta içi 09:00–17:00), resmi site: hommbitkisel.com.tr.</p>` },

{ path: 'kvkk/', title: `KVKK Aydınlatma Metni | ${AD}`, noindex: true,
  desc: `Kişisel verilerin korunması hakkında aydınlatma metni.`,
  h1: 'KVKK Aydınlatma Metni',
  body: `
<p><b>Veri sorumlusu:</b> Homm Bitkisel bağımsız temsilcisi ${AD} (Telefon: ${TEL}).</p>
<h2>Hangi veriler işlenir?</h2>
<p>Bu sitedeki form aracılığıyla kendi isteğinizle ilettiğiniz ad-soyad, telefon numarası ve ilgilendiğiniz konu bilgisi. Form, bilgilerinizi WhatsApp mesajı olarak hazırlar; mesajı siz göndermedikçe hiçbir bilginiz bize ulaşmaz ve bu sitede saklanmaz.</p>
<h2>Hangi amaçla işlenir?</h2>
<p>Yalnızca Homm Bitkisel üyeliği, kayıt adımları ve ürünler hakkında sizi bilgilendirmek üzere telefonla veya WhatsApp üzerinden aranmanız amacıyla.</p>
<h2>Kimlerle paylaşılır?</h2>
<p>Numaranız, sizi arayabilmesi için ${EKIP}'teki bir bağımsız temsilciyle paylaşılabilir. Bunun dışında üçüncü kişilere satılmaz, devredilmez.</p>
<h2>Hukuki sebep ve saklama süresi</h2>
<p>Verileriniz açık rızanıza dayanarak işlenir. Üye olmaktan vazgeçtiğinizde veya talep ettiğinizde derhal, her durumda en geç 6 ay içinde silinir.</p>
<h2>Haklarınız</h2>
<p>6698 sayılı Kanun'un 11. maddesi uyarınca verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini isteme ve rızanızı geri alma hakkına sahipsiniz. Talebinizi ${TEL} numarasını arayarak veya WhatsApp'tan yazarak iletebilirsiniz; “aramayın” demeniz yeterlidir.</p>
<p class="not">Resmi kayıt formunda girdiğiniz bilgiler bu siteye değil, doğrudan Homm Bitkisel Ürünler Pazarlama A.Ş.'ye iletilir ve şirketin kendi KVKK politikasına tabidir.</p>` },
];

const layout = (p) => {
  const url = BASE + p.path;
  const robots = (INDEX && !p.noindex) ? 'index,follow' : 'noindex,nofollow';
  const ld = [];
  const kisi = { '@context': 'https://schema.org', '@type': 'Person', name: AD, jobTitle: `${EKIP} Kurucu Lideri, Homm Bitkisel ${KARIYER} Lider`, telephone: '+' + TEL_INT, url: BASE + 'eylem-arslan/' };
  if (p.path === '') ld.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: `${EKIP} – ${AD} · Homm Bitkisel Bağımsız Temsilcisi`, url: BASE, inLanguage: 'tr' }, kisi);
  if (p.path === 'eylem-arslan/') ld.push(kisi);
  if (p.faq) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: sss.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  if (p.path && !p.noindex) ld.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Üyelik', item: BASE }, { '@type': 'ListItem', position: 2, name: p.h1, item: url }] });
  const ust = p.hero || `<section class="sayfabas"><div class="ic dar"><h1>${p.h1}</h1>${p.lead ? `<p class="lead">${p.lead}</p>` : ''}</div></section>`;
  return `<!doctype html>
<html lang="tr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:locale" content="tr_TR">
<meta property="og:title" content="${p.title}"><meta property="og:description" content="${p.desc}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}img/og.jpg"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#50b6bb">
<link rel="icon" href="${P}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${P}style.css">
${ld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head><body>
<div class="ust">Bu site Homm Bitkisel'in resmi sitesi değildir; <b>bağımsız temsilci ${AD}</b> tarafından hazırlanmıştır.</div>
<header><div class="ic">
  <a class="marka" href="${P}"><img class="hlogo" src="${P}img/homm-logo.png" alt="Homm Life" width="96" height="48"><span>${EKIP}<small>${AD} · Bağımsız Temsilci</small></span></a>
  <nav>${nav.map(([h, t]) => `<a href="${P}${h}"${h === p.path ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
  <a class="htel" href="tel:+${TEL_INT}">${ik.tel}<span><small>Telefon Numaramız</small>${TEL}</span></a>
  <a class="btn primary kucuk" href="${KAYIT}" rel="nofollow noopener" target="_blank">Ücretsiz Kayıt</a>
</div></header>
<main>
${ust}
<div class="ic${p.hero || p.genis ? '' : ' dar'} govde">
${p.body}
</div>
</main>
<footer><div class="ic">
  <div class="fgrid">
    <div><img class="flogo" src="${P}img/homm-logo.png" alt="Homm Life" width="120" height="60" loading="lazy"><p class="fmarka">${EKIP}</p><p>${AD}<br>${KARIYER} Lider · Homm Bitkisel Bağımsız Temsilcisi</p><p><a href="tel:+${TEL_INT}">${TEL}</a></p></div>
    <div><p class="fbas">Sayfalar</p>${nav.map(([h, t]) => `<a href="${P}${h}">${t}</a>`).join('')}</div>
    <div><p class="fbas">Bilgi</p>${altnav.map(([h, t]) => `<a href="${P}${h}">${t}</a>`).join('')}<a href="${KAYIT}" rel="nofollow noopener" target="_blank">Ücretsiz üye ol</a><a href="${MAGAZA}" rel="nofollow noopener" target="_blank">Mağazamdan alışveriş</a><a href="${WA_GENEL}" rel="nofollow noopener" target="_blank">WhatsApp</a></div>
  </div>
  <p class="yasal">Bu site bağımsız bir temsilci sayfasıdır. Homm Bitkisel ve Homm Life adları Homm Bitkisel Ürünler Pazarlama A.Ş.'ye aittir. Resmi site: hommbitkisel.com.tr · Müşteri hizmetleri: 444 77 97. Kazanç kişinin çalışmasına bağlıdır; garanti edilen gelir yoktur.</p>
</div></footer>
<a class="wayuzen" href="${WA_GENEL}" rel="nofollow noopener" target="_blank" aria-label="WhatsApp'tan yazın">${ik.wa}</a>
<div class="alt">
  <a class="k" href="${KAYIT}" rel="nofollow noopener" target="_blank">Üye Ol</a>
  <a class="s" href="${MAGAZA}" rel="nofollow noopener" target="_blank">Alışveriş</a>
  <a class="w" href="${WA_GENEL}" rel="nofollow noopener" target="_blank">WhatsApp</a>
  <a class="a" href="tel:+${TEL_INT}">Ara</a>
</div>
<script>
function tumUrunler(){
  var w=window.open('${MAGAZA}','_blank');
  if(!w) return true;
  setTimeout(function(){try{w.location.href='${KATALOG}'}catch(e){}},3500);
  return false;
}
function gonder(f){
  var m='Merhaba, Homm Bitkisel üyeliği için aranmak istiyorum.\\nAd Soyad: '+f.ad.value.trim()+'\\nTelefon: '+f.tel.value.trim()+'\\nŞehir: '+f.sehir.value.trim()+'\\nKonu: '+f.konu.value;
  window.open('https://wa.me/${TEL_INT}?text='+encodeURIComponent(m),'_blank');
  return false;
}
</script>
</body></html>`;
};

const css = `
:root{--y:#15777d;--y2:#1b8a90;--z:#50b6bb;--acik:#e3f5f6;--k:#f3fbfb;--m:#1d2b2c;--g:#566869;--c:#fff;--s:#d5e9ea;--altin:#1b8a90;--wa:#128c4b;--r:18px}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font:17px/1.65 "DM Sans",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:var(--m);background:var(--k);padding-bottom:62px;-webkit-font-smoothing:antialiased}
img{max-width:100%;height:auto;display:block}
svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
svg.dolu{fill:currentColor;stroke:none}
.ic{max-width:1120px;margin:0 auto;padding:0 20px}.ic.dar{max-width:820px}
a{color:var(--y2)}
h1,h2,.fmarka{font-family:"Playfair Display",Georgia,serif;font-weight:700;letter-spacing:-.01em}
h1{font-size:clamp(32px,5.6vw,54px);line-height:1.1;margin:14px 0 16px;color:var(--y);text-wrap:balance}
h1 em{font-style:italic;color:var(--z)}
h2{font-size:clamp(25px,3.4vw,34px);line-height:1.2;margin:0 0 14px;color:var(--y);text-wrap:balance}
h3{margin:0 0 4px;font-size:18px;color:var(--y)}
.lead{font-size:19.5px;color:#334647;max-width:60ch}
.ustbaslik{margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--altin)}
.not{font-size:14px;color:var(--g)}
.rozet{display:inline-block;background:var(--acik);color:var(--y);font-size:13px;font-weight:700;padding:5px 12px;border-radius:99px}
.rozet.zumrut{background:linear-gradient(135deg,#12a577,#0c6b4d);color:#fff;letter-spacing:.03em}

.ust{background:#fff7d6;color:#5c4a00;font-size:13px;text-align:center;padding:6px 12px}
header{background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-bottom:1px solid var(--s);position:sticky;top:0;z-index:20}
header .ic{display:flex;align-items:center;gap:10px 22px;padding-top:10px;padding-bottom:10px;flex-wrap:wrap}
.marka{display:flex;align-items:center;gap:10px;font-weight:700;font-size:19px;color:var(--y);text-decoration:none;line-height:1.15}
.marka small{display:block;font-weight:500;font-size:11.5px;color:var(--g)}
.hlogo{height:46px;width:auto}.flogo{height:54px;width:auto;filter:brightness(0) invert(1);margin-bottom:8px}
.htel{display:flex;align-items:center;gap:9px;text-decoration:none;color:var(--m);font-weight:700;font-size:15px;line-height:1.2}
.htel svg{width:38px;height:38px;padding:9px;border-radius:50%;background:var(--z);color:#fff}.htel small{display:block;font-weight:500;font-size:11.5px;color:var(--g)}
.tanitim{display:grid;grid-template-columns:1.05fr .95fr;gap:40px;align-items:center;margin:56px 0}
.tanitim img{border-radius:24px;box-shadow:0 18px 40px rgba(21,119,125,.16);width:100%;object-fit:cover;aspect-ratio:4/3}
.urunler{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:16px;margin:20px 0}
.urun{background:#fff;border:1px solid var(--s);border-radius:var(--r);padding:14px 14px 16px;text-decoration:none;color:var(--m);display:grid;gap:3px;transition:transform .15s,box-shadow .15s}
.urun:hover{transform:translateY(-3px);box-shadow:0 12px 26px rgba(21,119,125,.14)}
.urun .ug{height:190px;display:grid;place-items:center;background:var(--acik);border-radius:12px;margin-bottom:8px;padding:12px}
.urun img{max-height:166px;width:auto;max-width:100%;object-fit:contain}
.urun small{color:var(--y2);font-weight:700;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase}
.urun b{font-size:15.5px;line-height:1.3}.urun i{font-style:normal;color:var(--g);font-size:13.5px}
.indirim{display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,#fff4dc,#ffe9b8);border:1px solid #f1d58a;border-radius:16px;padding:12px 18px;margin:14px 0;color:#5a4300;max-width:720px}
.indirim>b{font-family:"Playfair Display",serif;font-size:32px;color:#c2410c;line-height:1}
.altlink{margin:6px 0 0;font-size:15px}
.uyebant{display:flex;flex-wrap:wrap;align-items:center;gap:12px 16px;background:linear-gradient(135deg,#fff,var(--acik));border:2px solid var(--z);border-radius:20px;padding:16px 20px;margin:22px 0}
.uyebant>div{flex:1;min-width:230px;display:grid;gap:2px}.uyebant>div>b{font-size:18px;color:var(--y)}.uyebant span{color:#334647;font-size:15px}
.sertgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px;margin:10px 0 24px}
.sertkart{background:#fff;border:1px solid var(--s);border-radius:var(--r);padding:12px;text-decoration:none;color:var(--m);display:grid;gap:4px;transition:transform .15s,box-shadow .15s}
.sertkart:hover{transform:translateY(-3px);box-shadow:0 12px 26px rgba(21,119,125,.16)}
.sertkart img{width:100%;aspect-ratio:1/1.38;object-fit:cover;object-position:top;border-radius:10px;border:1px solid var(--s);margin-bottom:6px}
.sertkart small{color:var(--g)}
.logo{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--z),var(--y));color:#fff;display:grid;place-items:center;font-family:"Playfair Display",serif;font-size:17px}
nav{display:flex;gap:2px 14px;font-size:14px;flex:1;flex-wrap:wrap}header .ic{max-width:1320px}
nav a{color:var(--m);text-decoration:none;padding:4px 0;border-bottom:2px solid transparent;white-space:nowrap}
nav a:hover,nav a[aria-current]{border-color:var(--z);color:var(--y)}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 24px;border-radius:99px;font-weight:700;text-decoration:none;border:2px solid var(--y);cursor:pointer;font-size:16.5px;font-family:inherit;transition:transform .15s,box-shadow .15s,background .15s}
.btn:hover{transform:translateY(-1px)}
.btn.primary{background:var(--y);color:#fff;box-shadow:0 8px 20px rgba(21,119,125,.25)}.btn.primary:hover{background:var(--y2);border-color:var(--y2)}
.btn.ghost{background:transparent;color:var(--y)}.btn.ghost:hover{background:var(--acik)}
.btn.wa{background:var(--wa);border-color:var(--wa);color:#fff;width:100%}
.btn.kucuk{padding:9px 18px;font-size:14.5px;box-shadow:none}
.cta{display:flex;flex-wrap:wrap;gap:12px;margin:24px 0 10px}

.hero{background:radial-gradient(1200px 520px at 85% 0%,#c9eff1 0%,transparent 62%),linear-gradient(180deg,#e3f7f8,var(--k))}
.heroic{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center;padding-top:48px;padding-bottom:56px}
.herogorsel{position:relative}
.herogorsel img{border-radius:28px 28px 28px 120px;box-shadow:0 30px 60px rgba(21,119,125,.22);aspect-ratio:4/5;object-fit:cover;width:100%}
.yuzen{position:absolute;left:-18px;bottom:28px;background:#fff;border-radius:16px;padding:12px 16px;box-shadow:0 14px 34px rgba(0,0,0,.14);font-size:13.5px;line-height:1.35}
.yuzen b{display:block;color:var(--y);font-size:15px}.yuzen span{color:var(--g)}
.cip{list-style:none;padding:0;margin:18px 0 0;display:flex;flex-wrap:wrap;gap:8px 18px;font-size:15px;font-weight:500;color:var(--y)}
.cip li{display:flex;align-items:center;gap:6px}.cip svg{width:18px;height:18px;color:var(--z);stroke-width:2.6}

.sayfabas{background:linear-gradient(180deg,#dff4f5,var(--k));padding:38px 0 8px}
.govde{padding-top:8px;padding-bottom:56px}
.govde>h2{margin-top:44px}
.bolum{margin:64px 0}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;margin:22px 0}
.card{background:var(--c);border:1px solid var(--s);border-radius:var(--r);padding:20px 22px;box-shadow:0 2px 10px rgba(29,43,44,.04)}
.card p{margin:0;color:#3d4c43}
.card.ikon>svg{width:44px;height:44px;padding:10px;border-radius:12px;background:var(--acik);color:var(--y);margin-bottom:12px}
.card.link{text-decoration:none;color:inherit;transition:transform .15s,box-shadow .15s}.card.link:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(21,119,125,.12)}

.bio{display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center;background:linear-gradient(135deg,#fff,#e9f7f8);border:1px solid var(--s);border-radius:26px;padding:30px;margin:56px 0;box-shadow:0 12px 34px rgba(21,119,125,.08)}
.bio h2{margin:10px 0 2px}.bio .unvan{margin:0 0 10px;font-weight:700;color:var(--altin);font-size:15px}
.bio p{margin:0 0 10px}
.avatar{width:150px;height:150px;border-radius:50%;object-fit:cover;border:5px solid #fff;box-shadow:0 10px 26px rgba(21,119,125,.22)}
.avatar.b{width:190px;height:190px}
.avatar.mono{display:grid;place-items:center;background:linear-gradient(135deg,var(--z),var(--y));color:#fff;font-family:"Playfair Display",serif;font-size:52px}

.adimlar{list-style:none;padding:0;margin:22px 0;display:grid;gap:14px}
.adimlar li{display:flex;gap:16px;align-items:flex-start;background:var(--c);border:1px solid var(--s);border-radius:var(--r);padding:18px 20px}
.adimlar li>span{flex:none;width:42px;height:42px;border-radius:50%;background:var(--y);color:#fff;display:grid;place-items:center;font-family:"Playfair Display",serif;font-size:19px}
.adimlar p{margin:0;color:#3d4c43}

.ikili{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-top:22px}
.secenek h3{font-size:24px;font-family:"Playfair Display",serif;margin:12px 0 6px}
.secenek a{font-weight:700}
.tik{list-style:none;padding:0;margin:14px 0;display:grid;gap:8px}
.tik li{display:flex;gap:9px;align-items:flex-start}.tik svg{width:20px;height:20px;color:var(--z);stroke-width:2.6;margin-top:3px}
.tik.buyuk li{background:var(--c);border:1px solid var(--s);border-radius:14px;padding:12px 16px}

.bant{display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:center;margin:64px 0}
.bant img,.gorsel img{border-radius:24px;box-shadow:0 18px 40px rgba(21,119,125,.14);width:100%;object-fit:cover}
.gorsel{margin:26px 0}.gorsel img{aspect-ratio:16/8}

.formkart{display:grid;grid-template-columns:1fr 1.1fr;gap:34px;background:var(--y);color:#eaf3ec;border-radius:28px;padding:36px;margin:64px 0;scroll-margin-top:90px}
.formkart h2{color:#fff;margin-top:12px}.formkart .rozet{background:rgba(255,255,255,.14);color:#fff}
.formkart .tik svg{color:#aeeef1}
.formkart form{background:#fff;color:var(--m);border-radius:20px;padding:22px;display:grid;gap:12px;align-content:start}
label{display:grid;gap:5px;font-weight:700;font-size:14.5px}
input,select{font:inherit;padding:12px 14px;border:1.5px solid #cfc8b4;border-radius:12px;background:#fff;width:100%}
input:focus,select:focus{outline:none;border-color:var(--z);box-shadow:0 0 0 3px rgba(80,182,187,.18)}
.onay{grid-template-columns:22px 1fr;align-items:start;font-weight:400;font-size:13px;color:var(--g)}
.onay input{width:18px;height:18px;margin-top:3px;padding:0}
form small{color:var(--g);font-size:12.5px}

.sss{display:grid;gap:10px;margin:18px 0}
details{background:var(--c);border:1px solid var(--s);border-radius:16px;padding:15px 20px}
details[open]{border-color:var(--y2);box-shadow:0 6px 18px rgba(21,119,125,.08)}
summary{font-weight:700;cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:12px}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";font-size:22px;line-height:1;color:var(--z)}details[open] summary::after{content:"–"}
details p{margin:10px 0 2px;color:#3d4c43}

.tablo{overflow-x:auto;border:1px solid var(--s);border-radius:var(--r);background:var(--c)}
table{width:100%;border-collapse:collapse;font-size:15.5px}
th,td{padding:12px 14px;text-align:left;border-bottom:1px solid var(--s)}th{background:var(--acik);color:var(--y)}
tr:last-child td{border-bottom:0}

footer{background:#0f5a5f;color:#d3eced;font-size:14.5px;padding:44px 0 26px}
footer a{color:#fff;text-decoration:none;display:block;padding:2px 0}footer a:hover{text-decoration:underline}
.fgrid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:30px}
.fmarka{font-size:24px;color:#fff;margin:0 0 6px}.fbas{font-weight:700;color:#fff;margin:0 0 8px}
.yasal{border-top:1px solid rgba(255,255,255,.14);margin-top:26px;padding-top:16px;font-size:12.5px;color:#a8d3d5}

.wayuzen{position:fixed;right:22px;bottom:22px;width:58px;height:58px;border-radius:50%;background:var(--wa);color:#fff;display:grid;place-items:center;box-shadow:0 10px 26px rgba(18,140,75,.45);z-index:15}
.wayuzen svg{width:32px;height:32px}
.alt{position:fixed;left:0;right:0;bottom:0;display:none;grid-template-columns:1fr 1fr 1fr .7fr;z-index:25;box-shadow:0 -4px 16px rgba(0,0,0,.12)}
.alt a{padding:16px 4px;text-align:center;font-weight:700;text-decoration:none;color:#fff;font-size:14.5px}
.alt .k{background:var(--y)}.alt .s{background:#c2410c}.alt .w{background:var(--wa)}.alt .a{background:#234446}
@media(min-width:861px){body{padding-bottom:0}}
@media(max-width:860px){
  .alt{display:grid}.wayuzen{display:none}
  header .ic{gap:8px 14px}header .btn,.htel{display:none}.hlogo{height:40px}
  .tanitim{grid-template-columns:1fr;gap:22px;margin:40px 0}.urunler,.sertgrid{grid-template-columns:repeat(2,1fr);gap:10px}.urun .ug{height:150px}.urun img{max-height:128px}
  nav{flex-basis:100%;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:0 -20px;padding:0 20px}nav::-webkit-scrollbar{display:none}
  .heroic{grid-template-columns:1fr;gap:30px;padding-top:28px;padding-bottom:36px}
  .herogorsel{max-width:440px}.herogorsel img{border-radius:24px 24px 24px 80px;aspect-ratio:5/5}.yuzen{left:10px;bottom:14px}
  .bant,.formkart{grid-template-columns:1fr}.formkart{padding:24px 18px;border-radius:22px;margin:48px -6px}
  .bio{grid-template-columns:1fr;text-align:center;justify-items:center;padding:24px 20px}
  .fgrid{grid-template-columns:1fr}.bolum{margin:48px 0}
}
`;

if (existsSync(OUT)) rmSync(OUT, { recursive: true });
for (const p of pages) { mkdirSync(`${OUT}/${p.path}`, { recursive: true }); writeFileSync(`${OUT}/${p.path}index.html`, layout(p)); }
cpSync('assets', `${OUT}/img`, { recursive: true });
writeFileSync(`${OUT}/style.css`, css);
writeFileSync(`${OUT}/favicon.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1b8a90"/><text x="32" y="44" font-size="34" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-weight="700">EA</text></svg>`);
writeFileSync(`${OUT}/.nojekyll`, '');
writeFileSync(`${OUT}/robots.txt`, INDEX ? `User-agent: *\nAllow: /\nSitemap: ${BASE}sitemap.xml\n` : `User-agent: *\nDisallow: /\n`);
const today = new Date().toISOString().slice(0, 10);
writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p => !p.noindex).map(p => `<url><loc>${BASE}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(`${OUT}/404.html`, layout({ path: '404', noindex: true, title: 'Sayfa bulunamadı', desc: '', h1: 'Sayfa bulunamadı', body: `<p><a href="${P}">Ana sayfaya dönün</a></p>` }));
// Google Search Console sahiplik doğrulaması (silmeyin)
writeFileSync(`${OUT}/google0ab4c5d791854410.html`, 'google-site-verification: google0ab4c5d791854410.html');
console.log(`${pages.length} sayfa üretildi. Google'a açık: ${INDEX}. Fotoğraf: ${FOTO ? 'var' : 'yok (EA monogram)'}`);
