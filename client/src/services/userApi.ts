
import { API_BASE_URL, authenticatedFetch } from './apiUtils';
import { toast } from "@/components/ui/use-toast";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  password?: string;
  avatar?: string; // Added avatar property
}

export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const data = await authenticatedFetch(`${API_BASE_URL}/api/users`);
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
      return [];
    }
  },
  
  getUserById: async (id: string): Promise<User | null> => {
    try {
      const data = await authenticatedFetch(`${API_BASE_URL}/api/users/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user details',
        variant: 'destructive',
      });
      return null;
    }
  },
  
  createUser: async (userData: Omit<User, '_id' | 'createdAt'>): Promise<User | null> => {
    try {
      const data = await authenticatedFetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      });
      return null;
    }
  },
  
  updateUser: async (id: string, userData: Partial<User>): Promise<User | null> => {
    try {
      const data = await authenticatedFetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
      return data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
      return null;
    }
  },
  
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      await authenticatedFetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'DELETE',
      });
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      return true;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
      return false;
    }
  }
};
