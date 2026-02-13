import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { AppSidebar } from "./AppSidebar";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <motion.main
        initial={false}
        animate={{ 
          marginLeft: sidebarOpen ? 280 : 72 
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          "min-h-screen transition-all duration-200",
          "px-6 py-8 lg:px-8"
        )}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}