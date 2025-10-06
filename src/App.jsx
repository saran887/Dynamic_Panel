// React
import { useState } from "react"

// Components
import { AppSidebar } from "./components/app-sidebar"
import { NavMain } from "./components/nav-main"
import { NavProjects } from "./components/nav-projects"
import { NavUser } from "./components/nav-user"
import { TeamSwitcher } from "./components/team-switcher"

// UI Components
import { Avatar } from "./components/ui/avatar"
import { Breadcrumb } from "./components/ui/breadcrumb"
import { Button } from "./components/ui/button"
import { Collapsible } from "./components/ui/collapsible"
import { DropdownMenu } from "./components/ui/dropdown-menu"
import { Input } from "./components/ui/input"
import { Separator } from "./components/ui/separator"
import { Sheet } from "./components/ui/sheet"
import { Sidebar, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { Skeleton } from "./components/ui/skeleton"
import { Tooltip } from "./components/ui/tooltip"

// Hooks
import { useIsMobile } from "./hooks/use-mobile"

// Lib


import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Contact from "./Contact";

import LogoPage from "./LogoPage";
import ServicesPage from "./ServicesPage";
import ProductsPage from "./ProductsPage";
import BlogPage from "./BlogPage";


export default function App() {
  const [user, setUser] = useState(null);
  const isMobile = useIsMobile ? useIsMobile() : false;

  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <SidebarProvider>
              <div className="flex w-full h-screen overflow-hidden bg-white">
                {/* Mobile sidebar trigger */}
                <div className="md:hidden fixed top-4 left-4 z-50">
                  <SidebarTrigger />
                </div>
                <AppSidebar />
                <Separator orientation="vertical" className="h-full hidden md:block" />
                <main className="flex-1 h-full overflow-auto bg-white p-4 md:p-6 pt-16 md:pt-6">
                  <Routes>
                    <Route path="/contact" element={<Contact userId={user?.id} />} />
                    <Route path="/logo" element={<LogoPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="*" element={<Navigate to="/contact" replace />} />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          }
        />
      </Routes>
    </Router>
  );
}
