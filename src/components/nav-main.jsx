import { Link } from "react-router-dom";
"use client"



import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items
}) {
  // Use react-router-dom Link for navigation
  return (
    <SidebarGroup>
     
      <SidebarMenu>
        {(items || []).map((item) => (
          <SidebarMenuItem key={item.key || item.title}>
            <SidebarMenuButton tooltip={item.title} asChild>
              {item.url && item.url.startsWith("/") ? (
                <Link to={item.url} className="w-full h-full flex items-center">
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
