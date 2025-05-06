
import { API_BASE_URL, handleResponse } from './apiUtils';
import { toast } from "@/components/ui/use-toast";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  register: async (userData: RegisterData): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'Registration failed',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching current user:', error);
      // Don't show toast here as this might be called on app initialization
      return null;
    }
  },
};

// Update the index export to include authApi
