'use client';

import { AdminPanel, AdminSectionHeader, AdminStatCard } from '@/components/admin/AdminPrimitives';
import { cn } from '@/lib/utils';
import {
  Calendar,
  CircleUserRound,
  Clock3,
  FileText,
  MessageSquareText,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const stats = [
  {
    title: 'Tổng người dùng',
    value: '12,453',
    delta: '+12.5%',
    icon: Users,
    iconClassName: 'bg-violet-500',
  },
  {
    title: 'Bài test hoàn thành',
    value: '8,742',
    delta: '+8.2%',
    icon: CircleUserRound,
    iconClassName: 'bg-emerald-500',
  },
  {
    title: 'Nghề nghiệp',
    value: '284',
    delta: '+5',
    icon: FileText,
    iconClassName: 'bg-sky-500',
  },
  {
    title: 'Lượt tư vấn',
    value: '1,632',
    delta: '-3.1%',
    icon: MessageSquareText,
    iconClassName: 'bg-orange-500',
    deltaType: 'down' as const,
  },
];

const activities = [
  { title: 'Người dùng mới đăng ký', user: 'Nguyen Van A', time: '2 phút trước', type: 'users' },
  { title: 'Hoàn thành bài test', user: 'Tran Thi B', time: '15 phút trước', type: 'test' },
  { title: 'Đặt lịch mentor', user: 'Le Van C', time: '1 giờ trước', type: 'mentor' },
  { title: 'Người dùng mới đăng ký', user: 'Pham Thi D', time: '2 giờ trước', type: 'users' },
  { title: 'Hoàn thành bài test', user: 'Hoang Van E', time: '3 giờ trước', type: 'test' },
] as const;

const popularCareers = [
  { name: 'Frontend Developer', views: '3,248', matches: '892 khớp', delta: '+15.3%' },
  { name: 'Data Analyst', views: '2,871', matches: '756 khớp', delta: '+12.8%' },
  { name: 'UI/UX Designer', views: '2,634', matches: '687 khớp', delta: '-2.4%' },
  { name: 'Backend Developer', views: '2,453', matches: '621 khớp', delta: '+8.9%' },
  { name: 'Product Manager', views: '2,198', matches: '534 khớp', delta: '+6.2%' },
];

const quickActions = [
  {
    label: 'Duyệt tài khoản',
    icon: Users,
    color: 'bg-violet-500',
    hint: 'Đã mở danh sách tài khoản chờ duyệt',
  },
  {
    label: 'Tạo nội dung',
    icon: FileText,
    color: 'bg-emerald-500',
    hint: 'Đã mở trình tạo nội dung',
  },
  {
    label: 'Xem phân tích',
    icon: TrendingUp,
    color: 'bg-sky-500',
    hint: 'Đã chuyển sang trang phân tích chi tiết',
  },
  {
    label: 'Quản lý gói dịch vụ',
    icon: Calendar,
    color: 'bg-orange-500',
    hint: 'Đã mở trang quản lý gói Free / Plus / Pro',
  },
];

export default function AdminDashboardPage() {
  const [activityFilter, setActivityFilter] = useState<'all' | 'users' | 'test' | 'mentor'>('all');
  const [actionMessage, setActionMessage] = useState<string>('Sẵn sàng cho thao tác quản trị');

  const filteredActivities = useMemo(() => {
    if (activityFilter === 'all') {
      return activities;
    }

    return activities.filter((item) => item.type === activityFilter);
  }, [activityFilter]);

  const activityFilters = [
    { value: 'all' as const, label: 'Tất cả' },
    { value: 'users' as const, label: 'Người dùng' },
    { value: 'test' as const, label: 'Bài test' },
    { value: 'mentor' as const, label: 'Mentor' },
  ];

  return (
    <div className="max-w-6xl">
      <AdminSectionHeader
        title="Dashboard"
        subtitle="Tổng quan hoạt động hệ thống Career AI"
        right={
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
            <Clock3 className="h-4 w-4" />
            Cập nhật: 5 phút trước
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <AdminStatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <AdminPanel title="Hoạt động gần đây" className="px-5 py-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {activityFilters.map((filter) => (
              <button
                type="button"
                key={filter.value}
                onClick={() => setActivityFilter(filter.value)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                  activityFilter === filter.value
                    ? 'border-violet-200 bg-violet-100 text-violet-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100',
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredActivities.map((item) => (
              <div key={`${item.title}-${item.user}`} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.user}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Nghề phổ biến" className="px-5 py-4">
          <div className="space-y-3">
            {popularCareers.map((item, index) => (
              <div key={item.name} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {index + 1}. {item.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.views} lượt xem • {item.matches}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold ${item.delta.startsWith('-') ? 'text-rose-500' : 'text-emerald-600'}`}
                >
                  {item.delta}
                </span>
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((item) => (
          <button
            type="button"
            key={item.label}
            onClick={() => setActionMessage(item.hint)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${item.color}`}
            >
              <item.icon className="h-4 w-4" />
            </span>
            {item.label}
            <Plus className="ml-auto h-4 w-4 text-slate-400" />
          </button>
        ))}
      </div>

      <p className="mt-4 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700">
        {actionMessage}
      </p>
    </div>
  );
}
