import { usePageTitle } from '../hooks/usePageTitle';

export default function PrivacyPolicy() {
  usePageTitle('Gizlilik Politikası');

  return (
    <div className="w-full max-w-4xl animate-fade-in pb-10">
      <div className="bg-[#16191d] rounded-2xl p-8 border border-base-300 shadow-xl prose prose-invert max-w-none">
        <h1 className="text-3xl font-black text-white mb-6">Gizlilik Politikası (KVKK Aydınlatma Metni)</h1>

        <p className="text-base-content/80">
          Son Güncellenme Tarihi: 14 Eylül 2026
        </p>

        <h3 className="text-indigo-400 mt-8">1. Toplanan Veriler</h3>
        <p className="text-base-content/80">
          Vardiyo uygulamasını (bundan sonra "Uygulama" olarak anılacaktır) kullanırken aşağıdaki verileriniz toplanabilir ve işlenebilir:
        </p>
        <ul className="text-base-content/80">
          <li><strong>Kimlik ve İletişim Verileri:</strong> Adınız, e-posta adresiniz (kayıt olmanız halinde).</li>
          <li><strong>Uygulama İçi Veriler:</strong> Vardiya başlangıç/bitiş saatleri, çalışma sisteminiz (2'li, 3'lü, sabit vb.), kaydettiğiniz mesai saatleri, izin günleri ve maaş/bordro hesaplaması için girdiğiniz brüt/net ücretler.</li>
          <li><strong>Cihaz Bilgileri:</strong> Bildirim onayları, uygulama versiyonu ve hata ayıklama (crashlytics) günlükleri.</li>
        </ul>

        <h3 className="text-indigo-400 mt-8">2. Verilerin Kullanım Amacı</h3>
        <p className="text-base-content/80">
          Toplanan veriler, tamamen size ait kişiselleştirilmiş vardiya takviminizi ve bordro hesaplamalarınızı oluşturmak amacıyla kullanılmaktadır. E-posta adresiniz sadece hesap kurtarma (şifre sıfırlama) ve gerekli güvenlik bilgilendirmeleri için kullanılır. Asla 3. taraf reklam şirketleriyle paylaşılmaz.
        </p>

        <h3 className="text-indigo-400 mt-8">3. Veri Güvenliği (Supabase)</h3>
        <p className="text-base-content/80">
          Uygulamamız veritabanı altyapısı olarak Supabase kullanmaktadır. Verileriniz Supabase sunucularında, endüstri standartlarında şifreleme ile (Row Level Security) güvence altına alınmıştır. Bu güvenlik modeli sayesinde, girdiğiniz maaş veya mesai bilgilerine diğer kullanıcıların veya yetkisiz kişilerin erişmesi teknik olarak engellenmiştir. (Sadece kendi kullanıcı ID'nize ait verileri okuyabilir ve yazabilirsiniz.)
        </p>

        <h3 className="text-indigo-400 mt-8">4. Çerezler (Cookies) ve Yerel Depolama (Local Storage)</h3>
        <p className="text-base-content/80">
          Uygulamamız, cihazınızda kullanıcı oturumunuzu açık tutmak (JWT Token) ve çerez/gizlilik onayınızı hatırlamak için yerel depolama teknolojilerini kullanır. Bunlar "zorunlu çerezler" statüsündedir ve uygulamanın temel işlevleri için gereklidir.
        </p>

        <h3 className="text-indigo-400 mt-8">5. Hesap Silme</h3>
        <p className="text-base-content/80">
          Kullanıcılar diledikleri zaman hesaplarını ve bağlı tüm verilerini (mesai kayıtları, ayarlar vb.) Ayarlar menüsünden kalıcı olarak silebilirler. Silinen veriler geri getirilemez.
        </p>

        <h3 className="text-indigo-400 mt-8">6. İletişim</h3>
        <p className="text-base-content/80">
          Vardiyo, <strong>Mertcan Çetinkaya</strong> (Mertcan Çetinkaya) tarafından geliştirilmiş ve yönetilmektedir.
          Kişisel verilerinizle ilgili her türlü soru, itiraz ve talep için uygulamanın <a href="/contact" className="text-indigo-400 underline">İletişim</a> bölümünden veya doğrudan <a href="mailto:merutou.labs@gmail.com" className="text-indigo-400 underline">merutou.labs@gmail.com</a> adresinden bizimle irtibata geçebilirsiniz.
        </p>
      </div>
    </div>
  );
}

