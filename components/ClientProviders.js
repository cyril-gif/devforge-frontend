"use client";
import { AuthProvider }  from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import  BottomNav  from '@/components/BottomNav';


export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
        <BottomNav />
      </ThemeProvider>  
    </AuthProvider>
  );
}
