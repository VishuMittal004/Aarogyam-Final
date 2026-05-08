'use client';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { User } from 'lucide-react';
import Link from 'next/link';

export default function UserButton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="/login" className="w-full">
          <SidebarMenuButton tooltip="Account" className="text-base">
            <User />
            <span className="whitespace-nowrap">Account</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
