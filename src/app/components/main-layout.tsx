'use client';

import {
  Sidebar, SidebarInset, SidebarProvider,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bell, Settings, Check, Moon, Sun, Languages, User, LogOut, AlertTriangle, Info } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReactNode } from 'react';
import SidebarNav from './sidebar-nav';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return <>{children}</>;
  }

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      '/': 'Dashboard',
      '/symptom-checker': 'Symptom Checker',
      '/vaccines': 'Vaccines',
      '/alerts': 'Health Alerts',
      '/chat': 'AI Chat',
      '/profile': 'My Profile',
      '/health-records': 'Health Records',
      '/emergency': 'Emergency Services',
      '/photo-detection': 'Photo Detection',
    };
    return titles[pathname] || 'Aarogyam';
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-sidebar-border">
        <SidebarNav />
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search health topics..."
                  className="w-64 pl-10 bg-input/50 border-border/50 focus:border-primary/50"
                />
              </div>
              <div className="flex items-center space-x-2">
                {/* Alerts Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                      <Bell className="h-4 w-4" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">3</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <p className="text-sm font-medium">Alerts & Notifications</p>
                      <p className="text-xs text-muted-foreground">You have 3 unread notifications</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-start gap-3 cursor-pointer">
                      <div className="bg-blue-900/50 p-2 rounded-full"><Info className="h-4 w-4 text-blue-400" /></div>
                      <div>
                        <p className="text-sm font-medium">New Health Advisory</p>
                        <p className="text-xs text-muted-foreground">Monsoon season alert: waterborne diseases</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-start gap-3 cursor-pointer">
                      <div className="bg-amber-900/50 p-2 rounded-full"><AlertTriangle className="h-4 w-4 text-amber-400" /></div>
                      <div>
                        <p className="text-sm font-medium">Vaccination Reminder</p>
                        <p className="text-xs text-muted-foreground">Your next dose is due in 5 days</p>
                        <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-start gap-3 cursor-pointer">
                      <div className="bg-green-900/50 p-2 rounded-full"><Info className="h-4 w-4 text-green-400" /></div>
                      <div>
                        <p className="text-sm font-medium">Health Tips</p>
                        <p className="text-xs text-muted-foreground">5 ways to stay hydrated this summer</p>
                        <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/alerts')} className="text-center justify-center text-sm font-medium text-primary cursor-pointer">
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Settings Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel>
                      <p className="text-sm font-medium">{user?.name || 'Guest'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || 'Not logged in'}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" /><span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Languages className="mr-2 h-4 w-4" /><span>Language</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user ? (
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:!text-red-600">
                        <LogOut className="mr-2 h-4 w-4" /><span>Log out</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => router.push('/login')} className="cursor-pointer text-primary">
                        <User className="mr-2 h-4 w-4" /><span>Sign In</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
