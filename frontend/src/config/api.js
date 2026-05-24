const normalizeBaseUrl = (value) => {
  const base = (value || 'http://localhost:8001').trim();
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

export const API_BASE_URL = normalizeBaseUrl(process.env.REACT_APP_API_URL);

export const apiUrl = (path = '') => {
  if (!path) {
    return API_BASE_URL;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
