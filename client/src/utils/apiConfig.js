/**
 * Auto-detect API URL based on current hostname
 * This allows the app to work from localhost AND network IPs
 */

const getApiUrl = () => {
  // If REACT_APP_API_URL is explicitly set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Get current hostname (localhost or network IP)
  const hostname = window.location.hostname;
  const protocol = window.location.protocol; // http or https
  
  // If accessing from localhost, use localhost for backend
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//localhost:5001/api`;
  }
  
  // If accessing from network IP, use same IP for backend
  // Port 5001 is the backend port
  return `${protocol}//${hostname}:5001/api`;
};

const getApiBaseUrl = () => {
  // Same as getApiUrl but without /api suffix (for OAuth redirects)
  if (process.env.REACT_APP_API_URL) {
    let url = process.env.REACT_APP_API_URL;
    // Remove trailing /api if present
    if (url.endsWith('/api')) {
      url = url.slice(0, -4);
    }
    // Remove trailing slash
    url = url.replace(/\/$/, '');
    return url;
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//localhost:5001`;
  }
  
  return `${protocol}//${hostname}:5001`;
};

export const API_URL = getApiUrl();
export const API_BASE_URL = getApiBaseUrl();

// Log for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🌐 API Configuration:');
  console.log('   Hostname:', window.location.hostname);
  console.log('   API URL:', API_URL);
  console.log('   API Base URL:', API_BASE_URL);
}

