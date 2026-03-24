import axios, { AxiosInstance } from 'axios';

// Configurar a URL base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Criar instância do Axios
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Apenas limpar token e redirecionar se for 401 e NÃO for a rota de login
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      // Token inválido ou expirado - apenas limpar, não redirecionar aqui
      // O AuthContext vai lidar com o redirecionamento
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);
