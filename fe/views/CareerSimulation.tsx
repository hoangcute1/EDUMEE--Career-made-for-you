'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  DollarSign,
  Lightbulb,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

/* ─── Types ─── */
type Level = {
  id: string;
  label: string;
  emoji: string;
  salaryRange: string;
  yearRange: string;
  nextLevel: string;
  skills: { name: string; color: string }[];
  tasks: string[];
  daySchedule: string;
  challenge: string;
  tip: string;
};

type Career = {
  id: string;
  label: string;
  icon: React.ElementType;
  levels: Level[];
};

/* ─── Data ─── */
const careers: Career[] = [
  {
    id: 'software',
    label: 'Kỹ sư Phần mềm',
    icon: Code,
    levels: [
      {
        id: 'intern',
        label: 'Intern',
        emoji: '🌱',
        salaryRange: '3–6 triệu',
        yearRange: '3–6 tháng',
        nextLevel: 'Junior',
        skills: [
          { name: 'Git', color: 'text-primary' },
          { name: 'Python Basics', color: 'text-mint' },
          { name: 'HTML/CSS', color: 'text-secondary' },
          { name: 'Problem Solving', color: 'text-gold' },
        ],
        tasks: [
          'Học ngôn ngữ lập trình cơ bản (Python/JavaScript)',
          'Fix bugs và viết unit tests',
          'Code review với senior developer',
          'Làm quen với Git workflow và CI/CD',
          'Tham gia daily standup và sprint planning',
        ],
        daySchedule:
          'Sáng: Học tài liệu kỹ thuật. Chiều: Code theo hướng dẫn. Tối: Xem tutorial và thực hành.',
        challenge: 'Làm quen với môi trường doanh nghiệp và quy trình làm việc chuyên nghiệp.',
        tip: 'Đừng ngại hỏi. Senior dev thích giải thích hơn bạn nghĩ.',
      },
      {
        id: 'junior',
        label: 'Junior',
        emoji: '🌿',
        salaryRange: '15–25 triệu',
        yearRange: '1–2 năm',
        nextLevel: 'Senior',
        skills: [
          { name: 'React/Vue', color: 'text-primary' },
          { name: 'TypeScript', color: 'text-mint' },
          { name: 'REST APIs', color: 'text-secondary' },
          { name: 'Testing', color: 'text-gold' },
        ],
        tasks: [
          'Phát triển feature mới theo requirement',
          'Viết unit test và integration test',
          'Code review cho sinh viên thực tập',
          'Tham gia design meeting',
          'Refactor code cũ, cải thiện performance',
        ],
        daySchedule:
          'Sáng: Review PR và task planning. Chiều: Code feature chính. Cuối ngày: Review lại code, commit.',
        challenge:
          'Chuyển từ học cách viết code sang hiểu business logic và viết code có chất lượng.',
        tip: 'Đầu tư thời gian đọc code người khác. 80% giờ làm là đọc code, 20% là viết.',
      },
      {
        id: 'senior',
        label: 'Senior',
        emoji: '🌲',
        salaryRange: '35–80 triệu',
        yearRange: '2–4 năm',
        nextLevel: 'Manager',
        skills: [
          { name: 'System Design', color: 'text-primary' },
          { name: 'Architecture', color: 'text-mint' },
          { name: 'Mentoring', color: 'text-secondary' },
          { name: 'DevOps', color: 'text-gold' },
        ],
        tasks: [
          'Thiết kế kiến trúc cho feature phức tạp',
          'Mentor junior developers',
          'Technical interviews cho ứng viên',
          'Lead sprint planning và estimation',
          'Tối ưu hóa performance hệ thống',
        ],
        daySchedule:
          'Sáng: Architecture review và team sync. Chiều: Code feature lớn, pair programming. Tối: Self-learning về công nghệ mới.',
        challenge: 'Cân bằng giữa coding và các trách nhiệm kỹ thuật/kỹ năng mềm.',
        tip: 'Bắt đầu viết blog kỹ thuật và nói chuyện tại tech meetup.',
      },
      {
        id: 'manager',
        label: 'Manager',
        emoji: '🏆',
        salaryRange: '60–120 triệu',
        yearRange: '3+ năm',
        nextLevel: 'Director',
        skills: [
          { name: 'Leadership', color: 'text-primary' },
          { name: 'Strategy', color: 'text-mint' },
          { name: 'Cross-team Collab', color: 'text-secondary' },
          { name: 'Hiring', color: 'text-gold' },
        ],
        tasks: [
          'Định hướng kỹ thuật cho toàn team',
          'Hiring & onboarding thành viên mới',
          'Align technical roadmap với business goals',
          '1-on-1 coaching từng thành viên',
          'Báo cáo technical progress cho CTO',
        ],
        daySchedule:
          'Sáng: Team standup và unblock blockers. Chiều: 1:1s và stakeholder meetings. Tối: Strategy planning.',
        challenge: 'Chuyển từ contributor cá nhân sang người thúc đẩy cả team.',
        tip: 'Đọc "The Manager\'s Path" và tham gia Engineering Leadership communities.',
      },
    ],
  },
  {
    id: 'data',
    label: 'Data Scientist',
    icon: BarChart3,
    levels: [
      {
        id: 'intern',
        label: 'Intern',
        emoji: '🌱',
        salaryRange: '3–6 triệu',
        yearRange: '3–6 tháng',
        nextLevel: 'Junior',
        skills: [
          { name: 'Excel/Sheets', color: 'text-primary' },
          { name: 'SQL cơ bản', color: 'text-mint' },
          { name: 'Python/Pandas', color: 'text-secondary' },
          { name: 'Statistics', color: 'text-gold' },
        ],
        tasks: [
          'Làm sạch và chuẩn hóa dữ liệu',
          'Tạo báo cáo Excel/Sheets cơ bản',
          'Viết query SQL đơn giản',
          'Học Python với dataset có sẵn',
        ],
        daySchedule:
          'Sáng: Collect & clean data. Chiều: Phân tích cơ bản. Tối: học course/tutorial.',
        challenge: 'Làm quen với dữ liệu thực tế – lộn xộn và thiếu sót hơn bài tập rất nhiều.',
        tip: 'Làm ngay 1-2 dự án Kaggle, đăng lên portfolio GitHub.',
      },
      {
        id: 'junior',
        label: 'Junior',
        emoji: '🌿',
        salaryRange: '15–25 triệu',
        yearRange: '1–2 năm',
        nextLevel: 'Senior',
        skills: [
          { name: 'Python/Pandas', color: 'text-primary' },
          { name: 'SQL nâng cao', color: 'text-mint' },
          { name: 'Visualization', color: 'text-secondary' },
          { name: 'ML cơ bản', color: 'text-gold' },
        ],
        tasks: [
          'Phân tích dữ liệu kinh doanh hàng tuần',
          'Tạo dashboard Tableau/Power BI',
          'A/B test analysis',
          'Viết báo cáo insights cho manager',
        ],
        daySchedule:
          'Sáng: Pull data + clean. Chiều: Analyze + build chart. Tối: Viết report hoặc học thêm ML.',
        challenge: 'Học cách trình bày insight cho người không chuyên kỹ thuật.',
        tip: 'Mỗi project nên có 1 story: vấn đề → phân tích → đề xuất.',
      },
      {
        id: 'senior',
        label: 'Senior',
        emoji: '🌲',
        salaryRange: '30–60 triệu',
        yearRange: '2–4 năm',
        nextLevel: 'Lead',
        skills: [
          { name: 'Machine Learning', color: 'text-primary' },
          { name: 'Statistical Modeling', color: 'text-mint' },
          { name: 'Big Data', color: 'text-secondary' },
          { name: 'Storytelling', color: 'text-gold' },
        ],
        tasks: [
          'Xây dựng model dự đoán churn/revenue',
          'Thiết kế data pipeline',
          'Mentor junior analysts',
          'Thuyết trình insights cho C-level',
        ],
        daySchedule:
          'Sáng: Model training + evaluation. Chiều: Review junior work + collaborate với product. Tối: Research papers.',
        challenge: 'Từ phân tích một chiều → tư duy data strategy cho toàn công ty.',
        tip: 'Học Spark/Databricks khi data vượt quá RAM. MLOps là kỹ năng hot nhất 2026.',
      },
      {
        id: 'manager',
        label: 'Lead/Manager',
        emoji: '🏆',
        salaryRange: '55–100 triệu',
        yearRange: '3+ năm',
        nextLevel: 'Head of Data',
        skills: [
          { name: 'Data Architecture', color: 'text-primary' },
          { name: 'MLOps', color: 'text-mint' },
          { name: 'Team Leadership', color: 'text-secondary' },
          { name: 'Business Acumen', color: 'text-gold' },
        ],
        tasks: [
          'Định hướng data strategy',
          'Xây dựng data culture trong tổ chức',
          'Hiring data team',
          'Align OKR data với business',
        ],
        daySchedule:
          'Sáng: Team standup + roadmap review. Chiều: Cross-team collaboration. Tối: Learning & networking.',
        challenge: 'Chuyển từ "làm bằng tay" sang "scale bằng hệ thống và con người".',
        tip: 'Tham gia Vietnam Data Science community và tích cực chia sẻ kiến thức.',
      },
    ],
  },
  {
    id: 'ux',
    label: 'UX Designer',
    icon: Users,
    levels: [
      {
        id: 'intern',
        label: 'Intern',
        emoji: '🌱',
        salaryRange: '3–7 triệu',
        yearRange: '3–6 tháng',
        nextLevel: 'Junior',
        skills: [
          { name: 'Figma cơ bản', color: 'text-primary' },
          { name: 'User Research', color: 'text-mint' },
          { name: 'Wireframing', color: 'text-secondary' },
          { name: 'Design Principles', color: 'text-gold' },
        ],
        tasks: [
          'Tạo wireframe theo brief từ senior',
          'Tham gia user interview',
          'Build component trong Figma',
          'Viết báo cáo usability cơ bản',
        ],
        daySchedule:
          'Sáng: Design sprint. Chiều: Figma + prototype. Tối: Design inspiration research.',
        challenge: 'Thiết kế đẹp VÀ usable – cân bằng giữa 2 yếu tố này là thử thách đầu tiên.',
        tip: 'Hàng ngày review Dribbble, Mobbin, Figma Community để nâng cảm nhận.',
      },
      {
        id: 'junior',
        label: 'Junior',
        emoji: '🌿',
        salaryRange: '12–20 triệu',
        yearRange: '1–2 năm',
        nextLevel: 'Senior',
        skills: [
          { name: 'Figma nâng cao', color: 'text-primary' },
          { name: 'Prototyping', color: 'text-mint' },
          { name: 'Design System', color: 'text-secondary' },
          { name: 'User Testing', color: 'text-gold' },
        ],
        tasks: [
          'Thiết kế full flow cho feature mới',
          'Conduct usability testing',
          'Maintain design system',
          'Collaborate với dev để handoff',
        ],
        daySchedule:
          'Sáng: User research review. Chiều: Design iteration. Tối: Developer handoff check.',
        challenge: 'Justify design decision với stakeholder không có background design.',
        tip: 'Học cách đọc số liệu analytics để support design decision bằng data.',
      },
      {
        id: 'senior',
        label: 'Senior',
        emoji: '🌲',
        salaryRange: '25–50 triệu',
        yearRange: '2–4 năm',
        nextLevel: 'Lead',
        skills: [
          { name: 'UX Strategy', color: 'text-primary' },
          { name: 'Service Design', color: 'text-mint' },
          { name: 'Design Leadership', color: 'text-secondary' },
          { name: 'Motion/Interaction', color: 'text-gold' },
        ],
        tasks: [
          'Lead design cho product area',
          'Xây dựng design system toàn dự án',
          'Mentor junior/mid designers',
          'Work directly với PM và stakeholders',
        ],
        daySchedule:
          'Sáng: Design reviews + strategy. Chiều: Deep design work. Tối: Community + learning.',
        challenge: 'Cân bằng giữa "làm tốt mình" và "đưa cả team lên".',
        tip: 'Xây dựng case study chất lượng cao hơn số lượng dự án trong portfolio.',
      },
      {
        id: 'manager',
        label: 'Lead/Manager',
        emoji: '🏆',
        salaryRange: '50–90 triệu',
        yearRange: '3+ năm',
        nextLevel: 'Head of Design',
        skills: [
          { name: 'Design Ops', color: 'text-primary' },
          { name: 'Brand Strategy', color: 'text-mint' },
          { name: 'Team Building', color: 'text-secondary' },
          { name: 'Product Vision', color: 'text-gold' },
        ],
        tasks: [
          'Định hướng design language công ty',
          'Hire & grow design team',
          'Align design với business strategy',
          'Partner với CPO về product vision',
        ],
        daySchedule:
          'Sáng: Cross-function meetings. Chiều: Design review + hiring. Tối: Industry networking.',
        challenge: 'Chuyển từ individual design sang enabling team tạo ra design tốt.',
        tip: 'Đọc "Org Design for Design Orgs" – cuốn sách gam changer cho design leader.',
      },
    ],
  },
  {
    id: 'pm',
    label: 'Product Manager',
    icon: Briefcase,
    levels: [
      {
        id: 'intern',
        label: 'Intern',
        emoji: '🌱',
        salaryRange: '4–7 triệu',
        yearRange: '3–6 tháng',
        nextLevel: 'Junior',
        skills: [
          { name: 'Jira/Notion', color: 'text-primary' },
          { name: 'User Story', color: 'text-mint' },
          { name: 'Wireframing', color: 'text-secondary' },
          { name: 'Giao tiếp', color: 'text-gold' },
        ],
        tasks: [
          'Theo dõi sprint progress',
          'Ghi chú và phân tích user feedback',
          'Hỗ trợ PM senior viết PRD',
          'Tham gia grooming và planning',
        ],
        daySchedule:
          'Sáng: Daily standup + note-taking. Chiều: Nghiên cứu thị trường + viết user story. Tối: Đọc case study PM.',
        challenge:
          'PM thực tế ít "chiến lược" hơn và nhiều "điều phối + giải quyết block" hơn bạn nghĩ.',
        tip: 'Đọc blog Lenny Rachitsky và làm quen với AARRR metrics ngay từ đầu.',
      },
      {
        id: 'junior',
        label: 'Junior',
        emoji: '🌿',
        salaryRange: '15–28 triệu',
        yearRange: '1–2 năm',
        nextLevel: 'Senior',
        skills: [
          { name: 'Product Roadmap', color: 'text-primary' },
          { name: 'Data-driven', color: 'text-mint' },
          { name: 'Agile/Scrum', color: 'text-secondary' },
          { name: 'A/B Testing', color: 'text-gold' },
        ],
        tasks: [
          'Viết PRD đầy đủ cho feature',
          'Ưu tiên backlog dựa trên impact/effort',
          'Phối hợp design + dev + QA',
          'Theo dõi KPI sau release',
        ],
        daySchedule:
          'Sáng: Check metrics + standup. Chiều: Write specs + cross-team sync. Tối: User research.',
        challenge: 'Ra quyết định với thông tin chưa đủ và thuyết phục team chưa tin tưởng.',
        tip: 'Mỗi decision cần có khung PRD: Problem → Solution → Metric → Risk.',
      },
      {
        id: 'senior',
        label: 'Senior',
        emoji: '🌲',
        salaryRange: '30–60 triệu',
        yearRange: '2–5 năm',
        nextLevel: 'Lead',
        skills: [
          { name: 'Product Strategy', color: 'text-primary' },
          { name: 'Revenue Optim.', color: 'text-mint' },
          { name: 'OKRs', color: 'text-secondary' },
          { name: 'Stakeholder Mgmt', color: 'text-gold' },
        ],
        tasks: [
          'Định hướng strategy cho product area',
          'OKR planning theo quý',
          'Mentor junior PMs',
          'Present roadmap cho leadership',
        ],
        daySchedule:
          'Sáng: Metrics deep dive. Chiều: Strategy work + stakeholder comms. Tối: Reads/networking.',
        challenge: 'Cân bằng user needs vs business goals vs technical constraints đồng thời.',
        tip: 'Develop "product sense" bằng cách dùng nhiều sản phẩm khác nhau và viết teardowns.',
      },
      {
        id: 'manager',
        label: 'CPO/Head',
        emoji: '🏆',
        salaryRange: '60–120+ triệu',
        yearRange: '5+ năm',
        nextLevel: 'CEO/Co-founder',
        skills: [
          { name: 'Vision Setting', color: 'text-primary' },
          { name: 'P&L Ownership', color: 'text-mint' },
          { name: 'Org Design', color: 'text-secondary' },
          { name: 'Board Comms', color: 'text-gold' },
        ],
        tasks: [
          'Xây dựng product vision 3-5 năm',
          'Tuyển dụng và phát triển team PM',
          'Báo cáo product metrics cho board',
          'Align portfolio sản phẩm với company strategy',
        ],
        daySchedule:
          'Sáng: Leadership meetings. Chiều: 1:1 PMs + deep strategy. Tối: External events + reading.',
        challenge: 'Duy trì customer obsession khi xa nhất khỏi người dùng thực tế.',
        tip: 'Đọc "Inspired" và "Empowered" của Marty Cagan – kinh thánh của CPO.',
      },
    ],
  },
];

