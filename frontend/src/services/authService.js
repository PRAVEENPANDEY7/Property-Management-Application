import api from './api';

export const authService = {
  /**
   * Authenticate user with credentials.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ token: string, user: object }>}
   */
  async login({ email, password }) {
    const response = await api.post('/auth/login', { email, password });
    return response.data?.data;
  },

  /**
   * Register a new user account.
   * @param {{ email: string, password: string, fullName: string }} data
   * @returns {Promise<object>}
   */
  async register({ email, password, fullName }) {
    const response = await api.post('/auth/register', { email, password, fullName });
    return response.data?.data;
  },

  /**
   * Fetch current authenticated user's profile.
   * @returns {Promise<object>}
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data?.data;
  },
};

export default authService;
