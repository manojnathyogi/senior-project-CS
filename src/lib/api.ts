// API configuration for Django backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Log API URL in development (helps debug production issues)
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

export const api = {
  async requestOTP(email: string, purpose: 'login' | 'signup' | 'password_reset' = 'signup') {
    const url = `${API_BASE_URL}/auth/otp/request/`;
    console.log('Requesting OTP from:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, purpose }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to request OTP' }));
        console.error('OTP request failed:', response.status, error);
        throw new Error(error.error || error.message || `Failed to request OTP (${response.status})`);
      }

      return response.json();
    } catch (error: any) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('Network error - backend may be down or CORS misconfigured');
        throw new Error('Cannot connect to server. Please check your connection and try again.');
      }
      throw error;
    }
  },

  async verifyOTPSignup(email: string, otpCode: string, userData: {
    name: string;
    username?: string;
    university?: string;
    role?: string;
    password?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/otp/verify-signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otp_code: otpCode,
        ...userData,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to verify OTP' }));
      throw new Error(error.error || error.message || 'Failed to verify OTP');
    }

    return response.json();
  },

  async verifyOTPLogin(email: string, otpCode: string) {
    const response = await fetch(`${API_BASE_URL}/auth/otp/verify-login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otp_code: otpCode,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to verify OTP' }));
      throw new Error(error.error || error.message || 'Failed to verify OTP');
    }

    return response.json();
  },

  async loginWithPassword(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Invalid credentials' }));
      throw new Error(error.error || error.message || 'Invalid credentials');
    }

    return response.json();
  },

  async getProfile() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const refreshResponse = await fetch(`${API_BASE_URL}/token/refresh/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh: refreshToken }),
            });

            if (refreshResponse.ok) {
              const { access } = await refreshResponse.json();
              localStorage.setItem('access_token', access);
              // Retry with new token
              return this.getProfile();
            }
          } catch (e) {
            // Refresh failed, clear tokens
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            throw new Error('Session expired. Please login again.');
          }
        }
        throw new Error('Session expired. Please login again.');
      }
      const error = await response.json().catch(() => ({ error: 'Failed to load profile' }));
      throw new Error(error.error || error.message || 'Failed to load profile');
    }

    return response.json();
  },

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Mood tracking APIs
  async createMoodLog(moodScore: number, textInput?: string, sentimentLabel?: string) {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/mood/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        mood_score: moodScore,
        text_input: textInput || null,
        sentiment_label: sentimentLabel || null,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to log mood' }));
      throw new Error(error.error || error.message || 'Failed to log mood');
    }

    return response.json();
  },

  async getMoodStats(days: number = 7) {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/mood/stats/?days=${days}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load mood stats' }));
      throw new Error(error.error || error.message || 'Failed to load mood stats');
    }

    return response.json();
  },

  // Admin dashboard APIs
  async getDashboardStats(timeFilter: string = 'week') {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/stats/?time_filter=${timeFilter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load stats' }));
      throw new Error(error.error || error.message || 'Failed to load stats');
    }

    return response.json();
  },

  async getMoodMetrics(timeFilter: string = 'week') {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/mood-metrics/?time_filter=${timeFilter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load mood metrics' }));
      throw new Error(error.error || error.message || 'Failed to load mood metrics');
    }

    return response.json();
  },

  async getFeatureUsage(timeFilter: string = 'week') {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/feature-usage/?time_filter=${timeFilter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load feature usage' }));
      throw new Error(error.error || error.message || 'Failed to load feature usage');
    }

    return response.json();
  },

  async getRiskAssessment(timeFilter: string = 'week') {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/risk-assessment/?time_filter=${timeFilter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load risk assessment' }));
      throw new Error(error.error || error.message || 'Failed to load risk assessment');
    }

    return response.json();
  },

  async getCampusDistribution(timeFilter: string = 'week') {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/campus-distribution/?time_filter=${timeFilter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load campus distribution' }));
      throw new Error(error.error || error.message || 'Failed to load campus distribution');
    }

    return response.json();
  },

  async getAllUsers() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/auth/users/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load users' }));
      throw new Error(error.error || error.message || 'Failed to load users');
    }

    return response.json();
  },

  async getResourceAllocation(timeFilter: string = 'month') {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/resource-allocation/?time_filter=${timeFilter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load resource allocation' }));
      throw new Error(error.error || error.message || 'Failed to load resource allocation');
    }

    return response.json();
  },

  async getBudgetOptimization(timeFilter: string = 'month') {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/budget-optimization/?time_filter=${timeFilter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load budget optimization' }));
      throw new Error(error.error || error.message || 'Failed to load budget optimization');
    }

    return response.json();
  },

  async getHighImpactAreas(timeFilter: string = 'month') {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/high-impact-areas/?time_filter=${timeFilter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load high impact areas' }));
      throw new Error(error.error || error.message || 'Failed to load high impact areas');
    }

    return response.json();
  },

  async getIntegrationSettings() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/integration-settings/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load integration settings' }));
      throw new Error(error.error || error.message || 'Failed to load integration settings');
    }

    return response.json();
  },

  async updateIntegrationSettings(settings: any) {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/integration-settings/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to update integration settings' }));
      throw new Error(error.error || error.message || 'Failed to update integration settings');
    }

    return response.json();
  },

  async testIntegration(systemId: string) {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/integration-test/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ system_id: systemId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to test integration' }));
      throw new Error(error.error || error.message || 'Failed to test integration');
    }

    return response.json();
  },

  async getIntegrationStatus() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/integration-status/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load integration status' }));
      throw new Error(error.error || error.message || 'Failed to load integration status');
    }

    return response.json();
  },

  async getCounselors() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/counselors/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load counselors' }));
      throw new Error(error.error || error.message || 'Failed to load counselors');
    }

    return response.json();
  },

  async getStudentsRequiringCounseling(timeFilter: string = 'week') {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/students-requiring-counseling/?time_filter=${timeFilter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load students' }));
      throw new Error(error.error || error.message || 'Failed to load students');
    }

    return response.json();
  },

  async getChatCommunicationsLog() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/chat-communications-log/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to load communications log' }));
      throw new Error(error.error || error.message || 'Failed to load communications log');
    }

    return response.json();
  },

  async assignCounselor(studentId: string, counselorId?: string) {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/assign-counselor/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        student_id: studentId,
        counselor_id: counselorId
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to assign counselor' }));
      throw new Error(error.error || error.message || 'Failed to assign counselor');
    }

    return response.json();
  },

  async createCounselor(counselorData: {
    email: string;
    name: string;
    password: string;
    university?: string;
    username?: string;
  }) {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/auth/create-counselor/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(counselorData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to create counselor' }));
      throw new Error(error.error || error.message || 'Failed to create counselor');
    }

    return response.json();
  },
};

