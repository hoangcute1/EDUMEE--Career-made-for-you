"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Briefcase, Code, TrendingUp, Users, DollarSign, Clock,
  ChevronRight, Star, BookOpen, Lightbulb
} from "lucide-react";

const careers = [
  { id: "frontend", label: "Frontend Developer", icon: Code },
  { id: "ba", label: "Business Analyst", icon: Briefcase },
  { id: "pm", label: "Product Manager", icon: Users },
  { id: "data", label: "Data Analyst", icon: TrendingUp },
];

const levels: Record<string, Array<{
  level: string;
  title: string;
  salary: string;
  years: string;
  skills: string[];
  tasks: string[];
  tips: string;
}>> = {
  frontend: [
    {
      level: "Intern",
      title: "Frontend Intern",
      salary: "3-6 triệu/tháng",
      years: "0-6 tháng",
      skills: ["HTML/CSS cơ bản", "JavaScript cơ bản", "Git"],
      tasks: ["Fix bug đơn giản", "Tạo UI component", "Học codebase"],
      tips: "Tập trung vào basic, đọc code người khác nhiều",
    },
    {
      level: "Junior",
      title: "Junior Frontend Dev",
      salary: "8-15 triệu/tháng",
      years: "6 tháng - 2 năm",
      skills: ["React/Vue", "TypeScript", "REST APIs", "Responsive Design"],
      tasks: ["Phát triển feature mới", "Code review cơ bản", "Viết unit test"],
      tips: "Xây portfolio, đóng góp open-source",
    },
    {
      level: "Senior",
      title: "Senior Frontend Dev",
      salary: "25-45 triệu/tháng",
      years: "3-5 năm",
      skills: ["Architecture patterns", "Performance optimization", "Mentoring", "System design"],
      tasks: ["Thiết kế architecture", "Lead technical decisions", "Mentor junior"],
      tips: "Bắt đầu viết blog, nói chuyện tại meetup",
    },
    {
      level: "Lead/Manager",
      title: "Tech Lead / Engineering Manager",
      salary: "45-80+ triệu/tháng",
      years: "5+ năm",
      skills: ["Team leadership", "Project management", "Strategic thinking", "Cross-team collab"],
      tasks: ["Định hướng kỹ thuật team", "Hiring & onboarding", "Align với business goals"],
      tips: "Phát triển soft skills, đọc sách leadership",
    },
  ],
};

// Reuse frontend data for others (demo)
levels.ba = levels.frontend;
levels.pm = levels.frontend;
levels.data = levels.frontend;

const CareerSimulation = () => {
  const [selectedCareer, setSelectedCareer] = useState("frontend");
  const [expandedLevel, setExpandedLevel] = useState<number | null>(0);

  const data = levels[selectedCareer];

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-card">
        <div className="container py-8">
          <h1 className="text-2xl md:text-3xl font-bold font-display mb-2">Mô phỏng nghề nghiệp</h1>
          <p className="text-muted-foreground">Khám phá hành trình phát triển trong từng ngành</p>
        </div>
      </div>

      <div className="container mt-6 space-y-6">
        {/* Career selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {careers.map((c) => (
            <Button
              key={c.id}
              variant={selectedCareer === c.id ? "default" : "outline"}
              size="sm"
              onClick={() => { setSelectedCareer(c.id); setExpandedLevel(0); }}
              className="gap-2 flex-shrink-0"
            >
              <c.icon className="w-4 h-4" />
              {c.label}
            </Button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-4">
            {data.map((item, i) => {
              const expanded = expandedLevel === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <button
                    onClick={() => setExpandedLevel(expanded ? null : i)}
                    className="w-full text-left flex items-start gap-4"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      i === 0 ? "bg-primary ring-4 ring-primary/20" :
                      i === 1 ? "bg-mint" :
                      i === 2 ? "bg-secondary" : "bg-accent"
                    }`}>
                      <span className="text-xs font-bold text-primary-foreground">{i + 1}</span>
                    </div>
                    <div className="flex-1 glass-card rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">{item.level}</div>
                          <div className="font-semibold">{item.title}</div>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
                      </div>

                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="mt-4 space-y-4 border-t border-border pt-4"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-mint" />
                              <span>{item.salary}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-secondary" />
                              <span>{item.years}</span>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium flex items-center gap-1 mb-2">
                              <Star className="w-3 h-3 text-gold" /> Kỹ năng cần có
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {item.skills.map((s) => (
                                <span key={s} className="text-xs px-2 py-1 rounded-full bg-sky-light text-primary font-medium">{s}</span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium flex items-center gap-1 mb-2">
                              <BookOpen className="w-3 h-3 text-primary" /> Công việc hàng ngày
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {item.tasks.map((t) => (
                                <li key={t} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                  {t}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-gold-light rounded-lg p-3 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{item.tips}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerSimulation;
