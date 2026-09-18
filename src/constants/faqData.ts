export const FAQ_DATA = [
    {
        category: "Uygulama Kullanımı ve Takvim",
        faqs: [
            { q: "Milat (Döngü Başlangıcı) kutucuğu nedir?", a: "Vardiya sistemleri (Örn: 2 gün çalış 1 gün yat) sürekli kendini tekrar eden bir döngüden ibarettir. Uygulamanın sizin bugün hangi vardiyada olduğunuzu bilebilmesi için, geçmişte o döngünün 1. gününe denk gelen rastgele bir tarihi 'Milat' olarak seçmeniz gerekir. Sistem tüm geleceği bu referans noktasına göre çizer." },
            { q: "Vardiya Sistemleri (2, 3, 4'lü, 12/36, 24/48) ve kullanım alanları nelerdir?", a: "Ayarlar menüsünde seçtiğiniz vardiya sistemi çalışma hayatınızı belirler. 3'lü vardiya klasik 8 saatlik fabrika düzenidir. 4'lü vardiya, fabrikaların durmadan 7/24 çalışmasını sağlayan rotasyondur. 12/36 ve 24/48 ise genellikle güvenlik, sağlık ve itfaiye personellerinin kullandığı yoğun nöbet-dinlenme sistemleridir." },
            { q: "Haftalık İzin Günleri nasıl seçilir? (Restoran, AVM vb. sektörler)", a: "Pazar günleri çalışılan AVM, restoran veya perakende sektörlerinde izin günleri genellikle hafta içidir. Ayarlardan 'Haftalık İzin Günü'nüzü Pazar yerine örneğin Salı olarak seçtiğinizde; takvim motorumuz Salı günlerini resmi hafta tatiliniz kabul eder ve olası mesai hesaplamalarını buna göre %50 zamlı işletir." },
            { q: "Ayarlara neden Net yerine Brüt Maaş girmeliyim?", a: "Türkiye'de vergi sistemi kümülatiftir (katlanarak artar). Yılın başında %15 ile başlayan vergi diliminiz, aylar geçtikçe %20 ve %27'ye yükselir. Eğer sadece Net maaş girerseniz sistem yıl sonundaki vergi kesintisini ve elinize geçecek gerçek rakamı hesaplayamaz. Brüt maaş, devletin ve SGK'nın gözündeki gerçek maaşınızdır." },
            { q: "'Saatlik ve Net Maaş Bul' aracı ne işe yarar?", a: "Eğer Brüt maaşınızı bilmiyorsanız 'Hesaplamalar' sekmesindeki araca elinize geçen net tutarı yazın. Sistem tersine mühendislik ile brütünüzü bulur. Çıkan sonucun yanındaki 'Ayarlara Kaydet' butonuna basarak bu değeri tek tuşla tüm takviminize ve bordronuza entegre edebilirsiniz." },
            { q: "Takvim Yönetimi & İzinler Tablosu nasıl kullanılır?", a: "Takvim sayfasının altındaki İzinler Tablosu; toplu yıllık izin girmek, yanlış girdiğiniz eski izin aralıklarını silmek veya askerlik/ücretsiz izin gibi durumlar için takvimi uzun süreliğine 'Duraklatmak' için kullanılan kontrol merkezidir." },
            { q: "Bordrodaki Gizli Kurtarıcı Matematikler (Hafta Sonu Atlaması) nasıl çalışır?", a: "İzinler Tablosundan örneğin 14 günlük toplu bir yıllık izin aralığı girdiğinizde, sistem aradaki haftalık izin günlerinizi (Örn: Pazar) ve varsa Resmi Tatilleri otomatik olarak atlar. Böylece yasal yıllık izin hakkınızdan boş yere gün eksilmesini ve paranızın yanmasını engeller." },
            { q: "Yıllık İzin mantığı nedir ve maaşa nasıl yansır?", a: "İş Kanununa göre yıllık izne ayrıldığınızda maaşınızdan kesinti yapılamaz. Takvimden ilgili günleri 'Yıllık İzin' olarak işaretlediğinizde, bordro motoru o günleri normal çalışmışsınız gibi tam yevmiye olarak hesaplamaya devam eder, ancak puantajınıza 'İzinli' olarak işler." },
            { q: "Ayı Dondurma ve Manuel Kayıtta Otomatik Dondurma nedir?", a: "Takvime kendi elinizle girdiğiniz özel bir kayıt (rapor, mesai) sizin gerçeğiniz olduğu için sistem tarafından anında dondurulur (🔒) ve gelecekte vardiya döngünüzü değiştirseniz dahi bozulmaz. Ancak tüm geçmişin (tatiller ve normal çalışma günleri dahil) değişime kapanmasını istiyorsanız 'Bu Ayı Dondur' butonunu kullanabilirsiniz." },
            { q: "Sistem fazla mesaiyi nasıl hesaplıyor?", a: "Mesai hesaplaması yasal olarak saatlik ücretinizin 1.5 katı (%50 zamlı) olarak yapılır. İş Kanunu'na göre haftalık 45 saati aşan çalışmalar mesai sayılır. Ayrıca resmi tatil veya hafta tatilinizde (Off-Day) çalışırsanız, sistem bu katsayıları otomatik olarak birleştirir ve katlamalı yevmiye uygular." },
            { q: "24 saat nöbet usulü çalışmada 24 saatin hepsi mesai mi olur?", a: "Hayır. Yargıtay kararlarına göre bir insan 24 saat uyanık kalamayacağı için (yemek, uyku, mola), 24 saatlik nöbetin en fazla 14 saati fiili çalışma sayılır. Sistem 24/48 gibi sistemlerde bu kuralı bilir ve haftalık 45 saati aşan kısımları ayıklayarak mesaiye dönüştürür." },
            { q: "Gece Zammı nedir?", a: "Gece çalışması (20:00 - 06:00 arası), gündüz çalışmasına göre fiziksel olarak daha yıpratıcı olduğu için bazı işyerlerinde (Örn: Güvenlik, Fabrika) gece saatlerine ekstra prim ödenir. Ayarlardan 'Gece Zammı' oranını girerseniz, sistem gece vardiyalarına denk gelen günlerde maaşınıza bu primi otomatik ekler." },
            { q: "Kısa/Yarım Çalışma, İşsizlik ve Doğum (Süt) İzni araçları nedir?", a: "Hesaplamalar sekmesindeki bu modüller, İŞKUR veya SGK tarafından işçilere ödenen yasal hakların simülasyonlarıdır. Kendi isteğiniz dışında işten ayrıldığınızda alacağınız maaşı veya yeni doğum yapmış bir annenin alacağı yasal süt ve rapor parasını net olarak hesaplar." },
            { q: "Kıdem ve İhbar Tazminatı hesaplayıcısı nasıl kullanılır?", a: "İşten haksız yere çıkarıldığınızda veya haklı nedenle istifa ettiğinizde (Örn: Maaşın ödenmemesi, Askerlik) alacağınız toplu parayı gösterir. Çalıştığınız süreyi, brüt maaşınızı ve varsa yol/yemek gibi ek menfaatleri girerek devletin keseceği Damga Vergisi düşülmüş net tutarı alabilirsiniz." },
            { q: "Bildirimler Sistemi ne işe yarar?", a: "Vardiyo, yaklaşan vardiyalarınızı (örn: Bu gece 00:00 vardiyanız var) veya önemli yasal sınırları size hatırlatmak için cihazınıza lokal bildirim gönderir. Bu sistem vardiyanızı kaçırmamanız veya peş peşe devamsızlık gibi riskli durumlarda (Risk Radarı) sizi korumak için tasarlanmıştır." },
            { q: "Dışa Aktarmada CSV, JSON ve PDF nedir, nerelerde kullanılır?", a: "PDF, vardiya ve bordro dökümünüzü telefonunuzda kolayca okumak veya İK/Muhasebe departmanına çıktı alıp vermek içindir. CSV, verilerinizi Excel'de açıp kendi matematiksel formüllerinizi kurmanız içindir. JSON ise verilerini başka bir sisteme/yazılıma göç ettirmek isteyen ileri düzey kullanıcılar içindir." }
        ]
    },
    {
        category: "Maaş, Vergi ve Mesailer",
        faqs: [
            { q: "Vergi dilimi nedir? Yıl sonuna doğru maaşım neden düşer?", a: "Kümülatif Gelir Vergisi matrahınız arttıkça yıl içinde %15 ile başlayan vergi diliminiz %20 ve %27'ye çıkar. Bu nedenle brüt maaşınız sabit kalsa bile (özellikle ikramiye alınan aylardan sonra) vergi kesintiniz artacağı için elinize geçen net maaş azalır." },
            { q: "Fazla çalışma ücretine hangi hallerde hak kazanılmaktadır?", a: "Haftalık yasal çalışma süresi olan 45 saati aşan her çalışma 'Fazla Mesai' sayılır ve saatlik ücretiniz %50 zamlı (1.5 katı) olarak ödenmek zorundadır." },
            { q: "12/36, 12/24 veya 24/48 sistemlerinde mesai nasıl hesaplanır?", a: "Yargıtay kararlarına göre bir işçi günde (molalar düşüldükten sonra) en fazla 11 saat çalıştırılabilir. 24 saatlik nöbetlerde işçi fiilen 14 saat çalışmış sayılır ve haftalık 45 saati aşan kısımlar fazla mesai olarak ödenmek zorundadır." },
            { q: "4'lü Vardiya Sistemi (4-Shift) nedir?", a: "3 vardiyalı (8 saatlik) sistemin hiç durmadan (7/24) çalışmasını sağlayan, 4 farklı ekibin rotasyona girdiği sistemdir. Genellikle 6 gün çalışma 2 gün tatil şeklinde uygulanır." },
            { q: "Hafta tatilimi (izin günümü) pazar dışında bir gün yapabilir miyim?", a: "Evet. İş Kanununa göre hafta tatili kesintisiz en az 24 saat olmalıdır, ancak Pazar günü olmak zorunda değildir. İş sözleşmenize göre haftanın herhangi bir günü (veya birden fazla gün) izin kullandırılabilir." },
            { q: "Hafta tatili (Pazar veya kendi izin günüm) mesaisi nasıl hesaplanır?", a: "Hafta tatilinde çalışılması yasaktır ancak çalışılırsa, o günün yevmiyesine ek olarak %50 zamlı (1.5 yevmiye) ödenmesi gerektiği Yargıtay kararlarıyla sabittir. Toplamda o gün için 2.5 yevmiye ödenmelidir." },
            { q: "Tatil günlerinde çalışan bir işçinin ücreti nasıl hesaplanır?", a: "Ulusal bayram ve resmi tatillerde (Örn: 23 Nisan, Bayramlar) çalışırsanız, o günün yevmiyesine ek olarak +1 yevmiye daha alırsınız. Yani toplamda o gün için çift yevmiye ödenir." },
            { q: "Maaşımın bir kısmı bankadan, bir kısmı elden veriliyor. Yasal mı?", a: "KESİNLİKLE HAYIR. Bu durum SGK primlerinizin ve ileride alacağınız emekli maaşının/tazminatın düşük yatması anlamına gelir. İşçi bu durumu ispatlarsa, sözleşmeyi haklı nedenle feshedip kıdem tazminatını alarak derhal işten ayrılabilir." },
            { q: "Ücretler hangi aralıklarla ve hangi oranlarda artırılmalıdır?", a: "İş Kanununda 'Her yıl zam yapılır' diye zorunlu bir oran yoktur (Asgari ücretin altında kalmamak şartıyla). Ancak iş veya toplu iş sözleşmenizde 'Enflasyon oranında artırılır' maddesi varsa işveren buna kesinlikle uymak zorundadır." },
            { q: "Çalışanlara yol ve yemek parası verilmesi gerekli midir?", a: "Hayır. Yasada işverenin yol/yemek parası verme zorunluluğu yoktur. Ancak sözleşmede belirtilmişse veya fabrikada bu imkanlar uzun süredir sağlanıyorsa bu 'Kazanılmış Hak' (İşyeri Uygulaması) olur ve sonradan tek taraflı kesilemez." },
            { q: "İşçilere ücret kesme cezası verilmesinin koşulları nelerdir?", a: "İşveren kafasına göre maaşınızdan ceza kesemez. Ücret kesme cezasının sebepleri toplu iş sözleşmesinde veya iç yönetmelikte açıkça belirtilmeli ve kesilen para 1 ay içinde Çalışma Bakanlığı hesabına yatırılmalıdır. (Bir ayda 2 yevmiyeden fazla ceza kesilemez)." },
        ]
    },
    {
        category: "İstifa, Çıkış ve Tazminat",
        faqs: [
            { q: "Kıdem tazminatının ödenmesi için gereken koşullar nelerdir?", a: "Aynı işyerinde en az 1 tam yıl çalışmış olmanız gerekir. Haksız yere çıkarılmanız, askerlik, emeklilik, sağlık sebepleri veya kadınlar için evlilik nedeniyle ayrılma durumlarında kıdem tazminatı ödenir." },
            { q: "15 Yıl 3600 Gün şartıyla kıdem tazminatı nasıl alınır?", a: "08.09.1999 tarihinden önce sigorta girişi olanlar 15 yıl 3600 gün; bu tarihten sonra girenler ise 25 yıl 4500 gün şartını sağladıklarında SGK'dan alacakları 'Kıdem tazminatı alabilir' yazısı ile kendi istekleriyle işten ayrılarak (istifa ederek) tazminatlarını tam alabilirler." },
            { q: "İşten kendi isteğiyle ayrılan işçi ihbar tazminatı alabilir mi?", a: "Kendi isteğiyle (istifa) ayrılan işçi İhbar Tazminatı ALAMAZ. İhbar süresine uymadan (örneğin 4 haftalık bildirim süresini beklemeden) aniden işi bırakırsa, işverene kendisi ihbar tazminatı ödemek zorunda kalabilir." },
            { q: "İşyerinde Mobbing (Psikolojik Baskı) görüyorum, ne yapmalıyım?", a: "İşveren veya yöneticiler tarafından sistematik olarak dışlanma, hakaret veya psikolojik baskıya (mobbing) maruz kalıyorsanız, bu durumu ispatlayarak (yazışmalar, şahitler) sözleşmenizi haklı nedenle feshedebilir ve kıdem tazminatınızı alabilirsiniz." },
            { q: "İhbar sürem (çıkış bekleme süresi) içindeyken yeni iş arayabilir miyim?", a: "Evet. İhbar süreniz boyunca işveren size günde en az 2 saat 'Yeni İş Arama İzni' vermek zorundadır. İsterseniz bu saatleri toplu olarak birleştirip, işten daha erken ayrılmak için peşin kullanabilirsiniz." },
            { q: "Evlilik nedeniyle istifa eden kadın işçi kıdem tazminatı alabilir mi?", a: "Evet. Kadın işçi, resmi nikah tarihinden itibaren 1 yıl içinde iş sözleşmesini evlilik gerekçesiyle feshederse kıdem tazminatını alarak işten ayrılabilir." },
            { q: "İşyerinin taşınması veya şartların ağırlaşması tazminat hakkı verir mi?", a: "Evet. İşveren çalışma şartlarınızda 'esaslı bir değişiklik' yaparsa (Örn: Fabrikayı uzak bir ilçeye taşıması, maaşınızı/yan haklarınızı düşürmesi, sabit vardiyanızı rotasyona çevirmesi) bunu size yazılı bildirmelidir. Kabul etmezseniz tazminatınızı alarak çıkabilirsiniz." },
            { q: "Tazminat ve işçilik alacaklarında zaman aşımı ne kadardır?", a: "Kıdem tazminatı, ihbar tazminatı, yıllık izin ücreti ve ödenmeyen fazla mesai gibi tüm işçilik alacaklarında zaman aşımı süresi işten çıkış tarihinden itibaren 5 yıldır." }
        ]
    },
    {
        category: "İzin, Rapor ve Sağlık",
        faqs: [
            { q: "Kullanmadığım yıllık izinlerin parasını çalışırken alabilir miyim?", a: "Hayır. Yıllık izin anayasal bir dinlenme hakkıdır ve çalışırken işçiye 'İzin yapma, parasını verelim' denilemez. Ancak işten ayrıldığınızda (istifa etseniz dahi) içeride kalan tüm izinlerinizin parası son brüt maaşınız üzerinden size ödenmek zorundadır." },
            { q: "Yıllık iznimin içine resmi tatil veya pazar günü denk gelirse ne olur?", a: "Yıllık izin günleri hesaplanırken, izne denk gelen Ulusal Bayram, Genel Tatil ve Hafta Tatili (Pazar) günleri izin süresinden SAYILMAZ. İzniniz bu tatil günleri kadar uzatılmak zorundadır." },
            { q: "Yıllık iznimi bölerek kullanabilir miyim?", a: "Evet. Yıllık izin tarafların anlaşması ile bir bölümü 10 günden aşağı olmamak üzere istenildiği kadar bölünebilir." },
            { q: "Çalışanın raporlu olduğu günlerde işveren ücret öder mi?", a: "Hayır, işveren raporlu günlerin parasını ödemek zorunda değildir (Maktu aylıklı sözleşmeler hariç). 3 gün ve üzeri raporlarda paranızı PTT veya Banka üzerinden SGK'dan alırsınız. İlk 2 günün parasını kimse ödemez." },
            { q: "Kadın işçilerin süt izni ne kadardır?", a: "Kadın işçilere 1 yaşından küçük çocuklarını emzirmeleri için günde toplam 1.5 saat süt izni verilir. Bu sürenin hangi saatlerde kullanılacağını işçi kendi belirler ve bu süre çalışılmış sayılır." },
            { q: "Eşi doğum yapan işçiye kaç gün izin verilir?", a: "Eşi doğum yapan erkek işçiye 5 gün ücretli babalık izni verilir." },
            { q: "Birinci derece akraba vefatında kaç gün izin hakkı vardır?", a: "İşçinin annesi, babası, eşi, kardeşi veya çocuğunun vefatı halinde işçiye 3 gün ücretli mazeret izni verilir." }
        ]
    },
    {
        category: "SGK ve Emeklilik Hakları",
        faqs: [
            { q: "Ne zaman emekli olacağımı nasıl öğrenebilirim?", a: "E-Devlet sistemine giriş yaparak 'Çalışma Hayatım' veya 'Ne Zaman Emekli Olurum' uygulaması üzerinden toplam prim gün sayınızı, sigortalılık sürenizi ve kalan yaş şartınızı anlık olarak takip edebilirsiniz." },
            { q: "EYT (Emeklilikte Yaşa Takılanlar) kimleri kapsar?", a: "08.09.1999 ve öncesinde ilk kez sigortalı olarak çalışmaya başlayanlar, kanundaki prim günü ve sigortalılık süresi şartlarını doldurduklarında herhangi bir yaş şartı aranmaksızın EYT kapsamında emekli olabilmektedir." },
            { q: "İşsizlik sigortasından yararlanma şartları nelerdir?", a: "1) Kendi isteğinizle ayrılmamış olmak. 2) İşten çıkmadan önceki son 120 gün hizmet akdine tabi çalışmak. 3) Son 3 yıl içinde en az 600 gün işsizlik primi ödenmiş olmak." },
            { q: "İşsizlik ödeneği ne kadar süre ile ödenmektedir?", a: "Son 3 yılda; 600 gün primi olanlara 6 ay, 900 gün primi olanlara 8 ay, 1080 gün primi olanlara 10 ay boyunca işsizlik maaşı ödenir." },
            { q: "İşsizlik ödeneği alırken sağlık hizmetlerinden yararlanabilir miyim?", a: "Evet. İşsizlik ödeneği aldığınız aylar boyunca Genel Sağlık Sigortası (GSS) priminiz İŞKUR tarafından ödenir. Ailenizle birlikte devlet hastanelerinden ücretsiz faydalanabilirsiniz." },
            { q: "İşverenin iflas etmesi durumunda içeride kalan maaşım ne olur?", a: "İşverenin iflası veya konkordato ilan etmesi durumunda, işçilerin içeride kalan son 3 aylık net maaşları İŞKUR bünyesindeki 'Ücret Garanti Fonu' tarafından ödenir." }
        ]
    },
    {
        category: "Sendikalar ve Toplu İş Sözleşmesi (TİS)",
        faqs: [
            { q: "Toplu İş Sözleşmesi (TİS) nedir?", a: "Sendika ile işveren (veya MESS gibi işveren sendikaları) arasında yapılan; işçilerin maaş zam oranlarını, ikramiyelerini (örn: yılda 4 maaş ikramiye), erzak, yakacak ve tatil yardımlarını yasal asgari sınırların çok daha üzerine çıkaran bağlayıcı, güçlü bir sözleşmedir." },
            { q: "Sendikalı olmam işten atılmama sebep olur mu?", a: "Sendikaya üye olmak anayasal bir haktır. İşveren sırf sendikaya üye olduğunuz (veya üye olmaya çalıştığınız) için sizi işten çıkarırsa, normal tazminatlara ek olarak en az 1 yıllık brüt maaşınız tutarında 'Sendikal Tazminat' ödemek zorunda kalır." },
            { q: "Grev hakkı nedir ve ne zaman kullanılır?", a: "Toplu iş sözleşmesi görüşmelerinde anlaşma sağlanamazsa sendika 'Grev' kararı alabilir. Grev süresince iş sözleşmeniz askıda kalır (maaş işlemez) ancak işveren bu sürede sizi işten çıkaramaz ve kesinlikle yerinize yeni işçi alamaz." },
            { q: "İşyeri sendika temsilcisi kimdir, güvencesi var mıdır?", a: "Fabrikadaki işçiler ile yönetim/sendika arasındaki iletişimi sağlayan seçilmiş işçilerdir. Temsilcilerin çok güçlü yasal güvenceleri vardır; işveren haklı ve çok geçerli bir sebep olmadan (sırf sendikal faaliyetleri yüzünden) temsilciyi işten çıkaramaz, görev yerini değiştiremez." },
            { q: "Sendika üyelik aidatı nasıl belirlenir ve kim öder?", a: "Aidat tutarı sendikanın tüzüğünde yazar (Genellikle aylık 1 günlük brüt yevmiyeniz kadardır). Üye olduktan sonra işveren bu tutarı her ay maaşınızdan keserek sendika hesabına yasal olarak aktarır." },
            { q: "E-Devlet üzerinden sendikadan istifa edersem ne olur?", a: "İstifa ettiğiniz an sendikanın sağladığı TİS haklarından (İkramiyeler, zam oranları vs.) yararlanmanız sona erer. Ancak 'Dayanışma Aidatı' ödeyerek sendikaya üye olmadan da bu haklardan faydalanmaya devam edebilirsiniz." },
            { q: "İşçi sendikasına nasıl üye olunur?", a: "Günümüzde sendika üyelikleri e-Devlet kapısı üzerinden 'İşçi Sendikaları Üyelik İşlemleri' menüsünden noter şartı aranmaksızın saniyeler içinde tamamen dijital olarak yapılmaktadır." }
        ]
    },
    {
        category: "Yevmiyeci Çalışan Hakları (Taşeron vb.)",
        faqs: [
            { q: "Yevmiyeli çalışıyorum, resmi tatillerde çalışırsam ek ücret alır mıyım?", a: "Yevmiyeli çalışsanız dahi Ulusal Bayram ve Genel Tatillerde (1 Mayıs, Dini Bayramlar vb.) çalıştığınız takdirde normal yevmiyenize ek olarak bir günlük yevmiye daha almanız yasal bir haktır." },
            { q: "Yevmiyeli çalışanda Kıdem ve İhbar Tazminatı olur mu?", a: "Genelde yevmiyeli çalışanlar 'belirli süreli' veya 'çağrı üzerine' çalışsa da, aynı işverene bağlı 1 yılı dolduran ve sürekli çağrılan taşeron/yevmiyeli işçiler Yargıtay kararlarına göre 'Belirsiz Süreli' kabul edilip kıdem tazminatına hak kazanabilmektedir. Ancak SGK çıkışınızın her ay yapılıp yapılmadığı önemlidir." },
            { q: "Pazar günü (Hafta Tatili) çalışmazsam yevmiye alır mıyım?", a: "Eğer haftanın 6 günü tam çalışmışsanız, İş Kanununa göre Pazar günü çalışmasanız dahi o günün ücretini (1 yevmiye) yasal olarak alma hakkınız vardır. Ancak fiiliyatta çoğu taşeron firma çalışılmayan günler için ödeme yapmamaktadır. İşçi bu ödenmeyen pazar yevmiyelerini sonradan dava yoluyla talep edebilir." },
            { q: "Günlük sigortam yapılıyor mu nasıl takip edebilirim?", a: "E-Devlet üzerinden 'SGK Hizmet Dökümü' sorgulaması yaparak ay içinde adınıza kaç gün prim yattığını kontrol edebilirsiniz. Çalıştığınız her gün için 1 günlük prim yatırılması yasal zorunluluktur." }
        ]
    }
];

