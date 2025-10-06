import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Contact,
  Frame,
  GalleryVerticalEnd,
  Handshake,
  HomeIcon,
  LogIn,
  LogsIcon,
  LucideHome,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Terminal,
  UserCheck,
  UserCog,  UserPlus,
  User,
  Zap,
  ShoppingCart
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import NutzLogo from "@/components/NutzLogo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "NUTZ",
      logo: NutzLogo,
      plan: "Professional",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Logo",
      url: "/logo",
      icon: GalleryVerticalEnd,
      key: "logo",
    },
    {
      title: "Service",
      url: "/Services",
      icon: Handshake,
      key: "s",
    },
    {
      title: "Products",
      url: "/products",
      icon: ShoppingCart,
      key: "products",
    },
    {
      title: "Blogs",
      url: "/blog",
      icon: BookOpen,
      key: "blog",
    },
    {
      title: "Contact",
      url: "/Contact",
      icon: User,
      key: "Contact",
    },
  ],
}

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="icon" className="bg-white" {...props}>
      <SidebarHeader className="flex-shrink-0">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto min-h-0">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects || []} />
      </SidebarContent>
      <SidebarFooter className="flex-shrink-0 border-t mt-auto">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}