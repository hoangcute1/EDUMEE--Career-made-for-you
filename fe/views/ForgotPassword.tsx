"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-card">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-4">
              {sent ? (
                <CheckCircle2 className="w-7 h-7 text-primary-foreground" />
              ) : (
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              )}
            </div>
            <h1 className="text-2xl font-bold font-display">
              {sent ? "Kiểm tra email!" : "Quên mật khẩu?"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {sent
                ? `Chúng tôi đã gửi link đặt lại mật khẩu đến ${email}`
                : "Nhập email để nhận link đặt lại mật khẩu"}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button variant="hero" className="w-full" disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi link đặt lại"}
              </Button>
            </form>
          ) : (
            <Button variant="hero" className="w-full" onClick={() => setSent(false)}>
              Gửi lại email
            </Button>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