export const THEMES = [
    { text: 'text-indigo-400', bgBorder: 'bg-indigo-900/10 border-indigo-500/30', iconBg: 'bg-indigo-500/10', borderHover: 'hover:border-indigo-500/50' },
    { text: 'text-amber-400', bgBorder: 'bg-amber-900/10 border-amber-500/30', iconBg: 'bg-amber-500/10', borderHover: 'hover:border-amber-500/50' },
    { text: 'text-red-400', bgBorder: 'bg-red-900/10 border-red-500/30', iconBg: 'bg-red-500/10', borderHover: 'hover:border-red-500/50' },
    { text: 'text-emerald-400', bgBorder: 'bg-emerald-900/10 border-emerald-500/30', iconBg: 'bg-emerald-500/10', borderHover: 'hover:border-emerald-500/50' },
    { text: 'text-purple-400', bgBorder: 'bg-purple-900/10 border-purple-500/30', iconBg: 'bg-purple-500/10', borderHover: 'hover:border-purple-500/50' }
];

export const TERMINATION_CODES = [
  { code: '3', reason: 'İstifa (kendi isteğiyle)', severance: false, unemployment: false, notice: false },
  { code: '3', reason: 'Şahsi/Ailevi nedenler, tayin', severance: false, unemployment: false, notice: false },
  { code: '4', reason: 'Haksız işten çıkarılan', severance: true, unemployment: true, notice: true },
  { code: '25', reason: 'Görülen lüzum üzerine çıkan', severance: true, unemployment: true, notice: false },
  { code: '25', reason: 'Haklı Ayrılan (mobbing v.s.)', severance: true, unemployment: true, notice: false },
  { code: '12', reason: 'Askerlik nedeniyle (erkekler)', severance: true, unemployment: true, notice: false },
  { code: '13', reason: 'Evlilik nedeniyle (kadınlar)', severance: true, unemployment: false, notice: false },
  { code: '14', reason: '08.09.1999 öncesi (15 yıl / 3600 prim)', severance: true, unemployment: false, notice: false },
  { code: '14', reason: '09.09.1999 - 30.04.2008 (25 yıl / 4500 prim)', severance: true, unemployment: false, notice: false },
  { code: '14', reason: '01.05.2008 sonrası (4600 - 5400 prim)', severance: true, unemployment: false, notice: false },
  { code: '16', reason: 'Başka bir işyerine nakil', severance: false, unemployment: false, notice: false },
  { code: '17', reason: 'İşyeri kapandığı için', severance: true, unemployment: true, notice: true },
  { code: '18', reason: 'Sağlık nedenlerinden dolayı', severance: true, unemployment: true, notice: false },
];
