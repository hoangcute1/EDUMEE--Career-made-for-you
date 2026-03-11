'use client';

import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { GraduationCap, MapPin, MessageCircle, Search, Star, Users, Video, X } from 'lucide-react';
import { useState } from 'react';

/* ─── Types ─── */
type SessionType = {
  id: string;
  label: string;
  desc: string;
  price: string;
  icon: React.ElementType;
};

type Mentor = {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  initials: string;
  gradientFrom: string;
  gradientTo: string;
  badge: string | null;
  badgeColor: string;
  rating: number;
  reviews: number;
  category: string;
  bio: string;
  skills: string[];
  schedule: string;
  price: string;
  sessions: number;
  sessionTypes: SessionType[];
};

/* ─── Data ─── */
const CATEGORIES = [
  'Tất cả',
  'Công nghệ',
  'Dữ liệu & AI',
  'Thiết kế',
  'Marketing',
  'Quản lý sản phẩm',
];

const mentors: Mentor[] = [
  {
    id: 'm1',
    name: 'Nguyễn Thị Lan Anh',
    role: 'Senior UX Designer',
    company: 'Shopee',
    location: 'TP. Hồ Chí Minh',
    initials: 'LA',
    gradientFrom: '#a78bfa',
    gradientTo: '#818cf8',
    badge: 'Top Mentor',
    badgeColor: 'bg-yellow-400 text-yellow-900',
    rating: 4.9,
    reviews: 127,
    category: 'Thiết kế',
    bio: '8 năm kinh nghiệm thiết kế sản phẩm số tại các công ty lớn như Shopee, Lazada và nhiều công ty quốc tế.',
    skills: ['UX Research', 'UI Design', 'Design System'],
    schedule: 'Thứ 2–6, 19:00–22:00',
    price: '300,000 VND/giờ',
    sessions: 340,
    sessionTypes: [
      {
        id: 'video',
        label: '1-1 Video Call',
        desc: 'Tư vấn riêng qua video',
        price: '300,000 VND/giờ',
        icon: Video,
      },
      {
        id: 'chat',
        label: 'Chat Tư vấn',
        desc: 'Hỏi đáp qua chat',
        price: '150,000 VND/giờ',
        icon: MessageCircle,
      },
      {
        id: 'cv',
        label: 'Review CV/Portfolio',
        desc: 'Review hồ sơ của bạn',
        price: '200,000 VND/lần',
        icon: GraduationCap,
      },
    ],
  },
  {
    id: 'm2',
    name: 'Trần Minh Hoàng',
    role: 'Engineering Manager',
    company: 'VNG',
    location: 'Hà Nội',
    initials: 'MH',
    gradientFrom: '#38bdf8',
    gradientTo: '#6366f1',
    badge: 'Expert',
    badgeColor: 'bg-blue-500 text-white',
    rating: 4.8,
    reviews: 98,
    category: 'Công nghệ',
    bio: '10 năm là Engineering Manager tại VNG và MoMo. Đã mentored 50+ engineers và giúp nhiều người thăng tiến lên senior.',
    skills: ['Backend Dev', 'System Design', 'Leadership'],
    schedule: 'Thứ 7, CN, 9:00–17:00',
    price: '400,000 VND/giờ',
    sessions: 380,
    sessionTypes: [
      {
        id: 'video',
        label: '1-1 Video Call',
        desc: 'Tư vấn riêng qua video',
        price: '400,000 VND/giờ',
        icon: Video,
      },
      {
        id: 'chat',
        label: 'Chat Tư vấn',
        desc: 'Hỏi đáp qua chat',
        price: '200,000 VND/giờ',
        icon: MessageCircle,
      },
    ],
  },
  {
    id: 'm3',
    name: 'Lê Phương Thảo',
    role: 'Data Science Lead',
    company: 'VinAI Research',
    location: 'Hà Nội',
    initials: 'PT',
    gradientFrom: '#c084fc',
    gradientTo: '#7c3aed',
    badge: 'PhD',
    badgeColor: 'bg-purple-600 text-white',
    rating: 4.9,
    reviews: 76,
    category: 'Dữ liệu & AI',
    bio: 'PhD AI, hiện đang là Data Science Lead tại VinAI. Giúp bạn định hướng con đường AI/ML, từ học thuật đến industry.',
    skills: ['Machine Learning', 'Deep Learning', 'Python'],
    schedule: 'Thứ 3, 5, 7, 18:00–21:00',
    price: '350,000 VND/giờ',
    sessions: 190,
    sessionTypes: [
      {
        id: 'video',
        label: '1-1 Video Call',
        desc: 'Tư vấn riêng qua video',
        price: '350,000 VND/giờ',
        icon: Video,
      },
      {
        id: 'cv',
        label: 'Review CV/Portfolio',
        desc: 'Review hồ sơ của bạn',
        price: '250,000 VND/lần',
        icon: GraduationCap,
      },
    ],
  },
  {
    id: 'm4',
    name: 'Vũ Quốc Anh',
    role: 'Product Manager',
    company: 'Tiki',
    location: 'Hồ Chí Minh',
    initials: 'QA',
    gradientFrom: '#34d399',
    gradientTo: '#0ea5e9',
    badge: null,
    badgeColor: '',
    rating: 4.7,
    reviews: 83,
    category: 'Quản lý sản phẩm',
    bio: '7 năm làm PM tại Tiki và các startup e-commerce. Chuyên tư vấn về career transition từ các ngành khác sang PM.',
    skills: ['Product Strategy', 'Agile', 'User Research'],
    schedule: 'Thứ 4, 7, 8:00–12:00',
    price: '280,000 VND/giờ',
    sessions: 195,
    sessionTypes: [
      {
        id: 'video',
        label: '1-1 Video Call',
        desc: 'Tư vấn riêng qua video',
        price: '280,000 VND/giờ',
        icon: Video,
      },
      {
        id: 'chat',
        label: 'Chat Tư vấn',
        desc: 'Hỏi đáp qua chat',
        price: '120,000 VND/giờ',
        icon: MessageCircle,
      },
    ],
  },
  {
    id: 'm5',
    name: 'Đỗ Thị Mai Linh',
    role: 'Marketing Director',
    company: 'Grab Vietnam',
    location: 'Hồ Chí Minh',
    initials: 'ML',
    gradientFrom: '#f97316',
    gradientTo: '#f43f5e',
    badge: null,
    badgeColor: '',
    rating: 4.8,
    reviews: 80,
    category: 'Marketing',
    bio: '9 năm kinh nghiệm marketing tại Grab, Momo. Chuyên đào tạo trẻ định hướng con đường Marketing & Brand Strategy.',
    skills: ['Digital Marketing', 'Brand Strategy', 'Growth Hacking'],
    schedule: 'Thứ 2, 4, 6, 20:00–22:00',
    price: '320,000 VND/giờ',
    sessions: 240,
    sessionTypes: [
      {
        id: 'video',
        label: '1-1 Video Call',
        desc: 'Tư vấn riêng qua video',
        price: '320,000 VND/giờ',
        icon: Video,
      },
      {
        id: 'cv',
        label: 'Review CV/Portfolio',
        desc: 'Review hồ sơ của bạn',
        price: '200,000 VND/lần',
        icon: GraduationCap,
      },
    ],
  },
  {
    id: 'm6',
    name: 'Nguyễn Trung Kiên',
    role: 'Full-Stack Developer',
    company: 'Axon Active Vietnam',
    location: 'Đà Nẵng',
    initials: 'TK',
    gradientFrom: '#10b981',
    gradientTo: '#0d9488',
    badge: 'Affordable',
    badgeColor: 'bg-green-500 text-white',
    rating: 4.6,
    reviews: 54,
    category: 'Công nghệ',
    bio: '5 năm kinh nghiệm Full-Stack, chuyên giúp các bạn mới bắt đầu học lập trình và chuẩn bị cho phỏng vấn kỹ thuật.',
    skills: ['React', 'Node.js', 'TypeScript'],
    schedule: 'Hàng ngày, 21:00–23:00',
    price: '200,000 VND/giờ',
    sessions: 100,
    sessionTypes: [
      {
        id: 'video',
        label: '1-1 Video Call',
        desc: 'Tư vấn riêng qua video',
        price: '200,000 VND/giờ',
        icon: Video,
      },
      {
        id: 'chat',
        label: 'Chat Tư vấn',
        desc: 'Hỏi đáp qua chat',
        price: '80,000 VND/giờ',
        icon: MessageCircle,
      },
      {
        id: 'cv',
        label: 'Review CV/Portfolio',
        desc: 'Review hồ sơ của bạn',
        price: '150,000 VND/lần',
        icon: GraduationCap,
      },
    ],
  },
];

