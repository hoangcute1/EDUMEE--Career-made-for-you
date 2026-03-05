"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-display">Tạo tài khoản mới</h1>
            <p className="text-muted-foreground text-sm mt-1">Bắt đầu hành trình khám phá nghề nghiệp</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

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
              <label className="text-sm font-medium">Mật khẩu</label>
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

            <Button variant="hero" className="w-full gap-2" disabled={loading}>
              {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Đăng nhập
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
