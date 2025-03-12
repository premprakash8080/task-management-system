import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Initialize axios auth header from localStorage
const token = localStorage.getItem('accessToken');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void; }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar?: string;
    coverImage?: string;
  };
}

const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      
      // Handle nested response structure
      const { data } = response.data;
      
      if (!data?.accessToken || !data?.refreshToken || !data?.user) {
        throw new Error('Invalid response format from server');
      }

      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: {
          _id: data.user._id,
          username: data.user.username,
          email: data.user.email,
          fullName: data.user.fullName,
          avatar: data.user.avatar,
          coverImage: data.user.coverImage
        }
      };
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error);
      // Clear any existing tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  signup: async (userData: SignUpData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);
      
      // Handle nested response structure
      const { data } = response.data;
      
      if (!data?.accessToken || !data?.refreshToken || !data?.user) {
        throw new Error('Invalid response format from server');
      }

      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: {
          _id: data.user._id,
          username: data.user.username,
          email: data.user.email,
          fullName: data.user.fullName,
          avatar: data.user.avatar,
          coverImage: data.user.coverImage
        }
      };
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  refreshToken: async (token?: string): Promise<{ accessToken: string }> => {
    // Get token from param or storage
    const refreshToken = token || localStorage.getItem('refreshToken')

    // Validate token silently
    if (!refreshToken || refreshToken === "undefined") {
      return Promise.reject(new Error('No valid refresh token available'))
    }

    try {
      const response = await axios.post(`${API_URL}/users/refresh-token`, { refreshToken })
      
      // Handle nested response structure
      const { data } = response.data
      
      // Validate response
      if (!data?.accessToken) {
        throw new Error('Invalid refresh token response')
      }

      // Store new access token
      localStorage.setItem('accessToken', data.accessToken)
      
      return { accessToken: data.accessToken }
    } catch (error: any) {
      console.error('Token refresh failed:', error.response?.data || error)
      // Clear invalid tokens
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      throw new Error(error.response?.data?.message || 'Token refresh failed')
    }
  },

  logout: async (): Promise<void> => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        await axios.post(`${API_URL}/users/logout`, {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      }
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Clear any pending requests
      failedQueue = [];
      isRefreshing = false;
    }
  }
};

// Add request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Update response interceptor with queue handling
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is not 401 or the request has already been retried, reject
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      try {
        const token = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { accessToken } = await authApi.refreshToken(refreshToken);
      
      // Update the authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      // Process any queued requests
      processQueue(null, accessToken);

      return axios(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      
      // Clear auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default authApi; 