import React from 'react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { LayoutGrid, Calculator, History } from 'lucide-react';
import AppLogo from '@/components/app-logo';

const userNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '#',
        icon: LayoutGrid,
    },
    {
        title: 'Kalkulasi',
        href: '#kalkulasi',
        icon: Calculator,
    },
    {
        title: 'History',
        href: '#history',
        icon: History,
    },
];

export default function UserSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <AppLogo />
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={userNavItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
