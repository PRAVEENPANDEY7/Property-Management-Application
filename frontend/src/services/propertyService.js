import api from './api';

export const propertyService = {
  /**
   * Fetch paginated public properties list with optional city and keyword filters.
   * @param {{ page?: number, size?: number, city?: string, search?: string, sortBy?: string, sortDir?: string }} params
   */
  async getPublicProperties(params = {}) {
    const cleanParams = {};
    if (params.page !== undefined) cleanParams.page = params.page;
    if (params.size !== undefined) cleanParams.size = params.size;
    if (params.city && params.city.trim()) cleanParams.city = params.city.trim();
    if (params.search && params.search.trim()) cleanParams.search = params.search.trim();
    if (params.sortBy) cleanParams.sortBy = params.sortBy;
    if (params.sortDir) cleanParams.sortDir = params.sortDir;

    const response = await api.get('/properties', { params: cleanParams });
    return response.data?.data;
  },

  /**
   * Fetch a single property with complete details and image list.
   * @param {number|string} id
   */
  async getPropertyById(id) {
    const response = await api.get(`/properties/${id}`);
    return response.data?.data;
  },

  /**
   * Fetch administrative paginated properties list.
   * @param {{ page?: number, size?: number, city?: string, search?: string, sortBy?: string, sortDir?: string }} params
   */
  async getAdminProperties(params = {}) {
    const cleanParams = {};
    if (params.page !== undefined) cleanParams.page = params.page;
    if (params.size !== undefined) cleanParams.size = params.size;
    if (params.city && params.city.trim()) cleanParams.city = params.city.trim();
    if (params.search && params.search.trim()) cleanParams.search = params.search.trim();
    if (params.sortBy) cleanParams.sortBy = params.sortBy;
    if (params.sortDir) cleanParams.sortDir = params.sortDir;

    const response = await api.get('/admin/properties', { params: cleanParams });
    return response.data?.data;
  },

  /**
   * Create a new property with images via multipart/form-data.
   * @param {FormData} formData
   */
  async createProperty(formData) {
    const response = await api.post('/admin/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.data;
  },

  /**
   * Update property attributes, retain selected existing images, and upload new ones.
   * @param {number|string} id
   * @param {FormData} formData
   * @param {number[]} keepImageIds
   * @param {number} primaryImageId
   */
  async updateProperty(id, formData, keepImageIds = [], primaryImageId = null) {
    const params = {};
    if (keepImageIds && keepImageIds.length > 0) {
      params.keepImageIds = keepImageIds.join(',');
    }
    if (primaryImageId) {
      params.primaryImageId = primaryImageId;
    }

    const response = await api.put(`/admin/properties/${id}`, formData, {
      params,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.data;
  },

  /**
   * Delete property and associated image files.
   * @param {number|string} id
   */
  async deleteProperty(id) {
    const response = await api.delete(`/admin/properties/${id}`);
    return response.data;
  },

  /**
   * Submit a customer lead / inquiry for a property.
   * @param {number|string} propertyId
   * @param {{ name: string, email: string, phone: string, message?: string }} data
   */
  async submitInquiry(propertyId, data) {
    const response = await api.post(`/properties/${propertyId}/inquiries`, data);
    return response.data?.data;
  },

  /**
   * Fetch administrative list of property inquiries.
   * @param {{ page?: number, size?: number }} params
   */
  async getAdminInquiries(params = {}) {
    const cleanParams = {};
    if (params.page !== undefined) cleanParams.page = params.page;
    if (params.size !== undefined) cleanParams.size = params.size;
    const response = await api.get('/admin/inquiries', { params: cleanParams });
    return response.data?.data;
  },

  /**
   * Update the status of an inquiry (NEW, CONTACTED, CLOSED).
   * @param {number|string} id
   * @param {string} status
   */
  async updateInquiryStatus(id, status) {
    const response = await api.patch(`/admin/inquiries/${id}/status`, null, {
      params: { status },
    });
    return response.data?.data;
  },

  /**
   * Fetch inquiry statistics (e.g. new inquiries count).
   */
  async getInquiryStats() {
    const response = await api.get('/admin/inquiries/stats');
    return response.data?.data;
  },
};

export default propertyService;
