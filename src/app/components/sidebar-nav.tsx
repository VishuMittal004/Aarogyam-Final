'use client';

import { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Bell, Languages, LayoutDashboard, Stethoscope, Syringe,
  ArrowLeft, User, Camera, Hospital, FileText, HeartPulse, LogOut,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const links = [
  { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: '/symptom-checker', label: 'Symptom Checker', icon: <Stethoscope className="h-5 w-5" /> },
  { href: '/vaccines', label: 'Vaccines', icon: <Syringe className="h-5 w-5" /> },
  { href: '/alerts', label: 'Health Alerts', icon: <Bell className="h-5 w-5" /> },
  { href: '/chat', label: 'AI Chat', icon: <Languages className="h-5 w-5" /> },
  { href: '/photo-detection', label: 'Photo Detection', icon: <Camera className="h-5 w-5" /> },
  { href: '/health-records', label: 'Health Records', icon: <FileText className="h-5 w-5" /> },
  { href: '/emergency', label: 'Emergency Services', icon: <Hospital className="h-5 w-5" /> },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center">
            <Image src="/logo.png" alt="Aarogyam Logo" width={24} height={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-sidebar-foreground">Aarogyam</h2>
          </div>
          <SidebarTrigger className="ml-auto md:hidden" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu className="space-y-1">
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} className="w-full">
                <SidebarMenuButton
                  isActive={pathname === link.href}
                  tooltip={link.label}
                  className={`w-full justify-start text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent-foreground'
                  }`}
                >
                  {link.icon}
                  <span className="whitespace-nowrap">{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <Link href={user ? '/profile' : '/login'} className="w-full">
              <SidebarMenuButton
                isActive={pathname === '/profile'}
                tooltip="Profile"
                className={`w-full justify-start text-sm font-medium transition-all duration-200 ${
                  pathname === '/profile'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/10'
                }`}
              >
                <User className="h-5 w-5" />
                <span className="whitespace-nowrap">{user ? user.name : 'Sign In'}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Logout"
                className="w-full justify-start text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="whitespace-nowrap">Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
