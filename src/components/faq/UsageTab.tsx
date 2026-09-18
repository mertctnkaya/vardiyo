import Alert from '../shared/Alert';

export default function UsageTab() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold text-indigo-400 mb-4 border-b border-base-300 pb-2">Vardiyo'ya Nereden Başlamalıyım?</h3>

      <p className="text-base-content/80 leading-relaxed mb-6">
        Uygulamamız her çalışma modelindeki personelin (Aylık Maaşlı veya Günlük Yevmiyeli) bordrosunu kuruşu kuruşuna takip edebilmesi için adım adım tasarlanmıştır. Aşağıdaki 5 adımı izlemeniz yeterlidir:
      </p>

      <div className="space-y-4">
        <div className="flex gap-4 items-start bg-base-200 p-4 rounded-xl border border-base-300 shadow-sm">
          <div className="w-8 h-8 shrink-0 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-lg">1</div>
          <div>
            <h4 className="font-bold text-base-content text-lg">Hesap Oluşturun (Önerilir)</h4>
            <p className="text-sm text-base-content/70 mt-1">Girdiğiniz mesailerin ve maaş bilgilerinizi cihazınız bozulsa dahi kaybetmemek için sağ üstten <strong>Kayıt Ol</strong> butonuna basarak ücretsiz hesabınızı açın. Verileriniz bulutta güvenle şifrelenir.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start bg-base-200 p-4 rounded-xl border border-base-300 shadow-sm">
          <div className="w-8 h-8 shrink-0 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-lg">2</div>
          <div>
            <h4 className="font-bold text-base-content text-lg">Çalışma Modelinizi ve Vardiyanızı Seçin (Ayarlar)</h4>
            <p className="text-sm text-base-content/70 mt-1"><strong>Ayarlar</strong> sekmesi sistemin beynidir. Maaşlı çalışıyorsanız <strong>Sabit Maaş</strong>, günlük/haftalık ücret alıyorsanız <strong>Yevmiye</strong> seçeneğini işaretleyin. Ayrıca çalıştığınız vardiya döngüsünü (Örn: 3'lü vardiya) ve döngü referans tarihinizi yine buradan ayarlamalısınız.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start bg-base-200 p-4 rounded-xl border border-base-300 shadow-sm">
          <div className="w-8 h-8 shrink-0 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-lg">3</div>
          <div>
            <h4 className="font-bold text-base-content text-lg">Net/Brüt Maaşınızı Dönüştürün (Maaşlı Çalışanlar)</h4>
            <p className="text-sm text-base-content/70 mt-1">Bordro hesaplamaları yasal olarak Brüt maaş üzerinden yapılır. Sadece "Aylık Net" veya "Saatlik Ücretinizi" biliyorsanız; <strong>Hesaplamalar</strong> menüsünden <strong>Saatlikten Bul</strong> veya <strong>Araçlar (Aylıktan)</strong> sekmelerine giderek elinizdeki tutarı yazın. Sistem Brüt maaşınızı otomatik bulup Ayarlarınıza kaydedecektir.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start bg-base-200 p-4 rounded-xl border border-base-300 shadow-sm">
          <div className="w-8 h-8 shrink-0 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-lg">4</div>
          <div>
            <h4 className="font-bold text-base-content text-lg">Takvimi Sadece "İstisnalar" İçin Kullanın</h4>
            <p className="text-sm text-base-content/70 mt-1">Sistem, geçmiş günleri varsayılan olarak <strong>çalıştınız kabul eder.</strong> Her gün takvime girip "çalıştım" demenize gerek yoktur. Sadece fazla mesai, geç kalma, yıllık izin veya özel yevmiye durumlarında <strong>Takvim</strong> üzerinden ilgili güne tıklayıp durumu seçmeniz yeterlidir.</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Alert color="amber" title="Maaşlı İpucu" icon="info" borderStyle="colored" bgStyle="colored" className="flex-1">
                Yasal sınırı aşacak devamsızlık girerseniz sistem sizi tazminat riski için takvim altında uyarır. Hatalı kaydı silmek için "Kaydı Temizle" demeniz yeterlidir.
              </Alert>
              <Alert color="indigo" title="Yevmiyeci İpucu" icon="info" borderStyle="colored" bgStyle="colored" className="flex-1">
                Pazar günleri otomatik tatil sayılır. Pazara mesaiye giderseniz veya standart yevmiyeniz değişirse "Özel Yevmiye / Mesai" diyerek farklı tutar girebilirsiniz.
              </Alert>
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-start bg-emerald-900/10 p-4 rounded-xl border border-emerald-500/30 shadow-sm">
          <div className="w-8 h-8 shrink-0 bg-emerald-600 rounded-full flex items-center justify-center font-bold text-white text-lg">5</div>
          <div>
            <h4 className="font-bold text-emerald-400 text-lg">Sonuç: Kusursuz Bordronuz Hazır</h4>
            <p className="text-sm text-base-content/70 mt-1"><strong>Hesaplamalar</strong> sekmesinde maaş modelinize göre özelleşmiş panel sizi bekler. SGK, vergi ve gece mesaisi detaylı <strong>Bordro Motoru</strong> veya haftalık/günlük kazanç raporlu <strong>Yevmiye Paneli</strong> sayesinde emeğinizin karşılığını kuruşu kuruşuna görüntüleyin.</p>
          </div>
        </div>
      </div>

      <Alert color="yellow" title="Daha Meraklıları İçin: Arka Planda Neler Dönüyor?" borderStyle="left-colored" bgStyle="colored" icon="info">
        <div className="space-y-4 text-sm text-yellow-100/80 leading-relaxed">
          <p><strong>Yevmiye ve Maaş Modellerinin Ayrımı:</strong> Sistem Yevmiye'ye ayarlandığında, SGK'ya bağlı resmi Kıdem Tazminatı, İşsizlik, Yıllık İzin Ücreti gibi yevmiyecilere uygulanmayan modülleri otomatik devre dışı bırakır. Sadece ödeme sıklığınıza (Örn: 15 Günde Bir) odaklanarak sonraki ödeme tarihinizi ve tam ay kazanç projeksiyonunu yapar.</p>
          <p><strong>Gece Saatleri ve Mola Algoritması:</strong> İş Kanununa göre 20:00 - 06:00 arası gece sayılır. Sistem sizin başlangıç ve bitiş saatlerinizi bu aralıkla çakıştırır. Geceye denk gelen süreyi dakika dakika hesaplar. 4 saati geçen gece çalışmalarında yarım saatlik yemek molasını hakedişten otomatik düşer.</p>
          <p><strong>Bordro Motoru Kümülatif Çalışır (Maaşlı):</strong> Maaşlı modda sistem her ayı yaşanmış günleri baz alarak (geleceğin parasını yatırmadan) hesaplar. SGK İşçi (%14), İşsizlik (%1) kesintilerinden sonra, yasal Vergi Matrahınızı bulur. Asgari ücret Damga ve Gelir Vergisi istisnalarını düşerek net maaşınıza ulaşır.</p>
          <p><strong>Verileriniz Nasıl Korunuyor?</strong> Bilgileriniz basit bir tarayıcı hafızasında tutulmaz. Google'ın bulut standartlarında olan Supabase sunucularında, e-posta adresinize bağlanan şifreli kimliklerle (UUID) korunur. İşlem güvenliği için Row Level Security (Satır Güvenliği) mevcuttur.</p>
        </div>
      </Alert>
    </div>
  );
}
