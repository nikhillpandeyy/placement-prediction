// CHANGE THIS TO YOUR RENDER URL AFTER DEPLOYING (e.g. 'https://your-backend.onrender.com')
window.BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:4000' 
    : 'https://YOUR_RENDER_BACKEND_URL_HERE.onrender.com';

const API_BASE = `${window.BACKEND_URL}/api/v1`;

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers
        },
        ...options
    };
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        const data = await response.json();
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = 'auth.html';
            }
            throw new Error(data.message || `HTTP ${response.status}`);
        }
        return data;
    } catch (err) {
        throw err;
    }
}

const api = {
    get: (url) => apiRequest(url, { method: 'GET' }),
    post: (url, body) => apiRequest(url, { method: 'POST', body: JSON.stringify(body) }),
    put: (url, body) => apiRequest(url, { method: 'PUT', body: JSON.stringify(body) }),
    patch: (url, body) => apiRequest(url, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (url) => apiRequest(url, { method: 'DELETE' })
};

function requireAuth() {
    if (!localStorage.getItem('token')) window.location.href = 'auth.html';
}

function logout() {
    localStorage.clear();
    window.location.href = 'auth.html';
}
