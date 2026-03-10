'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, X, XCircle } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/* ─── Career data ─── */
const allCareers = [
  {
    id: 'software-engineer',
    icon: '💻',
    name: 'Kỹ sư Phần mềm',
    match: 92,
    salary: 42,
    salaryRange: '25–60',
    growth: '+22% đến 2030',
    growthPct: 22,
    difficultyLabel: 'Trung bình',
    difficultyStars: 3,
    skills: ['JavaScript', 'Python', 'React', 'System Design'],
    pros: ['Lương cao', 'Remote-friendly', 'Nhu cầu cao', 'Đa dạng lĩnh vực'],
    cons: ['Áp lực deadline', 'Cần học liên tục'],
    jobOpportunity: 95,
    wlb: 70,
    yearsStudy: 4,
    color: '#7c3aed',
    radarColor: '#7c3aed',
  },
  {
    id: 'data-scientist',
    icon: '📊',
    name: 'Data Scientist',
    match: 87,
    salary: 35,
    salaryRange: '20–50',
    growth: '+35% đến 2030',
    growthPct: 35,
    difficultyLabel: 'Khó',
    difficultyStars: 4,
    skills: ['Python', 'SQL', 'Statistics', 'ML'],
    pros: ['Xu hướng mạnh', 'Nhiều ngành áp dụng', 'Lương tốt', 'Học thêm sâu'],
    cons: ['Cần nhiều kinh nghiệm'],
    jobOpportunity: 85,
    wlb: 75,
    yearsStudy: 4,
    color: '#0ea5e9',
    radarColor: '#0ea5e9',
  },
  {
    id: 'ux-ui',
    icon: '🎨',
    name: 'UX/UI Designer',
    match: 65,
    salary: 27,
    salaryRange: '15–40',
    growth: '+18% đến 2030',
    growthPct: 18,
    difficultyLabel: 'Khó',
    difficultyStars: 3,
    skills: ['Figma', 'Research', 'Prototyping'],
    pros: [
      'Sáng tạo tự do',
      'Cân bằng cuộc sống',
      'Portfolio trực quan',
      'Lương thấp hơn lập trình',
    ],
    cons: ['Khó ở tỉnh lẻ'],
    jobOpportunity: 78,
    wlb: 85,
    yearsStudy: 3,
    color: '#f43f5e',
    radarColor: '#f43f5e',
  },
  {
    id: 'product-manager',
    icon: '🎯',
    name: 'Product Manager',
    match: 78,
    salary: 48,
    salaryRange: '25–70',
    growth: '+25% đến 2030',
    growthPct: 25,
    difficultyLabel: 'Rất khó',
    difficultyStars: 4,
    skills: ['Strategy', 'Agile', 'Data Analysis', 'Communication'],
    pros: ['Lương cao', 'Ảnh hưởng lớn', 'Phát triển nhanh'],
    cons: ['Áp lực cao', 'Cần kinh nghiệm'],
    jobOpportunity: 80,
    wlb: 65,
    yearsStudy: 4,
    color: '#10b981',
    radarColor: '#10b981',
  },
  {
    id: 'ai-ml',
    icon: '🤖',
    name: 'Kỹ sư AI/ML',
    match: 85,
    salary: 55,
    salaryRange: '30–80',
    growth: '+45% đến 2030',
    growthPct: 45,
    difficultyLabel: 'Rất khó',
    difficultyStars: 5,
    skills: ['Deep Learning', 'TensorFlow', 'Python', 'Research'],
    pros: ['Lương rất cao', 'Xu hướng #1', 'Toàn cầu'],
    cons: ['Cần nền tảng toán mạnh', 'Cạnh tranh cao'],
    jobOpportunity: 90,
    wlb: 68,
    yearsStudy: 5,
    color: '#f59e0b',
    radarColor: '#f59e0b',
  },
];

/* ─── Difficulty stars ─── */
const DifficultyStars = ({ count }: { count: number }) => (
  <span className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={`text-xs ${i <= count ? 'text-gold' : 'text-muted-foreground'}`}>
        ★
      </span>
    ))}
  </span>
);

/* ─── Table row ─── */
const TableRow = ({
  label,
  values,
  highlight,
}: {
  label: string;
  values: (string | number)[];
  highlight?: boolean;
}) => (
  <tr className={highlight ? 'bg-primary/5' : ''}>
    <td className="text-muted-foreground py-3 pr-4 text-sm font-medium">{label}</td>
    {values.map((v, i) => (
      <td key={i} className="px-4 py-3 text-center text-sm font-semibold">
        {v}
      </td>
    ))}
  </tr>
);

