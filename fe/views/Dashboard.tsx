"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Compass, TrendingUp, Award, Target, BookOpen, GitCompare, 
  Users, ArrowRight, Star, Zap, MapPin
} from "lucide-react";

const journeySteps = [
  { level: "Hiện tại", title: "Sinh viên năm 3", subtitle: "Công nghệ thông tin", status: "current", color: "bg-primary" },
  { level: "3 tháng", title: "Intern Frontend", subtitle: "Thực tập tại startup", status: "next", color: "bg-mint" },
  { level: "1 năm", title: "Junior Developer", subtitle: "React / TypeScript", status: "future", color: "bg-secondary" },
  { level: "3 năm", title: "Senior Developer", subtitle: "Tech Lead pathway", status: "future", color: "bg-accent" },
];

const badges = [
  { icon: Star, label: "Người khám phá", earned: true },
  { icon: Zap, label: "Test hoàn thành", earned: true },
  { icon: Target, label: "Mục tiêu rõ ràng", earned: true },
  { icon: BookOpen, label: "Học 7 ngày liền", earned: false },
  { icon: Award, label: "Mentor đầu tiên", earned: false },
];

const quickActions = [
  { icon: GitCompare, label: "So sánh nghề", href: "/career-compare", color: "bg-lavender text-secondary" },
  { icon: Compass, label: "Mô phỏng nghề", href: "/career-simulation", color: "bg-sky-light text-primary" },
  { icon: Users, label: "Cộng đồng", href: "/community", color: "bg-coral-light text-coral" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-card">
        <div className="container py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-muted-foreground mb-1">Xin chào 👋</p>
            <h1 className="text-2xl md:text-3xl font-bold font-display">Hành trình của bạn</h1>
          </motion.div>
        </div>
      </div>

      <div className="container -mt-2 space-y-8">
        {/* Career Journey Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Career Journey Map
            </h2>
            <Link href="/career-simulation">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                Chi tiết <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-6">
              {journeySteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-4 relative"
                >
                  <div className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center flex-shrink-0 z-10 ${
                    step.status === "current" ? "ring-4 ring-primary/20" : step.status === "future" ? "opacity-50" : ""
                  }`}>
                    {step.status === "current" ? (
                      <div className="w-3 h-3 rounded-full bg-primary-foreground animate-pulse-soft" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                  <div className={step.status === "future" ? "opacity-50" : ""}>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{step.level}</div>
                    <div className="font-semibold">{step.title}</div>
                    <div className="text-sm text-muted-foreground">{step.subtitle}</div>
                  </div>
                  {step.status === "current" && (
                    <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      Đang ở đây
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="glass-card rounded-xl p-4 text-center hover:shadow-elevated transition-shadow cursor-pointer">
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mx-auto mb-2`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium">{action.label}</div>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold font-display flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-gold" />
            Thành tựu
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {badges.map((badge, i) => (
              <div key={i} className={`flex-shrink-0 text-center ${!badge.earned ? "opacity-30 grayscale" : ""}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-1 ${
                  badge.earned ? "bg-gold-light text-gold" : "bg-muted text-muted-foreground"
                }`}>
                  <badge.icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-medium max-w-[70px]">{badge.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Gợi ý từ AI</h3>
              <p className="text-sm text-primary-foreground/80 mb-3">
                Dựa trên profile của bạn, ngành Frontend Development rất phù hợp. Hãy thử khám phá thêm hướng Full-stack để mở rộng cơ hội!
              </p>
              <Link href="/career-simulation">
                <Button size="sm" className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 gap-1">
                  Khám phá ngay <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
