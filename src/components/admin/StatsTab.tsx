import StatCard from '../shared/StatCard';
import Alert from '../shared/Alert';
import type { StatsTabProps } from '../../types/admin';

export default function StatsTab({ stats, users, messages }: StatsTabProps) {
  // Temel Kullanıcı Verileri
  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.role === 'admin' || (u.premium_until && new Date(u.premium_until) > new Date())).length;
  const freeUsers = totalUsers - premiumUsers;

  // Temel Mesaj Verileri
  const totalTickets = messages.length;
  const unreadTickets = messages.filter(m => !m.is_read_by_admin).length;

  // Satır 3: Premium Detayları
  const lifetimePro = users.filter(u => u.premium_until && u.premium_until.includes('2099')).length;
  const adminAccounts = users.filter(u => u.role === 'admin').length;
  const tempPro = Math.max(0, premiumUsers - lifetimePro - adminAccounts);
  const inactiveUsers = Math.max(0, totalUsers - stats.usersCount);

  // Satır 4: Ticket Analizi
  const openTickets = messages.filter(m => m.status === 'open').length;
  const activeChats = messages.filter(m => m.status === 'active_chat').length;
  const closedTickets = messages.filter(m => m.status === 'closed').length;
  const guestTickets = messages.filter(m => !m.user_id).length;

  // Satır 5: Oranlar ve Verimlilik
  const avgLogs = stats.usersCount > 0 ? (stats.logsCount / stats.usersCount).toFixed(1) : '0';
  const avgReminders = stats.usersCount > 0 ? (stats.remindersCount / stats.usersCount).toFixed(1) : '0';
  const conversionRate = totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) + '%' : '0%';
  const retentionRate = totalUsers > 0 ? ((stats.usersCount / totalUsers) * 100).toFixed(1) + '%' : '0%';

  // Satır 6: Hacim ve Zaman
  const today = new Date().toISOString().split('T')[0];
  const todayMessages = messages.filter(m => m.created_at?.startsWith(today)).length;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weekMessages = messages.filter(m => m.created_at && new Date(m.created_at) >= sevenDaysAgo).length;

  const totalVolume = stats.logsCount + stats.remindersCount;
  const dbLoad = totalUsers + totalVolume + totalTickets;

  return (
    <div className="flex flex-col gap-6 px-2 animate-fade-in">
      {/* 1. Satır */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Kayıtlı Profil" value={totalUsers} desc="Sistemdeki tüm üyeler" colorTheme="white" iconName="users" />
        <StatCard title="Premium Üye" value={premiumUsers} desc="PRO (Abonelikli) hesaplar" colorTheme="emerald" iconName="premium" />
        <StatCard title="Ücretsiz Üye" value={freeUsers} desc="Standart (Free) hesaplar" colorTheme="gray" iconName="users" />
        <StatCard title="Aktif Ayarlar" value={stats.usersCount} desc="Ayarlarını özelleştirenler" colorTheme="indigo" iconName="star" />
      </div>

      {/* 2. Satır */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Mesai / Vardiya" value={stats.logsCount} desc="Takvime işlenmiş gün sayısı" colorTheme="blue" iconName="calendar" />
        <StatCard title="Hatırlatıcı" value={stats.remindersCount} desc="Kullanıcı notları/alarmlar" colorTheme="orange" iconName="bell" />
        <StatCard title="Destek Talebi" value={totalTickets} desc="Açılan toplam ticket" colorTheme="rose" iconName="mail" />
        <StatCard title="Okunmamış" value={unreadTickets} desc="Bekleyen talepler" colorTheme={unreadTickets > 0 ? "red" : "gray"} iconName={unreadTickets > 0 ? "warning" : "check"} />
      </div>

      {/* 3. Satır */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Ömür Boyu PRO" value={lifetimePro} desc="Sınırsız premium erişim" colorTheme="emerald" iconName="crown" />
        <StatCard title="Süreli PRO" value={tempPro} desc="Aylık/Yıllık abonelikler" colorTheme="sky" iconName="calendar" />
        <StatCard title="Admin Yetkili" value={adminAccounts} desc="Sistem yöneticileri" colorTheme="violet" iconName="close" />
        <StatCard title="Pasif Kayıt" value={inactiveUsers} desc="Giriş yapıp ayar kurmayanlar" colorTheme="gray" iconName="moon" />
      </div>

      {/* 4. Satır */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Açık Bilet" value={openTickets} desc="Cevaplanmayı bekleyen" colorTheme="amber" iconName="mail" />
        <StatCard title="Aktif Sohbet" value={activeChats} desc="Müşteriyle konuşulan" colorTheme="blue" iconName="info" />
        <StatCard title="Çözülen Ticket" value={closedTickets} desc="Kapatılmış talepler" colorTheme="emerald" iconName="check" />
        <StatCard title="Ziyaretçi Talebi" value={guestTickets} desc="Giriş yapmadan yazanlar" colorTheme="gray" iconName="user-x" />
      </div>

      {/* 5. Satır */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Kişi Başı Mesai" value={avgLogs} desc="Ortalama girilen mesai" colorTheme="indigo" iconName="clock" />
        <StatCard title="Kişi Başı Alarm" value={avgReminders} desc="Ortalama hatırlatıcı" colorTheme="orange" iconName="bell" />
        <StatCard title="Dönüşüm Oranı" value={conversionRate} desc="Free -> Premium oranı" colorTheme="emerald" iconName="money" />
        <StatCard title="Bağlılık (Aktiflik)" value={retentionRate} desc="Ayarlarını girenlerin oranı" colorTheme="blue" iconName="star" />
      </div>

      {/* 6. Satır */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Bugün Gelen" value={todayMessages} desc="Son 24 saatteki mesajlar" colorTheme="yellow" iconName="mail" />
        <StatCard title="Son 7 Gün (Mesaj)" value={weekMessages} desc="Haftalık mesaj hacmi" colorTheme="pink" iconName="calendar" />
        <StatCard title="İşlem Hacmi" value={totalVolume} desc="Toplam kayıtlı olay sayısı" colorTheme="violet" iconName="wallet" />
        <StatCard title="Veritabanı Yükü" value={dbLoad} desc="Toplam satır ağırlığı" colorTheme="gray" iconName="info" />
      </div>

      <div className="mt-2">
        <Alert color="amber" title="Yönetici Notu" icon="info" bgStyle="colored" borderStyle="colored">
          Kullanıcıların şifreleri, e-posta adresleri ve kimlik doğrulama ayarları güvenliğiniz gereği sadece <strong className="text-white">Supabase Dashboard</strong> üzerinden yönetilebilir. Ön yüzden sadece kullanıcı davranışlarını, mesajları ve premium yetkilerini takip edebilirsiniz.
        </Alert>
      </div>
    </div>
  );
}