/* ─── Level color helpers ─── */
const levelBg = (idx: number) =>
  [
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-cyan-600',
    'from-violet-500 to-purple-600',
    'from-amber-500 to-orange-600',
  ][idx];

const levelDot = ['bg-emerald-500', 'bg-blue-500', 'bg-violet-500', 'bg-amber-500'];

/* ─── Component ─── */
const CareerSimulation = () => {
  const [careerId, setCareerId] = useState('software');
  const [levelIdx, setLevelIdx] = useState(0);

  const career = careers.find((c) => c.id === careerId)!;
  const level = career.levels[levelIdx];
  const totalLevels = career.levels.length;

  const switchCareer = (id: string) => {
    setCareerId(id);
    setLevelIdx(0);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-card">
        <div className="container py-10 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="bg-primary/10 text-primary mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
              <Star className="h-4 w-4" /> Trải nghiệm thực tế
            </span>
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              Mô phỏng hành trình nghề nghiệp
            </h1>
            <p className="text-muted-foreground mt-2">
              Khám phá cuộc sống thực tế ở từng cấp độ sự nghiệp trước khi quyết định
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mt-6 space-y-6">
        {/* Career tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {careers.map((c) => (
            <button
              key={c.id}
              onClick={() => switchCareer(c.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                careerId === c.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <c.icon className="h-4 w-4" />
              {c.label}
            </button>
          ))}
        </div>

        {/* Progress timeline */}
        <div className="glass-card rounded-2xl p-4">
          <p className="text-muted-foreground mb-3 text-sm font-medium">
            Lộ trình thăng tiến ({career.label}):
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {career.levels.map((lv, i) => (
              <div key={lv.id} className="flex items-center gap-2">
                <button
                  onClick={() => setLevelIdx(i)}
                  className={`flex shrink-0 flex-col items-center gap-1 rounded-xl px-4 py-2 text-center transition-all ${
                    i === levelIdx
                      ? `bg-linear-to-br ${levelBg(i)} text-white shadow-lg`
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <span className="text-xl">{lv.emoji}</span>
                  <span className="text-xs font-semibold">{lv.label}</span>
                  <span
                    className={`text-xs ${i === levelIdx ? 'text-white/80' : 'text-muted-foreground'}`}
                  >
                    {lv.salaryRange}
                  </span>
                </button>
                {i < totalLevels - 1 && (
                  <ChevronRight className="text-muted-foreground h-4 w-4 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main 2-col layout */}
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          {/* Left: Level card */}
          <motion.div
            key={`${careerId}-${levelIdx}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            {/* Level hero card */}
            <div className={`rounded-2xl bg-linear-to-br ${levelBg(levelIdx)} p-6 text-white`}>
              <p className="mb-2 text-sm font-medium text-white/70">Cấp độ</p>
              <div className="mb-5 flex items-center gap-3">
                <span className="text-4xl">{level.emoji}</span>
                <div>
                  <p className="text-2xl font-bold">{level.label}</p>
                  <p className="text-white/80">{career.label}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: DollarSign, label: 'Lương', value: level.salaryRange },
                  { icon: Clock, label: 'Thời gian', value: level.yearRange },
                  { icon: TrendingUp, label: 'Cấp tiếp theo', value: level.nextLevel },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-white/20 px-3 py-2.5 text-center backdrop-blur-sm"
                  >
                    <Icon className="mx-auto mb-1 h-4 w-4 text-white/80" />
                    <p className="text-xs text-white/70">{label}</p>
                    <p className="text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily tasks */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display mb-3 flex items-center gap-2 font-semibold">
                <span>📋</span> Nhiệm vụ hàng ngày
              </h3>
              <ul className="space-y-2">
                {level.tasks.map((task) => (
                  <li key={task} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="text-mint mt-0.5 h-4 w-4 shrink-0" />
                    <span className="text-foreground">{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Day schedule */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display mb-3 flex items-center gap-2 font-semibold">
                <span>⏰</span> Một ngày làm việc tiêu biểu
              </h3>
              <p className="bg-muted/60 text-muted-foreground rounded-xl p-3 text-sm leading-relaxed">
                {level.daySchedule}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={levelIdx === 0}
                onClick={() => setLevelIdx((v) => v - 1)}
              >
                <ChevronLeft className="h-4 w-4" /> Trước
              </Button>
              <span className="text-muted-foreground text-xs">
                {levelIdx + 1} / {totalLevels}
              </span>
              <Button
                variant="hero"
                size="sm"
                className="gap-1.5"
                disabled={levelIdx === totalLevels - 1}
                onClick={() => setLevelIdx((v) => v + 1)}
              >
                Tiếp <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Bottom 2 cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
                <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400">
                  <Zap className="h-4 w-4" /> Thách thức lớn nhất
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">{level.challenge}</p>
              </div>
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/40">
                <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                  <Lightbulb className="h-4 w-4" /> Tips từ Senior
                </div>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">{level.tip}</p>
              </div>
            </div>
          </motion.div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Skills */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display mb-3 flex items-center gap-2 font-semibold">
                <span className="text-primary">◈</span> Kỹ năng cần có
              </h3>
              <ul className="space-y-2">
                {level.skills.map((sk) => (
                  <li key={sk.name} className="flex items-center gap-2.5 text-sm">
                    <span className={`h-2 w-2 rounded-full ${levelDot[levelIdx]} shrink-0`} />
                    <span className={`font-medium ${sk.color}`}>{sk.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Roadmap overview */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display mb-3 text-sm font-semibold">Tổng quan lộ trình</h3>
              <ul className="space-y-2">
                {career.levels.map((lv, i) => (
                  <button
                    key={lv.id}
                    onClick={() => setLevelIdx(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      i === levelIdx
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted/60 text-foreground'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${levelDot[i]}`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold">{lv.label}</p>
                      <p className="text-muted-foreground text-xs">
                        {lv.salaryRange} · {lv.yearRange}
                      </p>
                    </div>
                    {i === levelIdx && (
                      <span className="bg-primary ml-auto h-2 w-2 shrink-0 rounded-full" />
                    )}
                  </button>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerSimulation;
