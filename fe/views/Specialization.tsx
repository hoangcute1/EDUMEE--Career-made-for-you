"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertTriangle, Sparkles, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

const specializations = [
  {
    title: "Frontend Developer",
    trend: "up",
    trendLabel: "Tăng trưởng mạnh",
    risk: "low",
    opportunity: 90,
    salary: "15–40 triệu",
    description: "Phát triển giao diện web/app với React, Vue, Angular. Nhu cầu tuyển dụng cao, đặc biệt Remote.",
    skills: ["React", "TypeScript", "CSS", "UI/UX"],
    forecast: "Nhu cầu tăng 25% trong 5 năm tới nhờ AI-powered interfaces.",
  },
  {
    title: "AI / ML Engineer",
    trend: "up",
    trendLabel: "Tăng mạnh nhất",
    risk: "medium",
    opportunity: 95,
    salary: "25–80 triệu",
    description: "Xây dựng mô hình AI, machine learning, deep learning. Lĩnh vực bùng nổ toàn cầu.",
    skills: ["Python", "TensorFlow", "Math", "Data"],
    forecast: "Bùng nổ x3 trong 5 năm, nhưng yêu cầu học vấn & kỹ năng cao.",
  },
  {
    title: "Business Analyst",
    trend: "stable",
    trendLabel: "Ổn định",
    risk: "low",
    opportunity: 75,
    salary: "15–45 triệu",
    description: "Phân tích yêu cầu kinh doanh, cầu nối giữa business và tech team.",
    skills: ["Communication", "SQL", "Process Design", "Agile"],
    forecast: "Nhu cầu ổn định, phù hợp với người thích giao tiếp + phân tích.",
  },
  {
    title: "Data Analyst / Scientist",
    trend: "up",
    trendLabel: "Tăng trưởng tốt",
    risk: "low",
    opportunity: 85,
    salary: "18–50 triệu",
    description: "Phân tích dữ liệu, xây dựng dashboard, tìm insights kinh doanh.",
    skills: ["Python", "SQL", "Statistics", "Visualization"],
    forecast: "Mỗi công ty đều cần data – nhu cầu tăng đều 15%/năm.",
  },
  {
    title: "Product Manager",
    trend: "stable",
    trendLabel: "Ổn định cao",
    risk: "low",
    opportunity: 80,
    salary: "20–60 triệu",
    description: "Quản lý sản phẩm, chiến lược phát triển, làm việc với nhiều team.",
    skills: ["Strategy", "UX", "Analytics", "Leadership"],
    forecast: "Vị trí then chốt, lương cao nhưng đòi hỏi kinh nghiệm 2-3 năm+.",
  },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <ArrowUpRight className="w-4 h-4 text-mint" />;
  if (trend === "down") return <ArrowDownRight className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-gold" />;
};

const Specialization = () => {
  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-card">
        <div className="container py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-3">
              <TrendingUp className="w-4 h-4" /> Dự đoán AI
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display">Hướng chuyên sâu & Xu hướng</h1>
            <p className="text-muted-foreground mt-1">Dựa trên hồ sơ IT của bạn – Xu hướng 5–10 năm tới</p>
          </motion.div>
        </div>
      </div>

      <div className="container mt-6 space-y-4">
        {specializations.map((spec, i) => (
          <motion.div
            key={spec.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold font-display">{spec.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <TrendIcon trend={spec.trend} />
                  <span className="text-sm text-muted-foreground">{spec.trendLabel}</span>
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm font-medium">{spec.salary}</span>
                </div>
              </div>
              <Badge className={`${
                spec.risk === "low" ? "bg-mint/10 text-mint border-mint/20" :
                spec.risk === "medium" ? "bg-gold/10 text-gold border-gold/20" :
                "bg-destructive/10 text-destructive border-destructive/20"
              }`}>
                {spec.risk === "low" ? "Rủi ro thấp" : spec.risk === "medium" ? "Rủi ro TB" : "Rủi ro cao"}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{spec.description}</p>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Cơ hội việc làm</span>
                  <span className="font-medium text-primary">{spec.opportunity}%</span>
                </div>
                <Progress value={spec.opportunity} className="h-2" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {spec.skills.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">{spec.forecast}</p>
            </div>
          </motion.div>
        ))}

        {/* Warning */}
        <div className="p-4 rounded-xl bg-gold/5 border border-gold/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium mb-1">Lưu ý</div>
            <p className="text-xs text-muted-foreground">
              Dự đoán dựa trên dữ liệu thị trường hiện tại và có thể thay đổi. Hãy cập nhật thường xuyên và linh hoạt trong lộ trình phát triển của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specialization;
