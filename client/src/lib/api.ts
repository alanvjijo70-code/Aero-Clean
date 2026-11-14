// Support bound SERVER_URL (injected by Vercel service binding) or client VITE_API_BASE_URL
const getApiBaseUrl = (): string => {
  if (typeof process !== 'undefined' && process.env?.SERVER_URL) {
    const base = process.env.SERVER_URL.replace(/\/+$/, '');
    return `${base}/api/v1`;
  }
  return import.meta.env.VITE_API_BASE_URL || '/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

export class ApiError extends Error {
  code: string;
  details?: any;
  status: number;

  constructor(message: string, code = 'REQUEST_ERROR', status = 400, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

let authToken: string | null = localStorage.getItem('aeroclean_token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('aeroclean_token', token);
  } else {
    localStorage.removeItem('aeroclean_token');
  }
};

export const getAuthToken = () => authToken;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.message || `Request failed with status ${response.status}`,
      data.code || 'HTTP_ERROR',
      response.status,
      data.details
    );
  }

  return data.data !== undefined ? data.data : data;
}

export const api = {
  // Health
  getHealth: () => request<any>('/health'),

  // Buildings
  getBuildings: () => request<any[]>('/buildings'),
  getBuilding: (id: string) => request<any>(`/buildings/${id}`),
  createBuilding: (data: any) => request<any>('/buildings', { method: 'POST', body: JSON.stringify(data) }),
  updateBuilding: (id: string, data: any) => request<any>(`/buildings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteBuilding: (id: string) => request<any>(`/buildings/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: () => request<any[]>('/projects'),
  getProject: (id: string) => request<any>(`/projects/${id}`),
  createProject: (data: any) => request<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => request<any>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProject: (id: string) => request<any>(`/projects/${id}`, { method: 'DELETE' }),

  // Estimates
  calculateEstimate: (data: any) => request<any>('/estimates/calculate', { method: 'POST', body: JSON.stringify(data) }),
  saveEstimate: (data: any) => request<any>('/estimates/save', { method: 'POST', body: JSON.stringify(data) }),
  getEstimates: () => request<any[]>('/estimates'),
  getEstimate: (id: string) => request<any>(`/estimates/${id}`),
  deleteEstimate: (id: string) => request<any>(`/estimates/${id}`, { method: 'DELETE' }),

  // AI Operations
  analyzeSuitability: (data: any) => request<any>('/ai/cleaning-analysis', { method: 'POST', body: JSON.stringify(data) }),
  generateOperationalPlan: (data: any) => request<any>('/ai/operational-plan', { method: 'POST', body: JSON.stringify(data) }),
  generateAdvisory: (data: any) => request<any>('/ai/advisor', { method: 'POST', body: JSON.stringify(data) }),
  getAiHistory: () => request<any[]>('/ai/history'),
  getAiHistoryItem: (id: string) => request<any>(`/ai/history/${id}`),

  // Public Submissions
  submitContact: (data: any) => request<any>('/contact', { method: 'POST', body: JSON.stringify(data) }),
  requestDemo: (data: any) => request<any>('/demo-requests', { method: 'POST', body: JSON.stringify(data) }),
  subscribeNewsletter: (data: any) => request<any>('/newsletter/subscribe', { method: 'POST', body: JSON.stringify(data) })
};
