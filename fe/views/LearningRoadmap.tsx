'use client';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Lock,
  Target,
  Trophy,
} from 'lucide-react';
import { useState } from 'react';

const roadmapData = [
  {
    phase: 'Tháng 1–3',
    title: 'Nền tảng & Công cụ',
    status: 'completed',
    progress: 100,
    milestones: [
      {
        title: 'HTML/CSS cơ bản → nâng cao',
        done: true,
        desc: 'Responsive, Flexbox, Grid, accessibility',
        tasks: [
          'Box model & layout',
          'Flexbox exercises',
          'Grid basics',
          'Accessibility checklist',
        ],
      },
      {
        title: 'JavaScript cơ bản',
        done: true,
        desc: 'ES6+, DOM, async/await',
        tasks: [
          'Variables & scope',
          'Functions & closures',
          'DOM manipulation',
          'Fetch + async/await',
        ],
      },
      {
        title: 'Git + GitHub',
        done: true,
        desc: 'Branching, PR, collaboration',
        tasks: [
          'Init repo & commits',
          'Branching workflow',
          'Open PR & review',
          'Resolve merge conflicts',
        ],
      },
      {
        title: 'Mini project: Portfolio',
        done: true,
        desc: 'Host trên GitHub Pages/Vercel',
        tasks: ['Design layout', 'Implement pages', 'Deploy to Vercel', 'Write README & showcase'],
      },
    ],
    skills: ['HTML/CSS', 'JavaScript', 'Git'],
    kpi: 'Hoàn thành portfolio cơ bản và repo gọn gàng',
  },
  {
    phase: 'Tháng 4–6',
    title: 'Frontend & Tooling',
    status: 'current',
    progress: 35,
    milestones: [
      {
        title: 'React cơ bản → nâng cao',
        done: false,
        desc: 'Components, hooks, router, performance',
        tasks: ['Create components', 'UseState & UseEffect', 'React Router', 'Optimize renders'],
      },
      {
        title: 'TypeScript cơ bản',
        done: false,
        desc: 'Types, interfaces, generics',
        tasks: ['Types for props', 'Interfaces vs types', 'Generics examples'],
      },
      {
        title: 'State management',
        done: false,
        desc: 'Context, Redux hoặc Zustand',
        tasks: ['Context API', 'Redux basics', 'Zustand intro'],
      },
      {
        title: 'Project: SPA có state & routing',
        done: false,
        desc: 'Deploy có CI',
        tasks: ['Design app routes', 'Implement state flows', 'Set up GitHub Actions'],
      },
    ],
    skills: ['React', 'TypeScript', 'State Management'],
    kpi: 'Deploy 1 SPA có state + CI/CD',
  },
  {
    phase: 'Tháng 7–12',
    title: 'Backend & Fullstack',
    status: 'locked',
    progress: 0,
    milestones: [
      {
        title: 'Node.js + Express (hoặc Nest)',
        done: false,
        desc: 'REST API, auth, validation',
        tasks: ['Setup server', 'Routes & controllers', 'JWT auth'],
      },
      {
        title: 'Database cơ bản',
        done: false,
        desc: 'Postgres / Mongo, ORM',
        tasks: ['Schema design', 'CRUD queries', 'Use ORM (Prisma/TypeORM/Mongoose)'],
      },
      {
        title: 'Testing & TDD',
        done: false,
        desc: 'Unit + integration tests',
        tasks: ['Write unit tests', 'Integration tests with DB', 'Mocking'],
      },
      {
        title: 'Project: Fullstack CRUD App',
        done: false,
        desc: 'Auth + DB + Deployment',
        tasks: ['Design feature list', 'Implement backend & frontend', 'Deploy & monitor'],
      },
    ],
    skills: ['Node.js', 'Databases', 'Testing', 'Deployment'],
    kpi: 'Hoàn thành 1 fullstack app production-ready',
  },
  {
    phase: 'Năm 2',
    title: 'Chuyên sâu & Chuẩn bị tuyển dụng',
    status: 'locked',
    progress: 0,
    milestones: [
      {
        title: 'System Design cơ bản',
        done: false,
        desc: 'Scalability, caching, load balancing',
        tasks: ['Read system-design primer', 'Draw architecture diagrams', 'Discuss trade-offs'],
      },
      {
        title: 'Algorithms & LeetCode (medium)',
        done: false,
        desc: 'Practice interview problems',
        tasks: ['Array & strings', 'Trees & graphs', 'Dynamic programming basics'],
      },
      {
        title: 'Performance & Security',
        done: false,
        desc: 'Profiling, OWASP basics',
        tasks: ['Use profiler', 'Fix bottlenecks', 'Learn OWASP Top10'],
      },
      {
        title: 'Portfolio nâng cao & Open-source',
        done: false,
        desc: 'Projects with tests and docs',
        tasks: ['Add tests', 'Write docs', 'Publish project'],
      },
    ],
    skills: ['System Design', 'Algorithms', 'Security'],
    kpi: 'Sẵn sàng phỏng vấn: pass coding + system-design interviews',
  },
];

