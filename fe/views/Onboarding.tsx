"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "Bạn thích làm việc theo phong cách nào?",
    options: ["Độc lập, tự do sáng tạo", "Làm việc nhóm, thảo luận nhiều", "Phân tích dữ liệu, logic", "Giao tiếp, kết nối con người"],
  },
  {
    id: 2,
    question: "Điều gì quan trọng nhất với bạn trong công việc?",
    options: ["Thu nhập cao", "Sự cân bằng cuộc sống", "Cơ hội phát triển", "Đam mê & ý nghĩa"],
  },
  {
    id: 3,
    question: "Bạn giỏi nhất ở lĩnh vực nào?",
    options: ["Công nghệ & kỹ thuật", "Kinh doanh & quản lý", "Nghệ thuật & sáng tạo", "Khoa học & nghiên cứu"],
  },
  {
    id: 4,
    question: "Bạn đang ở giai đoạn nào?",
    options: ["Học sinh cấp 3", "Sinh viên năm 1-2", "Sinh viên năm 3-4", "Mới đi làm (0-2 năm)"],
  },
  {
    id: 5,
    question: "Bạn muốn đạt mục tiêu gì trong 3 năm tới?",
    options: ["Có việc làm ổn định", "Thăng tiến nhanh", "Khởi nghiệp", "Chuyển ngành"],
  },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const router = useRouter();

  const progress = ((step + 1) / questions.length) * 100;
  const currentQ = questions[step];
  const isLast = step === questions.length - 1;

  const selectAnswer = (option: string) => {
    setAnswers({ ...answers, [currentQ.id]: option });
  };

  const next = () => {
    if (isLast) {
      router.push("/personality-test");
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container py-4 flex items-center gap-4">
          <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-hero rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="text-sm text-muted-foreground font-medium">{step + 1}/{questions.length}</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
                  <Sparkles className="w-3 h-3" />
                  Câu {step + 1}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-display">
                  {currentQ.question}
                </h2>
              </div>

              <div className="grid gap-3">
                {currentQ.options.map((option) => {
                  const selected = answers[currentQ.id] === option;
                  return (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectAnswer(option)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        selected
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border hover:border-primary/30 bg-card"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selected ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}>
                        {selected && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                      </div>
                      <span className="font-medium">{option}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-end">
            <Button
              variant="hero"
              size="lg"
              onClick={next}
              disabled={!answers[currentQ.id]}
              className="gap-2"
            >
              {isLast ? "Xem kết quả" : "Tiếp theo"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
