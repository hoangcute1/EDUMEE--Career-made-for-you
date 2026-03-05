'use client';

import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Compass,
  GitCompare,
  GraduationCap,
  Menu,
  Sparkles,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';

const baseNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Compass },
  { href: '/career-simulation', label: 'Mô phỏng nghề', icon: BarChart3 },
  { href: '/career-compare', label: 'So sánh', icon: GitCompare },
  { href: '/learning-roadmap', label: 'Lộ trình', icon: BookOpen },
  { href: '/specialization', label: 'Xu hướng', icon: TrendingUp },
  { href: '/mentor-matching', label: 'Mentor', icon: GraduationCap },
  { href: '/community', label: 'Cộng đồng', icon: Users },
];

const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasResult = useSyncExternalStore(
    (cb) => {
      window.addEventListener('storage', cb);
      return () => window.removeEventListener('storage', cb);
    },
    () => localStorage.getItem('hasAssessmentResult') === 'true',
    () => false,
  );

  const navItems = hasResult
    ? [...baseNavItems, { href: '/assessment-result', label: 'Kết quả', icon: ClipboardCheck }]
    : baseNavItems;

  return (
    <nav className="glass-card sticky top-0 z-50 border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-display flex items-center gap-2 text-xl font-bold">
          <div className="bg-gradient-hero flex h-8 w-8 items-center justify-center rounded-lg">
            <Sparkles className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="text-gradient-hero">CareerBuddy</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={active ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-1.5 text-xs"
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="hover:bg-muted rounded-lg p-2 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-border overflow-hidden border-t lg:hidden"
          >
            <div className="container flex flex-col gap-2 py-4">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                    <Button
                      variant={active ? 'default' : 'ghost'}
                      className="w-full justify-start gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <Link href="/profile" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" /> Hồ sơ
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
