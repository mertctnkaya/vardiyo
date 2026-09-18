import { useState } from 'react';
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

/** Yevmiye modunda kullanılamayacak sekmeler */
const YEVMIYE_DISABLED_TABS: TabType[] = ['annual_leave', 'tazminat', 'hourly', 'tools', 'unemployment', 'report', 'short_work', 'maternity'];

export default function Calculations() {
  usePageTitle('Hesaplamalar & İşlemler');
  const [activeTab, setActiveTab] = useState<TabType>('payroll');
  const { settings } = useAppStore();
  const isYevmiye = settings?.work_type === 'yevmiye';

  const handleTabClick = (tab: TabType) => {
    if (isYevmiye && YEVMIYE_DISABLED_TABS.includes(tab)) return;
    setActiveTab(tab);
  };

  const getTabClass = (tab: TabType) => {
    const isActive = activeTab === tab;
    const isDisabled = isYevmiye && YEVMIYE_DISABLED_TABS.includes(tab);

    if (isDisabled) {
      return 'tab tab-lg rounded-lg transition-all text-base-content/20 cursor-not-allowed line-through';
    }
    if (isActive) {
      return 'tab tab-lg rounded-lg transition-all bg-indigo-600 text-white font-bold shadow-md';
    }
    return 'tab tab-lg rounded-lg transition-all text-base-content/60 hover:text-white hover:bg-white/5';
  };

  // Eğer yevmiye modundayken disabled bir sekmedeyse, payroll'a yönlendir
  if (isYevmiye && YEVMIYE_DISABLED_TABS.includes(activeTab)) {
    setActiveTab('payroll');
  }

  return (
    <div className="flex flex-col items-center animate-fade-in w-full pb-10" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>

      <div className="w-full max-w-5xl mb-6 px-2 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-base-content">
            {isYevmiye ? 'Yevmiye Bordro Paneli' : 'Gerçek Bordro Motoru'}
          </h2>
          <p className="text-base-content/60 mt-1">
            {isYevmiye
              ? 'Günlük yevmiye bazlı kazanç takibi ve istatistikler.'
              : 'Türkiye standartlarında Brüt\'ten Net\'e kuruşu kuruşuna hesaplama.'}
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl px-2 mb-6 print:hidden">
        <div className="tabs tabs-boxed bg-[#16191d] p-1 border border-base-300 flex-wrap justify-center sm:justify-start gap-1">
          <a className={getTabClass('payroll')} onClick={() => handleTabClick('payroll')}>Aylık Bordro</a>
          <a className={getTabClass('charts')} onClick={() => handleTabClick('charts')}>Grafikler</a>
          <a className={getTabClass('annual_leave')} onClick={() => handleTabClick('annual_leave')}>Yıllık İzin</a>
          <a className={getTabClass('tazminat')} onClick={() => handleTabClick('tazminat')}>Tazminat Hesapla</a>
          <a className={getTabClass('hourly')} onClick={() => handleTabClick('hourly')}>Saatlikten Bul</a>
          <a className={getTabClass('tools')} onClick={() => handleTabClick('tools')}>Maaştan Bul</a>
          <a className={getTabClass('unemployment')} onClick={() => handleTabClick('unemployment')}>İşsizlik</a>
          <a className={getTabClass('raise')} onClick={() => handleTabClick('raise')}>Zam Simülatörü</a>
          <a className={getTabClass('report')} onClick={() => handleTabClick('report')}>Rapor Parası</a>
          <a className={getTabClass('short_work')} onClick={() => handleTabClick('short_work')}>Kısa/Yarım Çalışma</a>
          <a className={getTabClass('maternity')} onClick={() => handleTabClick('maternity')}>Doğum & Süt İzni</a>
        </div>

        {isYevmiye && (
          <div className="mt-3">
            <Alert color="amber" icon="warning" borderStyle="colored" bgStyle="colored">
              Yevmiye sistemi seçili olduğunuz için brüt/net maaş hesaplamaları, tazminat, işsizlik maaşı ve izin ücretleri gibi SGK'ya bağlı modüller devre dışıdır. Bu hesaplamalar yalnızca resmi maaşlı çalışanlar için geçerlidir.
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
