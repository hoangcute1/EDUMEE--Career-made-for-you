'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef } from 'react';

interface NavLinkProps {
  href: string;
  className?: string;
  activeClassName?: string;
  children?: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, href, children, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <Link ref={ref} href={href} className={cn(className, isActive && activeClassName)} {...props}>
        {children}
      </Link>
    );
  },
);

NavLink.displayName = 'NavLink';

export { NavLink };
