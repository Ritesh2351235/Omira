import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarTrigger, useSidebar } from './ui/sidebar';

function MainContent() {
  const { state, isMobile } = useSidebar();
  const mainClass = isMobile
    ? 'w-full'
    : (state === "expanded" ? 'ml-72' : 'ml-16');

  return (
    <main className={`flex-1 flex flex-col ${mainClass} transition-all duration-300`}>
      <div className="flex h-16 items-center px-4 border-b">
        <SidebarTrigger className="lg:hidden" />
        <div className="flex-1" />
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </main>
  );
}

export default function Layout() {
  return (
    <SidebarProvider defaultOpen={!window.matchMedia('(max-width: 1024px)').matches}>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <MainContent />
      </div>
    </SidebarProvider>
  );
} 