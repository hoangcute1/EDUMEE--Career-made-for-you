'use client';

import { AdminPanel, AdminSectionHeader } from '@/components/admin/AdminPrimitives';
import { cn } from '@/lib/utils';
import { Eye, MoreVertical, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

type ContentType = 'Nghề nghiệp' | 'Bài test' | 'Tài nguyên';

type ContentItem = {
  id: string;
  name: string;
  category: string;
  status: 'Đã xuất bản' | 'Bản nháp';
  views: string;
  matches: string;
  updated: string;
};

const seedData: Record<ContentType, ContentItem[]> = {
  'Nghề nghiệp': [
    {
      id: 'c-1',
      name: 'Frontend Developer',
      category: 'Công nghệ',
      status: 'Đã xuất bản',
      views: '3,248',
      matches: '892',
      updated: '10/03/2026',
    },
    {
      id: 'c-2',
      name: 'Data Analyst',
      category: 'Dữ liệu',
      status: 'Đã xuất bản',
      views: '2,871',
      matches: '756',
      updated: '09/03/2026',
    },
    {
      id: 'c-3',
      name: 'UI/UX Designer',
      category: 'Thiết kế',
      status: 'Bản nháp',
      views: '2,634',
      matches: '687',
      updated: '08/03/2026',
    },
    {
      id: 'c-4',
      name: 'Backend Developer',
      category: 'Công nghệ',
      status: 'Đã xuất bản',
      views: '2,453',
      matches: '621',
      updated: '07/03/2026',
    },
    {
      id: 'c-5',
      name: 'Product Manager',
      category: 'Quản lý',
      status: 'Đã xuất bản',
      views: '2,198',
      matches: '534',
      updated: '06/03/2026',
    },
  ],
  'Bài test': [
    {
      id: 't-1',
      name: 'Trắc nghiệm Holland',
      category: 'Đánh giá',
      status: 'Đã xuất bản',
      views: '1,248',
      matches: '687',
      updated: '11/03/2026',
    },
    {
      id: 't-2',
      name: 'Bài test MBTI mini',
      category: 'Tính cách',
      status: 'Bản nháp',
      views: '840',
      matches: '522',
      updated: '08/03/2026',
    },
  ],
  'Tài nguyên': [
    {
      id: 'r-1',
      name: 'Hướng dẫn CV cho sinh viên',
      category: 'Tài liệu',
      status: 'Đã xuất bản',
      views: '932',
      matches: '430',
      updated: '10/03/2026',
    },
    {
      id: 'r-2',
      name: 'Checklist phỏng vấn intern',
      category: 'Mẫu tài liệu',
      status: 'Đã xuất bản',
      views: '711',
      matches: '401',
      updated: '07/03/2026',
    },
  ],
};

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<ContentType>('Nghề nghiệp');
  const [statusFilter, setStatusFilter] = useState<'Tất cả' | 'Đã xuất bản' | 'Bản nháp'>('Tất cả');
  const [search, setSearch] = useState('');
  const [itemsByTab, setItemsByTab] = useState(seedData);
  const [message, setMessage] = useState('Sẵn sàng quản lý nội dung');

  const tabs: Array<{ label: ContentType; count: number }> = [
    { label: 'Nghề nghiệp', count: itemsByTab['Nghề nghiệp'].length },
    { label: 'Bài test', count: itemsByTab['Bài test'].length },
    { label: 'Tài nguyên', count: itemsByTab['Tài nguyên'].length },
  ];

  const visibleItems = useMemo(() => {
    return itemsByTab[activeTab].filter((item) => {
      const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
      const byStatus = statusFilter === 'Tất cả' || item.status === statusFilter;
      return bySearch && byStatus;
    });
  }, [activeTab, itemsByTab, search, statusFilter]);

  const handleCreate = () => {
    const newItem: ContentItem = {
      id: `new-${Date.now()}`,
      name: `${activeTab} moi`,
      category: 'Chưa phân loại',
      status: 'Bản nháp',
      views: '0',
      matches: '0',
      updated: '12/03/2026',
    };

    setItemsByTab((prev) => ({ ...prev, [activeTab]: [newItem, ...prev[activeTab]] }));
    setMessage(`Đã tạo mới một mục trong ${activeTab}`);
  };

  const togglePublish = (id: string) => {
    setItemsByTab((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'Đã xuất bản' ? 'Bản nháp' : 'Đã xuất bản' }
          : item,
      ),
    }));
    setMessage('Đã cập nhật trạng thái xuất bản');
  };

  const deleteItem = (id: string) => {
    setItemsByTab((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((item) => item.id !== id),
    }));
    setMessage('Đã xóa mục nội dung');
  };

  return (
    <div className="max-w-6xl">
      <AdminSectionHeader
        title="Quản lý nội dung"
        subtitle="Quản lý nghề nghiệp, bài test và tài nguyên"
        right={
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-600"
          >
            <Plus className="h-4 w-4" />
            Thêm mới
          </button>
        }
      />

      <AdminPanel className="p-2">
        <div className="grid gap-2 md:grid-cols-3">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold ${
                tab.label === activeTab
                  ? 'border-violet-200 bg-violet-100 text-violet-700'
                  : 'border-transparent bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-600">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </AdminPanel>

      <AdminPanel className="mt-4 p-3">
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-72 flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 pr-3 pl-10 text-sm outline-none focus:border-violet-400"
              placeholder={`Tìm kiếm ${activeTab.toLowerCase()}...`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"
          >
            <option>Tất cả</option>
            <option>Đã xuất bản</option>
            <option>Bản nháp</option>
          </select>
        </div>
      </AdminPanel>

      <AdminPanel className="mt-4 p-0">
        <div className="overflow-x-auto rounded-2xl">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Nghề nghiệp</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Lượt xem</th>
                <th className="px-4 py-3">Khớp</th>
                <th className="px-4 py-3">Cập nhật</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((career) => (
                <tr key={career.id} className="border-t border-slate-100">
                  <td className="px-4 py-4 font-semibold text-slate-800">{career.name}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-700">
                      {career.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-semibold',
                        career.status === 'Đã xuất bản'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700',
                      )}
                    >
                      {career.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{career.views}</td>
                  <td className="px-4 py-4 text-slate-600">{career.matches}</td>
                  <td className="px-4 py-4 text-slate-600">{career.updated}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2 text-slate-500">
                      <button type="button" className="rounded-lg p-1 hover:bg-slate-100">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => togglePublish(career.id)}
                        className="rounded-lg p-1 hover:bg-slate-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteItem(career.id)}
                        className="rounded-lg p-1 hover:bg-slate-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button type="button" className="rounded-lg p-1 hover:bg-slate-100">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminPanel>

      <p className="mt-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700">
        {message}
      </p>
    </div>
  );
}
