import { usePageTitle } from '../hooks/usePageTitle';

export default function TermsOfService() {
  usePageTitle('Kullanım Koşulları');

  return (
    <div className="w-full max-w-4xl animate-fade-in pb-10">
      <div className="bg-[#16191d] rounded-2xl p-8 border border-base-300 shadow-xl prose prose-invert max-w-none">
        <h1 className="text-3xl font-black text-white mb-6">Kullanım Koşulları</h1>
        
        <p className="text-base-content/80">
          Son Güncellenme Tarihi: 14 Eylül 2026
        </p>

        <h3 className="text-indigo-400 mt-8">1. Kabul Edilme</h3>
        <p className="text-base-content/80">
          Vardiyo uygulamasını kullanarak bu kullanım koşullarını kabul etmiş sayılırsınız. Eğer bu koşulları kabul etmiyorsanız, uygulamayı kullanmayı bırakmalısınız.
        </p>

        <h3 className="text-indigo-400 mt-8">2. Hizmetin Kapsamı</h3>
        <p className="text-base-content/80">
          Vardiyo, Türkiye İş Kanunu (4857) standartlarına uygun olarak tasarlanmış bir vardiya hesaplama ve bordro tahmin (simülatör) uygulamasıdır. Amacımız, işçilerin kendi mesailerini, gece çalışma primlerini ve bordrolarını daha şeffaf bir şekilde takip edebilmelerini sağlamaktır.
        </p>

        <h3 className="text-indigo-400 mt-8">3. Feragatname (Sorumluluk Reddi)</h3>
        <p className="text-base-content/80">
          Uygulama içerisindeki bordro, fazla mesai, tazminat, yıllık izin, işsizlik maaşı ve benzeri her türlü parasal/rakamsal hesaplama <strong>tamamen bilgilendirme ve tahmin amaçlıdır.</strong> 
          Hesaplamalar resmi ilk vergi dilimleri ve standart yasal oranlar üzerinden yaklaşık olarak hesaplanır. Özel şirket politikaları, AGİ farklılıkları, BES ve icra kesintileri veya kümülatif vergi matrahındaki sapmalar nedeniyle gerçek maaş bordronuz ile uygulama sonuçları arasında farklar oluşabilir. 
          <br/><br/>
          Vardiyo uygulaması veya geliştiricisi, bu hesaplamaların doğurduğu hiçbir maddi, manevi veya hukuki sonuçtan sorumlu tutulamaz. Uygulama verileri resmi belge hükmünde değildir ve yasal mercilerde delil olarak kullanılamaz.
        </p>

        <h3 className="text-indigo-400 mt-8">4. Hesap Kullanımı</h3>
        <p className="text-base-content/80">
          Uygulama üzerinde açtığınız hesabın şifre güvenliğinden siz sorumlusunuz. Oturumunuz açıkken yapılan her işlem sizin tarafınızdan yapılmış sayılır. Geliştirici, zararlı gördüğü hesapları (spam, bot kullanımı vb.) önceden haber vermeksizin askıya alma hakkını saklı tutar.
        </p>

        <h3 className="text-indigo-400 mt-8">5. Değişiklikler</h3>
        <p className="text-base-content/80">
          Geliştirici, bu Kullanım Koşullarını önceden bildirim yapmaksızın güncelleme veya değiştirme hakkını saklı tutar. Güncellemeler uygulamada yayınlandığı andan itibaren geçerli sayılır.
        </p>
      </div>
    </div>
  );
}

