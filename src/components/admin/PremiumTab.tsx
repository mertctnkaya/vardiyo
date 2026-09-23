import { useState } from 'react';
import Alert from '../shared/Alert';
import UserManageModal from './UserManageModal';
import type { PremiumTabProps } from '../../types';
import type { AdminUser } from '../../types';

export default function PremiumTab({ users, actionFeedback, onGrantPremium, onDeleteAccount, onSendNotification }: PremiumTabProps) {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sortedUsers = [...users].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  const filteredUsers = sortedUsers.filter((u) => {
    const q = searchQuery.toLowerCase();
    return u.email.toLowerCase().includes(q) || (u.name?.toLowerCase().includes(q));
  });

  const getPlanBadge = (u: AdminUser) => {
    if (u.role === 'admin') return <span className="badge badge-sm bg-red-900/30 text-red-400 border-red-500/30">Kurucu</span>;
    if (!u.premium_until || new Date(u.premium_until) <= new Date()) return <span className="badge badge-sm bg-base-300/30 text-base-content/40 border-base-300">Ücretsiz</span>;
    if (u.premium_until.includes('2099')) return <span className="badge badge-sm bg-emerald-900/30 text-emerald-400 border-emerald-500/30">✨ Sınırsız</span>;
    const diffDays = Math.ceil((new Date(u.premium_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 31) return <span className="badge badge-sm bg-sky-900/30 text-sky-400 border-sky-500/30">1 Ay</span>;
    if (diffDays <= 93) return <span className="badge badge-sm bg-indigo-900/30 text-indigo-400 border-indigo-500/30">3 Ay</span>;
    if (diffDays <= 186) return <span className="badge badge-sm bg-fuchsia-900/30 text-fuchsia-400 border-fuchsia-500/30">6 Ay</span>;
    return <span className="badge badge-sm bg-purple-900/30 text-purple-400 border-purple-500/30">1 Yıl</span>;
  };

  const getStatusDot = (u: AdminUser) => {
    const active = u.has_settings && (u.logs_count ?? 0) > 0;
    return (
      <span className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-red-500'}`} />
        <span className={`text-xs ${active ? 'text-emerald-400' : 'text-red-400'}`}>{active ? 'Aktif' : 'Pasif'}</span>
      </span>
    );
  };

  return (
    <div className="w-full bg-[#16191d] rounded-xl shadow-2xl border border-base-300 overflow-hidden px-2 sm:px-0 animate-fade-in">
      {actionFeedback && (
        <div className="m-4 mb-0">
          <Alert
            color={actionFeedback.includes('Hata') ? 'red' : 'emerald'}
            title={actionFeedback.includes('Hata') ? 'Hata' : 'Başarılı'}
            icon={actionFeedback.includes('Hata') ? 'warning' : 'check'}
            bgStyle="colored"
            borderStyle="colored"
          >
            {actionFeedback}
          </Alert>
        </div>
      )}

      {/* Search */}
      <div className="p-4 pb-0">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="İsim veya e-posta ile ara..."
          className="input input-bordered w-full bg-[#0f1115] border-white/10 focus:border-indigo-500 text-white text-sm"
        />
      </div>

      {/* Stats bar */}
      <div className="px-4 pt-3 pb-1 flex flex-wrap gap-3 text-xs text-base-content/50">
        <span>Toplam: <strong className="text-white">{users.length}</strong></span>
        <span>Premium: <strong className="text-amber-400">{users.filter(u => u.premium_until && new Date(u.premium_until) > new Date()).length}</strong></span>
        <span>Aktif: <strong className="text-emerald-400">{users.filter(u => u.has_settings && (u.logs_count ?? 0) > 0).length}</strong></span>
        <span>Pasif: <strong className="text-base-content/30">{users.filter(u => !u.has_settings || !(u.logs_count ?? 0)).length}</strong></span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full text-left">
          <thead className="bg-[#1e2329] text-base-content/70">
            <tr>
              <th className="py-3 px-4">Kullanıcı</th>
              <th className="hidden sm:table-cell">Üyelik</th>
              <th className="hidden md:table-cell">Kayıt Tarihi</th>
              <th className="hidden sm:table-cell">Durum</th>
              <th className="text-right px-4">Yönet</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => {
              const displayName = u.name || u.email.split('@')[0];
              const initial = displayName.charAt(0).toUpperCase();
              const registeredAt = u.created_at
                ? new Date(u.created_at).toLocaleDateString('tr-TR')
                : '—';

              return (
                <tr key={u.id} className="border-b border-base-300/50 hover:bg-base-200/30 transition-colors">
                  {/* User */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-600/80 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-base-content truncate text-sm">{displayName}</p>
                        <p className="text-xs text-base-content/40 truncate">{u.email}</p>
                        {/* Mobile-only badges */}
                        <div className="flex gap-1.5 mt-1 sm:hidden">
                          {getPlanBadge(u)}
                          {getStatusDot(u)}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Plan */}
                  <td className="hidden sm:table-cell">{getPlanBadge(u)}</td>
                  {/* Date */}
                  <td className="hidden md:table-cell text-xs text-base-content/50">{registeredAt}</td>
                  {/* Status */}
                  <td className="hidden sm:table-cell">{getStatusDot(u)}</td>
                  {/* Action */}
                  <td className="text-right px-4">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="btn btn-sm p-3 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border-none"
                    >
                      Yönet
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-base-content/50">
            {searchQuery ? 'Aramanızla eşleşen kullanıcı bulunamadı.' : 'Kayıtlı kullanıcı bulunamadı.'}
          </div>
        )}
      </div>

      {/* User Manage Modal */}
      {selectedUser && (
        <UserManageModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onGrantPremium={(userId, months) => {
            onGrantPremium(userId, months);
            // Update local modal state after grant
            setSelectedUser(prev => {
              if (!prev || prev.id !== userId) return prev;
              let newDate: string | null;
              if (months === 999) newDate = '2099-12-31T00:00:00.000Z';
              else if (months === 0) newDate = null;
              else {
                const base = prev.premium_until && new Date(prev.premium_until) > new Date()
                  ? new Date(prev.premium_until)
                  : new Date();
                base.setMonth(base.getMonth() + months);
                newDate = base.toISOString();
              }
              return { ...prev, premium_until: newDate };
            });
          }}
          onDeleteAccount={(id, email) => {
            onDeleteAccount(id, email);
            setSelectedUser(null);
          }}
          onSendNotification={onSendNotification}
        />
      )}
    </div>
  );
}
