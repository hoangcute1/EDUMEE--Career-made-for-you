'use client';

import { AdminPanel, AdminSectionHeader } from '@/components/admin/AdminPrimitives';
import { cn } from '@/lib/utils';
import {
  Ban,
  CheckCircle2,
  Download,
  Eye,
  Mail,
  Search,
  Shield,
  ShieldCheck,
  UserCog,
} from 'lucide-react';
import { useMemo, useState } from 'react';

/* ── data ─────────────────────────────────────── */

type Plan = 'Free' | 'Plus' | 'Pro';

const userStats = [
  { label: 'Tổng người dùng', value: '12,453', color: 'bg-indigo-100 text-indigo-600' },
  { label: 'Đang hoạt động', value: '9,842', color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Mentor', value: '156', color: 'bg-violet-100 text-violet-600' },
  { label: 'Người dùng mới (tuần)', value: '234', color: 'bg-sky-100 text-sky-600' },
];

const planBadge: Record<Plan, string> = {
  Free: 'bg-slate-100 text-slate-600',
  Plus: 'bg-amber-100 text-amber-700',
  Pro: 'bg-violet-100 text-violet-700',
};

const initialUsers = [
  {
    id: 'u-1',
    name: 'Nguyen Van An',
    email: 'nguyenvanan@gmail.com',
    role: 'Sinh viên',
    plan: 'Free' as Plan,
    status: 'Hoạt động',
    joined: '15/01/2026',
    tests: 3,
  },
  {
    id: 'u-2',
    name: 'Tran Thi Bich',
    email: 'tranbich@gmail.com',
    role: 'Sinh viên',
    plan: 'Plus' as Plan,
    status: 'Hoạt động',
    joined: '12/01/2026',
    tests: 5,
  },
  {
    id: 'u-3',
    name: 'Le Van Cuong',
    email: 'lecuong@gmail.com',
    role: 'Mentor',
    plan: 'Pro' as Plan,
    status: 'Hoạt động',
    joined: '08/01/2026',
    tests: 2,
  },
  {
    id: 'u-4',
    name: 'Pham Thi Dung',
    email: 'phamdung@gmail.com',
    role: 'Sinh viên',
    plan: 'Free' as Plan,
    status: 'Bị khóa',
    joined: '20/12/2025',
    tests: 1,
  },
  {
    id: 'u-5',
    name: 'Hoang Van Em',
    email: 'hoangem@gmail.com',
    role: 'Sinh viên',
    plan: 'Plus' as Plan,
    status: 'Hoạt động',
    joined: '05/01/2026',
    tests: 4,
  },
  {
    id: 'u-6',
    name: 'Vu Thi Fiona',
    email: 'vufiona@gmail.com',
    role: 'Admin',
    plan: 'Pro' as Plan,
    status: 'Hoạt động',
    joined: '01/12/2025',
    tests: 0,
  },
];

/* ── component ────────────────────────────────── */

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'Tất cả' | 'Sinh viên' | 'Mentor' | 'Admin'>(
    'Tất cả',
  );
  const [planFilter, setPlanFilter] = useState<'Tất cả' | Plan>('Tất cả');
  const [statusFilter, setStatusFilter] = useState<'Tất cả' | 'Hoạt động' | 'Bị khóa'>('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState('');
  const [detailUser, setDetailUser] = useState<(typeof initialUsers)[0] | null>(null);

  const pageSize = 5;

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const bySearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const byRole = roleFilter === 'Tất cả' || u.role === roleFilter;
      const byPlan = planFilter === 'Tất cả' || u.plan === planFilter;
      const byStatus = statusFilter === 'Tất cả' || u.status === statusFilter;
      return bySearch && byRole && byPlan && byStatus;
    });
  }, [users, search, roleFilter, planFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  /* ── admin actions ── */

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Hoạt động' ? 'Bị khóa' : 'Hoạt động' } : u,
      ),
    );
    const user = users.find((u) => u.id === id);
    if (user) {
      const next = user.status === 'Hoạt động' ? 'khóa' : 'mở khóa';
      flash(`Đã ${next} tài khoản ${user.name}`);
    }
  };

  const handleChangeRole = (id: string) => {
    const cycle = ['Sinh viên', 'Mentor', 'Admin'];
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const idx = cycle.indexOf(u.role);
        const next = cycle[(idx + 1) % cycle.length];
        return { ...u, role: next };
      }),
    );
    flash('Đã cập nhật vai trò');
  };

  const handleExport = () => {
    const header = 'Name,Email,Role,Plan,Status,Joined,Tests';
    const rows = filteredUsers.map(
      (u) => `${u.name},${u.email},${u.role},${u.plan},${u.status},${u.joined},${u.tests}`,
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'admin-users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    flash('Đã xuất file CSV danh sách người dùng');
  };

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  }

  /* ── render ── */

  return (
    <div className="max-w-6xl">
      <AdminSectionHeader
        title="Quản lý người dùng"
        subtitle="Người dùng tự đăng ký tài khoản. Admin quản lý vai trò, trạng thái và gói dịch vụ."
      />

      {/* stats row */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {userStats.map((s) => (
          <article
            key={s.label}
            className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <p className="mb-2 text-xs text-slate-500">{s.label}</p>
            <div className={`rounded-lg px-3 py-2 text-4xl/none font-bold ${s.color}`}>
              {s.value}
            </div>
          </article>
        ))}
      </div>

      {/* filters */}
      <AdminPanel className="mt-4 p-3">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-65 flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-3 pl-10 text-sm outline-none focus:border-violet-400"
              placeholder="Tìm kiếm theo tên, email..."
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as typeof roleFilter);
              setCurrentPage(1);
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"
          >
            <option>Tất cả</option>
            <option>Sinh viên</option>
            <option>Mentor</option>
            <option>Admin</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value as typeof planFilter);
              setCurrentPage(1);
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"
          >
            <option>Tất cả</option>
            <option>Free</option>
            <option>Plus</option>
            <option>Pro</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setCurrentPage(1);
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"
          >
            <option>Tất cả</option>
            <option>Hoạt động</option>
            <option>Bị khóa</option>
          </select>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold"
          >
            <Download className="h-4 w-4" />
            Xuất file
          </button>
        </div>

        {/* table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Người dùng</th>
                <th className="px-4 py-3">Vai trò</th>
                <th className="px-4 py-3">Gói</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tham gia</th>
                <th className="px-4 py-3">Bài test</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-xs font-bold text-white">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-semibold',
                        planBadge[u.plan],
                      )}
                    >
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-semibold',
                        u.status === 'Hoạt động'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-600',
                      )}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.joined}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{u.tests}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 text-slate-500">
                      <button
                        type="button"
                        title="Xem chi tiết"
                        onClick={() => setDetailUser(u)}
                        className="rounded-lg p-1.5 hover:bg-slate-100"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Gửi email"
                        className="rounded-lg p-1.5 hover:bg-slate-100"
                        onClick={() => flash(`Đã gửi email tới ${u.email}`)}
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Đổi vai trò"
                        onClick={() => handleChangeRole(u.id)}
                        className="rounded-lg p-1.5 hover:bg-slate-100"
                      >
                        <UserCog className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title={u.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa'}
                        onClick={() => handleToggleStatus(u.id)}
                        className={cn(
                          'rounded-lg p-1.5 hover:bg-slate-100',
                          u.status === 'Bị khóa' && 'text-rose-500',
                        )}
                      >
                        {u.status === 'Hoạt động' ? (
                          <Ban className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="mt-3 flex items-center justify-between px-2 text-xs text-slate-500">
          <span>
            Hiển thị {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, filteredUsers.length)} / {filteredUsers.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              return (
                <button
                  type="button"
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`h-7 w-7 rounded-lg border text-xs ${
                    n === currentPage
                      ? 'border-violet-500 bg-violet-500 text-white'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {n}
                </button>
              );
            })}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-200 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </AdminPanel>

      {/* toast message */}
      {message && (
        <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {message}
        </p>
      )}

      {/* user detail drawer */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setDetailUser(null)}
            onKeyDown={(e) => e.key === 'Escape' && setDetailUser(null)}
            role="button"
            tabIndex={0}
            aria-label="Đóng"
          />
          <aside className="relative z-10 flex h-full w-96 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">Chi tiết người dùng</h2>
              <button
                type="button"
                onClick={() => setDetailUser(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500 text-xl font-bold text-white">
                  {detailUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{detailUser.name}</p>
                  <p className="text-sm text-slate-500">{detailUser.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <DetailRow label="Vai trò" icon={Shield}>
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
                    {detailUser.role}
                  </span>
                </DetailRow>
                <DetailRow label="Gói dịch vụ" icon={ShieldCheck}>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-semibold',
                      planBadge[detailUser.plan],
                    )}
                  >
                    {detailUser.plan}
                  </span>
                </DetailRow>
                <DetailRow label="Trạng thái" icon={CheckCircle2}>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-semibold',
                      detailUser.status === 'Hoạt động'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-600',
                    )}
                  >
                    {detailUser.status}
                  </span>
                </DetailRow>
                <DetailRow label="Ngày tham gia" icon={Eye}>
                  <span className="text-sm text-slate-700">{detailUser.joined}</span>
                </DetailRow>
                <DetailRow label="Bài test đã làm" icon={Eye}>
                  <span className="text-sm font-semibold text-slate-700">{detailUser.tests}</span>
                </DetailRow>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleChangeRole(detailUser.id);
                    setDetailUser(null);
                  }}
                  className="flex-1 rounded-xl bg-violet-500 py-2 text-sm font-semibold text-white hover:bg-violet-600"
                >
                  Đổi vai trò
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleToggleStatus(detailUser.id);
                    setDetailUser(null);
                  }}
                  className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {detailUser.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

/* helper */
function DetailRow({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof Eye;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      {children}
    </div>
  );
}
