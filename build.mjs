// Homm Bitkisel bağımsız temsilci sitesi üretici. Çalıştır: node build.mjs
// INDEX=1 node build.mjs  -> Google'a açık sürüm (şirket onayından sonra)
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';

const REPO = 'homm-bitkisel-eylem-arslan';
const ORIGIN = 'https://bulentarslan1453-droid.github.io';
const P = `/${REPO}/`; // site kök yolu
const BASE = ORIGIN + P;
const INDEX = process.env.INDEX === '1'; // 0: Google'a kapalı demo
const AD = 'Eylem Arslan';
const TEL = '0542 580 62 33', TEL_INT = '905425806233';
const KAYIT = 'https://www.hommbitkisel.com.tr/yeni-kayit/HOMM903621099';
const WA = (m) => `https://wa.me/${TEL_INT}?text=${encodeURIComponent(m)}`;
const OUT = 'docs';

const nav = [
  ['', 'Üyelik'], ['homm-bitkisel-kayit/', 'Nasıl Kayıt Olunur'], ['homm-bitkisel-temsilci-ol/', 'Temsilci Ol'],
  ['ayricalikli-musteri/', 'Ayrıcalıklı Müşteri'], ['homm-bitkisel-urunleri/', 'Ürünler'],
  ['sik-sorulan-sorular/', 'Sık Sorulanlar'], ['iletisim/', 'İletişim'],
];

const form = (baslik = 'Sizi arayalım') => `
<section class="card form" id="form">
  <h2>${baslik}</h2>
  <p>Adınızı ve numaranızı bırakın; ${AD} veya ekibinden bir bağımsız temsilci sizi arayıp üyelik adımlarında ücretsiz yardımcı olsun.</p>
  <form onsubmit="return gonder(this)">
    <label>Adınız Soyadınız<input name="ad" required minlength="3" autocomplete="name"></label>
    <label>Telefon Numaranız<input name="tel" required type="tel" inputmode="tel" pattern="[0-9 +()]{10,17}" placeholder="05xx xxx xx xx" autocomplete="tel"></label>
    <label>İlgilendiğiniz konu
      <select name="konu"><option>Temsilci olmak istiyorum</option><option>Sadece indirimli alışveriş (Ayrıcalıklı Müşteri)</option><option>Bilgi almak istiyorum</option></select>
    </label>
    <label class="onay"><input type="checkbox" required> <span><a href="${P}kvkk/">KVKK Aydınlatma Metni</a>'ni okudum; bilgilerimin üyelik hakkında aranmam amacıyla işlenmesine ve tarafımla telefon/WhatsApp üzerinden iletişime geçilmesine onay veriyorum.</span></label>
    <button class="btn wa" type="submit">WhatsApp ile Gönder</button>
    <small>Gönder'e bastığınızda WhatsApp açılır ve mesajınız hazır gelir; yalnızca göndermeniz yeterli.</small>
  </form>
</section>`;

const cta = `
<div class="cta">
  <a class="btn primary" href="${KAYIT}" rel="nofollow noopener" target="_blank">Hemen Ücretsiz Kayıt Ol</a>
  <a class="btn ghost" href="#form">Beni Arayın</a>
</div>
<p class="not">Kayıt butonu sizi Homm Bitkisel'in resmi kayıt formuna götürür. Formda “Tavsiye eden” alanında <b>${AD}</b> yazdığını göreceksiniz.</p>`;

