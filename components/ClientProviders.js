"use client";
import { AuthProvider }  from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import  BottomNav  from '@/components/BottomNav';
import AIChat from '@/components/AIChat';


export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
        <BottomNav />
        <AIChat />
      </ThemeProvider>  
    </AuthProvider>
  );
}
