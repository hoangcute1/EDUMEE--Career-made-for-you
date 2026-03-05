"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/login");
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
              <CheckCircle2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-display">Đặt mật khẩu mới</h1>
            <p className="text-muted-foreground text-sm mt-1">Tạo mật khẩu mới cho tài khoản của bạn</p>
          </div>

          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ít nhất 8 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="pl-10"
                  minLength={8}
                  required
                />
              </div>
              {confirm && password !== confirm && (
                <p className="text-xs text-destructive">Mật khẩu không khớp</p>
              )}
            </div>

            <Button variant="hero" className="w-full" disabled={loading || password !== confirm}>
              {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