const sss = [
  ['Homm Bitkisel üyelik ücretli mi?', 'Hayır. Kayıt olurken giriş ücreti veya sermaye istenmez. Bu sitede size yapılan yönlendirme ve telefon desteği de ücretsizdir.'],
  ['Homm Bitkisel’e kimler üye olabilir?', 'Bağımsız temsilci olmak için 18 yaşını doldurmuş olmanız yeterlidir. Yalnızca alışveriş yapmak isteyenler kayıt formunda “Ayrıcalıklı Müşteri” seçeneğini işaretler.'],
  ['Temsilci ile Ayrıcalıklı Müşteri arasındaki fark nedir?', 'Temsilci hem alışveriş yapar hem de ürün satışı ve ekip kurma yoluyla kazanç elde edebilir. Ayrıcalıklı Müşteri yalnızca kendi alışverişini yapar; satış yapma zorunluluğu yoktur.'],
  ['Satış yapmak zorunda mıyım?', 'Hayır. İsterseniz yalnızca kendi ihtiyaçlarınız için alışveriş yapabilirsiniz.'],
  ['Kayıt ne kadar sürer?', 'Resmi kayıt formunu doldurmak birkaç dakika sürer. Formu gönderdikten sonra telefonunuza gelen sözleşmeyi onayladığınızda üyeliğiniz tanımlanır.'],
  ['Kayıt formunda “Tavsiye eden” neden önemli?', `Tavsiye eden kişi, sisteme girdikten sonra size destek olacak sponsorunuzdur. Bu sitedeki kayıt bağlantısıyla girdiğinizde tavsiye eden olarak ${AD} görünür ve eğitim, sipariş, panel kullanımı gibi konularda ekibimiz size yardımcı olur.`],
  ['Ne kadar kazanırım?', 'Kazanç tamamen sizin çalışmanıza, satışınıza ve ekibinize bağlıdır. Garanti edilen bir gelir yoktur; kimseye sabit kazanç sözü vermiyoruz.'],
  ['Üyelikten çıkabilir miyim?', 'Evet. Temsilci sözleşmesine göre resmi sitedeki hesabınızda yer alan “Temsilcilikten Ayrıl” seçeneğiyle veya şirkete yazılı başvuruyla üyeliğinizi sonlandırabilirsiniz.'],
  ['Bu site Homm Bitkisel’in resmi sitesi mi?', `Hayır. Bu site Homm Bitkisel bağımsız temsilcisi ${AD} tarafından hazırlanmış bir bilgilendirme sayfasıdır. Şirketin resmi sitesi hommbitkisel.com.tr, müşteri hizmetleri numarası 444 77 97’dir.`],
  ['Numaramı bırakırsam ne olur?', `Yalnızca üyelik hakkında bilgi vermek için ${AD} veya ekibindeki bir bağımsız temsilci tarafından aranırsınız. Aranmak istemediğinizi söylediğiniz anda numaranız silinir.`],
];
const sssHtml = (list) => list.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('');

