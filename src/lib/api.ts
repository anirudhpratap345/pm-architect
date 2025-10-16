// API utility functions for making requests to our backend

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || 'An error occurred',
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      error: 'Network error occurred',
      status: 500,
    };
  }
}

// Decision API functions
export const decisionsApi = {
  // Get all decisions
  async getAll(filters?: {
    status?: string;
    priority?: string;
    tags?: string[];
  }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.tags) params.append('tags', filters.tags.join(','));

    const queryString = params.toString();
    const url = `/api/decisions${queryString ? `?${queryString}` : ''}`;
    
    return apiCall<any[]>(url);
  },

  // Get single decision
  async getById(id: string): Promise<ApiResponse<any>> {
    return apiCall<any>(`/api/decisions/${id}`);
  },

  // Create new decision
  async create(decisionData: any): Promise<ApiResponse<any>> {
    return apiCall<any>('/api/decisions', {
      method: 'POST',
      body: JSON.stringify(decisionData),
    });
  },

  // Update decision
  async update(id: string, decisionData: any): Promise<ApiResponse<any>> {
    return apiCall<any>(`/api/decisions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(decisionData),
    });
  },

  // Delete decision
  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiCall<{ message: string }>(`/api/decisions/${id}`, {
      method: 'DELETE',
    });
  },
};

// Comments API functions
export const commentsApi = {
  // Get comments for a decision
  async getByDecisionId(decisionId: string): Promise<ApiResponse<any[]>> {
    return apiCall<any[]>(`/api/decisions/${decisionId}/comments`);
  },

  // Create comment
  async create(decisionId: string, commentData: {
    content: string;
    parentId?: string;
    mentions?: string[];
  }): Promise<ApiResponse<any>> {
    return apiCall<any>(`/api/decisions/${decisionId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },
};

// Notifications API functions
export const notificationsApi = {
  // Get user notifications
  async getAll(): Promise<ApiResponse<any[]>> {
    return apiCall<any[]>('/api/notifications');
  },

  // Mark notification as read
  async markAsRead(id: string): Promise<ApiResponse<any>> {
    return apiCall<any>(`/api/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ read: true }),
    });
  },
};

// Error handling utilities
export const handleApiError = (error: string, fallbackMessage = 'Something went wrong') => {
  console.error('API Error:', error);
  return error || fallbackMessage;
};

// Success message utilities
export const showSuccessMessage = (message: string) => {
  // You can integrate this with your preferred toast/notification library
  console.log('Success:', message);
  // Example: toast.success(message);
};

export const showErrorMessage = (message: string) => {
  // You can integrate this with your preferred toast/notification library
  console.error('Error:', message);
  // Example: toast.error(message);
}; 