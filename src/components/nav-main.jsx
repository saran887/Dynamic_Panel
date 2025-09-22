import { Link } from "react-router-dom";
"use client"



import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items
}) {
  // Use react-router-dom Link for navigation
  return (
    <SidebarGroup>
     
      <SidebarMenu>
        {(items || []).map((item) => (
          <Collapsible
            key={item.key || item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  {item.url && item.url.startsWith("/") ? (
                    <Link to={item.url} className="w-full h-full flex items-center">
                      <span>{item.title}</span>
                    </Link>
                  ) : (
                    <span>{item.title}</span>
                  )}
                  {/* Arrow removed */}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {(item.items || []).map((subItem) => (
                    <SidebarMenuSubItem key={subItem.key || subItem.title}>
                      <SidebarMenuSubButton asChild>
                        {subItem.url && subItem.url.startsWith("/") ? (
                          <Link to={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        ) : (
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        )}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