const pages = [
{ path: '', title: `Homm Bitkisel Üyelik – Ücretsiz Üye Ol | Bağımsız Temsilci ${AD}`,
  desc: `Homm Bitkisel’e ücretsiz üye olmak için adım adım rehber. Bağımsız temsilci ${AD} kayıt, temsilcilik ve ayrıcalıklı müşteri üyeliğinde ücretsiz destek veriyor.`,
  h1: 'Homm Bitkisel Üyelik: Ücretsiz Üye Olun',
  body: `
<p class="lead">Homm Bitkisel'e (Homm Life) üye olmak istiyor ama nereden başlayacağınızı bilmiyor musunuz? Ben bağımsız temsilci <b>${AD}</b>. Kayıt formunu birlikte dolduralım, aklınızdaki soruları yanıtlayayım.</p>
${cta}
<div class="grid3">
  <div class="card"><h3>Ücretsiz</h3><p>Kayıtta giriş ücreti veya sermaye istenmez.</p></div>
  <div class="card"><h3>İki seçenek</h3><p>Temsilci olun ya da yalnızca alışveriş yapan Ayrıcalıklı Müşteri olun.</p></div>
  <div class="card"><h3>Birebir destek</h3><p>Kayıttan sonra panel, sipariş ve eğitimde ekibimiz yanınızda.</p></div>
</div>
<h2>Homm Bitkisel üyeliği nasıl çalışır?</h2>
<p>Homm Bitkisel, bitkisel içerikli kişisel bakım ve ev temizliği ürünlerini bağımsız temsilciler aracılığıyla satan bir doğrudan satış şirketidir. Üyelik iki şekilde açılır:</p>
<ul>
  <li><a href="${P}homm-bitkisel-temsilci-ol/"><b>Temsilci üyeliği</b></a>: hem alışveriş yapar hem de satış ve ekip kurma yoluyla kazanç elde edebilirsiniz.</li>
  <li><a href="${P}ayricalikli-musteri/"><b>Ayrıcalıklı Müşteri üyeliği</b></a>: yalnızca kendi alışverişinizi yaparsınız, satış zorunluluğu yoktur.</li>
</ul>
<h2>3 adımda üye olun</h2>
<ol class="adim">
  <li><b>Kayıt bağlantısını açın.</b> Resmi kayıt formunda “Tavsiye eden: ${AD}” yazdığını kontrol edin.</li>
  <li><b>Üyelik türünü seçin ve formu doldurun.</b> Telefon, e-posta ve kişisel bilgilerinizi girin.</li>
  <li><b>Telefonunuza gelen sözleşmeyi onaylayın.</b> Üyeliğiniz tanımlanır, biz de sizi arayıp ilk adımları anlatırız.</li>
</ol>
<p>Ayrıntılı anlatım için <a href="${P}homm-bitkisel-kayit/">Homm Bitkisel'e nasıl kayıt olunur</a> sayfasına bakın.</p>
${form()}
<h2>Sık sorulan sorular</h2>
${sssHtml(sss.slice(0, 5))}
<p><a href="${P}sik-sorulan-sorular/">Tüm soruları görün →</a></p>` },

{ path: 'homm-bitkisel-kayit/', title: `Homm Bitkisel Kayıt: Adım Adım Nasıl Üye Olunur? | ${AD}`,
  desc: `Homm Bitkisel yeni kayıt formu nasıl doldurulur? Ülke, tavsiye eden, iletişim ve kişisel bilgiler adım adım. Takıldığınız yerde ${AD} ücretsiz yardımcı olur.`,
  h1: 'Homm Bitkisel Kayıt: Adım Adım Nasıl Üye Olunur?',
  body: `
<p class="lead">Homm Bitkisel yeni kayıt formu tek sayfadır ve birkaç dakikada doldurulur. Aşağıda her alanı sırasıyla anlattım.</p>
${cta}
<h2>Kayıt formundaki adımlar</h2>
<ol class="adim">
  <li><b>Kayıt türünü seçin.</b> Sayfanın başında iki kutu vardır: <i>Temsilci (Kazanç + Alışveriş)</i> ve <i>Ayrıcalıklı Müşteri (Sadece alışveriş yapacağım)</i>. Size uygun olanı işaretleyin.</li>
  <li><b>Ülke ve tavsiye eden.</b> Ülkenizi seçin. “Tavsiye eden” alanında <b>${AD}</b> yazıyorsa doğru bağlantıdasınız; bu alan sizi destekleyecek sponsoru gösterir.</li>
  <li><b>İletişim bilgileri.</b> Cep telefonu numaranızı iki kez ve e-posta adresinizi yazın. Onay mesajı bu numaraya gelir, bu yüzden kendi numaranızı kullanın.</li>
  <li><b>Kişisel bilgiler.</b> Ad, soyad, şifre, kimlik numarası, doğum tarihi ve cinsiyet alanlarını doldurun. Şifrenizi not edin; temsilci girişinde kullanacaksınız.</li>
  <li><b>Sözleşme onayı.</b> Formu gönderdikten sonra telefonunuza gelen sözleşmeyi onaylayın. Onaydan sonra size özel referans kodu tanımlanır.</li>
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
  desc: `Homm Bitkisel temsilcisi olmak için gereken şartlar, başvuru adımları ve temsilcilikte sizi nelerin beklediği. ${AD} ekibinden ücretsiz başlangıç desteği.`,
  h1: 'Homm Bitkisel Temsilci Ol',
  body: `
<p class="lead">Homm Bitkisel bağımsız temsilcisi olarak ürünleri kendi çevrenize ve internet üzerinden satabilir, dilerseniz kendi ekibinizi kurabilirsiniz.</p>
${cta}
<h2>Temsilci olmak için şartlar</h2>
<ul>
  <li>18 yaşını doldurmuş olmak.</li>
  <li>Resmi kayıt formunu doldurmak ve telefonunuza gelen temsilci sözleşmesini onaylamak.</li>
  <li>Giriş ücreti veya sermaye gerekmez.</li>
</ul>
<h2>Temsilci olunca ne yaparsınız?</h2>
<ul>
  <li><b>Alışveriş:</b> Ürünleri temsilci panelinizden kendiniz sipariş edersiniz.</li>
  <li><b>Satış:</b> Ürünleri çevrenize ve şirket kurallarına uyarak internet üzerinden satabilirsiniz.</li>
  <li><b>Ekip:</b> Kendi kayıt bağlantınızla yeni üyeler kaydedip ekip kurabilirsiniz.</li>
</ul>
<h2>Dürüst olalım: kazanç garantisi yok</h2>
<p>Bu iş bir maaş değildir. Kazancınız yaptığınız satışa, ayırdığınız zamana ve ekibinize bağlıdır. Kimseye sabit gelir sözü vermiyoruz; verenlere de itibar etmeyin. Bizim sözümüz şu: başlarken yalnız kalmazsınız.</p>
<h2>${AD} ekibinde ne sunuyoruz?</h2>
<ul>
  <li>Kayıt formunda birebir yardım.</li>
  <li>Panel, sipariş ve ürün bilgisi eğitimi.</li>
  <li>Soru sorabileceğiniz bir ekip ve düzenli görüşmeler.</li>
</ul>
${form('Temsilcilik hakkında sizi arayalım')}` },

{ path: 'ayricalikli-musteri/', title: `Homm Bitkisel Ayrıcalıklı Müşteri Üyeliği Nedir? | ${AD}`,
  desc: `Satış yapmadan yalnızca alışveriş yapmak isteyenler için Homm Bitkisel Ayrıcalıklı Müşteri üyeliği: nedir, nasıl kayıt olunur, temsilcilikten farkı ne?`,
  h1: 'Homm Bitkisel Ayrıcalıklı Müşteri Üyeliği',
  body: `
<p class="lead">Satış yapmak ya da ekip kurmak istemiyor, yalnızca ürünleri kendiniz için almak mı istiyorsunuz? Kayıt formundaki <b>Ayrıcalıklı Müşteri</b> seçeneği bunun için var.</p>
${cta}
<h2>Ayrıcalıklı Müşteri kimdir?</h2>
<p>Ayrıcalıklı Müşteri, Homm Bitkisel'e yalnızca alışveriş amacıyla üye olan kişidir. Satış yapma zorunluluğu yoktur. Siparişlerinizi resmi site üzerinden kendi hesabınızla verirsiniz.</p>
<h2>Nasıl kayıt olunur?</h2>
<ol class="adim">
  <li>Kayıt bağlantısını açın.</li>
  <li>Sayfanın başında <i>Ayrıcalıklı Müşteri (Sadece alışveriş yapacağım)</i> kutusunu seçin.</li>
  <li>İletişim ve kişisel bilgilerinizi girip formu gönderin.</li>
</ol>
<h2>Temsilci mi, Ayrıcalıklı Müşteri mi?</h2>
<table>
  <tr><th></th><th>Temsilci</th><th>Ayrıcalıklı Müşteri</th></tr>
  <tr><td>Alışveriş</td><td>Evet</td><td>Evet</td></tr>
  <tr><td>Satış ve kazanç</td><td>Evet</td><td>Hayır</td></tr>
  <tr><td>Ekip kurma</td><td>Evet</td><td>Hayır</td></tr>
  <tr><td>Satış zorunluluğu</td><td>Yok</td><td>Yok</td></tr>
</table>
<p>Hangisinin size uygun olduğundan emin değilseniz numaranızı bırakın, birlikte karar verelim.</p>
${form()}` },

{ path: 'homm-bitkisel-urunleri/', title: `Homm Bitkisel Ürünleri: Kategoriler ve Sipariş | ${AD}`,
  desc: `Homm Bitkisel ürün kategorileri: cilt bakımı, saç bakımı, kişisel bakım, ev temizliği ve daha fazlası. Üye olarak nasıl sipariş verilir?`,
  h1: 'Homm Bitkisel Ürünleri',
  body: `
<p class="lead">Homm Bitkisel'in ürün yelpazesi kişisel bakımdan ev temizliğine uzanır. Güncel ürünler, içerikler ve fiyatlar için tek doğru kaynak şirketin resmi kataloğudur.</p>
<h2>Başlıca kategoriler</h2>
<div class="grid3">
  <div class="card"><h3>Cilt bakımı</h3><p>Yüz ve vücut bakım ürünleri.</p></div>
  <div class="card"><h3>Saç bakımı</h3><p>Şampuan ve saç bakım ürünleri.</p></div>
  <div class="card"><h3>Kişisel bakım</h3><p>Günlük bakım ve hijyen ürünleri.</p></div>
  <div class="card"><h3>Ev temizliği</h3><p>Konsantre temizlik ürünleri.</p></div>
  <div class="card"><h3>Anne ve bebek</h3><p>Bebekler için bakım ürünleri.</p></div>
  <div class="card"><h3>Gıda ve içecek</h3><p>Kahve ve içecek çeşitleri.</p></div>
</div>
<p><a class="btn ghost" href="https://www.hommbitkisel.com.tr/urunler/tumu" rel="nofollow noopener" target="_blank">Resmi sitede tüm ürünleri görün</a></p>
<h2>Nasıl sipariş verilir?</h2>
<p>Ürünleri almak için önce üye olursunuz. Üyeliğiniz açıldıktan sonra resmi sitedeki hesabınıza girip sepete ekleyerek sipariş verirsiniz. Hangi ürünün size uygun olduğunu sormak isterseniz bize yazın.</p>
<p class="not">Bu sayfadaki bilgiler genel tanıtım amaçlıdır; ürünler tıbbi tedavi amacı taşımaz, sağlık sorunlarınız için hekiminize danışın.</p>
${cta}
${form('Ürünler hakkında bilgi alın')}` },

{ path: 'sik-sorulan-sorular/', title: `Homm Bitkisel Üyelik Hakkında Sık Sorulan Sorular | ${AD}`,
  desc: `Homm Bitkisel üyelik ücretli mi, kimler üye olabilir, satış zorunlu mu, üyelikten nasıl çıkılır? En çok sorulan soruların kısa ve net yanıtları.`,
  h1: 'Homm Bitkisel Üyelik: Sık Sorulan Sorular',
  faq: true,
  body: `${sssHtml(sss)}${cta}${form('Sorunuz mu var? Arayalım')}` },

{ path: 'iletisim/', title: `İletişim | Homm Bitkisel Bağımsız Temsilcisi ${AD}`,
  desc: `Homm Bitkisel bağımsız temsilcisi ${AD} ile iletişim: telefon ${TEL}, WhatsApp ve geri arama formu.`,
  h1: 'İletişim',
  body: `
<p class="lead">Üyelik, kayıt ve ürünler hakkında bana doğrudan ulaşabilirsiniz.</p>
<div class="grid3">
  <div class="card"><h3>Telefon</h3><p><a href="tel:+${TEL_INT}">${TEL}</a></p></div>
  <div class="card"><h3>WhatsApp</h3><p><a href="${WA('Merhaba, Homm Bitkisel üyeliği hakkında bilgi almak istiyorum.')}" rel="nofollow noopener" target="_blank">Mesaj gönder</a></p></div>
  <div class="card"><h3>Kayıt</h3><p><a href="${KAYIT}" rel="nofollow noopener" target="_blank">Resmi kayıt formu</a></p></div>
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
<p>Numaranız, sizi arayabilmesi için ${AD} ekibindeki bir bağımsız temsilciyle paylaşılabilir. Bunun dışında üçüncü kişilere satılmaz, devredilmez.</p>
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
  if (p.path === '') ld.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: `${AD} – Homm Bitkisel Bağımsız Temsilcisi`, url: BASE, inLanguage: 'tr' },
    { '@context': 'https://schema.org', '@type': 'Person', name: AD, jobTitle: 'Homm Bitkisel Bağımsız Temsilcisi', telephone: '+' + TEL_INT, url: BASE });
  if (p.faq) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: sss.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  if (p.path && !p.noindex) ld.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Üyelik', item: BASE }, { '@type': 'ListItem', position: 2, name: p.h1, item: url }] });
  return `<!doctype html>
<html lang="tr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:locale" content="tr_TR">
<meta property="og:title" content="${p.title}"><meta property="og:description" content="${p.desc}"><meta property="og:url" content="${url}">
<meta name="theme-color" content="#1f5c3f">
<link rel="icon" href="${P}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${P}style.css">
${ld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head><body>
<div class="ust">Bu site Homm Bitkisel'in resmi sitesi değildir; <b>bağımsız temsilci ${AD}</b> tarafından hazırlanmıştır.</div>
<header><div class="ic">
  <a class="marka" href="${P}"><span class="yaprak">❦</span> ${AD}<small>Homm Bitkisel Bağımsız Temsilcisi</small></a>
  <nav>${nav.map(([h, t]) => `<a href="${P}${h}"${h === p.path ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
</div></header>
<main><div class="ic">
<h1>${p.h1}</h1>
${p.body}
</div></main>
<footer><div class="ic">
  <p><b>${AD}</b> · Homm Bitkisel Bağımsız Temsilcisi · <a href="tel:+${TEL_INT}">${TEL}</a></p>
  <p>Bu site bağımsız bir temsilci sayfasıdır. Homm Bitkisel ve Homm Life adları Homm Bitkisel Ürünler Pazarlama A.Ş.'ye aittir. Resmi site: hommbitkisel.com.tr · Müşteri hizmetleri: 444 77 97</p>
  <p><a href="${P}kvkk/">KVKK Aydınlatma Metni</a> · <a href="${P}iletisim/">İletişim</a></p>
</div></footer>
<div class="alt">
  <a class="k" href="${KAYIT}" rel="nofollow noopener" target="_blank">Kayıt Ol</a>
  <a class="w" href="${WA('Merhaba, Homm Bitkisel üyeliği hakkında bilgi almak istiyorum.')}" rel="nofollow noopener" target="_blank">WhatsApp</a>
  <a class="a" href="tel:+${TEL_INT}">Ara</a>
</div>
<script>
function gonder(f){
  var m='Merhaba, Homm Bitkisel üyeliği için aranmak istiyorum.\\nAd Soyad: '+f.ad.value.trim()+'\\nTelefon: '+f.tel.value.trim()+'\\nKonu: '+f.konu.value;
  window.open('https://wa.me/${TEL_INT}?text='+encodeURIComponent(m),'_blank');
  return false;
}
</script>
</body></html>`;
};

const css = `
:root{--y:#1f5c3f;--y2:#2f7d57;--k:#f6f3ea;--m:#1d2a22;--g:#5b6b61;--c:#fff;--s:#e3ddcd;--wa:#128c4b}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font:17px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:var(--m);background:var(--k);padding-bottom:64px}
.ic{max-width:860px;margin:0 auto;padding:0 16px}
.ust{background:#fff7d6;color:#5c4a00;font-size:13.5px;text-align:center;padding:7px 12px;border-bottom:1px solid #ecdf9d}
header{background:var(--c);border-bottom:1px solid var(--s)}
header .ic{display:flex;flex-wrap:wrap;align-items:center;gap:8px 20px;padding-top:12px;padding-bottom:10px}
.marka{font-weight:800;font-size:20px;color:var(--y);text-decoration:none;line-height:1.2}
.marka small{display:block;font-weight:500;font-size:12.5px;color:var(--g)}
.yaprak{color:var(--y2)}
nav{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:14.5px}
nav a{color:var(--m);text-decoration:none;padding:3px 0;border-bottom:2px solid transparent}
nav a:hover,nav a[aria-current]{border-color:var(--y2);color:var(--y)}
main{padding:26px 0 40px}
h1{font-size:clamp(27px,5.4vw,40px);line-height:1.15;margin:0 0 14px;color:var(--y);text-wrap:balance}
h2{font-size:23px;margin:34px 0 10px;color:var(--y)}
h3{margin:0 0 4px;font-size:17.5px;color:var(--y)}
.lead{font-size:19px}
a{color:var(--y2)}
.cta{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0 8px}
.btn{display:inline-block;padding:13px 22px;border-radius:10px;font-weight:700;text-decoration:none;border:2px solid var(--y);cursor:pointer;font-size:16.5px;font-family:inherit}
.btn.primary{background:var(--y);color:#fff}.btn.primary:hover{background:var(--y2);border-color:var(--y2)}
.btn.ghost{background:transparent;color:var(--y)}
.btn.wa{background:var(--wa);border-color:var(--wa);color:#fff;width:100%}
.not{font-size:14px;color:var(--g)}
.card{background:var(--c);border:1px solid var(--s);border-radius:14px;padding:16px 18px}
.card p{margin:0}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin:22px 0}
.adim{padding-left:22px}.adim li{margin:8px 0}
.form{margin:34px 0;border-color:var(--y2);box-shadow:0 6px 24px rgba(31,92,63,.08)}
.form h2{margin-top:0}
form{display:grid;gap:12px;margin-top:12px}
label{display:grid;gap:5px;font-weight:600;font-size:15px}
input,select{font:inherit;padding:12px;border:1px solid #c9c2ae;border-radius:9px;background:#fff;width:100%}
input:focus,select:focus{outline:2px solid var(--y2);outline-offset:1px}
.onay{grid-template-columns:22px 1fr;align-items:start;font-weight:400;font-size:13.5px;color:var(--g)}
.onay input{width:18px;height:18px;margin-top:3px;padding:0}
form small{color:var(--g);font-size:13px}
details{background:var(--c);border:1px solid var(--s);border-radius:12px;padding:12px 16px;margin:8px 0}
summary{font-weight:700;cursor:pointer}
details p{margin:8px 0 2px}
table{width:100%;border-collapse:collapse;background:var(--c);border:1px solid var(--s);border-radius:12px;overflow:hidden;font-size:15.5px}
th,td{padding:10px 12px;text-align:left;border-bottom:1px solid var(--s)}th{background:#eef3ee;color:var(--y)}
footer{background:var(--y);color:#dfeae3;font-size:14px;padding:22px 0}
footer a{color:#fff}
.alt{position:fixed;left:0;right:0;bottom:0;display:grid;grid-template-columns:1.3fr 1fr .8fr;background:#fff;border-top:1px solid var(--s);z-index:9}
.alt a{padding:15px 6px;text-align:center;font-weight:800;text-decoration:none;color:#fff;font-size:15.5px}
.alt .k{background:var(--y)}.alt .w{background:var(--wa)}.alt .a{background:#33443a}
@media(min-width:800px){.alt{display:none}body{padding-bottom:0}}
`;

if (existsSync(OUT)) rmSync(OUT, { recursive: true });
for (const p of pages) { mkdirSync(`${OUT}/${p.path}`, { recursive: true }); writeFileSync(`${OUT}/${p.path}index.html`, layout(p)); }
writeFileSync(`${OUT}/style.css`, css);
writeFileSync(`${OUT}/favicon.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1f5c3f"/><text x="32" y="44" font-size="34" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-weight="700">EA</text></svg>`);
writeFileSync(`${OUT}/.nojekyll`, '');
writeFileSync(`${OUT}/robots.txt`, INDEX ? `User-agent: *\nAllow: /\nSitemap: ${BASE}sitemap.xml\n` : `User-agent: *\nDisallow: /\n`);
const today = new Date().toISOString().slice(0, 10);
writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p => !p.noindex).map(p => `<url><loc>${BASE}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(`${OUT}/404.html`, layout({ path: '404', noindex: true, title: 'Sayfa bulunamadı', desc: '', h1: 'Sayfa bulunamadı', body: `<p><a href="${P}">Ana sayfaya dönün</a></p>` }));
console.log(`${pages.length} sayfa üretildi. Google'a açık: ${INDEX}`);
// Google Search Console sahiplik doğrulaması (silmeyin)
writeFileSync(`${OUT}/google0ab4c5d791854410.html`, 'google-site-verification: google0ab4c5d791854410.html');
