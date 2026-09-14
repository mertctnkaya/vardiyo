import Alert from '../shared/Alert';

const codes = [
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

export default function TerminationCodesTab() {
  const getBadge = (status: boolean) => {
    return status
      ? <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ALIR</span>
      : <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">ALAMAZ</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-base-300 pb-2">
        <h3 className="text-xl font-bold text-indigo-400">İşten Ayrılma Kodları ve Tazminat Hakları</h3>
      </div>

      <div className="bg-gradient-to-br from-indigo-900/30 to-[#16191d] border border-indigo-500/20 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Glow efekti */}
        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 overflow-x-auto p-4 sm:p-6">
          <table className="table w-full text-sm sm:text-base">
            <thead className="text-indigo-200/70 font-medium border-b border-indigo-500/30">
              <tr>
                <th className="w-20 text-center pb-4">Kod</th>
                <th className="pb-4">Ayrılma Sebebi</th>
                <th className="text-center pb-4">Kıdem</th>
                <th className="text-center pb-4">İşsizlik</th>
                <th className="text-center pb-4">İhbar</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((item, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <td className="text-center py-4">
                    <span className="inline-block px-3 py-1.5 bg-indigo-950/50 text-indigo-200 rounded-lg font-mono text-sm font-bold border border-indigo-500/30 shadow-inner">
                      {item.code}
                    </span>
                  </td>
                  <td className="font-medium text-base-content/80 whitespace-nowrap py-4">{item.reason}</td>
                  <td className="text-center py-4">{getBadge(item.severance)}</td>
                  <td className="text-center py-4">{getBadge(item.unemployment)}</td>
                  <td className="text-center py-4">{getBadge(item.notice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Alert color="indigo" title="SGK Çıkış Kodları Nedir?" icon="info">
        SGK İşten Çıkış Kodları, iş sözleşmesinin hangi gerekçeyle sona erdiğini resmi kurumlara bildirmek için kullanılır. Bu kodlar; kıdem tazminatı, ihbar tazminatı ve işsizlik maaşı alıp alamayacağınızı doğrudan belirleyen en önemli yasal veridir. İşten ayrılırken size imzalatılan belgelerdeki kodun gerçek ayrılma sebebinizle eşleştiğinden emin olmalısınız.
      </Alert>

      <Alert color="amber" title="Genel Bilgilendirme" icon="warning">
        Bu tablo genel bilgilendirme amaçlıdır. Hak kaybı yaşamamak için işten ayrılmadan veya imza atmadan önce mutlaka hukuki destek almanız veya ALO 170 ile görüşmeniz önerilir.
      </Alert>
    </div>
  );
}

