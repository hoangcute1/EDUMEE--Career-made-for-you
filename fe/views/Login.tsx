"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: integrate with auth backend
    setTimeout(() => {
      setLoading(false);
      router.push("/onboarding");
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
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-display">Chào mừng trở lại!</h1>
            <p className="text-muted-foreground text-sm mt-1">Đăng nhập để tiếp tục hành trình</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mật khẩu</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
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

            <Button variant="hero" className="w-full gap-2" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
