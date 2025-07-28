import React from "react";
import { useSidebar } from "./ui/sidebar";
import { usePathname } from "next/navigation";

const AppSidebar = ({ userType }: AppSidebarProps) => {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();
  return <div>AppSidebar</div>;
};

export default AppSidebar;
