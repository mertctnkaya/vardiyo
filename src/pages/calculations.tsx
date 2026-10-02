import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PayrollTab from '../components/calculations/PayrollTab';
import DataVisualizerTab from '../components/calculations/DataVisualizerTab';
import AnnualLeaveTab from '../components/calculations/AnnualLeaveTab';
import SeveranceTab from '../components/calculations/SeveranceTab';
import HourlyTab from '../components/calculations/HourlyTab';
import MonthlyToolsTab from '../components/calculations/MonthlyToolsTab';
import UnemploymentTab from '../components/calculations/UnemploymentTab';
import RaiseSimulatorTab from '../components/calculations/RaiseSimulatorTab';
import ReportPayTab from '../components/calculations/ReportPayTab';
import ShortWorkTab from '../components/calculations/ShortWorkTab';
import MaternityLeaveTab from '../components/calculations/MaternityLeaveTab';
import Alert from '../components/shared/Alert';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAppStore } from '../store/useAppStore';

type TabType = 'payroll' | 'charts' | 'annual_leave' | 'tazminat' | 'hourly' | 'tools' | 'unemployment' | 'raise' | 'report' | 'short_work' | 'maternity';
type CategoryType = 'bordro' | 'izinler' | 'odenek';

/** Yevmiye modunda kullanılamayacak sekmeler */
const YEVMIYE_DISABLED_TABS: TabType[] = ['annual_leave', 'tazminat', 'hourly', 'tools', 'unemployment', 'report', 'short_work', 'maternity'];

const CATEGORIES: { id: CategoryType; label: string; icon: string }[] = [
  { id: 'bordro', label: 'Bordro & Analiz', icon: '💰' },
  { id: 'izinler', label: 'Yasal İzinler', icon: '🏖️' },
  { id: 'odenek', label: 'Ödenek & Tazminat', icon: '⚖️' },
];

const TABS_BY_CATEGORY: Record<CategoryType, { id: TabType; label: string }[]> = {
  bordro: [
    { id: 'payroll', label: 'Aylık Bordro' },
    { id: 'charts', label: 'İstatistikler' },
    { id: 'raise', label: 'Zam Simülatörü' },
    { id: 'hourly', label: 'Saatlikten Bul' },
    { id: 'tools', label: 'Maaştan Bul' }
  ],
  izinler: [
    { id: 'annual_leave', label: 'Yıllık İzin' },
    { id: 'maternity', label: 'Doğum & Süt İzni' }
  ],
  odenek: [
    { id: 'tazminat', label: 'Tazminat Hesapla' },
    { id: 'unemployment', label: 'İşsizlik' },
    { id: 'report', label: 'Rapor Parası' },
    { id: 'short_work', label: 'Kısa Çalışma' }
  ]
};

export default function Calculations() {
  usePageTitle('Maaş & Hakediş');
  const [searchParams] = useSearchParams();

  const [activeCategory, setActiveCategory] = useState<CategoryType>('bordro');
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tabFromUrl = searchParams.get('tab') as TabType;
    return tabFromUrl || 'payroll';
  });

  // URL'den gelen tab'a göre kategoriyi de otomatik seç
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as TabType;
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
      for (const [cat, tabs] of Object.entries(TABS_BY_CATEGORY)) {
        if (tabs.some(t => t.id === tabFromUrl)) {
          setActiveCategory(cat as CategoryType);
          break;
        }
      }
    }
  }, [searchParams]);

  const { settings } = useAppStore();
  const isYevmiye = settings?.work_type === 'yevmiye';

  const handleCategoryClick = (cat: CategoryType) => {
    setActiveCategory(cat);
    // Kategori değişince, o kategorinin ilk sekmesini seç (eğer yevmiye değilse veya yevmiye ise izin verilen ilk sekmeyi seç)
    const firstTab = TABS_BY_CATEGORY[cat].find(t => !(isYevmiye && YEVMIYE_DISABLED_TABS.includes(t.id)));
    if (firstTab) {
      setActiveTab(firstTab.id);
    }
  };

  const handleTabClick = (tab: TabType) => {
    if (isYevmiye && YEVMIYE_DISABLED_TABS.includes(tab)) return;
    setActiveTab(tab);
  };

  // Eğer yevmiye modundayken disabled bir sekmedeyse, payroll'a yönlendir
  if (isYevmiye && YEVMIYE_DISABLED_TABS.includes(activeTab)) {
    setActiveTab('payroll');
    setActiveCategory('bordro');
  }

  return (
    <div className="flex flex-col items-center animate-fade-in w-full pb-10" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>

      <div className="w-full max-w-5xl mb-6 px-2 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-base-content">
            {isYevmiye ? 'Yevmiye & Haklar' : 'Maaş & Yasal Haklar'}
          </h2>
          <p className="text-base-content/60 mt-1">
            {isYevmiye
              ? 'Günlük yevmiye bazlı kazanç takibi ve istatistikler.'
              : 'Türkiye standartlarında Brüt\'ten Net\'e hesaplama ve yasal haklarınız.'}
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl px-2 mb-6 print:hidden flex flex-col gap-4">
        {/* Kategori Seçici (Ana Sekmeler) */}
        <div className="flex bg-[#16191d] border border-base-300 rounded-xl overflow-hidden p-1 shadow-sm w-full md:w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex-1 md:flex-none px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-base-content/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Alt Sekmeler (Aktif Kategoriye Göre) */}
        <div className="flex flex-wrap gap-2">
          {TABS_BY_CATEGORY[activeCategory].map((tab) => {
            const isActive = activeTab === tab.id;
            const isDisabled = isYevmiye && YEVMIYE_DISABLED_TABS.includes(tab.id);

            let btnClass = 'px-4 py-2 text-sm font-medium rounded-lg transition-all border ';
            if (isDisabled) {
              btnClass += 'border-base-300 bg-[#16191d] text-base-content/20 cursor-not-allowed line-through';
            } else if (isActive) {
              btnClass += 'border-indigo-500/50 bg-indigo-900/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]';
            } else {
              btnClass += 'border-base-300 bg-[#16191d] text-base-content/60 hover:text-white hover:border-base-content/30';
            }

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={btnClass}
                disabled={isDisabled}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {isYevmiye && (
          <div className="mt-2">
            <Alert color="amber" icon="warning" borderStyle="colored" bgStyle="colored">
              Yevmiye sistemi seçili olduğunuz için SGK'ya bağlı modüller (tazminat, işsizlik, izin ücretleri vb.) devre dışıdır.
            </Alert>
          </div>
        )}
      </div>

      <div className="w-full max-w-5xl">
        {activeTab === 'payroll' && <PayrollTab />}
        {activeTab === 'charts' && <DataVisualizerTab />}
        {activeTab === 'annual_leave' && <AnnualLeaveTab />}
        {activeTab === 'tazminat' && <SeveranceTab />}
        {activeTab === 'hourly' && <HourlyTab />}
        {activeTab === 'tools' && <MonthlyToolsTab />}
        {activeTab === 'unemployment' && <UnemploymentTab />}
        {activeTab === 'raise' && <RaiseSimulatorTab />}
        {activeTab === 'report' && <ReportPayTab />}
        {activeTab === 'short_work' && <ShortWorkTab />}
        {activeTab === 'maternity' && <MaternityLeaveTab />}
      </div>
    </div>
  );
}
