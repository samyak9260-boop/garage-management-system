'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Bell, 
  Settings, 
  ShieldCheck 
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'डॅशबोर्ड', href: '/dashboard', icon: LayoutDashboard },
    { name: 'ग्राहक', href: '/customers', icon: Users },
    { name: 'सर्व्हिस', href: '/service', icon: Wrench },
    { name: 'रिमाइंडर्स', href: '/reminders', icon: Bell },
    { name: 'सेटिंग्ज', href: '/settings', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Garage Name */}
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-slate-800 text-base">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>गॅरेज व्यवस्थापन</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}