const LearningRoadmap = () => {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-card">
        <div className="container py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-primary/10 text-primary mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm">
              <BookOpen className="h-4 w-4" /> Lộ trình cá nhân hóa
            </div>
            <h1 className="font-display text-2xl font-bold md:text-3xl">Lộ trình Kĩ sư Phần Mềm</h1>
            <p className="text-muted-foreground mt-1">Dựa trên profile và mục tiêu của bạn</p>
          </motion.div>
        </div>
      </div>

      <div className="container mt-6 space-y-4">
        {roadmapData.map((phase, i) => {
          const isExpanded = expanded === i;
          const isCurrent = phase.status === 'current';
          const isLocked = phase.status === 'locked';

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card overflow-hidden rounded-2xl ${isLocked ? 'opacity-60' : ''}`}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : i)}
                className={`flex w-full cursor-pointer items-center gap-4 p-6 text-left`}
              >
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
                    isCurrent ? 'bg-gradient-hero' : isLocked ? 'bg-muted' : 'bg-mint'
                  }`}
                >
                  {isCurrent ? (
                    <Clock className="text-primary-foreground h-6 w-6" />
                  ) : isLocked ? (
                    <Target className="text-muted-foreground h-6 w-6" />
                  ) : (
                    <Trophy className="text-primary-foreground h-6 w-6" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    {phase.phase}
                  </div>
                  <div className="text-lg font-semibold">
                    {phase.title}
                    {isLocked && (
                      <Lock className="text-muted-foreground ml-2 inline-block h-4 w-4" />
                    )}
                  </div>
                  {isCurrent && (
                    <Progress value={phase.progress} className="mt-2 h-1.5 max-w-[200px]" />
                  )}
                </div>
                {isCurrent && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">Đang học</Badge>
                )}
                {isLocked && (
                  <Badge variant="outline" className="text-muted-foreground border-border gap-1">
                    <Lock className="h-3 w-3" /> Chưa mở
                  </Badge>
                )}
                {!isLocked &&
                  (isExpanded ? (
                    <ChevronUp className="text-muted-foreground h-5 w-5" />
                  ) : (
                    <ChevronDown className="text-muted-foreground h-5 w-5" />
                  ))}
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="space-y-4 px-6 pb-6"
                >
                  {/* Milestones */}
                  <div className="space-y-3">
                    {phase.milestones.map((m, j) => (
                      <div key={j} className="bg-muted/50 flex items-start gap-3 rounded-xl p-3">
                        <CheckCircle2
                          className={`mt-0.5 h-5 w-5 flex-shrink-0 ${m.done ? 'text-mint' : 'text-muted-foreground/30'}`}
                        />
                        <div>
                          <div
                            className={`text-sm font-medium ${m.done ? 'text-muted-foreground line-through' : ''}`}
                          >
                            {m.title}
                          </div>
                          <div className="text-muted-foreground text-xs">{m.desc}</div>
                          {m.tasks && (
                            <ul className="text-muted-foreground mt-2 ml-4 list-disc text-xs">
                              {m.tasks.map((t, ti) => (
                                <li key={ti}>{t}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="mb-2 text-sm font-medium">Kỹ năng cần đạt:</div>
                    <div className="flex flex-wrap gap-2">
                      {phase.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* KPI */}
                  <div className="bg-primary/5 border-primary/10 rounded-xl border p-3">
                    <div className="text-primary mb-1 text-xs font-medium">🎯 KPI giai đoạn</div>
                    <div className="text-sm">{phase.kpi}</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningRoadmap;
