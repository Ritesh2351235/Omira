import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Bookmark,
  HeartPulse,
  Layers,
  Settings,
  LogOut,
  User
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "./ui/sidebar";

import { cn } from "../lib/utils";

export function AppSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      title: "Home",
      icon: Home,
      url: "/dashboard",
      active: isActive('/dashboard')
    },
    {
      title: "Memories",
      icon: Bookmark,
      url: "/memories",
      active: isActive('/memories')
    },
    {
      title: "Health",
      icon: HeartPulse,
      url: "/health",
      active: isActive('/health')
    },
    {
      title: "MCP Server",
      icon: Layers,
      url: "/mcp",
      active: isActive('/mcp')
    }
  ];

  const settingsItems = [
    {
      title: "Account",
      icon: User,
      url: "/account",
      active: isActive('/account')
    }
  ];

  return (
    <Sidebar>
      <div className="flex items-center px-4 p-4 py-2">
        <img src="/omira.png" alt="Omira" width={48} height={48} />
        <span className="font-semibold">Omira</span>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                  >
                    <Link
                      to={item.url}
                      className={cn(
                        "flex w-full items-center gap-2",
                        item.active ? "text-accent-foreground" : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                  >
                    <Link
                      to={item.url}
                      className={cn(
                        "flex w-full items-center gap-2",
                        item.active ? "text-accent-foreground" : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar >
  );
} 
