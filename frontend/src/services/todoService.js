import axios from 'axios';

const API_URL = 'http://localhost:3000/api/todos';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for CORS
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('📤 Making request:', config.method.toUpperCase(), config.url);
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getTodos = async () => {
  try {
    console.log('📋 Fetching todos...');
    const response = await api.get('/');
    console.log('✅ Todos fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching todos:', error);
    throw error;
  }
};

export const createTodo = async (todoData) => {
  try {
    console.log('📝 Creating todo:', todoData);
    const response = await api.post('/', todoData);
    console.log('✅ Todo created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating todo:', error);
    throw error;
  }
};

export const updateTodo = async (id, updates) => {
  try {
    console.log('🔄 Updating todo:', id, updates);
    const response = await api.put(`/${id}`, updates);
    console.log('✅ Todo updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating todo:', error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    console.log('🗑️ Deleting todo:', id);
    await api.delete(`/${id}`);
    console.log('✅ Todo deleted');
  } catch (error) {
    console.error('❌ Error deleting todo:', error);
    throw error;
  }
};

export const getTodosByDate = async (date) => {
  try {
    const response = await api.get(`/date/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching todos by date:', error);
    throw error;
  }
};

export const getTodosByPriority = async (priority) => {
  try {
    const response = await api.get(`/priority/${priority}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching todos by priority:', error);
    throw error;
  }
}; 