import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  university?: string;
  role: 'student' | 'admin' | 'counselor';
  is_email_verified: boolean;
  created_at?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has JWT token
    const token = localStorage.getItem('access_token');
    if (token) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await api.getProfile();
      setUser(profile);
    } catch (error: any) {
      console.error("Error loading user profile:", error);
      setUser(null);
      // Clear invalid tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await api.logout();
    setUser(null);
    window.location.href = "/login";
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
    refreshUser: loadUserProfile,
  };
};