/* ─── Main component ─── */
const CareerCompare = () => {
  const [selected, setSelected] = useState<string[]>([
    'software-engineer',
    'data-scientist',
    'ux-ui',
  ]);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length > 1) setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  const selectedCareers = allCareers.filter((c) => selected.includes(c.id));
  const unselected = allCareers.filter((c) => !selected.includes(c.id));

  /* Radar data */
  const radarData = [
    {
      subject: 'Lương',
      ...Object.fromEntries(
        selectedCareers.map((c) => [c.name, Math.round((c.salary / 80) * 100)]),
      ),
    },
    {
      subject: 'Cơ hội VL',
      ...Object.fromEntries(selectedCareers.map((c) => [c.name, c.jobOpportunity])),
    },
    {
      subject: 'Tăng trưởng',
      ...Object.fromEntries(selectedCareers.map((c) => [c.name, Math.min(c.growthPct * 1.8, 100)])),
    },
    {
      subject: 'WLB',
      ...Object.fromEntries(selectedCareers.map((c) => [c.name, c.wlb])),
    },
  ];

  /* Bar data */
  const barMetrics = [
    { key: 'Lương (tr)', values: selectedCareers.map((c) => c.salary) },
    { key: 'Cơ hội VL (%)', values: selectedCareers.map((c) => c.jobOpportunity) },
    { key: 'Tăng trưởng (%)', values: selectedCareers.map((c) => c.growthPct) },
    { key: 'Work-Life Balance', values: selectedCareers.map((c) => c.wlb) },
  ];
  const barData = barMetrics.map((m) => ({
    name: m.key,
    ...Object.fromEntries(selectedCareers.map((c, i) => [c.name, m.values[i]])),
  }));

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-card">
        <div className="container py-10 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="bg-primary/10 text-primary mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
              So sánh 2–3 nghề
            </span>
            <h1 className="font-display text-3xl font-bold md:text-4xl">So sánh nghề nghiệp</h1>
            <p className="text-muted-foreground mt-2">
              Chọn 2–3 nghề để so sánh chi tiết lương, kỹ năng, cơ hội và lộ trình phát triển
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mt-6 space-y-8">
        {/* Selector */}
        <div className="glass-card rounded-2xl p-5">
          <p className="text-muted-foreground mb-3 text-sm font-medium">
            Chọn nghề để so sánh ({selected.length}/3):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedCareers.map((c) => (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: c.color }}
              >
                {c.icon} {c.name} <X className="h-3.5 w-3.5" />
              </button>
            ))}
            {unselected.map((c) => (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                disabled={selected.length >= 3}
                className="border-border text-foreground hover:bg-muted flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {selectedCareers.map((career, i) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card overflow-hidden rounded-2xl"
            >
              {/* Top strip */}
              <div className="h-1.5 w-full" style={{ background: career.color }} />

              <div className="space-y-4 p-5">
                {/* Name + match */}
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-2xl">{career.icon}</span>
                    <h3 className="font-display font-semibold">{career.name}</h3>
                  </div>
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                    style={{ background: career.color }}
                  >
                    {career.match}% phù hợp với bạn
                  </span>
                </div>

                {/* Salary */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-mint text-base font-semibold">
                    Lương TB: {career.salary} triệu/tháng
                  </span>
                </div>

                {/* Growth */}
                <div className="text-mint flex items-center gap-1.5 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">{career.growth}</span>
                </div>

                {/* Difficulty */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Độ khó:</span>
                  <DifficultyStars count={career.difficultyStars} />
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {career.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                      style={{ background: career.color + 'cc' }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Pros */}
                <div className="space-y-1">
                  {career.pros.map((p) => (
                    <div key={p} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="text-mint h-3.5 w-3.5 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                  {career.cons.map((c) => (
                    <div key={c} className="text-muted-foreground flex items-center gap-2 text-xs">
                      <XCircle className="text-destructive h-3.5 w-3.5 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Radar */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display mb-4 font-semibold">Biểu đồ so sánh tổng thể</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                {selectedCareers.map((c) => (
                  <Radar
                    key={c.id}
                    name={c.name}
                    dataKey={c.name}
                    stroke={c.color}
                    fill={c.color}
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />
                ))}
                <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '0.75rem',
                    border: '1px solid hsl(var(--border))',
                    fontSize: 12,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display mb-4 font-semibold">So sánh chỉ số cụ thể</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '0.75rem',
                    border: '1px solid hsl(var(--border))',
                    fontSize: 12,
                  }}
                />
                <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
                {selectedCareers.map((c) => (
                  <Bar
                    key={c.id}
                    dataKey={c.name}
                    fill={c.color}
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed table */}
        <div className="glass-card overflow-hidden rounded-2xl">
          <div className="border-border border-b px-6 py-4">
            <h3 className="font-display font-semibold">So sánh chi tiết</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-muted-foreground w-36 py-3 pr-4 text-left text-sm font-semibold">
                    Tiêu chí
                  </th>
                  {selectedCareers.map((c) => (
                    <th key={c.id} className="px-4 py-3 text-center text-sm font-semibold">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">{c.icon}</span>
                        <span style={{ color: c.color }}>{c.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                <TableRow
                  label="Lương TB"
                  values={selectedCareers.map((c) => `${c.salary}tr/tháng`)}
                  highlight
                />
                <TableRow label="Độ phù hợp" values={selectedCareers.map((c) => `${c.match}%`)} />
                <TableRow
                  label="Tăng trưởng"
                  values={selectedCareers.map((c) => `+${c.growthPct}%`)}
                  highlight
                />
                <TableRow
                  label="Cơ hội việc làm"
                  values={selectedCareers.map((c) => `${c.jobOpportunity}%`)}
                />
                <TableRow
                  label="Work-Life Balance"
                  values={selectedCareers.map((c) => `${c.wlb}/100`)}
                  highlight
                />
                <TableRow
                  label="Số năm đào tạo"
                  values={selectedCareers.map((c) => `${c.yearsStudy} năm`)}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerCompare;
