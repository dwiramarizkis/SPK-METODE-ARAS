// API helper functions with CSRF token support

function getCSRFToken(): string {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    return token || '';
}

export async function apiRequest(url: string, options: RequestInit = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCSRFToken(),
        'Accept': 'application/json',
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export const api = {
    get: (url: string) => apiRequest(url, { method: 'GET' }),
    post: (url: string, data: any) => apiRequest(url, { method: 'POST', body: JSON.stringify(data) }),
    put: (url: string, data: any) => apiRequest(url, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (url: string) => apiRequest(url, { method: 'DELETE' }),
};
