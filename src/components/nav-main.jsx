import { Link } from "react-router-dom";
"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {(items || []).map((item) => (
          <SidebarMenuItem key={item.key || item.title}>
            <SidebarMenuButton tooltip={item.title} asChild>
              {item.url && item.url.startsWith("/") ? (
                <Link 
                  to={item.url} 
                  className="w-full h-full flex items-center"
                  onClick={handleNavClick}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              ) : (
                <div className="w-full h-full flex items-center">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
