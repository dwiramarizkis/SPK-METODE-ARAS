import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin-sidebar';

export function Dashboard() {
    const userName = localStorage.getItem('userName') || 'Admin';

    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="w-full bg-sidebar p-2">
                <div className="flex flex-col h-full bg-white rounded-lg border-2 border-border overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b-2 border-border bg-white px-6">
                        <SidebarTrigger className="-ml-1" />
                        <div className="h-4 w-px bg-border" />
                        <h1 className="text-xl font-heading">Admin Dashboard</h1>
                    </header>
                    <div className="flex flex-1 flex-col gap-6 p-6 overflow-auto bg-gray-50">
                        <div className="rounded-base border-2 border-border bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-2xl font-heading mb-2">Welcome, {userName}!</h2>
                            <p className="text-gray-600">Manage your system from this dashboard.</p>
                        </div>
                    </div>
                </div>
            </main>
        </SidebarProvider>
    );
}
