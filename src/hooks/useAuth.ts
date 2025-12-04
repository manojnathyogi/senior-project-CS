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
    try {
      await api.logout();
    } catch (error) {
      // Ignore logout errors
    }
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Use window.location to ensure proper navigation even if redirects aren't configured
    // The redirects file should handle this, but this ensures it works
    window.location.href = window.location.origin + "/login";
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
    refreshUser: loadUserProfile,
  };
};

