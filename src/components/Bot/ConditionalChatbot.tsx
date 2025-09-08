"use client";

import { usePathname } from "next/navigation";
import Chatbot from "./Chatbot";

export default function ConditionalChatbot() {
  const pathname = usePathname();
  
  // Don't show chatbot on admin dashboard pages
  const isAdminDashboard = pathname.startsWith('/dashboard');
  
  if (isAdminDashboard) {
    return null;
  }
  
  return <Chatbot />;
}
