import { useState } from 'react';
import { useCVStore } from '../store/useCVStore';
import StepPersonal from '../components/cv-builder/StepPersonal';
import StepJobTitle from '../components/cv-builder/StepJobTitle';
import StepExperience from '../components/cv-builder/StepExperience';
import StepSkills from '../components/cv-builder/StepSkills';
import StepFinalize from '../components/cv-builder/StepFinalize';
import CVPreview from '../components/cv-builder/CVPreview';
import Alert from '../components/shared/Alert';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const steps = [
  { id: 1, title: 'Kişisel' },
  { id: 2, title: 'Meslek' },
  { id: 3, title: 'Eğitim & Deneyim' },
  { id: 4, title: 'Yetenekler' },
  { id: 5, title: 'Ek Bilgiler' },
  { id: 6, title: 'PDF' }
];

export default function CVBuilderPage() {
  const { currentStep } = useCVStore();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepPersonal />;
      case 2:
        return <StepJobTitle />;
      case 3:
        return <StepExperience />;
      case 4:
        return <StepSkills />;
      case 5:
        return <StepFinalize />;
      case 6:
        return <CVPreview />;
      default:
        return <StepPersonal />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in pb-10">
      <div className="w-full max-w-4xl px-2">
        <div className="mb-4 mt-4">
          <h1 className="text-3xl font-bold text-white mb-2">Akıllı CV Oluşturucu</h1>
          <p className="text-base-content/70">Mavi yaka ve saha personeline özel ATS uyumlu özgeçmiş hazırlayın.</p>
        </div>

        {/* Freemium Uyarı Mesajı */}
        <div className="mb-8">
          <Alert color="amber" title="Premium Özellik (Tek Seferlik Hediye)" icon="premium">
            <span className="text-sm">
              Bu araç Vardiyo PRO kullanıcılarına özel, Türkiye'nin en detaylı ATS uyumlu mavi yaka CV oluşturucusudur.
              <strong> 1 kereye mahsus </strong> CV'nizi son adıma kadar ücretsiz oluşturup indirebilirsiniz ve hesabınıza kaydedilir.
              Daha sonra CV'nizi güncellemek (yeni iş/yetenek eklemek) veya sıfırdan başka bir CV oluşturmak isterseniz Premium üyeliğe ihtiyacınız olacaktır.
            </span>
          </Alert>
        </div>

        {/* İlerleme Çubuğu (Stepper) */}
        <div className="mb-6">
          <ul className="steps steps-horizontal w-full">
            {steps.map((step) => (
              <li
                key={step.id}
                className={`step ${currentStep >= step.id ? 'step-primary text-white' : 'text-base-content/40'}`}
              >
                <span className="hidden sm:inline text-sm">{step.title}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ATS UYARI ALANI (COLLAPSIBLE) */}
        <div className="mb-6 rounded-xl border border-red-500/50 bg-red-900/20 overflow-hidden transition-all duration-300">
          <button
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            className="w-full flex items-center justify-between p-4 hover:bg-red-900/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <span className="font-bold text-red-400 text-left">
                DİKKAT: ATS'den (Yapay Zeka) %90+ Puanla Geçmek İstiyorsanız Burayı Kesinlikle Okuyun!
              </span>
            </div>
            {isGuideOpen ? <ChevronUp className="w-5 h-5 text-red-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-red-400 shrink-0" />}
          </button>

          {isGuideOpen && (
            <div className="p-4 pt-0 text-sm text-red-200/80 border-t border-red-500/20 mt-2 space-y-4 animate-fade-in">
              <p>
                <strong>Vardiyo CV Motoru</strong> olarak, İK robotlarının (ATS) CV'nizi doğru okuyabilmesi için gereken
                görünmez tüm teknik altyapıyı biz mükemmel hazırlıyoruz.
                <strong> Ancak, botun size vereceği "Kalite Puanını" tamamen sizin yazdığınız kelimeler belirler!</strong>
              </p>

              <ul className="list-disc list-inside space-y-2 ml-1 text-xs sm:text-sm">
                <li>
                  <strong className="text-red-300">Kısaltmalara Dikkat Edin:</strong> Kendi eklediğiniz eğitimleri veya kurumları yazarken (Örn: YETGİM, İSMEK)
                  botların kafasını karıştırmamak için parantez içinde açıkça ne olduğunu belirtin.
                  (Örn: <em>CNC Adaptasyon Eğitimi - Yetkinlik Geliştirme Merkezi</em>)
                </li>
                <li>
                  <strong className="text-red-300">En Kritik Yer İŞ ÖZETİ'dir:</strong> "Pres hattında çalıştım" deyip geçmeyin.
                  Mutlaka kullandığınız makine markasını (Fanuc, Siemens vs.), vardiya sisteminizi ve somut görevlerinizi (Kumpas ölçümü vb.) detaylıca anlatın. Botlar kelimeleri sayar!
                </li>
                <li>
                  <strong className="text-red-300">Tarihlerde Boşluk Bırakmayın:</strong> Başlangıç ve bitiş yıllarını mutlaka doldurun.
                  ATS robotları bu tarihlere bakıp "Acaba bu kişi kaç yıl tecrübeli?" matematiğini yapar.
                </li>
                <li>
                  <strong className="text-red-300">Yazım Kuralları:</strong> Kelimeleri tamamen küçük harfle veya yapışık yazmayın.
                  İK robotları Türkçe sözlük filtresi kullanır.
                </li>
              </ul>

              <div className="p-3 bg-black/40 rounded-lg border border-red-500/30">
                <span className="font-bold text-amber-400">NOT: </span>
                Eğer "Kurumsal" PDF değil, doğrudan fabrikaya veya ustaya elden vereceğiniz <strong>"Atölye" formatını</strong> oluşturacaksanız
                bu robot kurallarına sıkı sıkıya uymak zorunda değilsiniz. Çünkü Atölye formatını sadece insan gözü okuyacak.
                <strong className="text-white"> (Yine de daha profesyonel bir intiba için uymanız ŞİDDETLE ÖNERİLİR!)</strong>
              </div>
            </div>
          )}
        </div>

        {/* Adım İçeriği */}
        <div className="bg-[#16191d] rounded-2xl border border-white/5 shadow-2xl p-6 min-h-[400px]">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
