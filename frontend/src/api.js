const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const fetchMenu = () => fetch(`${API_BASE}/menu/`).then(res => res.json());
export const addMenu = (data) => fetch(`${API_BASE}/menu/`, { method: 'POST', body: JSON.stringify(data) }).then(res => res.json());
export const updateMenu = (data) => fetch(`${API_BASE}/menu/`, { method: 'PUT', body: JSON.stringify(data) }).then(res => res.json());
export const deleteMenu = (id) => fetch(`${API_BASE}/menu/`, { method: 'DELETE', body: JSON.stringify({id}) }).then(res => res.json());

export const fetchOrders = () => fetch(`${API_BASE}/orders/`).then(res => res.json());
export const addOrder = (data) => fetch(`${API_BASE}/orders/`, { method: 'POST', body: JSON.stringify(data) }).then(res => res.json());
export const updateOrder = (data) => fetch(`${API_BASE}/orders/`, { method: 'PUT', body: JSON.stringify(data) }).then(res => res.json());
export const deleteOrder = (id) => fetch(`${API_BASE}/orders/`, { method: 'DELETE', body: JSON.stringify({id}) }).then(res => res.json());

export const fetchUsers = () => fetch(`${API_BASE}/users/`).then(res => res.json());
export const addUser = (data) => fetch(`${API_BASE}/users/`, { method: 'POST', body: JSON.stringify(data) }).then(res => res.json());

export const fetchMessages = () => fetch(`${API_BASE}/messages/`).then(res => res.json());
export const addMessage = (data) => fetch(`${API_BASE}/messages/`, { method: 'POST', body: JSON.stringify(data) }).then(res => res.json());

export const fetchNotifications = () => fetch(`${API_BASE}/notifications/`).then(res => res.json());
export const addNotification = (data) => fetch(`${API_BASE}/notifications/`, { method: 'POST', body: JSON.stringify(data) }).then(res => res.json());

export const placeOrder = (data) => fetch(`${API_BASE}/orders/place/`, { method: 'POST', body: JSON.stringify(data) }).then(res => res.json());
export const cancelOrder = (orderId, isAdmin = false) => fetch(`${API_BASE}/orders/${orderId}/cancel/?admin=${isAdmin}`, { method: 'POST' }).then(res => res.json());
export const markOrderReady = (orderId) => fetch(`${API_BASE}/orders/${orderId}/ready/`, { method: 'POST' }).then(res => res.json());
export const markOrderReceived = (orderId) => fetch(`${API_BASE}/orders/${orderId}/received/`, { method: 'POST' }).then(res => res.json());

export const subscribeStudent = (username) => fetch(`${API_BASE}/student/subscribe/`, { method: 'POST', body: JSON.stringify({username}) }).then(res => res.json());