/* ─── Booking Modal ─── */
const BookingModal = ({ mentor, onClose }: { mentor: Mentor; onClose: () => void }) => {
  const [selectedType, setSelectedType] = useState(mentor.sessionTypes[0].id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl"
      >
        {/* Title bar */}
        <div className="border-border flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${mentor.gradientFrom}, ${mentor.gradientTo})`,
              }}
            >
              {mentor.initials}
            </div>
            <div>
              <p className="font-semibold">{mentor.name}</p>
              <p className="text-muted-foreground text-xs">
                {mentor.role} tại {mentor.company}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-muted rounded-full p-1.5 transition-colors">
            <X className="text-muted-foreground h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {/* Session type selection */}
          <div>
            <p className="mb-2.5 text-sm font-medium">Chọn loại buổi học:</p>
            <div className="space-y-2">
              {mentor.sessionTypes.map((type) => (
                <label
                  key={type.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                    selectedType === type.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="sessionType"
                    value={type.id}
                    checked={selectedType === type.id}
                    onChange={() => setSelectedType(type.id)}
                    className="accent-primary"
                  />
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                      selectedType === type.id
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <type.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{type.label}</p>
                    <p className="text-muted-foreground text-xs">{type.desc}</p>
                  </div>
                  <span className="text-primary shrink-0 text-sm font-bold">{type.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="border-border rounded-xl border p-3">
            <p className="mb-1.5 text-sm font-medium">Lịch khả dụng:</p>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>📅</span>
              <span>{mentor.schedule}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Đóng
            </Button>
            <Button variant="hero" className="flex-1">
              Xác nhận đặt lịch
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Mentor Card ─── */
const MentorCard = ({
  mentor,
  index,
  onBook,
}: {
  mentor: Mentor;
  index: number;
  onBook: (m: Mentor) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.07 }}
    className="glass-card flex flex-col overflow-hidden rounded-2xl"
  >
    {/* Gradient header */}
    <div
      className="relative h-24"
      style={{
        background: `linear-gradient(135deg, ${mentor.gradientFrom}55, ${mentor.gradientTo}55)`,
      }}
    >
      {mentor.badge && (
        <span
          className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-bold ${mentor.badgeColor}`}
        >
          {mentor.badge}
        </span>
      )}
      {/* Avatar */}
      <div
        className="border-background absolute -bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-full border-4 text-base font-bold text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${mentor.gradientFrom}, ${mentor.gradientTo})`,
        }}
      >
        {mentor.initials}
      </div>
    </div>

    <div className="flex flex-1 flex-col p-5 pt-8">
      {/* Name + rating */}
      <div className="mb-1 flex items-start justify-between gap-2">
        <div>
          <p className="font-display font-semibold">{mentor.name}</p>
          <p className="text-muted-foreground text-xs">{mentor.role}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">{mentor.rating}</span>
          <span className="text-muted-foreground text-xs">({mentor.reviews})</span>
        </div>
      </div>

      {/* Company + location */}
      <div className="text-muted-foreground mb-3 flex flex-wrap gap-2 text-xs">
        <span className="flex items-center gap-1">
          <span className="text-foreground font-medium">{mentor.company}</span>
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {mentor.location}
        </span>
      </div>

      {/* Bio */}
      <p className="text-muted-foreground mb-3 line-clamp-2 flex-1 text-sm">{mentor.bio}</p>

      {/* Skills */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {mentor.skills.map((s) => (
          <span
            key={s}
            className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Schedule + sessions */}
      <div className="text-muted-foreground mb-4 flex items-center justify-between text-xs">
        <span>📅 {mentor.schedule}</span>
        <span>{mentor.sessions} buổi đã dạy</span>
      </div>

      {/* Price + buttons */}
      <div className="flex items-center gap-2">
        <span className="text-primary flex-1 text-sm font-bold">{mentor.price}</span>
        <button className="border-border hover:bg-muted flex h-8 w-8 items-center justify-center rounded-xl border transition-colors">
          <MessageCircle className="text-muted-foreground h-4 w-4" />
        </button>
        <Button variant="hero" size="sm" onClick={() => onBook(mentor)}>
          Đặt lịch
        </Button>
      </div>
    </div>
  </motion.div>
);

/* ─── Main component ─── */
const MentorMatching = () => {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);

  const filtered = mentors.filter((m) => {
    const matchCat = activeCategory === 'Tất cả' || m.category === activeCategory;
    const matchSearch =
      !search.trim() ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <>
      <div className="min-h-screen pb-20">
        {/* Header */}
        <div className="bg-gradient-card">
          <div className="container py-10 text-center">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <span className="bg-primary/10 text-primary mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
                <GraduationCap className="h-4 w-4" /> 500+ mentor chuyên nghiệp
              </span>
              <h1 className="font-display text-3xl font-bold md:text-4xl">Kết nối với Mentor</h1>
              <p className="text-muted-foreground mt-2">
                Học hỏi trực tiếp từ các chuyên gia đang làm việc tại các công ty hàng đầu Việt Nam
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mt-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Users, value: '500+', label: 'Mentors' },
              { icon: Video, value: '15,000+', label: 'Buổi học' },
              { icon: Star, value: '4.8/5', label: 'Đánh giá' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="glass-card rounded-2xl p-3 text-center sm:p-4">
                <Icon className="text-primary mx-auto mb-2 h-5 w-5" />
                <p className="text-xl font-bold">{value}</p>
                <p className="text-muted-foreground text-xs">{label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mentor theo tên, kỹ năng..."
              className="border-input bg-background focus:ring-ring h-11 w-full rounded-xl border pr-4 pl-10 text-sm outline-none focus:ring-2"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((mentor, i) => (
                <MentorCard key={mentor.id} mentor={mentor} index={i} onBook={setBookingMentor} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">Không tìm thấy mentor phù hợp.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking modal */}
      <AnimatePresence>
        {bookingMentor && (
          <BookingModal mentor={bookingMentor} onClose={() => setBookingMentor(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default MentorMatching;
